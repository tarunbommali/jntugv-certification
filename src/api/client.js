const AUTH_TOKEN_KEY = 'aikya_auth_token';

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

const getInitialToken = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

let authToken = getInitialToken();

const stripTrailingSlash = (value) => value.replace(/\/$/, '');

const getBaseUrl = () => {
  const envUrl = import.meta.env?.VITE_API_URL?.trim();
  if (envUrl) {
    return stripTrailingSlash(envUrl);
  }

  if (typeof window !== 'undefined') {
    if (window.__APP_API_URL__) {
      return stripTrailingSlash(window.__APP_API_URL__);
    }

    const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    if (isLocalhost) {
      const protocol = window.location.protocol || 'http:';
      const devPort = import.meta.env?.VITE_DEV_API_PORT?.trim() || '3000';
      return `${protocol}//${window.location.hostname}:${devPort}/api`;
    }

    return stripTrailingSlash(`${window.location.origin}/api`);
  }

  return 'http://localhost:3000/api';
};

const buildUrl = (path) => {
  if (!path) return getBaseUrl();
  if (/^https?:/i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getBaseUrl()}${normalized}`;
};

export const getAuthToken = () => authToken;

export const setAuthToken = (token) => {
  authToken = token || null;
  if (typeof window === 'undefined') return;

  try {
    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    // ignore storage failures (private mode, etc.)
  }
};

export const clearAuthToken = () => setAuthToken(null);

const parseResponseBody = async (response) => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

// In-flight request deduplication
const pendingRequests = new Map();

export const apiRequest = async (path, options = {}) => {
  const {
    method = 'GET',
    body,
    headers = {},
    withAuth = true,
    parseJson = true,
    dedup = true, // Default to true for read operations efficiency
    ...rest
  } = options;

  const finalHeaders = {
    ...headers,
  };

  const isJsonBody = body && !(body instanceof FormData) && headers['Content-Type'] !== 'multipart/form-data';

  if (isJsonBody && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  if (withAuth && authToken) {
    finalHeaders.Authorization = `Bearer ${authToken}`;
  }

  const fetchOptions = {
    method,
    headers: finalHeaders,
    ...rest,
  };

  if (body) {
    fetchOptions.body = isJsonBody ? JSON.stringify(body) : body;
  }

  const url = buildUrl(path);

  // Create a unique key for deduplication
  // Only deduplicate GET requests or explicit 'dedup' requests
  const shouldDedup = dedup && (method.toUpperCase() === 'GET');
  const cacheKey = shouldDedup ? `${method}:${url}:${authToken || 'anon'}` : null;

  if (cacheKey && pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  const requestPromise = (async () => {
    try {
      const response = await fetch(url, fetchOptions);
      const payload = parseJson ? await parseResponseBody(response) : null;

      if (!response.ok) {
        if (response.status === 401 && withAuth) {
          clearAuthToken();
        }

        const message = typeof payload === 'string'
          ? payload
          : payload?.error || payload?.message || response.statusText;

        throw new ApiError(message, response.status, payload);
      }

      return payload;
    } finally {
      if (cacheKey) {
        pendingRequests.delete(cacheKey);
      }
    }
  })();

  if (cacheKey) {
    pendingRequests.set(cacheKey, requestPromise);
  }

  return requestPromise;
};

export default apiRequest;
export { ApiError };

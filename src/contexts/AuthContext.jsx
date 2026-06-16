/* eslint-disable no-console, no-unused-vars */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { authApi } from '../api/index.js';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

const ensureUserShape = (user) => {
  if (!user) return null;
  const normalized = authApi.normalizeUser(user);
  return {
    ...normalized,
    email: normalized.email || '',
    username: normalized.username || normalized.firstName || '',
  };
};

let googleScriptPromise;

const loadGoogleScript = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Identity Services unavailable'));
  }

  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Small delay to ensure Google SDK initializes
      setTimeout(resolve, 100);
    };
    script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
};

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleInitializedRef = useRef(false);
  const googleCallbackRef = useRef(null);

  const applySession = useCallback((payload) => {
    const normalizedUser = ensureUserShape(payload?.user || payload);
    if (normalizedUser) {
      setCurrentUser(normalizedUser);
      setUserProfile(normalizedUser);
    } else {
      setCurrentUser(null);
      setUserProfile(null);
    }
    return normalizedUser;
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await authApi.fetchCurrentUser();
      return applySession(profile);
    } catch {
      setCurrentUser(null);
      setUserProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [applySession]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const signup = useCallback(async (email, password, additionalData = {}) => {
    const result = await authApi.signup({ email, password, ...additionalData });
    return applySession(result);
  }, [applySession]);

  const signin = useCallback(async (email, password) => {
    const result = await authApi.login({ email, password });
    return applySession(result);
  }, [applySession]);

  const requestPasswordReset = useCallback(async (email) => authApi.requestPasswordReset(email), []);

  // Handle Google credential response
  const handleGoogleCredential = useCallback(async (credential) => {
    try {
      const result = await authApi.loginWithGoogle(credential);
      return applySession(result);
    } catch (error) {
      console.error('Google sign-in API error:', error);
      throw error;
    }
  }, [applySession]);

  // Initialize Google SDK
  const initializeGoogle = useCallback(async () => {
    if (!GOOGLE_CLIENT_ID) {
      console.warn('Google Client ID not configured');
      return false;
    }

    try {
      await loadGoogleScript();

      const googleAccounts = window.google?.accounts?.id;
      if (!googleAccounts) {
        console.error('Google Identity Services not available');
        return false;
      }

      if (!googleInitializedRef.current) {
        googleAccounts.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response?.credential && googleCallbackRef.current) {
              googleCallbackRef.current(response.credential);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        googleInitializedRef.current = true;
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize Google:', error);
      return false;
    }
  }, []);

  // Sign in with Google using popup/prompt
  const signinWithGoogle = useCallback(async () => {
    if (!GOOGLE_CLIENT_ID) {
      throw new Error('Google client ID is not configured. Add VITE_GOOGLE_CLIENT_ID to your .env file.');
    }

    const initialized = await initializeGoogle();
    if (!initialized) {
      throw new Error('Failed to initialize Google Sign-In');
    }

    return new Promise((resolve, reject) => {
      let resolved = false;
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error('Google sign-in timed out. Please try again.'));
        }
      }, 60000); // 60 second timeout

      googleCallbackRef.current = async (credential) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeoutId);

        try {
          const user = await handleGoogleCredential(credential);
          resolve(user);
        } catch (error) {
          reject(error);
        }
      };

      const googleAccounts = window.google?.accounts?.id;

      // Try to render the Google button in a temporary container or use prompt
      googleAccounts.prompt((notification) => {
        if (resolved) return;

        const isNotDisplayed = notification?.isNotDisplayed?.();
        const isSkipped = notification?.isSkippedMoment?.();
        const isDismissed = notification?.isDismissedMoment?.();

        if (isNotDisplayed) {
          // One Tap is not displayed, this is common - user needs to click the button
          console.log('Google One Tap not displayed, reason:', notification?.getNotDisplayedReason?.());
          // Don't reject - user can still click the Google button
        }

        if (isSkipped) {
          console.log('Google sign-in skipped:', notification?.getSkippedReason?.());
        }

        if (isDismissed) {
          const reason = notification?.getDismissedReason?.();
          if (reason === 'credential_returned') {
            // Success - credential callback will handle this
          } else {
            resolved = true;
            clearTimeout(timeoutId);
            reject(new Error(`Google sign-in cancelled: ${reason || 'dismissed'}`));
          }
        }
      });
    });
  }, [initializeGoogle, handleGoogleCredential]);

  // Render Google Button in a container element
  const renderGoogleButton = useCallback(async (containerRef, options = {}) => {
    if (!GOOGLE_CLIENT_ID || !containerRef) return;

    const initialized = await initializeGoogle();
    if (!initialized) return;

    const googleAccounts = window.google?.accounts?.id;
    if (!googleAccounts) return;

    try {
      googleAccounts.renderButton(containerRef, {
        type: options.type || 'standard',
        theme: options.theme || 'outline',
        size: options.size || 'large',
        text: options.text || 'continue_with',
        shape: options.shape || 'rectangular',
        width: options.width || 300,
        logo_alignment: options.logoAlignment || 'left',
      });
    } catch (error) {
      console.error('Failed to render Google button:', error);
    }
  }, [initializeGoogle]);

  const logout = useCallback(() => {
    authApi.logoutSession();
    setCurrentUser(null);
    setUserProfile(null);

    // Revoke Google session if available
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (e) {
        // Ignore errors
      }
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    setLoading(true);
    return fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates) => {
    const result = await authApi.updateProfile(updates);
    return applySession(result);
  }, [applySession]);

  const value = useMemo(() => ({
    currentUser,
    userProfile,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin' || currentUser?.isAdmin,
    loading,
    signup,
    signin,
    signinWithGoogle,
    renderGoogleButton,
    handleGoogleCredential,
    logout,
    requestPasswordReset,
    refreshProfile,
    updateProfile,
    isGoogleConfigured: Boolean(GOOGLE_CLIENT_ID),
  }), [
    currentUser,
    userProfile,
    loading,
    signup,
    signin,
    signinWithGoogle,
    renderGoogleButton,
    handleGoogleCredential,
    logout,
    requestPasswordReset,
    refreshProfile,
    updateProfile,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

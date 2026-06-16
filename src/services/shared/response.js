export const extractData = (response) => {
  if (
    response &&
    response.success === true &&
    "data" in response
  ) {
    return response.data;
  }

  return response;
};

export const success = (data, extras = {}) => ({
  success: true,
  data,
  ...extras,
});

export const failure = (error, extras = {}) => ({
  success: false,
  error:
    error?.message ||
    error?.statusText ||
    (typeof error === 'string' ? error : "Request failed"),
  ...extras,
});

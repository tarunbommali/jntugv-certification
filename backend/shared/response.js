export const success = (res, data, statusCode = 200) => {
  res.status(statusCode).json({ success: true, data });
};

export const created = (res, data) => success(res, data, 201);

export const error = (res, statusCode, message) => {
  res.status(statusCode).json({ success: false, error: message });
};

export const noContent = (res) => {
  res.status(204).send();
};

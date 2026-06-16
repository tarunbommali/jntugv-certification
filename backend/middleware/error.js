import { logger } from '../shared/logger.js';

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  void next;
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode);

  if (process.env.NODE_ENV !== 'test') {
    logger.error(`${req.method} ${req.originalUrl} >> ${err.message}`, err, {
      path: req.originalUrl,
      method: req.method,
    });
  }

  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

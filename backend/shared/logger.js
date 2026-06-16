export const logger = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({ level: 'info', timestamp: new Date().toISOString(), message, ...meta }));
  },
  warn: (message, meta = {}) => {
    console.warn(JSON.stringify({ level: 'warn', timestamp: new Date().toISOString(), message, ...meta }));
  },
  error: (message, error = null, meta = {}) => {
    const errorDetails = error ? {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    } : {};
    console.error(JSON.stringify({ level: 'error', timestamp: new Date().toISOString(), message, error: errorDetails, ...meta }));
  },
};

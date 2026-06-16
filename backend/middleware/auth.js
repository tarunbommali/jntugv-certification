/* eslint-disable no-unused-vars */
import { verifyToken } from '../shared/jwt.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required.');
}

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

import bcrypt from 'bcryptjs';
import { randomUUID, randomBytes, createHash, randomInt } from 'crypto';
import { generateToken } from '../../shared/jwt.js';
import { sendOtpEmail } from '../../modules/notifications/notification.service.js';
import * as AuthRepo from './auth.repository.js';

export const sanitizeUser = (user) => {
  if (!user) return null;
  const safeUser = { ...user };
  delete safeUser.password;
  delete safeUser.passwordResetToken;
  delete safeUser.passwordResetExpires;
  return safeUser;
};

export const signup = async ({ email, password, firstName, lastName, username }) => {
  const existing = await AuthRepo.findByEmail(email);
  if (existing) throw Object.assign(new Error('User already exists'), { statusCode: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = randomUUID();
  const resolvedUsername = username || [firstName, lastName].filter(Boolean).join('_').trim() || email.split('@')[0];

  const newUser = await AuthRepo.createUser({
    id: userId,
    email,
    password: hashedPassword,
    firstName,
    lastName,
    username: resolvedUsername,
    emailVerified: false,
    authProvider: 'password',
  });

  const token = generateToken({ id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin || false });
  return { user: sanitizeUser(newUser), token };
};

export const login = async ({ email, password }) => {
  const user = await AuthRepo.findByEmail(email);
  if (!user || !user.password) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

  await AuthRepo.updateUser(user.id, { lastLoginAt: new Date() });

  const token = generateToken({ id: user.id, email: user.email, isAdmin: user.isAdmin || false });
  return { user: sanitizeUser(user), token };
};

export const forgotPassword = async (email) => {
  const user = await AuthRepo.findByEmail(email);
  const response = { success: true, message: 'If an account exists, an OTP has been sent.' };

  if (!user || user.isActive === false) return response;

  const otp = randomInt(100000, 999999).toString();
  const hashedOtp = createHash('sha256').update(otp).digest('hex');
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await AuthRepo.updateUser(user.id, { passwordResetToken: hashedOtp, passwordResetExpires: expiresAt, updatedAt: new Date() });
  await sendOtpEmail(user.email, otp, 5);

  if (process.env.NODE_ENV !== 'production') {
    response.otp = otp;
    response.expiresAt = expiresAt.toISOString();
  }
  return response;
};

export const verifyOtp = async ({ email, otp }) => {
  const user = await AuthRepo.findByEmail(email);
  if (!user) throw Object.assign(new Error('Invalid OTP'), { statusCode: 400 });

  const expiresAt = user.passwordResetExpires instanceof Date ? user.passwordResetExpires : new Date(user.passwordResetExpires);
  if (!expiresAt || expiresAt.getTime() < Date.now()) throw Object.assign(new Error('OTP has expired'), { statusCode: 400 });

  const hashedOtp = createHash('sha256').update(otp.toString()).digest('hex');
  if (user.passwordResetToken !== hashedOtp) throw Object.assign(new Error('Invalid OTP'), { statusCode: 400 });

  const resetToken = randomBytes(32).toString('hex');
  const hashedResetToken = createHash('sha256').update(resetToken).digest('hex');
  const newExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await AuthRepo.updateUser(user.id, { passwordResetToken: hashedResetToken, passwordResetExpires: newExpiry, updatedAt: new Date() });
  return { resetToken };
};

export const resetPassword = async ({ token, password }) => {
  const hashedToken = createHash('sha256').update(token).digest('hex');
  const user = await AuthRepo.findByResetToken(hashedToken);

  const expiresAt = user?.passwordResetExpires instanceof Date ? user.passwordResetExpires : user?.passwordResetExpires ? new Date(user.passwordResetExpires) : null;
  if (!user || !expiresAt || expiresAt.getTime() < Date.now()) throw Object.assign(new Error('Invalid or expired reset token'), { statusCode: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedUser = await AuthRepo.updateUser(user.id, {
    password: hashedPassword,
    passwordResetToken: null,
    passwordResetExpires: null,
    authProvider: 'password',
    updatedAt: new Date(),
  });

  const authToken = generateToken({ id: updatedUser.id, email: updatedUser.email, isAdmin: updatedUser.isAdmin || false });
  return { user: sanitizeUser(updatedUser), token: authToken };
};

export const googleAuth = async (googleClient, credential) => {
  const { OAuth2Client } = await import('google-auth-library');
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch {
    throw Object.assign(new Error('Invalid Google credential'), { statusCode: 401 });
  }

  const email = payload?.email?.trim().toLowerCase();
  const googleId = payload?.sub;
  if (!email) throw Object.assign(new Error('Google account has no email'), { statusCode: 400 });

  let user = await AuthRepo.findByEmail(email);

  if (!user) {
    const userId = randomUUID();
    user = await AuthRepo.createUser({
      id: userId, email, googleId, authProvider: 'google',
      username: payload?.name || email.split('@')[0],
      firstName: payload?.given_name, lastName: payload?.family_name,
      photoURL: payload?.picture, emailVerified: Boolean(payload?.email_verified), isActive: true,
    });
  } else {
    user = await AuthRepo.updateUser(user.id, {
      googleId: googleId || user.googleId, authProvider: 'google',
      username: payload?.name || user.username || email.split('@')[0],
      firstName: payload?.given_name || user.firstName, lastName: payload?.family_name || user.lastName,
      photoURL: payload?.picture || user.photoURL,
      emailVerified: payload?.email_verified !== undefined ? Boolean(payload.email_verified) : user.emailVerified,
      updatedAt: new Date(),
    });
  }

  await AuthRepo.updateUser(user.id, { lastLoginAt: new Date() });
  const token = generateToken({ id: user.id, email: user.email, isAdmin: user.isAdmin || false });
  return { user: sanitizeUser(user), token };
};

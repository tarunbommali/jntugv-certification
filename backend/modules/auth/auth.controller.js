import { OAuth2Client } from 'google-auth-library';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import * as AuthService from './auth.service.js';
import * as AuthRepo from './auth.repository.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

export const signup = asyncHandler(async (req, res) => {
  const result = await AuthService.signup(req.body);
  res.status(201).json({ success: true, ...result });
});

export const login = asyncHandler(async (req, res) => {
  const result = await AuthService.login(req.body);
  res.json({ success: true, ...result });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await AuthService.forgotPassword(req.body.email);
  res.json(result);
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const result = await AuthService.verifyOtp(req.body);
  res.json({ success: true, ...result });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword, password } = req.body;
  const result = await AuthService.resetPassword({ token, password: newPassword || password });
  res.json({ success: true, message: 'Password reset successful', ...result });
});

export const me = asyncHandler(async (req, res) => {
  const user = await AuthRepo.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, ...AuthService.sanitizeUser(user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };
  delete updateData.password;
  delete updateData.email;
  delete updateData.isAdmin;

  if (updateData.username) {
    if (!/^@[a-zA-Z0-9._]+$/.test(updateData.username)) {
      return res.status(400).json({ success: false, error: 'Username can only contain letters, numbers, dots, and underscores.' });
    }
    const existing = await AuthRepo.findByUsername(updateData.username);
    if (existing && existing.id !== req.user.id) {
      return res.status(400).json({ success: false, error: 'Username is already taken. Please choose another one.' });
    }
  }

  if (updateData.dateOfBirth) {
    updateData.dateOfBirth = new Date(updateData.dateOfBirth);
  }

  const updatedUser = await AuthRepo.updateUser(req.user.id, { ...updateData, updatedAt: new Date() });
  res.json({ success: true, ...AuthService.sanitizeUser(updatedUser) });
});

export const googleLogin = asyncHandler(async (req, res) => {
  if (!googleClient) return res.status(500).json({ success: false, error: 'Google sign-in is not configured' });

  const { credential } = req.body;
  if (!credential) return res.status(400).json({ success: false, error: 'Missing Google credential' });

  const result = await AuthService.googleAuth(googleClient, credential);
  res.json({ success: true, ...result });
});

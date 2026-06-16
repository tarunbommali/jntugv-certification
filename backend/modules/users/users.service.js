import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import * as UsersRepo from './users.repository.js';

export const sanitizeUser = (user) => {
  if (!user) return null;
  const safe = { ...user };
  delete safe.password;
  return safe;
};

const normalizeEmail = (email) => (email ? email.trim().toLowerCase() : email);

export const listUsers = async (limit, searchTerm) => {
  const results = await UsersRepo.findAll(limit, searchTerm);
  return results.map(sanitizeUser);
};

export const getUserById = async (id) => {
  const user = await UsersRepo.findById(id);
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

  const enrollments = await UsersRepo.getEnrollmentsByUser(id);
  return sanitizeUser({ ...user, totalCoursesEnrolled: enrollments.length });
};

export const createUser = async (data) => {
  const { email, password, username, firstName, lastName, phone, role = 'student', isActive = true } = data;
  if (!email || !password) throw Object.assign(new Error('Email and password are required'), { statusCode: 400 });

  const normalizedEmail = normalizeEmail(email);
  const existing = await UsersRepo.findByEmail(normalizedEmail);
  if (existing) throw Object.assign(new Error('User already exists'), { statusCode: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = randomUUID();

  const newUser = await UsersRepo.createUser({
    id: userId,
    email: normalizedEmail,
    password: hashedPassword,
    username: username || [firstName, lastName].filter(Boolean).join('_').trim() || normalizedEmail.split('@')[0],
    firstName,
    lastName,
    phone,
    isAdmin: role === 'admin',
    isActive: Boolean(isActive),
    authProvider: 'password',
  });

  return sanitizeUser(newUser);
};

export const updateUser = async (id, data) => {
  const updates = { ...data };

  if (updates.email) updates.email = normalizeEmail(updates.email);
  if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
  if (updates.role !== undefined) { updates.isAdmin = updates.role === 'admin'; delete updates.role; }
  if (updates.status !== undefined) { updates.isActive = updates.status === 'active'; delete updates.status; }
  if (updates.isActive !== undefined) updates.isActive = Boolean(updates.isActive);
  if (updates.isAdmin !== undefined) updates.isAdmin = Boolean(updates.isAdmin);

  updates.updatedAt = new Date();
  const updatedUser = await UsersRepo.updateUser(id, updates);
  if (!updatedUser) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  return sanitizeUser(updatedUser);
};

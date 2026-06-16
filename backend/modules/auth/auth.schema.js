import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    username: z.string().trim().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email().trim().toLowerCase(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    password: z.string().min(8).optional(),
    newPassword: z.string().min(8).optional(),
  }).refine((data) => data.password || data.newPassword, {
    message: 'password or newPassword is required',
    path: ['password'],
  }),
});

import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    courseId: z.string().uuid({ message: 'Invalid course ID format' }),
    amount: z.number().nonnegative('Amount must be non-negative'),
    currency: z.string().length(3, 'Currency must be 3 characters').default('INR'),
    couponCode: z.string().optional(),
  }),
});

export const createOrderSchema = z.object({
  body: z.object({
    courseId: z.string().uuid({ message: 'Invalid course ID format' }),
    couponCode: z.string().trim().max(64).optional(),
    billingInfo: z.object({
      name: z.string().trim().min(1).max(191),
      email: z.string().email(),
      phone: z.string().trim().min(6).max(32),
      country: z.string().trim().max(64).optional(),
    }),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpayOrderId: z.string().min(1),
    razorpayPaymentId: z.string().min(1),
    razorpaySignature: z.string().min(1),
  }),
});

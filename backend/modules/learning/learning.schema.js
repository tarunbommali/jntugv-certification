import { z } from 'zod';

export const enrollmentSchema = z.object({
  body: z.object({
    courseId: z.string().uuid({ message: 'Invalid course ID format' }),
    paymentData: z.object({
      method: z.string().min(1, 'Payment method is required'),
      amount: z.number().nonnegative('Amount must be non-negative'),
    }).optional(),
  }),
});

export const progressSchema = z.object({
  body: z.object({
    completionPercentage: z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
    currentLesson: z.string().optional(),
    completedLessons: z.array(z.string()).optional(),
    timeSpent: z.number().nonnegative().optional(),
  }),
});

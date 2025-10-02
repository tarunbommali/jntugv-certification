import { z } from 'zod';

// Core reusable fields
const TimestampSchema = z.union([
  z.any().refine((v) => v && typeof v.toDate === 'function', {
    message: 'Expected Firestore Timestamp-like object'
  }),
  z.date()
]);

const UrlSchema = z.string().url().or(z.string());

// User profile schema
export const UserProfileSchema = z.object({
  uid: z.string(),
  name: z.string().min(1).optional(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  university: z.string().optional(),
  isAdmin: z.boolean().default(false),
  createdAt: TimestampSchema.optional(),
  updatedAt: TimestampSchema.optional()
});

// Enrollment schema
export const EnrollmentSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  courseId: z.string(),
  status: z.enum(['INIT', 'PENDING', 'SUCCESS', 'FAILED']).default('INIT'),
  orderId: z.string().optional(),
  paymentId: z.string().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
  createdAt: TimestampSchema.optional(),
  updatedAt: TimestampSchema.optional()
});

// Purchase history schema
export const PurchaseSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  items: z.array(
    z.object({
      courseId: z.string(),
      price: z.number(),
      title: z.string()
    })
  ),
  total: z.number(),
  status: z.enum(['SUCCESS', 'REFUNDED', 'FAILED']).default('SUCCESS'),
  paymentGateway: z.enum(['razorpay', 'manual']).default('razorpay'),
  createdAt: TimestampSchema.optional()
});

// Course Module schema
const CourseModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  content: z.array(z.string()).default([]),
  videoUrl: UrlSchema.optional()
});

// Course schema
export const CourseSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  mission: z.string().optional(),
  price: z.number().optional(),
  originalPrice: z.number().optional(),
  discountPercent: z.number().optional(),
  duration: z.string().optional(),
  mode: z.string().optional(),
  language: z.string().optional(),
  rating: z.string().optional(),
  validity: z.string().optional(),
  features: z.array(z.string()).default([]),
  thumbnail: UrlSchema.optional(),
  skills: z.array(z.string()).optional(),
  handsonProjects: z.array(z.string()).optional(),
  modules: z.array(CourseModuleSchema).default([])
});

// Helper safe parsers
export function safeParseArray(schema, docs) {
  const data = Array.isArray(docs) ? docs : [];
  return data
    .map((d) => {
      const result = schema.safeParse(d);
      if (result.success) return { ok: true, value: result.data };
      return { ok: false, error: result.error, raw: d };
    })
    .filter((r) => r.ok)
    .map((r) => r.value);
}

export function safeParse(schema, data) {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
}

// Dummy enrolled data when Firestore has no records
export const DummyEnrollment = (userId, courseId) => ({
  userId,
  courseId: String(courseId),
  status: 'SUCCESS'
});


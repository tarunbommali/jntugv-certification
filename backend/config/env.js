import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DB_HOST: z.string().min(1, 'Database host is required'),
  DB_USER: z.string().min(1, 'Database user is required'),
  DB_PASSWORD: z.string().min(1, 'Database password is required'),
  DB_NAME: z.string().min(1, 'Database name is required'),
  DB_PORT: z.string().transform(Number).optional(),
  CORS_ORIGINS: z.string().optional().default('*').transform((val) => val.split(',').map(s => s.trim())),
  JWT_SECRET: z.string().min(1, 'JWT Secret is required'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:');
  _env.error.issues.forEach((issue) => {
    console.error(`  - ${issue.path[0]}: ${issue.message}`);
  });
  process.exit(1);
}

export const env = _env.data;

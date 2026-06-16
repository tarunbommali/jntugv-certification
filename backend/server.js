/* eslint-disable no-console */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";

// Modules — organized by business domain
import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import catalogRoutes from "./modules/catalog/catalog.routes.js";
import learningRoutes from "./modules/learning/learning.routes.js";
import paymentsRoutes from "./modules/payments/payments.routes.js";
import certificatesRoutes from "./modules/certificates/certificates.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import publicRoutes from "./modules/public/public.routes.js";
import assessmentsRoutes from "./modules/assessments/assessments.routes.js";

import { dbReady } from "./db/index.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { authenticateToken } from "./middleware/auth.js";
import { getProgress, updateProgress } from "./modules/learning/learning.controller.js";

const app = express();
const PORT = env.PORT || 3000;

const allowedOrigins = env.CORS_ORIGINS || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Webhook needs raw body for signature verification
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  const base = `${req.protocol}://${req.get('host')}`;
  res.json({
    status: "ok",
    message: "Server is running successfully 🚀",
    environment: env.NODE_ENV,
    api: {
      auth: `${base}/api/auth`,
      courses: `${base}/api/courses`,
      enrollments: `${base}/api/enrollments`,
      payments: `${base}/api/payments`,
      certificates: `${base}/api/certificates`,
      admin: `${base}/api/admin`,
      public: `${base}/api/public`,
    },
  });
});

// Student journey routes (API URLs unchanged for frontend compatibility)
app.use("/api/auth", authRoutes);
app.use("/api/courses", catalogRoutes);       // catalog module → /api/courses
app.use("/api/enrollments", learningRoutes);  // learning module → /api/enrollments
app.use("/api/payments", paymentsRoutes);
app.use("/api/certificates", certificatesRoutes);
app.use("/api/courses/:courseId/assessments", assessmentsRoutes);

// Admin routes
app.use("/api/admin/users", usersRoutes);
app.use("/api/admin", adminRoutes);

// Public routes (no auth required)
app.use("/api/public", publicRoutes);

// Progress — convenience endpoints (handled inside learning module)
import { validate } from './middleware/validate.js';
import { progressSchema } from './modules/learning/learning.schema.js';

app.get('/api/progress/:courseId', authenticateToken, getProgress);
app.put('/api/progress/:courseId', authenticateToken, validate(progressSchema), updateProgress);

// Error handling
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await dbReady;
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

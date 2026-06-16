import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import * as ctrl from './auth.controller.js';
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.schema.js';

const router = Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP verification requests per `window`
  message: { success: false, message: 'Too many OTP verification attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', validate(signupSchema), ctrl.signup);
router.post('/login', validate(loginSchema), ctrl.login);
router.post('/forgot-password', validate(forgotPasswordSchema), ctrl.forgotPassword);
router.post('/verify-otp', otpLimiter, ctrl.verifyOtp);
router.post('/reset-password', validate(resetPasswordSchema), ctrl.resetPassword);
router.post('/google', ctrl.googleLogin);
router.get('/me', authenticateToken, ctrl.me);
router.put('/profile', authenticateToken, ctrl.updateProfile);

export default router;

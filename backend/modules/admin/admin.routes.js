import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';
import * as ctrl from './admin.controller.js';

const router = Router();

// Public coupon routes (no auth needed for active list & validation)
router.get('/coupons/active', ctrl.getActiveCoupons);
router.post('/coupons/validate', authenticateToken, ctrl.validateCoupon);
router.post('/coupons/apply', authenticateToken, ctrl.applyCoupon);

// Admin-only coupon management
router.get('/coupons', authenticateToken, requireAdmin, ctrl.getAllCoupons);
router.post('/coupons', authenticateToken, requireAdmin, ctrl.createCoupon);
router.put('/coupons/:id', authenticateToken, requireAdmin, ctrl.updateCoupon);
router.delete('/coupons/:id', authenticateToken, requireAdmin, ctrl.deleteCoupon);

// Realtime admin dashboard
router.get('/realtime', authenticateToken, requireAdmin, ctrl.adminRealtime);

export default router;

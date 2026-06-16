import { randomUUID } from 'crypto';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import * as AdminService from './admin.service.js';

// --- Coupons ---
export const getActiveCoupons = asyncHandler(async (req, res) => {
  const data = await AdminService.getActiveCoupons();
  res.json({ success: true, data });
});

export const getAllCoupons = asyncHandler(async (req, res) => {
  const data = await AdminService.getAllCoupons();
  res.json({ success: true, data });
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, courseId, amount } = req.body || {};
  if (!code) return res.status(400).json({ success: false, error: 'Coupon code is required' });

  const coupon = await AdminService.fetchCouponByCode(code);
  const evaluation = AdminService.evaluateCoupon(coupon, { amount, courseId });
  if (!evaluation.valid) return res.status(400).json({ success: false, error: evaluation.message || 'Invalid coupon' });

  res.json({ success: true, data: { coupon, discount: evaluation.discount } });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const { code, courseId, amount } = req.body || {};
  if (!code) return res.status(400).json({ success: false, error: 'Coupon code is required' });

  const coupon = await AdminService.fetchCouponByCode(code);
  const evaluation = AdminService.evaluateCoupon(coupon, { amount, courseId });
  if (!evaluation.valid) return res.status(400).json({ success: false, error: evaluation.message || 'Invalid coupon' });

  const updatedFields = {
    usedCount: (coupon.usedCount ?? 0) + 1,
    totalOrders: (coupon.totalOrders ?? 0) + 1,
    totalDiscountGiven: (coupon.totalDiscountGiven ?? 0) + evaluation.discount,
    updatedAt: new Date(),
  };
  await AdminService.updateCoupon(coupon.id, updatedFields);

  res.json({ success: true, data: { coupon: { ...coupon, ...updatedFields }, discount: evaluation.discount } });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const couponId = req.body?.id || randomUUID();
  const normalized = AdminService.normalizeCouponInput(req.body, { userId: req.user?.id, isNew: true });

  if (!normalized.code) return res.status(400).json({ success: false, error: 'Coupon code is required' });
  if (!normalized.name) return res.status(400).json({ success: false, error: 'Coupon name is required' });

  const data = await AdminService.createCoupon(couponId, normalized);
  res.status(201).json({ success: true, data });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const existing = await AdminService.getCouponById(req.params.id);
  if (!existing) return res.status(404).json({ success: false, error: 'Coupon not found' });

  const normalized = AdminService.normalizeCouponInput(req.body, { userId: req.user?.id || existing.createdBy, isNew: false });
  const data = await AdminService.updateCoupon(req.params.id, normalized);
  res.json({ success: true, data });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  await AdminService.deleteCoupon(req.params.id);
  res.json({ success: true, message: 'Coupon deleted successfully' });
});

// --- Realtime ---
export const adminRealtime = asyncHandler(async (req, res) => {
  try {
    const data = await AdminService.getAdminRealtimeData();
    res.json(data);
  } catch (err) {
    if (err?.code === 'ER_NO_SUCH_TABLE') {
      return res.json({ courses: [], enrollments: [], users: [], payments: [], coupons: [], stats: { totalCourses: 0, totalPublishedCourses: 0, totalUsers: 0, totalAdmins: 0, totalEnrollments: 0, totalPayments: 0, capturedPayments: 0, activeCoupons: 0 } });
    }
    throw err;
  }
});

export const publicRealtime = asyncHandler(async (req, res) => {
  try {
    const data = await AdminService.getPublicRealtimeData();
    res.json(data);
  } catch (err) {
    if (err?.code === 'ER_NO_SUCH_TABLE') {
      return res.json({ courses: [], featured: [], enrollments: [], payments: [], coupons: [], stats: { totalCourses: 0, featuredCourses: 0, totalEnrollments: 0, totalCapturedPayments: 0, activeCoupons: 0 } });
    }
    throw err;
  }
});

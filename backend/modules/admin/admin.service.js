import { db } from '../../db/index.js';
import { users, courses, enrollments, payments, coupons } from '../../db/schema.js';
import { eq, desc } from 'drizzle-orm';

// Coupon helpers
const normalizeCode = (code) => (code || '').trim().toUpperCase();
const ensureArray = (v) => (Array.isArray(v) ? v : []);
const coerceNumber = (v, fallback = 0) => { const n = Number(v); return Number.isFinite(n) ? n : fallback; };
const parseDate = (v) => { if (!v) return undefined; const d = new Date(v); return Number.isNaN(d.getTime()) ? undefined : d; };

export const normalizeCouponInput = (input = {}, { userId, isNew = false } = {}) => {
  const now = new Date();
  const n = { updatedAt: now };

  if (input.code !== undefined || isNew) n.code = normalizeCode(input.code);
  if (input.name !== undefined || isNew) n.name = input.name?.trim() || null;
  if (input.description !== undefined || isNew) n.description = input.description?.trim() || '';
  if (input.type !== undefined || isNew) n.type = input.type === 'amount' ? 'amount' : 'percent';
  if (input.value !== undefined || isNew) n.value = coerceNumber(input.value, 0);
  if (input.minOrderAmount !== undefined || isNew) n.minOrderAmount = coerceNumber(input.minOrderAmount, 0);
  if (input.maxDiscountAmount !== undefined || isNew) n.maxDiscountAmount = input.maxDiscountAmount != null && input.maxDiscountAmount !== '' ? coerceNumber(input.maxDiscountAmount, 0) : null;
  if (input.usageLimit !== undefined || isNew) n.usageLimit = input.usageLimit != null && input.usageLimit !== '' ? coerceNumber(input.usageLimit, null) : null;
  if (input.usageLimitPerUser !== undefined || isNew) n.usageLimitPerUser = input.usageLimitPerUser != null && input.usageLimitPerUser !== '' ? coerceNumber(input.usageLimitPerUser, 1) : 1;
  if (input.isActive !== undefined || isNew) n.isActive = input.isActive === undefined ? true : Boolean(input.isActive);
  if (input.applicableCourses !== undefined || isNew) n.applicableCourses = ensureArray(input.applicableCourses);
  if (input.applicableCategories !== undefined || isNew) n.applicableCategories = ensureArray(input.applicableCategories);

  const validFrom = parseDate(input.validFrom);
  const validUntil = parseDate(input.validUntil);
  if (validFrom) n.validFrom = validFrom; else if (isNew) n.validFrom = now;
  if (validUntil) n.validUntil = validUntil; else if (input.validUntil === null) n.validUntil = null;

  if (isNew) { n.createdAt = now; n.createdBy = userId || null; n.usedCount = 0; n.totalOrders = 0; n.totalDiscountGiven = 0; }

  return Object.fromEntries(Object.entries(n).filter(([, v]) => v !== undefined));
};

export const evaluateCoupon = (coupon, { amount = 0, courseId } = {}) => {
  if (!coupon) return { valid: false, message: 'Invalid coupon code' };
  if (!coupon.isActive) return { valid: false, message: 'Coupon is not active' };
  const now = new Date();
  if (coupon.validFrom && new Date(coupon.validFrom) > now) return { valid: false, message: 'Coupon not yet valid' };
  if (coupon.validUntil && new Date(coupon.validUntil) < now) return { valid: false, message: 'Coupon has expired' };
  if (coupon.usageLimit && (coupon.usedCount ?? 0) >= coupon.usageLimit) return { valid: false, message: 'Coupon usage limit reached' };
  if (amount && coupon.minOrderAmount && amount < coupon.minOrderAmount) return { valid: false, message: `Min order ₹${coupon.minOrderAmount / 100} required` };
  if (courseId && Array.isArray(coupon.applicableCourses) && coupon.applicableCourses.length > 0 && !coupon.applicableCourses.includes(courseId)) return { valid: false, message: 'Coupon not applicable for this course' };

  let discount = 0;
  if (coupon.type === 'percent') {
    discount = Math.floor((amount * coupon.value) / 100);
    if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
  } else {
    discount = coupon.value;
  }
  return { valid: true, discount };
};

export const fetchCouponByCode = async (code) => {
  if (!code) return null;
  const [coupon] = await db.select().from(coupons).where(eq(coupons.code, normalizeCode(code))).limit(1);
  return coupon || null;
};

export const getAllCoupons = async () => db.select().from(coupons);
export const getActiveCoupons = async () => {
  const all = await db.select().from(coupons);
  const now = new Date();
  return all.filter((c) => {
    if (!c.isActive) return false;
    if (c.validFrom && new Date(c.validFrom) > now) return false;
    if (c.validUntil && new Date(c.validUntil) < now) return false;
    if (c.usageLimit && (c.usedCount ?? 0) >= c.usageLimit) return false;
    return true;
  });
};

export const createCoupon = async (id, data) => {
  await db.insert(coupons).values({ id, ...data }).execute();
  const [c] = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
  return c;
};

export const updateCoupon = async (id, data) => {
  await db.update(coupons).set(data).where(eq(coupons.id, id)).execute();
  const [c] = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
  return c;
};

export const deleteCoupon = async (id) => {
  await db.delete(coupons).where(eq(coupons.id, id));
};

export const getCouponById = async (id) => {
  const [c] = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
  return c || null;
};

// Realtime data
export const getAdminRealtimeData = async () => {
  const [coursesList, enrollmentsList, usersList, paymentsList, couponsList] = await Promise.all([
    db.select().from(courses).orderBy(desc(courses.createdAt)),
    db.select().from(enrollments).orderBy(desc(enrollments.enrolledAt)),
    db.select().from(users).orderBy(desc(users.createdAt)),
    db.select().from(payments).orderBy(desc(payments.createdAt)),
    db.select().from(coupons).orderBy(desc(coupons.createdAt)),
  ]);

  const sanitizedUsers = usersList.map((u) => { const c = { ...u }; delete c.password; return c; });

  return {
    courses: coursesList, enrollments: enrollmentsList, users: sanitizedUsers,
    payments: paymentsList, coupons: couponsList,
    stats: {
      totalCourses: coursesList.length,
      totalPublishedCourses: coursesList.filter((c) => c.isPublished !== false).length,
      totalUsers: usersList.length,
      totalAdmins: usersList.filter((u) => u.isAdmin).length,
      totalEnrollments: enrollmentsList.length,
      totalPayments: paymentsList.length,
      capturedPayments: paymentsList.filter((p) => (p.status || '').toLowerCase() === 'captured').length,
      activeCoupons: couponsList.filter((c) => c.isActive !== false).length,
    },
  };
};

export const getPublicRealtimeData = async () => {
  const [allCourses, recentEnrollments, recentPayments, allCoupons] = await Promise.all([
    db.select().from(courses).orderBy(desc(courses.createdAt)),
    db.select().from(enrollments).orderBy(desc(enrollments.enrolledAt)).limit(25),
    db.select().from(payments).orderBy(desc(payments.createdAt)).limit(25),
    db.select().from(coupons).orderBy(desc(coupons.createdAt)),
  ]);

  const filteredCourses = allCourses.filter((c) => c.isPublished !== false);
  const now = new Date();
  const activeCoupons = allCoupons.filter((c) => {
    if (!c.isActive) return false;
    if (c.validFrom && new Date(c.validFrom) > now) return false;
    if (c.validUntil && new Date(c.validUntil) < now) return false;
    return true;
  });

  return {
    courses: filteredCourses, featured: filteredCourses.filter((c) => c.isFeatured),
    enrollments: recentEnrollments, payments: recentPayments, coupons: activeCoupons,
    stats: {
      totalCourses: filteredCourses.length, featuredCourses: filteredCourses.filter((c) => c.isFeatured).length,
      totalEnrollments: recentEnrollments.length,
      totalCapturedPayments: recentPayments.filter((p) => (p.status || '').toLowerCase() === 'captured').length,
      activeCoupons: activeCoupons.length,
    },
  };
};

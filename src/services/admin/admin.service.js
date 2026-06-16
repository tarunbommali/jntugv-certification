import { adminApi, couponsApi } from '../../api/index.js';
import { extractData, success, failure } from '../shared/response.js';

export const getAdminDashboardData = async () => {
  try {
    const response = await adminApi.getAdminRealtimeData();
    const data = extractData(response);
    return success(data);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const getAllActiveCoupons = async () => {
  try {
    const response = await couponsApi.getActiveCoupons();
    const coupons = extractData(response);
    return success(Array.isArray(coupons) ? coupons : []);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const getAllCoupons = async () => {
  try {
    const response = await couponsApi.getAllCoupons();
    const allCoupons = extractData(response);
    return success(Array.isArray(allCoupons) ? allCoupons : []);
  } catch (error) {
    if (error?.status === 401 || error?.status === 403) {
      try {
        const fallbackResponse = await couponsApi.getActiveCoupons();
        const fallback = extractData(fallbackResponse);
        return success(Array.isArray(fallback) ? fallback : [], { scope: 'active' });
      } catch (fallbackError) {
        return failure(fallbackError, { details: fallbackError?.payload });
      }
    }
    return failure(error, { details: error?.payload });
  }
};

export const validateCouponCode = async (code, courseId, userId, amount) => {
  try {
    const response = await couponsApi.validateCouponCode({ code, courseId, userId, amount });
    const data = extractData(response);
    return success(data, { coupon: data?.coupon, discount: data?.discount });
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const applyCoupon = async (code, courseId, userId, amount) => {
  try {
    const response = await couponsApi.applyCoupon({ code, courseId, userId, amount });
    const data = extractData(response);
    return success(data, { coupon: data?.coupon, discount: data?.discount });
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const createCoupon = async (payload) => {
  try {
    const response = await couponsApi.createCoupon(payload);
    const coupon = extractData(response);
    return success(coupon);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const updateCoupon = async (couponId, payload) => {
  try {
    const response = await couponsApi.updateCoupon(couponId, payload);
    const coupon = extractData(response);
    return success(coupon);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const deleteCoupon = async (couponId) => {
  try {
    await couponsApi.deleteCoupon(couponId);
    return success(true);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

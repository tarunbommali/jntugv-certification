import apiRequest from './client.js';

export const getActiveCoupons = () => apiRequest('/admin/coupons/active', { withAuth: false });

export const validateCouponCode = (payload) => apiRequest('/admin/coupons/validate', {
  method: 'POST',
  body: payload,
});

export const applyCoupon = (payload) => apiRequest('/admin/coupons/apply', {
  method: 'POST',
  body: payload,
});

export const getAllCoupons = () => apiRequest('/admin/coupons', { method: 'GET' });

export const createCoupon = (payload) => apiRequest('/admin/coupons', {
  method: 'POST',
  body: payload,
});

export const updateCoupon = (couponId, payload) => apiRequest(`/admin/coupons/${couponId}`, {
  method: 'PUT',
  body: payload,
});

export const deleteCoupon = (couponId) => apiRequest(`/admin/coupons/${couponId}`, {
  method: 'DELETE',
});

export default {
  getActiveCoupons,
  validateCouponCode,
  applyCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};

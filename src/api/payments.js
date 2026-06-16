import apiRequest from './client.js';

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.append(key, value);
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const createPaymentRecord = (payload) => apiRequest('/payments', {
  method: 'POST',
  body: payload,
});

export const createRazorpayOrder = (payload) => apiRequest('/payments/order', {
  method: 'POST',
  body: payload,
});

export const verifyRazorpayPayment = (payload) => apiRequest('/payments/verify', {
  method: 'POST',
  body: payload,
});

export const updatePaymentStatus = (paymentId, updates) => apiRequest(`/payments/${paymentId}`, {
  method: 'PUT',
  body: updates,
});

export const getMyPayments = () => apiRequest('/payments/my-payments');

export const getAllPayments = (params) => apiRequest(`/payments${buildQuery(params)}`);

export default {
  createPaymentRecord,
  createRazorpayOrder,
  verifyRazorpayPayment,
  updatePaymentStatus,
  getMyPayments,
  getAllPayments,
};

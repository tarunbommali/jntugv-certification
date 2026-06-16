import { paymentsApi } from '../../api/index.js';
import { extractData, success, failure } from '../shared/response.js';

export const createPaymentRecord = async (payload) => {
  try {
    const response = await paymentsApi.createPaymentRecord(payload);
    const payment = extractData(response);
    return success(payment);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const createRazorpayOrder = async (payload) => {
  try {
    const response = await paymentsApi.createRazorpayOrder(payload);
    return success(extractData(response));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const verifyRazorpayPayment = async (payload) => {
  try {
    const response = await paymentsApi.verifyRazorpayPayment(payload);
    return success(extractData(response));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const updatePaymentStatus = async (paymentId, statusPayload) => {
  try {
    const response = await paymentsApi.updatePaymentStatus(paymentId, statusPayload);
    const payment = extractData(response);
    return success(payment);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const getAllPayments = async (params) => {
  try {
    const response = await paymentsApi.getAllPayments(params);
    const payments = extractData(response);
    return success(Array.isArray(payments) ? payments : []);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const getUserPaymentHistory = async () => {
  try {
    const response = await paymentsApi.getMyPayments();
    const payments = extractData(response);
    return success(payments);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  getUserPaymentHistory, 
  validateCouponCode, 
  applyCoupon,
  getAllActiveCoupons 
} from '../firebase/services';
import { useAuth } from './AuthContext';

const PaymentContext = createContext(undefined);

export const usePayment = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be used within PaymentProvider');
  return ctx;
};

export const PaymentProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Payment history state
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentsError, setPaymentsError] = useState(null);
  
  // Coupon state
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [couponsError, setCouponsError] = useState(null);
  
  // Current coupon validation state
  const [couponValidation, setCouponValidation] = useState({
    isValid: false,
    coupon: null,
    error: null,
    loading: false
  });

  // Fetch user payment history
  const fetchPaymentHistory = async (uid) => {
    if (!uid) return setPaymentHistory([]);

    try {
      setLoadingPayments(true);
      setPaymentsError(null);

      const result = await getUserPaymentHistory(uid);
      if (result.success) {
        setPaymentHistory(result.data);
      } else {
        setPaymentsError(result.error);
        setPaymentHistory([]);
      }
    } catch (err) {
      console.error('Failed to fetch payment history:', err);
      setPaymentsError('Failed to load payment history.');
      setPaymentHistory([]);
    } finally {
      setLoadingPayments(false);
    }
  };

  // Fetch available coupons
  const fetchAvailableCoupons = async () => {
    try {
      setLoadingCoupons(true);
      setCouponsError(null);

      const result = await getAllActiveCoupons();
      if (result.success) {
        setAvailableCoupons(result.data);
      } else {
        setCouponsError(result.error);
        setAvailableCoupons([]);
      }
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
      setCouponsError('Failed to load available coupons.');
      setAvailableCoupons([]);
    } finally {
      setLoadingCoupons(false);
    }
  };

  // Validate coupon code
  const validateCoupon = async (couponCode, courseId) => {
    if (!couponCode || !courseId) {
      setCouponValidation({
        isValid: false,
        coupon: null,
        error: 'Coupon code and course ID are required',
        loading: false
      });
      return;
    }

    try {
      setCouponValidation(prev => ({ ...prev, loading: true, error: null }));

      const result = await validateCouponCode(couponCode, courseId, currentUser?.uid);
      
      if (result.success) {
        setCouponValidation({
          isValid: true,
          coupon: result.data,
          error: null,
          loading: false
        });
      } else {
        setCouponValidation({
          isValid: false,
          coupon: null,
          error: result.error,
          loading: false
        });
      }
    } catch (err) {
      console.error('Failed to validate coupon:', err);
      setCouponValidation({
        isValid: false,
        coupon: null,
        error: 'Failed to validate coupon code',
        loading: false
      });
    }
  };

  // Apply coupon (this would typically be called during checkout)
  const applyCouponToOrder = async (couponCode, courseId) => {
    if (!couponCode || !courseId) {
      return { success: false, error: 'Coupon code and course ID are required' };
    }

    try {
      const result = await applyCoupon(couponCode, courseId, currentUser?.uid);
      return result;
    } catch (err) {
      console.error('Failed to apply coupon:', err);
      return { success: false, error: 'Failed to apply coupon' };
    }
  };

  // Clear coupon validation
  const clearCouponValidation = () => {
    setCouponValidation({
      isValid: false,
      coupon: null,
      error: null,
      loading: false
    });
  };

  // Calculate discount amount
  const calculateDiscount = (coupon, subtotal) => {
    if (!coupon || !coupon.isValid) return 0;

    const { type, value, maxDiscountAmount } = coupon.coupon;
    
    let discount = 0;
    
    if (type === 'percent') {
      discount = Math.min(subtotal * (value / 100), maxDiscountAmount || subtotal);
    } else if (type === 'flat') {
      discount = Math.min(value, subtotal);
    }
    
    return Math.round(discount);
  };

  // Effect to fetch payment history when user changes
  useEffect(() => {
    if (isAuthenticated && currentUser?.uid) {
      fetchPaymentHistory(currentUser.uid);
    } else {
      setPaymentHistory([]);
      setLoadingPayments(false);
    }
  }, [isAuthenticated, currentUser?.uid]);

  // Effect to fetch available coupons on mount
  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  const value = useMemo(() => ({
    // Payment history
    paymentHistory,
    loadingPayments,
    paymentsError,
    refreshPaymentHistory: () => fetchPaymentHistory(currentUser?.uid),
    
    // Coupons
    availableCoupons,
    loadingCoupons,
    couponsError,
    refreshCoupons: fetchAvailableCoupons,
    
    // Coupon validation
    couponValidation,
    validateCoupon,
    applyCouponToOrder,
    clearCouponValidation,
    calculateDiscount,
    
    // Helper functions
    getPaymentById: (paymentId) => paymentHistory.find(p => p.id === paymentId),
    getPaymentsByCourse: (courseId) => paymentHistory.filter(p => p.courseId === courseId),
    getTotalSpent: () => paymentHistory.reduce((total, payment) => {
      return total + (payment.status === 'captured' ? payment.amount : 0);
    }, 0),
  }), [
    paymentHistory,
    loadingPayments,
    paymentsError,
    availableCoupons,
    loadingCoupons,
    couponsError,
    couponValidation,
    currentUser?.uid,
    isAuthenticated
  ]);

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

// src/hooks/useCouponLogic.js

import { useState, useEffect, useCallback } from 'react';
import {
    getAllCoupons,
    getAllActiveCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon
} from '../services/index.js';

const initialFormData = {
    code: '',
    name: '',
    description: '',
    type: 'percent',
    value: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    usageLimitPerUser: '',
    validFrom: '',
    validUntil: '',
    applicableCourses: [],
    applicableCategories: [],
    isActive: true
};

const formatDateForInput = (date) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    // Ensure it is in 'YYYY-MM-DD' format for date inputs
    return d.toISOString().split('T')[0];
};

const toNumber = (value, fallback = 0) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
};

const toOptionalNumber = (value) => {
    if (value === null || value === undefined) return null;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
};

const toDateOrNull = (value) => {
    if (!value) return null;
    const candidate = value.toDate ? value.toDate() : new Date(value);
    return Number.isNaN(candidate?.getTime?.()) ? null : candidate;
};

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const normalizeCouponRecord = (coupon = {}) => ({
    ...coupon,
    value: toNumber(coupon.value, 0),
    minOrderAmount: toNumber(coupon.minOrderAmount, 0),
    maxDiscountAmount: toOptionalNumber(coupon.maxDiscountAmount),
    usageLimit: toOptionalNumber(coupon.usageLimit),
    usageLimitPerUser: toOptionalNumber(coupon.usageLimitPerUser ?? 1) ?? 1,
    usedCount: toNumber(coupon.usedCount, 0),
    totalDiscountGiven: toNumber(coupon.totalDiscountGiven, 0),
    totalOrders: toNumber(coupon.totalOrders, 0),
    validFrom: coupon.validFrom === null ? null : toDateOrNull(coupon.validFrom),
    validUntil: coupon.validUntil === null ? null : toDateOrNull(coupon.validUntil),
    applicableCourses: ensureArray(coupon.applicableCourses),
    applicableCategories: ensureArray(coupon.applicableCategories),
});

export const useCouponLogic = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [editingCouponId, setEditingCouponId] = useState(null);

    const resetForm = useCallback(() => {
        setFormData(initialFormData);
        setEditingCouponId(null);
    }, []);

    const fetchCoupons = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            let result = await getAllCoupons();
            if (!result.success) {
                result = await getAllActiveCoupons();
            }
            if (result.success) {
                const normalizedCoupons = Array.isArray(result.data)
                    ? result.data.map(normalizeCouponRecord)
                    : [];
                setCoupons(normalizedCoupons);
            } else {
                setError(result.error);
            }
        } catch (err) {
            const message = err?.message ? ` (${err.message})` : '';
            setError(`Failed to load coupons${message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const loadCouponForEdit = useCallback((couponId) => {
        const coupon = coupons.find(c => c.id === couponId);
        if (coupon) {
            setEditingCouponId(coupon.id);
            setFormData({
                ...coupon,
                validFrom: formatDateForInput(coupon.validFrom),
                validUntil: formatDateForInput(coupon.validUntil),
                // Ensure number fields are correctly cast if they were Firestore Timestamps/Integers
                value: String(coupon.value),
                minOrderAmount: String(coupon.minOrderAmount || ''),
                maxDiscountAmount: String(coupon.maxDiscountAmount || ''),
                usageLimit: String(coupon.usageLimit || ''),
                usageLimitPerUser: String(coupon.usageLimitPerUser || ''),
            });
            return coupon;
        }
        return null;
    }, [coupons]);


    const handleSubmit = async () => {
        setLoading(true); 
        setError(null);
        
        try {
            const couponData = {
                ...formData,
                code: formData.code.toUpperCase(),
                // Convert string inputs to correct types (float/int/Date) for backend
                value: parseFloat(formData.value) || 0,
                minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
                maxDiscountAmount: parseFloat(formData.maxDiscountAmount) || 0,
                usageLimit: parseInt(formData.usageLimit) || 0,
                usageLimitPerUser: parseInt(formData.usageLimitPerUser) || 0,
                validFrom: formData.validFrom ? new Date(formData.validFrom) : null,
                validUntil: formData.validUntil ? new Date(formData.validUntil) : null,
            };

            let result;
            if (editingCouponId) {
                result = await updateCoupon(editingCouponId, couponData);
            } else {
                result = await createCoupon(couponData);
            }

            if (!result.success) {
                setError(result.error);
                return { success: false, error: result.error };
            }
            
            return { success: true };

        } catch (err) {
            const message = err?.message ? ` (${err.message})` : '';
            const errorMessage = `Failed to save coupon.${message}`;
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (couponId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await deleteCoupon(couponId);
            if (result.success) {
                await fetchCoupons(); // Re-fetch list
            } else {
                setError(result.error);
            }
        } catch (err) {
            const message = err?.message ? ` (${err.message})` : '';
            setError(`Failed to delete coupon${message}`);
        } finally {
            setLoading(false);
        }
    };
    
    // Utility for table display
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return date.toDate ? date.toDate().toLocaleDateString() : new Date(date).toLocaleDateString();
    };

    const getCouponStatus = (coupon) => {
        const now = new Date();
        const validFrom = coupon.validFrom?.toDate ? coupon.validFrom.toDate() : new Date(coupon.validFrom);
        const validUntil = coupon.validUntil?.toDate ? coupon.validUntil.toDate() : new Date(coupon.validUntil);
        
        if (!coupon.isActive) return { status: 'inactive', color: 'text-muted', icon: 'EyeOff' };
        if (validFrom && now < validFrom) return { status: 'upcoming', color: 'text-blue-600', icon: 'Clock' };
        if (validUntil && now > validUntil) return { status: 'expired', color: 'text-red-600', icon: 'AlertCircle' };
        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return { status: 'limit-reached', color: 'text-orange-600', icon: 'AlertCircle' };
        
        return { status: 'active', color: 'text-green-600', icon: 'CheckCircle' };
    };

    return {
        coupons,
        loading,
        error,
        setError,
        formData,
        editingCouponId,
        resetForm,
        fetchCoupons,
        handleInputChange,
        handleSubmit,
        handleDelete,
        loadCouponForEdit,
        formatDate,
        getCouponStatus,
    };
};
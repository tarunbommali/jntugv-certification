// src/pages/admin/AdminCoupons.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import { 
    getAllActiveCoupons, 
    createCoupon, 
    updateCoupon, 
    deleteCoupon 
} from '../../firebase/services.js'; 
import { global_classnames } from '../../utils/classnames.js';
import { 
    Plus, 
    Edit, 
    Trash2, 
    EyeOff, 
    Percent, 
    DollarSign,
    Users,
    AlertCircle,
    CheckCircle,
    Clock,
    X,
    ArrowLeft
} from 'lucide-react';

const PRIMARY_COLOR = "#0056D2"; // Academic Blue
const SUCCESS_COLOR = "#00B551"; // Academic Green

const AdminCoupons = () => {
    const { isAdmin } = useAuth();
    
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [formData, setFormData] = useState(null); 

    // Redirect if not admin
    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg border-t-4 border-red-500">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                    <p className="text-gray-600">You need admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    // --- Helper Functions ---
    
    const resetForm = () => {
        setFormData({
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
        });
    };

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await getAllActiveCoupons();
            if (result.success) {
                setCoupons(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error('Failed to fetch coupons:', err);
            setError('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (formData === null) {
            resetForm();
        }
        fetchCoupons();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        
        try {
            const couponData = {
                ...formData,
                code: formData.code.toUpperCase(),
                value: parseFloat(formData.value),
                minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
                maxDiscountAmount: parseFloat(formData.maxDiscountAmount) || 0,
                usageLimit: parseInt(formData.usageLimit) || 0,
                usageLimitPerUser: parseInt(formData.usageLimitPerUser) || 0,
                validFrom: formData.validFrom ? new Date(formData.validFrom) : null,
                validUntil: formData.validUntil ? new Date(formData.validUntil) : null,
            };

            let result;
            if (editingCoupon) {
                result = await updateCoupon(editingCoupon.id, couponData);
            } else {
                result = await createCoupon(couponData);
            }

            if (result.success) {
                setShowCreateModal(false);
                setEditingCoupon(null);
                resetForm();
                await fetchCoupons();
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error('Failed to save coupon:', err);
            setError('Failed to save coupon. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (couponId) => {
        setLoading(true);
        try {
            const result = await deleteCoupon(couponId);
            if (result.success) {
                setShowDeleteModal(null);
                await fetchCoupons();
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error('Failed to delete coupon:', err);
            setError('Failed to delete coupon');
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (coupon) => {
        setEditingCoupon(coupon);
        const formatDateForInput = (date) => {
            if (!date) return '';
            const d = date.toDate ? date.toDate() : new Date(date);
            return d.toISOString().split('T')[0];
        };

        setFormData({
            ...coupon,
            validFrom: formatDateForInput(coupon.validFrom),
            validUntil: formatDateForInput(coupon.validUntil),
        });
        setShowCreateModal(true);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return date.toDate ? date.toDate().toLocaleDateString() : new Date(date).toLocaleDateString();
    };

    const getCouponStatus = (coupon) => {
        const now = new Date();
        const validFrom = coupon.validFrom?.toDate ? coupon.validFrom.toDate() : new Date(coupon.validFrom);
        const validUntil = coupon.validUntil?.toDate ? coupon.validUntil.toDate() : new Date(coupon.validUntil);
        
        if (!coupon.isActive) return { status: 'inactive', color: 'text-gray-500', icon: EyeOff };
        if (validFrom && now < validFrom) return { status: 'upcoming', color: 'text-blue-600', icon: Clock };
        if (validUntil && now > validUntil) return { status: 'expired', color: 'text-red-600', icon: AlertCircle };
        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return { status: 'limit-reached', color: 'text-orange-600', icon: AlertCircle };
        
        return { status: 'active', color: 'text-green-600', icon: CheckCircle };
    };

    if (loading && coupons.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    
    // Safety check for formData before rendering forms/modals
    if (formData === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}>
                
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                         
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 italic">Coupon Management</h1>
                            <p className="text-gray-600 mt-1">Manage discount codes and promotional offers</p>
                        </div>
                    </div>

                    {/* Header Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-gray-600">
                                Total Coupons: <span className="font-semibold">{coupons.length}</span>
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                resetForm();
                                setEditingCoupon(null);
                                setShowCreateModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors shadow-md hover:opacity-90"
                            style={{ backgroundColor: PRIMARY_COLOR }}
                        >
                            <Plus className="w-5 h-5" />
                            Create Coupon
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        <AlertCircle className="w-5 h-5 inline mr-2" />
                        {error}
                    </div>
                )}

                {/* Coupons Table */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Code / Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Discount</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Usage</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Validity</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {coupons.map((coupon) => {
                                    const statusInfo = getCouponStatus(coupon);
                                    const StatusIcon = statusInfo.icon;
                                    
                                    return (
                                        <tr key={coupon.id} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div 
                                                        className="text-sm font-extrabold" 
                                                        style={{ color: PRIMARY_COLOR }}
                                                    >
                                                        {coupon.code}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{coupon.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    {coupon.type === 'percent' ? ( 
                                                        <Percent className="w-4 h-4 text-gray-500" /> 
                                                    ) : ( 
                                                        <DollarSign className="w-4 h-4 text-gray-500" /> 
                                                    )}
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {coupon.type === 'percent' ? `${coupon.value}%` : `₹${coupon.value}`}
                                                    </span>
                                                </div>
                                                {coupon.minOrderAmount > 0 && (
                                                    <div className="text-xs text-gray-500">Min: ₹{coupon.minOrderAmount}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm font-semibold">
                                                    <Users className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-900">
                                                        {coupon.usedCount || 0}/{coupon.usageLimit || '∞'}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Total Saved: ₹{coupon.totalDiscountGiven || 0}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                <div className="font-semibold">{formatDate(coupon.validFrom)}</div>
                                                <div className="text-xs text-gray-500">to {formatDate(coupon.validUntil)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`flex items-center gap-1 font-semibold ${statusInfo.color}`}>
                                                    <StatusIcon className="w-4 h-4" />
                                                    <span className="text-sm capitalize">
                                                        {statusInfo.status.replace('-', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => startEdit(coupon)} 
                                                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded"
                                                        title="Edit Coupon"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setShowDeleteModal(coupon)} 
                                                        className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
                                                        title="Delete Coupon"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        
                        {coupons.length === 0 && !loading && (
                            <div className="p-10 text-center text-gray-500">
                                <div className="flex flex-col items-center gap-2">
                                    <Percent className="w-12 h-12 text-gray-300" />
                                    <p className="text-lg font-medium">No coupons available</p>
                                    <p className="text-sm">Create your first coupon to get started</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Create/Edit Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center backdrop-blur-sm justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                            <div className="p-6">
                                {/* Modal Header */}
                                <div className="flex justify-between items-center border-b pb-3 mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                                    </h2>
                                    <button 
                                        onClick={() => { 
                                            setShowCreateModal(false); 
                                            setEditingCoupon(null); 
                                            resetForm(); 
                                        }} 
                                        className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Coupon Code & Name */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Coupon Code *
                                            </label>
                                            <input 
                                                type="text" 
                                                name="code" 
                                                value={formData.code} 
                                                onChange={handleInputChange} 
                                                required 
                                                readOnly={!!editingCoupon} 
                                                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    editingCoupon ? 'bg-gray-100 text-gray-500' : 'bg-white'
                                                }`} 
                                                placeholder="e.g., WELCOME10"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Coupon Name *
                                            </label>
                                            <input 
                                                type="text" 
                                                name="name" 
                                                value={formData.name} 
                                                onChange={handleInputChange} 
                                                required 
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                                placeholder="e.g., Welcome Discount"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea 
                                            name="description" 
                                            value={formData.description} 
                                            onChange={handleInputChange} 
                                            rows={2} 
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                            placeholder="Describe the coupon purpose..."
                                        />
                                    </div>

                                    {/* Discount Value & Type */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Discount Type *
                                            </label>
                                            <select 
                                                name="type" 
                                                value={formData.type} 
                                                onChange={handleInputChange} 
                                                required 
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="percent">Percentage (%)</option>
                                                <option value="flat">Fixed Amount (₹)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Discount Value *
                                            </label>
                                            <input 
                                                type="number" 
                                                name="value" 
                                                value={formData.value} 
                                                onChange={handleInputChange} 
                                                required 
                                                min="0" 
                                                step={formData.type === 'percent' ? '1' : '0.01'} 
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                                placeholder={formData.type === 'percent' ? '10' : '500'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Max Discount Amount (₹)
                                            </label>
                                            <input 
                                                type="number" 
                                                name="maxDiscountAmount" 
                                                value={formData.maxDiscountAmount} 
                                                onChange={handleInputChange} 
                                                min="0" 
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                                placeholder="0 (Unlimited)"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Valid From/Until Dates */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Valid From
                                            </label>
                                            <input 
                                                type="date" 
                                                name="validFrom" 
                                                value={formData.validFrom} 
                                                onChange={handleInputChange} 
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Valid Until
                                            </label>
                                            <input 
                                                type="date" 
                                                name="validUntil" 
                                                value={formData.validUntil} 
                                                onChange={handleInputChange} 
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Usage Limits */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Usage Limit (Total)
                                            </label>
                                            <input 
                                                type="number" 
                                                name="usageLimit" 
                                                value={formData.usageLimit} 
                                                onChange={handleInputChange} 
                                                min="0" 
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Usage Limit Per User
                                            </label>
                                            <input 
                                                type="number" 
                                                name="usageLimitPerUser" 
                                                value={formData.usageLimitPerUser} 
                                                onChange={handleInputChange} 
                                                min="0" 
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Active Checkbox */}
                                    <div className="flex items-center pt-2">
                                        <input 
                                            type="checkbox" 
                                            name="isActive" 
                                            checked={formData.isActive} 
                                            onChange={handleInputChange} 
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 block text-sm font-medium text-gray-900">
                                            Coupon is Active
                                        </label>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                        <button 
                                            type="button" 
                                            onClick={() => { 
                                                setShowCreateModal(false); 
                                                setEditingCoupon(null); 
                                                resetForm(); 
                                            }} 
                                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={loading} 
                                            className="px-4 py-2 text-white rounded-md transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ backgroundColor: PRIMARY_COLOR }}
                                        >
                                            {loading ? 'Processing...' : (editingCoupon ? 'Update Coupon' : 'Create Coupon')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
                            <div className="flex items-center gap-3 mb-4 border-b pb-2">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                                <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
                            </div>
                            
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete the coupon <strong>"{showDeleteModal.code}"</strong>? 
                                This action cannot be undone.
                            </p>
                            
                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => setShowDeleteModal(null)} 
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleDelete(showDeleteModal.id)} 
                                    disabled={loading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Deleting...' : 'Delete Permanently'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCoupons;
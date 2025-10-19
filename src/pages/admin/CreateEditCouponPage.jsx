// src/pages/admin/CreateEditCouponPage.jsx

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useCouponLogic } from "../../hooks/useCouponLogic.js";
import PageContainer from "../../components/layout/PageContainer.jsx";
import { AlertCircle, Percent, DollarSign, ArrowLeft } from "lucide-react";
import { global_classnames } from "../../utils/classnames.js";
// ... other imports (kept minimal)

const PRIMARY_COLOR = "#0056D2";

const CreateEditCouponPage = () => {
  // ... existing hook and auth logic (omitted for brevity)
  const { isAdmin } = useAuth();
  const { couponId } = useParams(); // ID is correctly pulled from URL
  const navigate = useNavigate();

  const {
    loading,
    error,
    setError,
    formData,
    handleInputChange,
    handleSubmit,
    loadCouponForEdit,
    resetForm,
  } = useCouponLogic();

  const isEditing = !!couponId;

  useEffect(() => {
    if (isEditing) {
      // Only try to load if couponId exists (i.e., we are in edit mode)
      loadCouponForEdit(couponId);
    } else {
      // Reset form for create mode
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponId, isEditing, loadCouponForEdit]);

  // ... loading and permission checks (omitted for brevity)

  const breadcrumbItems = [
    { label: "Admin", link: "/admin" },
    { label: "Coupons", link: "/admin/coupons" },
    // CORRECTED: Breadcrumb links match the new simple routes
    {
      label: isEditing ? "Edit" : "Create",
      link: isEditing
        ? `/admin/coupons/edit/${couponId}`
        : "/admin/coupons/create",
    },
  ];

  // ... onSubmit function and component JSX (omitted for brevity)

  return (
    // ... full component JSX
    <PageContainer
      items={breadcrumbItems}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="flex flex-col  gap-4 mb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 italic">
          {isEditing ? "Edit Coupon" : "Create New Coupon"}
        </h1>
        <p className="text-gray-600 mt-1">
          Define the details and restrictions for this promotional code.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5 inline mr-2" />
          {error}
        </div>
      )}

      {/* Coupon Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSubmit();
          }}
          className="space-y-6"
        >
          {/* ... form fields (omitted for brevity) */}
          {/* Basic Info: Code & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Coupon Code *
              </label>
              <input
                id="code"
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                readOnly={isEditing}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isEditing ? "bg-gray-100 text-gray-500" : "bg-white"
                }`}
                placeholder="e.g., WELCOME10"
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Coupon Name *
              </label>
              <input
                id="name"
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
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the coupon purpose..."
            />
          </div>

          <div className="text-lg font-semibold text-gray-800 border-b pb-1 mt-6">
            Discount Details
          </div>

          {/* Discount Value & Type & Max Discount */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Discount Type *
              </label>
              <div className="relative">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="appearance-none w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Fixed Amount (₹)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  {formData.type === "percent" ? (
                    <Percent className="w-5 h-5" />
                  ) : (
                    <DollarSign className="w-5 h-5" />
                  )}
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="value"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Discount Value *
              </label>
              <input
                id="value"
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                required
                min="0"
                step={formData.type === "percent" ? "1" : "0.01"}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={formData.type === "percent" ? "10" : "500"}
              />
            </div>
            <div>
              <label
                htmlFor="maxDiscountAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Max Discount Amount (₹)
              </label>
              <input
                id="maxDiscountAmount"
                type="number"
                name="maxDiscountAmount"
                value={formData.maxDiscountAmount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0 (Unlimited)"
              />
            </div>
          </div>

          {/* Validity Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="validFrom"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Valid From
              </label>
              <input
                id="validFrom"
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="validUntil"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Valid Until
              </label>
              <input
                id="validUntil"
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="text-lg font-semibold text-gray-800 border-b pb-1 mt-6">
            Usage Restrictions
          </div>

          {/* Minimum Order Amount */}
          <div>
            <label
              htmlFor="minOrderAmount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Min Order Amount (₹)
            </label>
            <input
              id="minOrderAmount"
              type="number"
              name="minOrderAmount"
              value={formData.minOrderAmount}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0 (No Minimum)"
            />
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="usageLimit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Usage Limit (Total)
              </label>
              <input
                id="usageLimit"
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0 (Unlimited)"
              />
            </div>
            <div>
              <label
                htmlFor="usageLimitPerUser"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Usage Limit Per User
              </label>
              <input
                id="usageLimitPerUser"
                type="number"
                name="usageLimitPerUser"
                value={formData.usageLimitPerUser}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0 (Unlimited)"
              />
            </div>
          </div>

          {/* Status/Active Checkbox */}
          <div className="flex items-center pt-2">
            <input
              id="isActive"
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm font-medium text-gray-900"
            >
              Coupon is Active
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin/coupons")}
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
              {loading
                ? "Processing..."
                : isEditing
                ? "Update Coupon"
                : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default CreateEditCouponPage;

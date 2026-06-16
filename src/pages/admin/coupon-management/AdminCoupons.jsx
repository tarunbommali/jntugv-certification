/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
// src/pages/admin/AdminCoupons.jsx

import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link
import { useCouponLogic } from "../../../hooks/useCouponLogic.js";
import {
  Plus,
  Edit,
  Trash2,
  Percent,
  Users,
  AlertCircle,
  X,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import PageContainer from "../../../components/layout/PageContainer.jsx";
import PageTitle from "../../../components/ui/PageTitle.jsx";
import { formatINR } from "../../../utils/currency.js";
const PRIMARY_COLOR = "var(--color-primary)"; // LinkedIn Blue from theme

const items = [
  { label: "Admin", link: "/admin" },
  { label: "Coupons", link: "/admin/coupons" },
];

const AdminCoupons = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  const { coupons, loading, error, handleDelete, formatDate, getCouponStatus } =
    useCouponLogic();

  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const resolveCouponType = (coupon) =>
    coupon?.type === "amount" || coupon?.type === "flat" ? "amount" : "percent";

  const discountLabel = (coupon) => {
    const type = resolveCouponType(coupon);
    return type === "percent" ? `${coupon.value}%` : formatINR(coupon.value || 0);
  };

  const maxDiscountLabel = (coupon) => {
    const type = resolveCouponType(coupon);
    if (type === "percent") {
      return coupon.maxDiscountAmount
        ? `Max ${formatINR(coupon.maxDiscountAmount)}`
        : "No max cap";
    }
    return coupon.maxDiscountAmount
      ? `Cap ${formatINR(coupon.maxDiscountAmount)}`
      : "Fixed amount";
  };

  const minOrderLabel = (coupon) =>
    coupon.minOrderAmount && coupon.minOrderAmount > 0
      ? formatINR(coupon.minOrderAmount)
      : "None";

  const limitLabel = (value, { unlimitedText = "Unlimited" } = {}) => {
    if (value === null || value === undefined) return unlimitedText;
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return unlimitedText;
    return numeric;
  };

  const applicabilityLabel = (coupon) => {
    const courseCount = coupon.applicableCourses?.length || 0;
    const categoryCount = coupon.applicableCategories?.length || 0;
    if (courseCount > 0) {
      return `${courseCount} course${courseCount > 1 ? "s" : ""}`;
    }
    if (categoryCount > 0) {
      return `${categoryCount} ${categoryCount > 1 ? "categories" : "category"}`;
    }
    return "All courses";
  };

  // --- Redirection/Loading checks (omitted for brevity, assume existing logic)

  // --- Handlers ---
  const confirmDelete = async () => {
    if (!showDeleteModal) return;

    setIsDeleting(true);
    try {
      await handleDelete(showDeleteModal.id);
      setShowDeleteModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Navigation function for editing
  const startEdit = (couponId) => {
    // Correct path for editing a coupon: /admin/coupons/edit/:couponId
    navigate(`/admin/coupons/edit/${couponId}`);
  };

  return (
    <PageContainer items={items} className="min-h-screen bg-background py-8">
      {/* Page Title */}
      <PageTitle
        title="Coupon Management"
        description="Manage discount codes and promotional offers"
      />

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <p className="text-muted">
            Total Coupons:{" "}
            <span className="font-semibold">{coupons.length}</span>
          </p>
        </div>
        {/* CORRECTED: Link for creating a new coupon */}
        <Link
          to="/admin/coupons/create"
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors shadow-md hover:opacity-90"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          <Plus className="w-5 h-5" />
          Create Coupon
        </Link>
      </div>

      {/* Error Message (omitted for brevity) */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5 inline mr-2" />
          {error}
        </div>
      )}

      {/* Coupons Table (omitted most table rows for brevity) */}
      <div className="bg-surface rounded-xl shadow-md border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Coupon
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Requirements
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="bg-surface divide-y divide-border">
              {loading && coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-sm text-muted">
                    Loading coupons...
                  </td>
                </tr>
              )}
              {coupons.map((coupon) => {
                const statusInfo = getCouponStatus(coupon);
                const StatusIcon = LucideIcons[statusInfo.icon] || AlertCircle;

                return (
                  <tr
                    key={coupon.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <div className="font-mono text-sm font-semibold text-foreground">
                        {coupon.code}
                      </div>
                      <div className="text-sm text-muted">{coupon.name}</div>
                      {coupon.description && (
                        <div className="text-xs text-muted max-w-xs truncate">
                          {coupon.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <div className="text-sm font-semibold text-foreground">
                        {discountLabel(coupon)}
                      </div>
                      <div className="text-xs text-muted capitalize">
                        {resolveCouponType(coupon) === "percent"
                          ? "Percentage"
                          : "Fixed amount"}
                      </div>
                      <div className="text-xs text-muted">{maxDiscountLabel(coupon)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <div className="text-sm text-foreground">
                        Min Order: {minOrderLabel(coupon)}
                      </div>
                      <div className="text-xs text-muted">
                        Per User Limit: {limitLabel(coupon.usageLimitPerUser, { unlimitedText: "Unlimited" })}
                      </div>
                      <div className="text-xs text-muted">
                        Total Limit: {limitLabel(coupon.usageLimit)}
                      </div>
                      <div className="text-xs text-muted">
                        Applies to: {applicabilityLabel(coupon)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <div className="text-xs uppercase text-muted tracking-wide">
                        From
                      </div>
                      <div className="text-sm text-foreground">
                        {formatDate(coupon.validFrom)}
                      </div>
                      <div className="text-xs uppercase text-muted tracking-wide mt-2">
                        Until
                      </div>
                      <div className="text-sm text-foreground">
                        {coupon.validUntil ? formatDate(coupon.validUntil) : "No end date"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <div className="text-sm text-foreground">
                        Used {coupon.usedCount} / {limitLabel(coupon.usageLimit)}
                      </div>
                      <div className="text-xs text-muted">
                        Orders: {coupon.totalOrders}
                      </div>
                      <div className="text-xs text-muted">
                        Discount Given: {formatINR(coupon.totalDiscountGiven)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`flex items-center gap-1 font-semibold ${statusInfo.color}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm capitalize">
                          {statusInfo.status.replace("-", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {/* CORRECTED: Call startEdit to navigate */}
                        <button
                          onClick={() => startEdit(coupon.id)}
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
              {/* ... empty state check ... */}
              {!loading && coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-muted">
                    <div className="flex flex-col items-center gap-2">
                      <Percent className="w-12 h-12 text-gray-300" />
                      <p className="text-lg font-medium">No coupons available</p>
                      <p className="text-sm">Create your first coupon to get started</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal (omitted for brevity) */}
      {showDeleteModal && (
        // ... Modal JSX here
        <div className="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <h2 className="text-xl font-bold text-foreground">
                  Confirm Deletion
                </h2>
              </div>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="text-muted hover:text-foreground transition-colors p-1 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-muted mb-6">
              Are you sure you want to delete the coupon{" "}
              <strong>"{showDeleteModal.code}"</strong>? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-muted bg-surface-elevated rounded-md hover:bg-gray-300 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default AdminCoupons;

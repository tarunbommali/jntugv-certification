// src/pages/admin/AdminCoupons.jsx

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link
import { useCouponLogic } from "../../hooks/useCouponLogic.js";
import {
  Plus,
  Edit,
  Trash2,
  Percent,
  DollarSign,
  Users,
  AlertCircle,
  X,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import PageContainer from "../../components/layout/PageContainer.jsx";
import PageTitle from "../../components/ui/PageTitle.jsx";
const PRIMARY_COLOR = "#0056D2";

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
    <PageContainer items={items} className="min-h-screen bg-gray-50 py-8">
        {/* Page Title */}
      <PageTitle
        title="Coupon Management"
        description="Manage discount codes and promotional offers"
      />

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <p className="text-gray-600">
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
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header (omitted for brevity) */}
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => {
                const statusInfo = getCouponStatus(coupon);
                const StatusIcon = LucideIcons[statusInfo.icon] || AlertCircle;

                return (
                  <tr
                    key={coupon.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    {/* ... other table cells ... */}
                    <td className="px-6 py-4 whitespace-nowrap">...</td>
                    <td className="px-6 py-4 whitespace-nowrap">...</td>
                    <td className="px-6 py-4 whitespace-nowrap">...</td>
                    <td className="px-6 py-4 whitespace-nowrap">...</td>
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
            </tbody>
          </table>

          {coupons.length === 0 && !loading && (
            <div className="p-10 text-center text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <Percent className="w-12 h-12 text-gray-300" />
                <p className="text-lg font-medium">No coupons available</p>
                <p className="text-sm">
                  Create your first coupon to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal (omitted for brevity) */}
      {showDeleteModal && (
        // ... Modal JSX here
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <h2 className="text-xl font-bold text-gray-900">
                  Confirm Deletion
                </h2>
              </div>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the coupon{" "}
              <strong>"{showDeleteModal.code}"</strong>? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
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

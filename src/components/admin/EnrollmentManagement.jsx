/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  getUserEnrollments,
  updateEnrollment,
  deleteEnrollment,
} from "../../firebase/services_modular/enrollmentOperations";

const EnrollmentManagement = ({ userId, onEnrollmentChange }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [editForm, setEditForm] = useState({
    status: "",
    paidAmount: 0,
    paymentMethod: "",
    paymentReference: "",
  });

  useEffect(() => {
    fetchEnrollments();
  }, [userId]);

  const fetchEnrollments = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError("");
    
    try {
      const result = await getUserEnrollments(userId);
      if (result.success) {
        setEnrollments(result.data || []);
      } else {
        setError(result.error || "Failed to fetch enrollments");
      }
    } catch (err) {
      setError("An error occurred while fetching enrollments");
      console.error("Enrollment fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEnrollment = (enrollment) => {
    setEditingEnrollment(enrollment);
    setEditForm({
      status: enrollment.status || "SUCCESS",
      paidAmount: enrollment.paidAmount || 0,
      paymentMethod: enrollment.paymentDetails?.method || "offline",
      paymentReference: enrollment.paymentDetails?.reference || "",
    });
  };

  const handleUpdateEnrollment = async () => {
    if (!editingEnrollment) return;

    setLoading(true);
    try {
      const updateData = {
        status: editForm.status,
        paidAmount: parseFloat(editForm.paidAmount) || 0,
        paymentDetails: {
          ...editingEnrollment.paymentDetails,
          method: editForm.paymentMethod,
          reference: editForm.paymentReference,
        },
      };

      const result = await updateEnrollment(editingEnrollment.id, updateData);
      if (result.success) {
        setEditingEnrollment(null);
        await fetchEnrollments();
        onEnrollmentChange?.();
      } else {
        setError(result.error || "Failed to update enrollment");
      }
    } catch (err) {
      setError("An error occurred while updating enrollment");
      console.error("Enrollment update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteEnrollment(enrollmentId);
      if (result.success) {
        await fetchEnrollments();
        onEnrollmentChange?.();
      } else {
        setError(result.error || "Failed to delete enrollment");
      }
    } catch (err) {
      setError("An error occurred while deleting enrollment");
      console.error("Enrollment deletion error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "PENDING":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "FAILED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && enrollments.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading enrollments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Course Enrollments ({enrollments.length})
        </h3>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No enrollments found for this user.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {enrollment.courseTitle || "Course"}
                    </h4>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        enrollment.status
                      )}`}
                    >
                      {getStatusIcon(enrollment.status)}
                      <span className="ml-1">{enrollment.status}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>${enrollment.paidAmount || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {enrollment.enrolledAt?.toDate?.()?.toLocaleDateString() ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="capitalize">
                        {enrollment.paymentDetails?.method || "N/A"}
                      </span>
                    </div>
                  </div>

                  {enrollment.paymentDetails?.reference && (
                    <div className="mt-2 text-xs text-gray-500">
                      Ref: {enrollment.paymentDetails.reference}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEditEnrollment(enrollment)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit enrollment"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEnrollment(enrollment.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete enrollment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Enrollment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="SUCCESS">Success</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paid Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.paidAmount}
                  onChange={(e) => setEditForm({ ...editForm, paidAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={editForm.paymentMethod}
                  onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                  <option value="free">Free</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Reference
                </label>
                <input
                  type="text"
                  value={editForm.paymentReference}
                  onChange={(e) => setEditForm({ ...editForm, paymentReference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Transaction ID, Receipt No., etc."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingEnrollment(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEnrollment}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentManagement;
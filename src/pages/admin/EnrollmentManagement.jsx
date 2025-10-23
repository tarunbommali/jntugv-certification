/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import {
  Search,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  User,
  BookOpen,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import {
  updateEnrollment,
  deleteEnrollment,
  createEnrollment,
} from "../../firebase/services_modular/enrollmentOperations";
import PageContainer from "../../components/layout/PageContainer.jsx";
import PageTitle from "../../components/ui/PageTitle.jsx";
import FormField from "../../components/ui/FormField.jsx";
import { useEnrollmentContext } from "../../hooks/admin/useEnrollmentContext.js";
import {
  getStatusIcon,
  getStatusColor,
  getUniqueStatuses,
  getPublishedCourses,
  filterEnrollments,
  calculateStats,
  getCleanEnrollmentData,
  isValidEnrollment,
} from "../../utils/helper/enrollmentHelpers.js";
import {
  editEnrollmentFormConfig,
  manualEnrollmentFormConfig,
} from "../../configs/enrollmentFormConfigs.js";

const items = [
  { label: "Admin", link: "/admin" },
  { label: "Enrollment Management", link: "/admin/enrollments" },
];

const EnrollmentManagement = () => {
  const { isAdmin } = useAuth();
  const {
    enrollments,
    users,
    courses,
    loading,
    error,
    refreshData,
  } = useEnrollmentContext();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [userFilter, setUserFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [actionMessage, setActionMessage] = useState({ type: "", message: "" });
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [showManualEnrollment, setShowManualEnrollment] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form States
  const [editForm, setEditForm] = useState({
    status: "",
    paidAmount: 0,
    paymentMethod: "",
    paymentReference: "",
  });

  const [manualEnrollmentForm, setManualEnrollmentForm] = useState({
    userId: "",
    courseId: "",
    status: "SUCCESS",
    paidAmount: 0,
    paymentMethod: "offline",
    paymentReference: "",
  });

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Toast notification helper
  const showToast = (message, type = "success") => {
    setActionMessage({ show: true, message, type });
    setTimeout(() => setActionMessage({ show: false, message: "", type: "success" }), 5000);
  };

  // Clean and filter enrollments
  const cleanEnrollments = enrollments
    .filter(isValidEnrollment)
    .map(getCleanEnrollmentData);

  const filters = { searchTerm, statusFilter, userFilter, courseFilter };
  const filteredEnrollments = filterEnrollments(cleanEnrollments, filters);
  const stats = calculateStats(cleanEnrollments);

  // Handlers
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

    setProcessing(true);
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
        showToast("Enrollment updated successfully");
        refreshData();
      } else {
        throw new Error(result.error || "Failed to update enrollment");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) {
      return;
    }

    setProcessing(true);
    try {
      const result = await deleteEnrollment(enrollmentId);
      if (result.success) {
        showToast("Enrollment deleted successfully");
        refreshData();
      } else {
        throw new Error(result.error || "Failed to delete enrollment");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleManualEnrollment = async () => {
    const { userId, courseId, status, paidAmount, paymentMethod, paymentReference } = manualEnrollmentForm;
    
    if (!userId || !courseId) {
      showToast("Please select both user and course", "error");
      return;
    }

    setProcessing(true);
    try {
      const selectedCourse = courses.find(c => c.courseId === courseId);
      const selectedUser = users.find(u => u.uid === userId);

      const enrollmentData = {
        userId: userId,
        courseId: courseId,
        status: status,
        paidAmount: parseFloat(paidAmount) || selectedCourse?.price || 0,
        paymentDetails: {
          method: paymentMethod,
          reference: paymentReference,
          status: status === "SUCCESS" ? "completed" : "pending",
        },
        enrolledAt: new Date(),
      };

      const result = await createEnrollment(enrollmentData);
      if (result.success) {
        setShowManualEnrollment(false);
        setManualEnrollmentForm({
          userId: "",
          courseId: "",
          status: "SUCCESS",
          paidAmount: 0,
          paymentMethod: "offline",
          paymentReference: "",
        });
        showToast(`Successfully enrolled ${selectedUser?.displayName || selectedUser?.email} in ${selectedCourse?.title}`);
        refreshData();
      } else {
        throw new Error(result.error || "Failed to create enrollment");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleCourseChange = (courseId) => {
    const selectedCourse = courses.find(c => c.courseId === courseId);
    setManualEnrollmentForm(prev => ({
      ...prev,
      courseId: courseId,
      paidAmount: selectedCourse?.price || 0,
    }));
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "N/A";
    
    try {
      if (date.toDate) {
        // Firebase timestamp
        return date.toDate().toLocaleDateString();
      } else if (date instanceof Date) {
        // JavaScript Date object
        return date.toLocaleDateString();
      } else if (typeof date === 'string') {
        // ISO string
        return new Date(date).toLocaleDateString();
      }
      return "Invalid Date";
    } catch (error) {
      return "N/A";
    }
  };

  // Loading State
  if (loading && enrollments.length === 0) {
    return (
      <PageContainer items={items} className="min-h-screen bg-gray-50 py-8">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading enrollments...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer items={items} className="min-h-screen bg-gray-50 py-8">
      <PageTitle
        title="Enrollment Management"
        description="Manage all course enrollments across the platform"
      />

      {/* Action Message Bar */}
      {actionMessage.message && (
        <div
          className={`p-3 rounded-lg mb-4 ${
            actionMessage.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {actionMessage.message}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
              <div className="mt-2 text-sm text-red-700"><p>{error}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Header with Manual Enrollment Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <FormField
            type="text"
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by user name, email, or course title..."
            icon={Search}
            className="mb-0"
          />
        </div>

        <button
          onClick={() => setShowManualEnrollment(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>Manual Enrollment</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <FormField
            label="Status"
            type="select"
            value={statusFilter}
            onChange={setStatusFilter}
            className="mb-0"
          >
            <option value="ALL">All Statuses</option>
            {getUniqueStatuses(cleanEnrollments).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </FormField>

          {/* User Filter */}
          <FormField
            label="User"
            type="select"
            value={userFilter}
            onChange={setUserFilter}
            className="mb-0"
          >
            <option value="ALL">All Users</option>
            {users.map(user => (
              <option key={user.uid} value={user.uid}>
                {user.displayName || user.email}
              </option>
            ))}
          </FormField>

          {/* Course Filter */}
          <FormField
            label="Course"
            type="select"
            value={courseFilter}
            onChange={setCourseFilter}
            className="mb-0"
          >
            <option value="ALL">All Courses</option>
            {courses.map(course => (
              <option key={course.courseId} value={course.courseId}>
                {course.title} {!course.isPublished && "(Draft)"}
              </option>
            ))}
          </FormField>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {filteredEnrollments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No enrollments found matching your criteria.</p>
            {cleanEnrollments.length === 0 && (
              <p className="text-sm mt-2">No enrollments have been created yet.</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <EnrollmentRow
                    key={enrollment.id}
                    enrollment={enrollment}
                    onEdit={handleEditEnrollment}
                    onDelete={handleDeleteEnrollment}
                    getStatusIcon={getStatusIcon}
                    getStatusColor={getStatusColor}
                    formatDate={formatDate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <StatsSection stats={stats} />

      {/* Edit Enrollment Modal */}
      {editingEnrollment && (
        <EditEnrollmentModal
          enrollment={editingEnrollment}
          form={editForm}
          setForm={setEditForm}
          onClose={() => setEditingEnrollment(null)}
          onSave={handleUpdateEnrollment}
          loading={processing}
          config={editEnrollmentFormConfig}
        />
      )}

      {/* Manual Enrollment Modal */}
      {showManualEnrollment && (
        <ManualEnrollmentModal
          form={manualEnrollmentForm}
          setForm={setManualEnrollmentForm}
          onClose={() => setShowManualEnrollment(false)}
          onSave={handleManualEnrollment}
          onCourseChange={handleCourseChange}
          loading={processing}
          users={users}
          courses={courses}
          config={manualEnrollmentFormConfig}
          getPublishedCourses={getPublishedCourses}
        />
      )}
    </PageContainer>
  );
};

// Sub-components for better organization
const EnrollmentRow = ({ enrollment, onEdit, onDelete, getStatusIcon, getStatusColor, formatDate }) => (
  <tr key={enrollment.id} className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">
            {enrollment.user?.displayName || "Unknown User"}
          </div>
          <div className="text-sm text-gray-500">
            {enrollment.user?.email || "No email"}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">
        {enrollment.course?.title || "Unknown Course"}
      </div>
      <div className="text-sm text-gray-500">
        {enrollment.course?.category || "Uncategorized"}
        {!enrollment.course?.isPublished && (
          <span className="ml-2 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
            Draft
          </span>
        )}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
        {getStatusIcon(enrollment.status)}
        <span className="ml-1">{enrollment.status}</span>
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      <div className="flex items-center">
        <DollarSign className="w-4 h-4 mr-1" />
        {enrollment.paidAmount || 0}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <div className="capitalize">
        {enrollment.paymentDetails?.method || "Not specified"}
      </div>
      {enrollment.paymentDetails?.reference && (
        <div className="text-xs text-gray-400">
          {enrollment.paymentDetails.reference}
        </div>
      )}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <div className="flex items-center">
        <Calendar className="w-4 h-4 mr-1" />
        {formatDate(enrollment.enrolledAt)}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onEdit(enrollment)}
          className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
          title="Edit enrollment"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(enrollment.id)}
          className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
          title="Delete enrollment"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </td>
  </tr>
);

const StatsSection = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
      <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
      <div className="text-sm text-gray-600">Total Enrollments</div>
    </div>
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
      <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
      <div className="text-sm text-gray-600">Successful</div>
    </div>
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
      <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
      <div className="text-sm text-gray-600">Pending</div>
    </div>
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
      <div className="text-2xl font-bold text-purple-600">${stats.totalRevenue}</div>
      <div className="text-sm text-gray-600">Total Revenue</div>
    </div>
  </div>
);

const EditEnrollmentModal = ({ enrollment, form, setForm, onClose, onSave, loading, config }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <h3 className="text-lg font-semibold mb-4">Edit Enrollment</h3>
      
      <div className="space-y-4">
        <FormField
          label={config.status.label}
          type={config.status.type}
          value={form.status}
          onChange={(value) => setForm({ ...form, status: value })}
          className="mb-0"
        >
          {config.status.options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </FormField>

        <FormField
          label={config.paidAmount.label}
          type={config.paidAmount.type}
          value={form.paidAmount}
          onChange={(value) => setForm({ ...form, paidAmount: value })}
          step={config.paidAmount.step}
          className="mb-0"
        />

        <FormField
          label={config.paymentMethod.label}
          type={config.paymentMethod.type}
          value={form.paymentMethod}
          onChange={(value) => setForm({ ...form, paymentMethod: value })}
          className="mb-0"
        >
          {config.paymentMethod.options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </FormField>

        <FormField
          label={config.paymentReference.label}
          type={config.paymentReference.type}
          value={form.paymentReference}
          onChange={(value) => setForm({ ...form, paymentReference: value })}
          placeholder={config.paymentReference.placeholder}
          className="mb-0"
        />
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  </div>
);

const ManualEnrollmentModal = ({ form, setForm, onClose, onSave, onCourseChange, loading, users, courses, config, getPublishedCourses }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Manual Enrollment</h3>
      
      <div className="space-y-4">
        {/* User Selection */}
        <FormField
          label={config.userId.label}
          type={config.userId.type}
          value={form.userId}
          onChange={(value) => setForm({ ...form, userId: value })}
          className="mb-0"
        >
          <option value="">Choose a user</option>
          {users.map(user => (
            <option key={user.uid} value={user.uid}>
              {user.displayName || user.email}
            </option>
          ))}
        </FormField>

        {/* Course Selection */}
        <FormField
          label={config.courseId.label}
          type={config.courseId.type}
          value={form.courseId}
          onChange={(value) => onCourseChange(value)}
          className="mb-0"
        >
          <option value="">Choose a course</option>
          {getPublishedCourses(courses).map(course => (
            <option key={course.courseId} value={course.courseId}>
              {course.title} - ₹{course.price || 0}
            </option>
          ))}
        </FormField>
        <p className="text-xs text-gray-500 mt-1">Only published courses are shown</p>

        {/* Course Fee Display */}
        {form.courseId && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Course Fee:</strong> ₹{form.paidAmount}
            </div>
          </div>
        )}

        {/* Status */}
        <FormField
          label={config.status.label}
          type={config.status.type}
          value={form.status}
          onChange={(value) => setForm({ ...form, status: value })}
          className="mb-0"
        >
          {config.status.options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </FormField>

        {/* Payment Method */}
        <FormField
          label={config.paymentMethod.label}
          type={config.paymentMethod.type}
          value={form.paymentMethod}
          onChange={(value) => setForm({ ...form, paymentMethod: value })}
          className="mb-0"
        >
          {config.paymentMethod.options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </FormField>

        {/* Payment Reference */}
        <FormField
          label={config.paymentReference.label}
          type={config.paymentReference.type}
          value={form.paymentReference}
          onChange={(value) => setForm({ ...form, paymentReference: value })}
          placeholder={config.paymentReference.placeholder}
          className="mb-0"
        />
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={loading || !form.userId || !form.courseId}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Enrolling..." : "Enroll User"}
        </button>
      </div>
    </div>
  </div>
);

export default EnrollmentManagement;
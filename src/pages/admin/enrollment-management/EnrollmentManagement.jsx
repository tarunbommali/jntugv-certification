/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  Search,
  Edit,
  Trash2,
  Calendar,
  IndianRupee,
  User,
  BookOpen,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import {
  updateEnrollment,
  deleteEnrollment,
  createEnrollment,
} from "../../../services/index.js";
import PageContainer from "../../../components/layout/PageContainer.jsx";
import PageTitle from "../../../components/ui/PageTitle.jsx";
import FormField from "../../../components/ui/FormField.jsx";
import { useRealtimeAdminEnrollments, useRealtimeAdminUsers, useRealtimeCourses } from "../../../hooks/useRealtimeApi.js";
import {
  getStatusIcon,
  getStatusColor,
  getUniqueStatuses,
  filterEnrollments,
  calculateStats,
  getCleanEnrollmentData,
  isValidEnrollment,
} from "../../../utils/helper/enrollmentHelpers.jsx";
import {
  editEnrollmentFormConfig,
  manualEnrollmentFormConfig,
} from "../../../configs/enrollmentFormConfigs.js";
import ManualEnrollmentForm from "./ManualEnrollmentForm.jsx";
import ToastNotification from "../../../components/ui/ToastNotification.jsx";

const items = [
  { label: "Admin", link: "/admin" },
  { label: "Enrollment Management", link: "/admin/enrollments" },
];

const EnrollmentManagement = () => {
  const { isAdmin, currentUser } = useAuth();
  const navigate = useNavigate();

  // -------------------------
  // Real-time data (API / MySQL)
  // -------------------------
  const { data: rtEnrollments, loading: enrollLoading, error: enrollError } = useRealtimeAdminEnrollments({ limitCount: 500 });
  const { data: rtUsers, loading: usersLoading, error: usersError } = useRealtimeAdminUsers({ limitCount: 1000 });
  const { data: rtCourses, loading: coursesLoading, error: coursesError } = useRealtimeCourses({ limitCount: 500, publishedOnly: false });

  // -------------------------
  // Local UI state
  // -------------------------
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [userFilter, setUserFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");

  const [actionMessage, setActionMessage] = useState({ type: "", message: "" });
  const [toastVisible, setToastVisible] = useState(false);

  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [showManualEnrollment, setShowManualEnrollment] = useState(false);
  const [processing, setProcessing] = useState(false);

  // -------------------------
  // Forms state
  // -------------------------
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

  // Redirect non-admins
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // -------------------------
  // Toast helpers
  // -------------------------
  const showToast = (message, type = "success", opts = {}) => {
    setActionMessage({ message, type });
    setToastVisible(true);

    if (opts.duration === 0) return;

    const clearAfter = typeof opts.duration === "number" ? opts.duration + 300 : 5300;
    setTimeout(() => {
      setActionMessage({ message: "", type: "" });
    }, clearAfter);
  };

  const closeToast = () => {
    setToastVisible(false);
    setTimeout(() => setActionMessage({ message: "", type: "" }), 300);
  };

  // -------------------------
  // Normalize realtime users & courses for join
  // -------------------------
  const users = (rtUsers || []).map(u => ({ ...u, uid: u.uid || u.id }));
  const courses = (rtCourses || []).map(c => ({ ...c, courseId: c.courseId || c.id }));

  // Join user & course onto each enrollment
  const enrollments = (rtEnrollments || []).map(e => ({
    ...e,
    id: e.id,
    user: users.find(u => String(u.uid) === String(e.userId)) || null,
    course: courses.find(c => String(c.courseId) === String(e.courseId)) || null,
    paidAmount: e.paidAmount ?? e.amount ?? e.paymentDetails?.amountPaid ?? 0,
  }));

  // Clean + filter enrollments
  const cleanEnrollments = enrollments
    .filter(isValidEnrollment)
    .map(getCleanEnrollmentData);

  const filters = { searchTerm, statusFilter, userFilter, courseFilter };
  const filteredEnrollments = filterEnrollments(cleanEnrollments, filters);
  const stats = calculateStats(cleanEnrollments);

  // -------------------------
  // Handlers for Edit / Delete / Manual
  // -------------------------
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
        setEditForm({
          status: "",
          paidAmount: 0,
          paymentMethod: "",
          paymentReference: "",
        });
        showToast("Enrollment updated successfully", "success");
      } else {
        throw new Error(result.error || "Failed to update enrollment");
      }
    } catch (err) {
      showToast(err.message || "Failed to update enrollment", "error");
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
        showToast("Enrollment deleted successfully", "success");
      } else {
        throw new Error(result.error || "Failed to delete enrollment");
      }
    } catch (err) {
      showToast(err.message || "Failed to delete enrollment", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleManualEnrollment = async (formData) => {
    const {
      userId,
      courseId,
      status,
      paidAmount,
      paymentMethod,
      paymentReference,
    } = formData;

    if (!userId || !courseId) {
      showToast("Please select both user and course", "error");
      return;
    }

    setProcessing(true);
    try {
      const selectedCourse = courses.find((c) => String(c.courseId) === String(courseId));
      const selectedUser = users.find((u) => u.uid === userId);

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

      const result = await createEnrollment({
        userId,
        courseId,
        courseTitle: selectedCourse?.title || selectedCourse?.courseTitle || "Course",
        coursePrice: parseFloat(paidAmount) || selectedCourse?.price || 0,
        status,
        enrolledBy: 'admin',
        paymentData: {
          method: paymentMethod,
          reference: paymentReference,
          amountPaid: parseFloat(paidAmount) || selectedCourse?.price || 0,
          amount: parseFloat(paidAmount) || selectedCourse?.price || 0,
          paymentId: `ADMIN_${Date.now()}`,
        },
      });

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

        showToast(
          `Successfully enrolled ${selectedUser?.username || selectedUser?.email || "user"} in ${selectedCourse?.title || "course"}`,
          "success"
        );
      } else {
        throw new Error(result.error || "Failed to create enrollment");
      }
    } catch (err) {
      showToast(err.message || "Failed to create enrollment", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleCourseChange = (courseId) => {
    const selectedCourse = courses.find((c) => c.courseId === courseId);
    setManualEnrollmentForm((prev) => ({
      ...prev,
      courseId: courseId,
      paidAmount: selectedCourse?.price || 0,
    }));
  };

  // -------------------------
  // Utility: format date safely
  // -------------------------
  const formatDate = (date) => {
    if (!date) return "N/A";

    try {
      if (date.toDate) {
        return date.toDate().toLocaleDateString();
      } else if (date instanceof Date) {
        return date.toLocaleDateString();
      } else if (typeof date === "string") {
        return new Date(date).toLocaleDateString();
      }
      return "Invalid Date";
    } catch (error) {
      return "N/A";
    }
  };

  // -------------------------
  // Loading & error states
  // -------------------------
  const loading = enrollLoading || usersLoading || coursesLoading;
  const error = enrollError || usersError || coursesError;
  if (loading && (rtEnrollments?.length || 0) === 0) {
    return (
      <PageContainer items={items} className="min-h-screen bg-background py-8">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted mt-4">Loading enrollments...</p>
        </div>
      </PageContainer>
    );
  }

  // -------------------------
  // Render
  // -------------------------
  return (
    <PageContainer items={items} className="min-h-screen bg-background py-8">
      <PageTitle
        title="Enrollment Management"
        description="Manage all course enrollments across the platform"
      />

      <ToastNotification
        show={toastVisible}
        message={actionMessage.message}
        type={actionMessage.type === "error" ? "error" : actionMessage.type === "warning" ? "warning" : (actionMessage.type || "success")}
        duration={5000}
        onClose={closeToast}
        position="bottom-center"
        showCloseButton={true}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading data
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with search + manual enrollment button */}
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

        <Link to='/admin/enrollments/manual'
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>Manual Enrollment</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-surface p-6 rounded-xl shadow-md border border-border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Status"
            type="select"
            value={statusFilter}
            onChange={setStatusFilter}
            className="mb-0"
          >
            <option value="ALL">All Statuses</option>
            {getUniqueStatuses(cleanEnrollments).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </FormField>

          <FormField
            label="User"
            type="select"
            value={userFilter}
            onChange={setUserFilter}
            className="mb-0"
          >
            <option value="ALL">All Users</option>
            {users.map((user) => (
              <option key={user.uid} value={user.uid}>
                {user.username || user.email}
              </option>
            ))}
          </FormField>

          <FormField
            label="Course"
            type="select"
            value={courseFilter}
            onChange={setCourseFilter}
            className="mb-0"
          >
            <option value="ALL">All Courses</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.title} {!course.isPublished && "(Draft)"}
              </option>
            ))}
          </FormField>
        </div>
      </div>

      {/* Enrollments table */}
      <div className="bg-surface rounded-xl shadow-md border border-border overflow-hidden">
        {filteredEnrollments.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No enrollments found matching your criteria.</p>
            {cleanEnrollments.length === 0 && (
              <p className="text-sm mt-2">
                No enrollments have been created yet.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-border">
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

      {/* Summary stats */}
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
        <ManualEnrollmentForm
          form={manualEnrollmentForm}
          setForm={setManualEnrollmentForm}
          onClose={() => setShowManualEnrollment(false)}
          onSave={handleManualEnrollment}
          onCourseChange={handleCourseChange}
          loading={processing}
          users={users}
          courses={courses}
        />
      )}
    </PageContainer>
  );
};

// -------------------------
// Sub-components
// -------------------------
const EnrollmentRow = ({
  enrollment,
  onEdit,
  onDelete,
  getStatusIcon,
  getStatusColor,
  formatDate,
}) => {
  return (
    <tr key={enrollment.id} className="hover:bg-background">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-foreground">
              {enrollment.user?.username || "Unknown User"}
            </div>
            <div className="text-sm text-muted">
              {enrollment.user?.email || "No email"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {(
          (enrollment.course?.title || enrollment.course?.courseTitle) && (
            <div className="text-sm font-medium text-foreground">
              {enrollment.course?.title || enrollment.course?.courseTitle}
            </div>
          )
        )}
        {enrollment.course?.category && (
          <div className="text-sm text-muted">
            {enrollment.course.category}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            enrollment.status
          )}`}
        >
          {getStatusIcon(enrollment.status)}
          <span className="ml-1">{enrollment.status}</span>
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
        <div className="flex items-center">
          <IndianRupee className="w-4 h-4 mr-1" />
          {enrollment.paidAmount || 0}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
        <div className="capitalize">
          {enrollment.paymentDetails?.method || "Not specified"}
        </div>
        {enrollment.paymentDetails?.reference && (
          <div className="text-xs text-muted">
            {enrollment.paymentDetails.reference}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
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
};

const StatsSection = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
    <div className="bg-surface p-4 rounded-lg shadow border border-border text-center">
      <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
      <div className="text-sm text-muted">Total Enrollments</div>
    </div>
    <div className="bg-surface p-4 rounded-lg shadow border border-border text-center">
      <div className="text-2xl font-bold text-green-600">
        {stats.successful}
      </div>
      <div className="text-sm text-muted">Successful</div>
    </div>
    <div className="bg-surface p-4 rounded-lg shadow border border-border text-center">
      <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
      <div className="text-sm text-muted">Pending</div>
    </div>
    <div className="bg-surface p-4 rounded-lg shadow border border-border text-center">
      <div className="text-2xl font-bold text-purple-600">
        ₹{stats.totalRevenue}
      </div>
      <div className="text-sm text-muted">Total Revenue</div>
    </div>
  </div>
);

const EditEnrollmentModal = ({
  enrollment,
  form,
  setForm,
  onClose,
  onSave,
  loading,
  config,
}) => {
  return (
    <div className="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Edit Enrollment</h3>

        <div className="space-y-4">
          <FormField
            label={config.status.label}
            type={config.status.type}
            value={form.status}
            onChange={(value) => setForm({ ...form, status: value })}
            className="mb-0"
          >
            {config.status.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
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
            {config.paymentMethod.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
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
            className="px-4 py-2 text-muted border border-border rounded-lg hover:bg-background transition-colors"
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
};

export default EnrollmentManagement;
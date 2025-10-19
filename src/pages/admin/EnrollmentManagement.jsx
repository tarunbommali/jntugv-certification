/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  User,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  getAllUsersData,
} from "../../firebase/services_modular/userOperations";
import {
  getUserEnrollments,
  updateEnrollment,
  deleteEnrollment,
} from "../../firebase/services_modular/enrollmentOperations";
import { getAllCourses } from "../../firebase/services_modular/courseOperations";
import PageContainer from "../../components/layout/PageContainer.jsx";
import PageTitle from "../../components/ui/PageTitle.jsx";

const items = [
  { label: "Admin", link: "/admin" },
  { label: "Enrollment Management", link: "/admin/enrollments" },
];

const EnrollmentManagement = () => {
  const { isAdmin } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [userFilter, setUserFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [actionMessage, setActionMessage] = useState({ type: "", message: "" });
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [editForm, setEditForm] = useState({
    status: "",
    paidAmount: 0,
    paymentMethod: "",
    paymentReference: "",
  });

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch users, courses, and enrollments in parallel
      const [usersResult, coursesResult] = await Promise.all([
        getAllUsersData(500),
        getAllCourses(),
      ]);

      if (usersResult.success) {
        setUsers(usersResult.data);
      }

      if (coursesResult.success) {
        setCourses(coursesResult.data);
      }

      // Fetch enrollments for all users
      await fetchAllEnrollments(usersResult.data || []);
    } catch (err) {
      setActionMessage({
        type: "error",
        message: "Failed to load data",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEnrollments = async (userList) => {
    try {
      const enrollmentPromises = userList.map(async (user) => {
        const result = await getUserEnrollments(user.uid);
        if (result.success) {
          return result.data.map(enrollment => ({
            ...enrollment,
            user: user,
            course: courses.find(c => c.courseId === enrollment.courseId),
          }));
        }
        return [];
      });

      const enrollmentArrays = await Promise.all(enrollmentPromises);
      const allEnrollments = enrollmentArrays.flat();
      setEnrollments(allEnrollments);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
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
        setActionMessage({
          type: "success",
          message: "Enrollment updated successfully",
        });
        await fetchAllData();
      } else {
        setActionMessage({
          type: "error",
          message: result.error || "Failed to update enrollment",
        });
      }
    } catch (err) {
      setActionMessage({
        type: "error",
        message: "An error occurred while updating enrollment",
      });
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
        setActionMessage({
          type: "success",
          message: "Enrollment deleted successfully",
        });
        await fetchAllData();
      } else {
        setActionMessage({
          type: "error",
          message: result.error || "Failed to delete enrollment",
        });
      }
    } catch (err) {
      setActionMessage({
        type: "error",
        message: "An error occurred while deleting enrollment",
      });
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

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch = 
      enrollment.user?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || enrollment.status === statusFilter;
    const matchesUser = userFilter === "ALL" || enrollment.userId === userFilter;
    const matchesCourse = courseFilter === "ALL" || enrollment.courseId === courseFilter;

    return matchesSearch && matchesStatus && matchesUser && matchesCourse;
  });

  const getUniqueStatuses = () => {
    const statuses = [...new Set(enrollments.map(e => e.status))];
    return statuses;
  };

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

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search enrollments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              {getUniqueStatuses().map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* User Filter */}
          <div>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Users</option>
              {users.map(user => (
                <option key={user.uid} value={user.uid}>
                  {user.displayName || user.email}
                </option>
              ))}
            </select>
          </div>

          {/* Course Filter */}
          <div>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Courses</option>
              {courses.map(course => (
                <option key={course.courseId} value={course.courseId}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {filteredEnrollments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No enrollments found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
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
                            {enrollment.user?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.course?.title || enrollment.courseTitle || "Unknown Course"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {enrollment.course?.category || "N/A"}
                      </div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {enrollment.paidAmount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="capitalize">
                        {enrollment.paymentDetails?.method || "N/A"}
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
                        {enrollment.enrolledAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditEnrollment(enrollment)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50"
                          title="Edit enrollment"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEnrollment(enrollment.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50"
                          title="Delete enrollment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{enrollments.length}</div>
          <div className="text-sm text-gray-600">Total Enrollments</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">
            {enrollments.filter(e => e.status === "SUCCESS").length}
          </div>
          <div className="text-sm text-gray-600">Successful</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {enrollments.filter(e => e.status === "PENDING").length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">
            ${enrollments.reduce((sum, e) => sum + (e.paidAmount || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>

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
    </PageContainer>
  );
};

export default EnrollmentManagement;
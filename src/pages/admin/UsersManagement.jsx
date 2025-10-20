/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
// src/pages/admin/UsersManagement.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Navigate, useNavigate, Link } from "react-router-dom";
import {
  Search,
  Mail,
  Calendar,
  Shield,
  UserPlus,
  UserX,
  Settings,
} from "lucide-react";
// Assuming the following services exist in your project structure
import {
  getAllUsersData,
  toggleUserAccountStatus,
} from "../../firebase/services_modular/userOperations";
import PageContainer from "../../components/layout/PageContainer.jsx";
import PageTitle from "../../components/ui/PageTitle.jsx";

const items = [
  { label: "Admin", link: "/admin" },
  { label: "User Management", link: "/admin/users" },
];

const UsersManagement = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionMessage, setActionMessage] = useState({ type: "", message: "" });

  if (!isAdmin) {
    // Redirection handled by ProtectedRoute, but this is a fail-safe
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    // Fetch up to 500 users
    const result = await getAllUsersData(500);
    if (result.success) {
      // Ensure status defaults to 'active' if not set in the database
      const normalizedUsers = result.data.map((user) => ({
        ...user,
        status: user.status || "active",
      }));
      setUsers(normalizedUsers);
    } else {
      console.error("Failed to fetch users:", result.error);
    }
    setLoading(false);
  };

  /**
   * Toggles a user's account status between 'active' and 'inactive'
   * Requires a service function that uses Firebase Admin SDK on the backend.
   */
  const handleAccountStatusToggle = async (user) => {
    const currentStatus = user.status || "active";
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const action = newStatus === "inactive" ? "DISABLE" : "ENABLE";

    if (
      window.confirm(
        `Are you sure you want to ${action} ${
          user.displayName || user.email
        }'s account?`
      )
    ) {
      try {
        // Call to a serverless function/backend service
        const result = await toggleUserAccountStatus(user.uid, newStatus);

        if (result.success) {
          setActionMessage({
            type: "success",
            message: `User ${
              user.displayName || user.email
            }'s account has been ${newStatus}d.`,
          });
          fetchUsers(); // Re-fetch to update the table data
        } else {
          setActionMessage({
            type: "error",
            message: result.error || `Failed to ${action} user account.`,
          });
        }
      } catch (error) {
        setActionMessage({
          type: "error",
          message: "An unexpected error occurred during status update.",
        });
      }
      setTimeout(() => setActionMessage({ type: "", message: "" }), 4000);
    }
  };

  const filteredUsers = users.filter((user) => {
    const name = (user.displayName || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || email.includes(search);
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "instructor":
        return "bg-blue-100 text-blue-800";
      case "student":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageContainer items={items} className="min-h-screen bg-gray-50 py-8">
      <PageTitle
        title="User Management"
        description="Manage platform users and their permissions"
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        {/* Link to the new User Creation Form */}
        <Link
          to="/admin/users/create/new"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </Link>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No users found matching your search criteria.
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
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.uid}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {(user.displayName || user.email || "U")
                              .substring(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.displayName || "No Name"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                          user.isAdmin ? "admin" : "student"
                        )}`}
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {user.isAdmin ? "admin" : "student"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          user.status || "active"
                        )}`}
                      >
                        {user.status || "active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.totalCoursesEnrolled || 0} courses
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {user.createdAt?.toDate?.()?.toLocaleDateString() ||
                          "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                      {/* Link to the User Management Form for editing/enrolling */}
                      <Link
                        to={`/admin/users/manage/${user.uid}`}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 p-2 rounded-md hover:bg-indigo-50"
                      >
                        <Settings className="w-4 h-4" />
                        Manage
                      </Link>

                      {/* Toggle Account Status Button */}
                      <button
                        onClick={() => handleAccountStatusToggle(user)}
                        className={`flex items-center gap-1 p-2 rounded-md transition-colors ${
                          user.status === "inactive"
                            ? "text-green-600 hover:text-green-900 hover:bg-green-50"
                            : "text-red-600 hover:text-red-900 hover:bg-red-50"
                        }`}
                        title={
                          user.status === "inactive"
                            ? "Enable Account"
                            : "Disable Account"
                        }
                      >
                        <UserX className="w-4 h-4" />
                        {user.status === "inactive" ? "Enable" : "Disable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats (Kept for completeness) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.status === "active" || !u.status).length}
          </div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {users.filter((u) => u.isAdmin).length}
          </div>
          <div className="text-sm text-gray-600">Admins</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {users.reduce(
              (acc, user) => acc + (user.totalCoursesEnrolled || 0),
              0
            )}
          </div>
          <div className="text-sm text-gray-600">Total Enrollments</div>
        </div>
      </div>
    </PageContainer>
  );
};

export default UsersManagement;

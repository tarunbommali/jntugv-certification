/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
// src/pages/admin/UsersManagement.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
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

import {
  getAllUsersData,
  toggleUserAccountStatus,
} from "../../../services/index.js";
import PageContainer from "../../../components/layout/PageContainer.jsx";
import PageTitle from "../../../components/ui/PageTitle.jsx";

const items = [
  { label: "Admin", link: "/admin" },
  { label: "User Management", link: "/admin/users" },
];

const UsersManagement = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
    title: "",
  });

  // ✅ helper to show toast (moved up so effects can use it)
  const showToast = (type, message, title = "") => {
    setToast({ show: true, type, message, title });
  };

  // ✅ helper to close toast
  const closeToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // If user is not admin -> show toast then redirect to home
  useEffect(() => {
    if (isAdmin === false) {
      // show the toast message
      showToast("error", "Admin access required", "Access Denied");

      // wait a bit so the toast is visible, then redirect
      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [isAdmin, navigate]);

  const fetchUsers = async (searchTerm) => {
    if (!searchTerm) {
      setUsers([]);
      return;
    }
    setLoading(true);
    const result = await getAllUsersData(10, searchTerm);
    if (result.success) {
      const normalizedUsers = result.data.map((user) => ({
        ...user,
        status: user.status || "active",
      }));
      setUsers(normalizedUsers);
    } else {
      console.error("Failed to fetch users:", result.error);
      showToast("error", "Failed to load users.");
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (searchTerm) {
      fetchUsers(searchTerm);
    } else {
      setUsers([]);
    }
  };

  const handleAccountStatusToggle = async (user) => {
    const currentStatus = user.status || "active";
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const action = newStatus === "inactive" ? "DISABLE" : "ENABLE";

    if (
      window.confirm(
        `Are you sure you want to ${action} ${
          user.username || user.email
        }'s account?`
      )
    ) {
      try {
        const result = await toggleUserAccountStatus(user.uid, newStatus);

        if (result.success) {
          showToast(
            "success",
            `User ${
              user.username || user.email
            }'s account has been ${newStatus}d.`,
            "Action Successful"
          );
          fetchUsers();
        } else {
          showToast(
            "error",
            result.error || `Failed to ${action} user account.`,
            "Action Failed"
          );
        }
      } catch (error) {
        showToast(
          "error",
          "An unexpected error occurred during status update.",
          "Server Error"
        );
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const name = (user.username || "").toLowerCase();
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
        return "bg-surface-elevated text-foreground";
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
        return "bg-surface-elevated text-foreground";
    }
  };

  // If isAdmin is strictly false, we still render the page briefly while toast shows and redirect happens.
  // If isAdmin is null/undefined (auth loading state), keep rendering nothing or a loader if you prefer.
  if (isAdmin === null || isAdmin === undefined) {
    // optional: show a loader while auth resolves
    return null;
  }

  return (
    <PageContainer items={items} className="min-h-screen bg-background py-8">
      <PageTitle
        title="User Management"
        description="Manage platform users and their permissions"
      />

     
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-4 pr-10 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-0 top-0 h-full px-3 text-muted hover:text-blue-600"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Link
          to="/admin/users/create/new"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </Link>
      </div>

      {/* Users Table */}
      <div className="bg-surface rounded-xl shadow-md border border-border overflow-hidden mt-4">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-muted mt-4">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-muted">
            No users found matching your search criteria.
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
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.uid}
                    className="hover:bg-background transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {(user.username || user.email || "U")
                              .substring(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            {user.username || "No Name"}
                          </div>
                          <div className="text-sm text-muted flex items-center">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {user.totalCoursesEnrolled || 0} courses
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {user.createdAt?.toDate?.()?.toLocaleDateString() ||
                          "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                      <Link
                        to={`/admin/users/manage/${user.uid}`}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 p-2 rounded-md hover:bg-indigo-50"
                      >
                        <Settings className="w-4 h-4" />
                        Manage
                      </Link>

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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-surface p-4 rounded-lg shadow border border-border text-center">
          <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          <div className="text-sm text-muted">Total Users</div>
        </div>
        <div className="bg-surface p-4 rounded-lg shadow border border-border text-center">
          <div className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.status === "active" || !u.status).length}
          </div>
          <div className="text-sm text-muted">Active Users</div>
        </div>
        <div className="bg-surface p-4 rounded-lg shadow border border-border text-center">
          <div className="text-2xl font-bold text-purple-600">
            {users.filter((u) => u.isAdmin).length}
          </div>
          <div className="text-sm text-muted">Admins</div>
        </div>
        <div className="bg-surface p-4 rounded-lg shadow border border-border text-center">
          <div className="text-2xl font-bold text-orange-600">
            {users.reduce(
              (acc, user) => acc + (user.totalCoursesEnrolled || 0),
              0
            )}
          </div>
          <div className="text-sm text-muted">Total Enrollments</div>
        </div>
      </div>
    </PageContainer>
  );
};

export default UsersManagement;

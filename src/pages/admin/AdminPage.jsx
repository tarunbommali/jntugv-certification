/* eslint-disable no-unused-vars */
// src/pages/AdminPage.jsx

import "react";
import { useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Navigate, Link } from "react-router-dom";
import { global_classnames } from "../../utils/classnames.js";
import PageContainer from "../../components/layout/PageContainer.jsx";
import PageTitle from "../../components/ui/PageTitle.jsx";
import {
  Users,
  BookOpen,
  UserCheck,
  BarChart3,
  Settings,
  CreditCard,
  FileText,
} from "lucide-react";
import { useRealtimeAdminUsers, useRealtimeAdminEnrollments, useRealtimeAdminPayments, useRealtimeCourses } from "../../hooks/useRealtimeFirebase.js";
import { formatINR } from "../../utils/currency.js";

const items = [{ label: "Admin", link: "/admin" }];
const AdminPage = () => {
  const { isAdmin, userProfile } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Realtime data
  const { data: users = [], loading: usersLoading } = useRealtimeAdminUsers({ enabled: true });
  const { data: enrollments = [], loading: enrollmentsLoading } = useRealtimeAdminEnrollments({ enabled: true });
  const { data: payments = [], loading: paymentsLoading } = useRealtimeAdminPayments({ enabled: true });
  const { data: courses = [], loading: coursesLoading } = useRealtimeCourses({ publishedOnly: true, featuredOnly: false, limitCount: 200 });

  // Derived stats (resilient to missing fields)
  const stats = useMemo(() => {
    const totalUsers = Array.isArray(users) ? users.length : 0;
    const activeCourses = Array.isArray(courses) ? courses.filter((c) => c && (c.isPublished ?? true)).length : 0;
    const totalEnrollments = Array.isArray(enrollments) ? enrollments.length : 0;

    // Revenue from enrollments (preferred)
    const revenueFromEnrollments = (Array.isArray(enrollments) ? enrollments : []).reduce((sum, e) => {
      const val = Number(e.paidAmount ?? e.amount ?? 0);
      return Number.isFinite(val) ? sum + val : sum;
    }, 0);
    // Fallback: revenue from payments with captured/success statuses
    const revenueFromPayments = (Array.isArray(payments) ? payments : []).reduce((sum, p) => {
      const ok = (p.status || "").toLowerCase();
      const eligible = ok.includes("captured") || ok.includes("success");
      const val = Number(p.amount ?? p.paidAmount ?? 0);
      return eligible && Number.isFinite(val) ? sum + val : sum;
    }, 0);

    const revenue = revenueFromEnrollments > 0 ? revenueFromEnrollments : revenueFromPayments;

    return { totalUsers, activeCourses, totalEnrollments, revenue };
  }, [users, courses, enrollments, payments]);

  return (
    <PageContainer items={items} className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
 

      <PageTitle title="Dashboard" description="Overview" />

      {/* Stats */}
      <div className="mt-12 bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{usersLoading ? '…' : stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{coursesLoading ? '…' : stats.activeCourses}</div>
            <div className="text-sm text-gray-600">Active Courses</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{enrollmentsLoading ? '…' : stats.totalEnrollments}</div>
            <div className="text-sm text-gray-600">Enrollments</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{paymentsLoading && enrollmentsLoading ? '…' : formatINR(stats.revenue || 0)}</div>
            <div className="text-sm text-gray-600">Revenue</div>
          </div>
        </div>
      </div>

      {/* Management Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <Link
          to="/admin/users"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <p className="text-sm text-gray-600">Manage users and their accounts</p>
            </div>
          </div>
        </Link>

        {/* Course Management */}
        <Link
          to="/admin/courses"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Course Management</h3>
              <p className="text-sm text-gray-600">Create and manage courses</p>
            </div>
          </div>
        </Link>

        {/* Enrollment Management */}
        <Link
          to="/admin/enrollments"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Enrollment Management</h3>
              <p className="text-sm text-gray-600">Manage course enrollments</p>
            </div>
          </div>
        </Link>

        {/* Analytics */}
        <Link
          to="/admin/analytics"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">View platform analytics</p>
            </div>
          </div>
        </Link>

        {/* Coupon Management */}
        <Link
          to="/admin/coupons"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Coupon Management</h3>
              <p className="text-sm text-gray-600">Manage discount coupons</p>
            </div>
          </div>
        </Link>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 opacity-50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
              <p className="text-sm text-gray-600">Platform configuration</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AdminPage;

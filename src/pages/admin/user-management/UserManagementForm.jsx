/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Lock,
  UserPlus,
  Send,
  ArrowLeft,
  User,
  BookOpen,
  Shield,
  UserX,
  CreditCard,
  IndianRupee,
} from "lucide-react";
import PageContainer from "../../../components/layout/PageContainer.jsx";
import {
  createUserWithCredentials,
  getUserData,
  toggleUserAccountStatus,
  getAllCourses,
  createEnrollment,
  getUserEnrollmentStats,
  updateUserRole,
} from "../../../services/index.js";
import PageTitle from "../../../components/ui/PageTitle.jsx";
import EnrollmentManagement from "../enrollment-management/EnrollmentManagement.jsx";
import ToastNotification from "../../../components/ui/ToastNotification.jsx";

const resolveUserId = (user) => String(user?.uid ?? user?.id ?? "");
const resolveCourseId = (course) => String(course?.courseId ?? course?.id ?? "");
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

// Fixed initial password for admin-created users
const FIXED_INITIAL_PASSWORD = "Pass#1234";

const UserManagementForm = () => {
  const { isAdmin } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const isCreationMode = userId === "new" || !userId;

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollmentStats, setEnrollmentStats] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    // role removed from UI, keep default 'student' internally
    role: "student",
    // password is fixed for creation, not editable
    password: FIXED_INITIAL_PASSWORD,
  });
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [coursePrices, setCoursePrices] = useState({}); // Track individual course prices
  const [paymentMethod, setPaymentMethod] = useState("offline"); // offline, free, online
  const [offlinePaymentDetails, setOfflinePaymentDetails] = useState({
    amountPaid: 0,
    paymentReference: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshEnrollments, setRefreshEnrollments] = useState(0);

  // Toast state + helpers
  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
    title: "",
  });
  const showToast = (type, message, title = "") => {
    setToast({ show: true, type, message, title });
  };
  const closeToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // if not admin: show toast then redirect
  useEffect(() => {
    if (isAdmin === false) {
      showToast("error", "Admin access required", "Access Denied");
      const t = setTimeout(() => navigate("/", { replace: true }), 1200);
      return () => clearTimeout(t);
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch courses for both modes
        const courseResult = await getAllCourses();
        if (courseResult.success) {
          const normalizedCourses = (courseResult.data || []).map((course) => ({
            ...course,
            courseId: resolveCourseId(course),
          }));
          setCourses(normalizedCourses);
          const initialPrices = {};
          normalizedCourses.forEach((course) => {
            const id = resolveCourseId(course);
            if (!id) return;
            initialPrices[id] = toNumber(course.price);
          });
          setCoursePrices(initialPrices);
        } else {
          showToast("error", courseResult.error || "Failed to fetch courses.");
        }

        // If managing existing user, load their data
        if (!isCreationMode) {
          const userResult = await getUserData(userId);
          if (userResult.success) {
            setUser(userResult.data);
            // Pre-fill form with user data
            setFormData((prev) => ({
              ...prev,
              name: userResult.data.username || "",
              email: userResult.data.email || "",
              phone: userResult.data.phone || "",
              // role remains handled on backend / update flow
              password: FIXED_INITIAL_PASSWORD, // keep the internal value (not shown)
            }));

            // Fetch enrollment stats
            await fetchEnrollmentStats(resolveUserId(userResult.data));
          } else {
            showToast("error", "Failed to fetch user data.");
          }
        } else {
          // Reset form for new user creation
          setFormData({
            name: "",
            email: "",
            phone: "",
            role: "student",
            password: FIXED_INITIAL_PASSWORD,
          });
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        showToast("error", "An error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if admin (prevents unnecessary calls while auth resolves)
    if (isAdmin) fetchData();
    else setLoading(false);
  }, [userId, isCreationMode, refreshEnrollments, isAdmin]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCoursePriceChange = (courseId, price) => {
    const id = String(courseId);
    setCoursePrices((prev) => ({
      ...prev,
      [id]: toNumber(price),
    }));
  };

  const handleOfflinePaymentChange = (e) => {
    setOfflinePaymentDetails({
      ...offlinePaymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Function to fetch enrollment stats
  const fetchEnrollmentStats = async (targetUserId) => {
    const idToUse = targetUserId || resolveUserId(user);
    if (!isCreationMode && idToUse) {
      try {
        const statsResult = await getUserEnrollmentStats(idToUse);
        if (statsResult.success) {
          setEnrollmentStats(statsResult.data);
        }
      } catch (err) {
        console.error("Failed to fetch enrollment stats:", err);
      }
    }
  };

  // Calculate total amount for selected courses
  const calculateTotalAmount = () => {
    return selectedCourses.reduce((total, courseId) => {
      const amount = toNumber(coursePrices[courseId]);
      return total + amount;
    }, 0);
  };

  // Main form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isCreationMode) {
        // Create new user with fixed initial password and default role 'student'
        const result = await createUserWithCredentials({
          email: formData.email,
          password: FIXED_INITIAL_PASSWORD, // use fixed password
          username: formData.name,
          phone: formData.phone,
          role: "student", // role removed from UI; default to student
        });

        if (result.success) {
          const newUserId = resolveUserId(result.data);

          if (selectedCourses.length > 0 && newUserId) {
            await enrollUserInCourses(newUserId);
            showToast(
              "success",
              `User created and enrolled in ${selectedCourses.length} course(s).`,
              "Success"
            );
            // redirect after short delay
            setTimeout(() => navigate("/admin/users"), 2000);
          } else {
            showToast(
              "success",
              `User created successfully! Credentials: ${formData.email} / ${FIXED_INITIAL_PASSWORD}`,
              "User Created"
            );
            setTimeout(() => navigate("/admin/users"), 2000);
          }
        } else {
          showToast("error", result.error || "Failed to create user", "Error");
        }
      } else {
        // For existing user, handle enrollments
        const existingUserId = resolveUserId(user);
        if (selectedCourses.length > 0 && existingUserId) {
          await enrollUserInCourses(existingUserId);
          showToast(
            "success",
            `Successfully enrolled user in ${selectedCourses.length} course(s).`,
            "Enrollment Successful"
          );
        } else {
          showToast("error", "Please select at least one course to enroll.", "Validation");
        }
      }
    } catch (err) {
      console.error(err);
      showToast("error", "An error occurred while processing your request.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to enroll user in courses
  const enrollUserInCourses = async (userIdToEnroll) => {
    try {
      const totalAmount = calculateTotalAmount();

      for (const courseId of selectedCourses) {
        const course = courses.find((c) => resolveCourseId(c) === courseId);
        const coursePrice = toNumber(coursePrices[courseId], toNumber(course?.price));

        let paymentData = {};

        if (paymentMethod === "free") {
          paymentData = {
            amount: 0,
            paymentId: "ADMIN_FREE_ENROLLMENT",
            method: "free",
            status: "SUCCESS",
          };
        } else if (paymentMethod === "offline") {
          const paidAmount = toNumber(
            offlinePaymentDetails.amountPaid,
            coursePrice
          );
          paymentData = {
            amount: coursePrice,
            paymentId:
              offlinePaymentDetails.paymentReference || `OFFLINE_${Date.now()}`,
            method: "offline",
            status: "SUCCESS",
            reference: offlinePaymentDetails.paymentReference,
            paymentDate: offlinePaymentDetails.paymentDate,
            amountPaid: paidAmount,
          };
        } else {
          paymentData = {
            amount: coursePrice,
            paymentId: `ONLINE_${Date.now()}`,
            method: "online",
            status: "SUCCESS",
          };
        }

        await createEnrollment({
          userId: userIdToEnroll,
          courseId: courseId,
          courseTitle: course?.title || "Course",
          coursePrice: coursePrice,
          finalPrice: coursePrice,
          originalPrice: toNumber(course?.originalPrice, coursePrice),
          status: "SUCCESS",
          paymentData: paymentData,
          enrolledBy: "admin", // Track that admin enrolled this user
          enrollmentDate: new Date().toISOString(),
        });
      }

      // Reset selections and refresh
      setSelectedCourses([]);
      setOfflinePaymentDetails({
        amountPaid: 0,
        paymentReference: "",
        paymentDate: new Date().toISOString().split("T")[0],
      });

      if (!isCreationMode) {
        const existingId = resolveUserId(user);
        if (existingId) {
          const updatedUserResult = await getUserData(existingId);
          if (updatedUserResult.success) setUser(updatedUserResult.data);

          const statsResult = await getUserEnrollmentStats(existingId);
          if (statsResult.success) setEnrollmentStats(statsResult.data);
        }
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      showToast("error", "Failed to enroll user in courses.");
    }
  };

  // Handler for changing user role (Admin/Student) - kept, but role select removed from creation form
  const handleRoleUpdate = async () => {
    if (!user) return;
    setSubmitting(true);

    const newRole = formData.role;
    try {
      const targetUserId = resolveUserId(user);
      const result = await updateUserRole(targetUserId, newRole);
      if (result.success) {
        showToast("success", `User role updated to ${newRole} successfully.`);
        if (result.data) {
          setUser(result.data);
        } else {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  isAdmin: newRole === "admin",
                  role: newRole,
                }
              : prev
          );
        }
      } else {
        showToast("error", result.error || "Failed to update user role.");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "An error occurred during role update.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for Toggling Account Status
  const handleAccountStatusToggle = async () => {
    if (!user) return;
    const newStatus = user.status === "active" ? "inactive" : "active";
    if (
      window.confirm(
        `Are you sure you want to ${
          newStatus === "inactive" ? "DISABLE" : "ENABLE"
        } ${user.username || user.email}'s account?`
      )
    ) {
      setSubmitting(true);
      try {
        const targetUserId = resolveUserId(user);
        const result = await toggleUserAccountStatus(targetUserId, newStatus);
        if (result.success) {
          showToast("success", `Account has been ${newStatus}d.`);
          if (result.data) {
            setUser(result.data);
          } else {
            setUser((prev) =>
              prev
                ? {
                    ...prev,
                    status: newStatus,
                    isActive: newStatus === "active",
                  }
                : prev
            );
          }
        } else {
          showToast("error", result.error || "Failed to update user status.");
        }
      } catch (error) {
        console.error(error);
        showToast("error", "An unexpected error occurred during status update.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-muted mt-4">Loading...</p>
      </div>
    );
  }

  const pageTitle = isCreationMode
    ? "Create New User"
    : `Manage User: ${user?.username || user?.email || "Loading..."}`;

  const items = [
    { label: "Admin", link: "/admin" },
    { label: "User Management", link: "/admin/users" },
  ];

  const breadcrumbs = isCreationMode
    ? [...items, { label: "Create User", link: `/admin/users/create/new` }]
    : [
        ...items,
        {
          label: user?.username || "User Details",
          link: `/admin/users/manage/${userId}`,
        },
      ];

  const totalAmount = calculateTotalAmount();
  const totalAmountDisplay = toNumber(totalAmount).toFixed(2).replace(/\.00$/, "");

  return (
    <PageContainer items={breadcrumbs} className="min-h-screen bg-background py-8">
      <PageTitle
        title={pageTitle}
        description={
          isCreationMode
            ? "Fill out the form to create a new user account and enroll in courses."
            : "View and manage user details, role, and course enrollments with flexible payment options."
        }
      />

      {/* TOAST */}
      <ToastNotification
        show={toast.show}
        type={toast.type}
        message={toast.message}
        title={toast.title}
        duration={4000}
        onClose={closeToast}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Form & Management */}
        <div className="lg:col-span-1 space-y-4">
          {/* User Creation/Details Form */}
          <div className="bg-surface p-6 rounded-xl shadow-md border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>{isCreationMode ? "Create User" : "Account Details"}</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-muted absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    required={isCreationMode}
                    value={formData.name}
                    onChange={handleFormChange}
                    disabled={!isCreationMode}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-surface-elevated disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-muted absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required={isCreationMode}
                    value={formData.email}
                    onChange={handleFormChange}
                    disabled={!isCreationMode}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-surface-elevated disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* NOTE: Role removed from UI; default role = student */}
              {/* NOTE: Initial password is fixed and non-editable */}
              {isCreationMode && (
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
                  <strong>Note:</strong> New users will be created with the default role <code>student</code> and initial password <code>{FIXED_INITIAL_PASSWORD}</code>. Password cannot be changed here.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                disabled={
                  submitting ||
                  (!isCreationMode && selectedCourses.length === 0)
                }
              >
                {submitting
                  ? "Processing..."
                  : isCreationMode
                  ? "Create User"
                  : `Enroll in ${selectedCourses.length} Course(s)`}
                {isCreationMode ? (
                  <UserPlus className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>

          {/* User Management Controls (only for existing users) */}
          {!isCreationMode && user && (
            <>
              {/* Account Status Card */}
              <div className="bg-surface p-6 rounded-xl shadow-md border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
                  <UserX className="w-5 h-5 text-blue-600" />
                  <span>Account Status</span>
                </h2>
                <p className="mb-2">
                  <strong className="text-muted">Name:</strong>{" "}
                  {user.username || "N/A"}
                </p>
                <p className="mb-2">
                  <strong className="text-muted">Email:</strong> {user.email}
                </p>
                <p className="mb-2">
                  <strong className="text-muted">Total Courses:</strong>{" "}
                  {enrollmentStats?.totalEnrollments || user.totalCoursesEnrolled || 0}
                </p>
                {enrollmentStats && (
                  <div className="mb-2 pl-4 text-sm text-muted">
                    <p>• Online: {enrollmentStats.onlineEnrollments}</p>
                    <p>• Offline: {enrollmentStats.offlineEnrollments}</p>
                    <p>• Free: {enrollmentStats.freeEnrollments}</p>
                  </div>
                )}
                <p className="mb-4">
                  <strong className="text-muted">Account Status:</strong>
                  <span
                    className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status || "active"}
                  </span>
                </p>

                <button
                  onClick={handleAccountStatusToggle}
                  className={`w-full px-4 py-2 rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center space-x-2 ${
                    user.status === "inactive"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                  disabled={submitting}
                >
                  <UserX className="w-4 h-4" />
                  {submitting
                    ? "Updating..."
                    : user.status === "inactive"
                    ? "Enable Account"
                    : "Disable Account"}
                </button>
              </div>

              {/* Enrollment Management Card */}
              <div className="bg-surface p-6 rounded-xl shadow-md border border-border">
                <EnrollmentManagement 
                  userId={resolveUserId(user)} 
                  onEnrollmentChange={() => {
                    setRefreshEnrollments(prev => prev + 1);
                    // Refresh enrollment stats
                    fetchEnrollmentStats(resolveUserId(user));
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Right Column - Course Enrollment & Payment (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Selection Card */}
          <div className="bg-surface p-6 rounded-xl shadow-md border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Course Enrollment</span>
            </h2>
            <p className="text-muted mb-4">
              {isCreationMode
                ? "Select courses to automatically enroll the new user after creation."
                : "Select courses to enroll this user. You can adjust individual course prices and choose payment method."}
            </p>

            <div className="max-h-[400px] overflow-y-auto space-y-3 mb-4 p-2 border rounded-lg">
              {courses.length > 0 ? (
                courses.map((course) => {
                  const courseId = resolveCourseId(course);
                  const priceValue = toNumber(
                    coursePrices[courseId],
                    toNumber(course?.price)
                  );
                  return (
                    <div
                      key={courseId || course.title}
                      className="flex items-start p-3 border border-border rounded-lg hover:bg-background"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(courseId) && selectedCourses.includes(courseId)}
                        onChange={(e) => {
                          if (!courseId) return;
                          if (e.target.checked) {
                            setSelectedCourses((prev) =>
                              prev.includes(courseId) ? prev : [...prev, courseId]
                            );
                          } else {
                            setSelectedCourses((prev) =>
                              prev.filter((id) => id !== courseId)
                            );
                          }
                        }}
                        className="mt-1 mr-3 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">
                          {course.title}
                        </div>
                        <div className="text-sm text-muted mb-2">
                          {course.category || "Uncategorized"} • {
                            course.duration || "Self-paced"
                          }
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <IndianRupee className="w-4 h-4 text-muted" />
                            <span className="text-sm text-muted">Price:</span>
                          </div>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={priceValue}
                            onChange={(e) =>
                              handleCoursePriceChange(courseId, e.target.value)
                            }
                            className="w-24 px-2 py-1 border border-border rounded text-sm"
                            placeholder="0.00"
                          />
                          <span className="text-sm text-muted">
                            (Original: ₹{toNumber(course?.price)})
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted text-center py-4">
                  No courses available.
                </p>
              )}
            </div>

            {/* Selected Courses Summary */}
            {selectedCourses.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Selected Courses Summary
                </h3>
                <div className="space-y-2">
                  {selectedCourses.map((courseId) => {
                    const course = courses.find((c) => resolveCourseId(c) === courseId);
                    const price = toNumber(coursePrices[courseId]);
                    return (
                      <div
                        key={courseId}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-blue-700">{course?.title}</span>
                        <span className="font-medium">₹{price}</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-blue-200 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-blue-900">
                      <span>Total Amount:</span>
                      <span>₹{totalAmountDisplay}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Card */}
          {selectedCourses.length > 0 && (
            <div className="bg-surface p-6 rounded-xl shadow-md border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Payment Method</span>
              </h2>

              <div className="space-y-4">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("offline")}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        paymentMethod === "offline"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-border hover:border-gray-400"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1" />
                      <div className="font-medium">Offline Payment</div>
                      <div className="text-xs text-muted">
                        Cash, Bank Transfer
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("free")}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        paymentMethod === "free"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-border hover:border-gray-400"
                      }`}
                    >
                      <IndianRupee className="w-5 h-5 mx-auto mb-1" />
                      <div className="font-medium">Free Enrollment</div>
                      <div className="text-xs text-muted">Complimentary</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("online")}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        paymentMethod === "online"
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-border hover:border-gray-400"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1" />
                      <div className="font-medium">Online Payment</div>
                      <div className="text-xs text-muted">
                        Card, UPI, etc.
                      </div>
                    </button>
                  </div>
                </div>

                {/* Offline Payment Details */}
                {paymentMethod === "offline" && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-3">
                      Offline Payment Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-yellow-700 mb-1">
                          Amount Paid
                        </label>
                        <input
                          type="number"
                          name="amountPaid"
                          value={offlinePaymentDetails.amountPaid}
                          onChange={handleOfflinePaymentChange}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-yellow-700 mb-1">
                          Payment Date
                        </label>
                        <input
                          type="date"
                          name="paymentDate"
                          value={offlinePaymentDetails.paymentDate}
                          onChange={handleOfflinePaymentChange}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-yellow-700 mb-1">
                          Payment Reference
                        </label>
                        <input
                          type="text"
                          name="paymentReference"
                          value={offlinePaymentDetails.paymentReference}
                          onChange={handleOfflinePaymentChange}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="Transaction ID, Receipt No., etc."
                        />
                      </div>
                    </div>
                    {toNumber(offlinePaymentDetails.amountPaid) > 0 &&
                      toNumber(offlinePaymentDetails.amountPaid) !== totalAmount && (
                        <div className="mt-2 text-sm text-yellow-700">
                          <strong>Note:</strong> Paid amount (₹
                          {toNumber(offlinePaymentDetails.amountPaid)}) differs from total
                          (₹{totalAmountDisplay})
                        </div>
                      )}
                  </div>
                )}

                {/* Payment Summary */}
                <div className="bg-background p-4 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">
                    Payment Summary
                  </h4>
                  <div className="flex justify-between text-sm">
                    <span>Total Course Fees:</span>
                    <span className="font-medium">₹{totalAmountDisplay}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Payment Method:</span>
                    <span className="font-medium capitalize">
                      {paymentMethod}
                    </span>
                  </div>
                  {paymentMethod === "offline" &&
                    toNumber(offlinePaymentDetails.amountPaid) > 0 && (
                      <div className="flex justify-between text-sm mt-1">
                        <span>Amount Paid:</span>
                        <span className="font-medium text-green-600">
                          ₹{toNumber(offlinePaymentDetails.amountPaid)}
                        </span>
                      </div>
                    )}
                  {paymentMethod === "free" && (
                    <div className="text-green-600 text-sm mt-1 font-medium">
                      ✓ User will be enrolled for free
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default UserManagementForm;

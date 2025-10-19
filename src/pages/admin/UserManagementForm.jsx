/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
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
  DollarSign,
} from "lucide-react";
import PageContainer from "../../components/layout/PageContainer.jsx";
import {
  createUserWithCredentials,
  getUserData,
  toggleUserAccountStatus,
} from "../../firebase/services_modular/userOperations";
import { getAllCourses } from "../../firebase/services_modular/courseOperations";
import { createEnrollment } from "../../firebase/services_modular/enrollmentOperations";
import PageTitle from "../../components/ui/PageTitle.jsx";

const UserManagementForm = () => {
  const { isAdmin } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const isCreationMode = userId === "new" || !userId;

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "student",
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        // Fetch courses for both modes
        const courseResult = await getAllCourses();
        if (courseResult.success) {
          setCourses(courseResult.data);
          // Initialize course prices
          const initialPrices = {};
          courseResult.data.forEach((course) => {
            initialPrices[course.courseId] = course.price || 0;
          });
          setCoursePrices(initialPrices);
        } else {
          setError(courseResult.error || "Failed to fetch courses.");
        }

        // If managing existing user, load their data
        if (!isCreationMode) {
          const userResult = await getUserData(userId);
          if (userResult.success) {
            setUser(userResult.data);
            // Pre-fill form with user data
            setFormData({
              name: userResult.data.displayName || "",
              email: userResult.data.email || "",
              phone: userResult.data.phone || "",
              password: "", // Never pre-fill password
              role: userResult.data.isAdmin ? "admin" : "student",
            });
          } else {
            setError("Failed to fetch user data.");
          }
        } else {
          // Reset form for new user creation
          setFormData({
            name: "",
            email: "",
            phone: "",
            password: "",
            role: "student",
          });
          setUser(null);
        }
      } catch (err) {
        setError("An error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, isCreationMode]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCoursePriceChange = (courseId, price) => {
    setCoursePrices((prev) => ({
      ...prev,
      [courseId]: parseFloat(price) || 0,
    }));
  };

  const handleOfflinePaymentChange = (e) => {
    setOfflinePaymentDetails({
      ...offlinePaymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Calculate total amount for selected courses
  const calculateTotalAmount = () => {
    return selectedCourses.reduce((total, courseId) => {
      return total + (coursePrices[courseId] || 0);
    }, 0);
  };

  // Main form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      if (isCreationMode) {
        // Create new user
        const result = await createUserWithCredentials({
          email: formData.email,
          password: formData.password,
          displayName: formData.name,
          phone: formData.phone,
          role: formData.role,
        });

        if (result.success) {
          setSuccess(
            `User created successfully! Credentials: ${formData.email} / ${formData.password}`
          );

          // If courses are selected for the new user, enroll them
          if (selectedCourses.length > 0 && result.data?.uid) {
            await enrollUserInCourses(result.data.uid);
          } else {
            setTimeout(() => navigate("/admin/users"), 3000);
          }
        } else {
          setError(result.error || "Failed to create user");
        }
      } else {
        // For existing user, we only handle enrollments in the main form
        if (selectedCourses.length > 0) {
          await enrollUserInCourses(user.uid);
        } else {
          setError("Please select at least one course to enroll.");
        }
      }
    } catch (err) {
      setError("An error occurred while processing your request.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to enroll user in courses
  const enrollUserInCourses = async (userIdToEnroll) => {
    try {
      const totalAmount = calculateTotalAmount();

      for (const courseId of selectedCourses) {
        const course = courses.find((c) => c.courseId === courseId);
        const coursePrice = coursePrices[courseId] || 0;

        let paymentData = {};

        if (paymentMethod === "free") {
          paymentData = {
            amount: 0,
            paymentId: "ADMIN_FREE_ENROLLMENT",
            method: "free",
            status: "SUCCESS",
          };
        } else if (paymentMethod === "offline") {
          paymentData = {
            amount: coursePrice,
            paymentId:
              offlinePaymentDetails.paymentReference || `OFFLINE_${Date.now()}`,
            method: "offline",
            status: "SUCCESS",
            reference: offlinePaymentDetails.paymentReference,
            paymentDate: offlinePaymentDetails.paymentDate,
            amountPaid: offlinePaymentDetails.amountPaid || coursePrice,
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
          status: "SUCCESS",
          paymentData: paymentData,
          enrolledBy: "admin", // Track that admin enrolled this user
          enrollmentDate: new Date().toISOString(),
        });
      }

      const successMessage = isCreationMode
        ? `User created and enrolled in ${selectedCourses.length} course(s) with ${paymentMethod} payment! Total: $${totalAmount}. Redirecting...`
        : `Successfully enrolled user in ${selectedCourses.length} course(s) with ${paymentMethod} payment! Total: $${totalAmount}.`;

      setSuccess(successMessage);
      setSelectedCourses([]);
      setOfflinePaymentDetails({
        amountPaid: 0,
        paymentReference: "",
        paymentDate: new Date().toISOString().split("T")[0],
      });

      // Refresh user data for existing users
      if (!isCreationMode) {
        const updatedUserResult = await getUserData(userId);
        if (updatedUserResult.success) setUser(updatedUserResult.data);
      }

      // Redirect after success for creation mode
      if (isCreationMode) {
        setTimeout(() => navigate("/admin/users"), 3000);
      }
    } catch (err) {
      setError("Failed to enroll user in courses.");
      console.error("Enrollment error:", err);
    }
  };

  // Handler for changing user role (Admin/Student)
  const handleRoleUpdate = async () => {
    if (!user) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    const newRole = formData.role;
    try {
      const result = await updateUserRole(user.uid, newRole);
      if (result.success) {
        setSuccess(`User role updated to ${newRole} successfully.`);
        setUser((prev) => ({ ...prev, isAdmin: newRole === "admin" }));
      } else {
        setError(result.error || "Failed to update user role.");
      }
    } catch (err) {
      setError("An error occurred during role update.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccess(""), 3000);
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
        } ${user.displayName || user.email}'s account?`
      )
    ) {
      setSubmitting(true);
      try {
        const result = await toggleUserAccountStatus(user.uid, newStatus);
        if (result.success) {
          setSuccess(`Account has been ${newStatus}d.`);
          setUser((prev) => ({ ...prev, status: newStatus }));
        } else {
          setError(result.error || "Failed to update user status.");
        }
      } catch (error) {
        setError("An unexpected error occurred during status update.");
      } finally {
        setSubmitting(false);
        setTimeout(() => setSuccess(""), 3000);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    );
  }

  const pageTitle = isCreationMode
    ? "Create New User"
    : `Manage User: ${user?.displayName || user?.email || "Loading..."}`;

  const items = [
    { label: "Admin", link: "/admin" },
    { label: "User Management", link: "/admin/users" },
  ];

  const breadcrumbs = isCreationMode
    ? [...items, { label: "Create User", link: `/admin/users/create/new` }]
    : [
        ...items,
        {
          label: user?.displayName || "User Details",
          link: `/admin/users/manage/${userId}`,
        },
      ];

  const totalAmount = calculateTotalAmount();

  return (
    <PageContainer items={breadcrumbs} className="min-h-screen bg-gray-50 py-8">
      <PageTitle
        title={pageTitle}
        description={
          isCreationMode
            ? "Fill out the form to create a new user account and enroll in courses."
            : "View and manage user details, role, and course enrollments with flexible payment options."
        }
      />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Form & Management */}
        <div className="lg:col-span-1 space-y-4">
          {/* User Creation/Details Form */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>{isCreationMode ? "Create User" : "Account Details"}</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    required={isCreationMode}
                    value={formData.name}
                    onChange={handleFormChange}
                    disabled={!isCreationMode}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required={isCreationMode}
                    value={formData.email}
                    onChange={handleFormChange}
                    disabled={!isCreationMode}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="relative">
                  <Shield className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <select
                    name="role"
                    required={isCreationMode}
                    value={formData.role}
                    onChange={handleFormChange}
                    disabled={!isCreationMode}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Password Input (only for creation) */}
              {isCreationMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleFormChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
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
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <UserX className="w-5 h-5 text-blue-600" />
                  <span>Account Status</span>
                </h2>
                <p className="mb-2">
                  <strong className="text-gray-700">Name:</strong>{" "}
                  {user.displayName || "N/A"}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Email:</strong> {user.email}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Total Courses:</strong>{" "}
                  {user.totalCoursesEnrolled || 0}
                </p>
                <p className="mb-4">
                  <strong className="text-gray-700">Account Status:</strong>
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
            </>
          )}
        </div>

        {/* Right Column - Course Enrollment & Payment (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Selection Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Course Enrollment</span>
            </h2>
            <p className="text-gray-600 mb-4">
              {isCreationMode
                ? "Select courses to automatically enroll the new user after creation."
                : "Select courses to enroll this user. You can adjust individual course prices and choose payment method."}
            </p>

            <div className="max-h-[400px] overflow-y-auto space-y-3 mb-4 p-2 border rounded-lg">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course.courseId}
                    className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.courseId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCourses([
                            ...selectedCourses,
                            course.courseId,
                          ]);
                        } else {
                          setSelectedCourses(
                            selectedCourses.filter(
                              (id) => id !== course.courseId
                            )
                          );
                        }
                      }}
                      className="mt-1 mr-3 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {course.title}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        {course.category} • {course.duration || "Self-paced"}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Price:</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            coursePrices[course.courseId] || course.price || 0
                          }
                          onChange={(e) =>
                            handleCoursePriceChange(
                              course.courseId,
                              e.target.value
                            )
                          }
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="0.00"
                        />
                        <span className="text-sm text-gray-500">
                          (Original: ${course.price || 0})
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
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
                    const course = courses.find((c) => c.courseId === courseId);
                    const price = coursePrices[courseId] || 0;
                    return (
                      <div
                        key={courseId}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-blue-700">{course?.title}</span>
                        <span className="font-medium">${price}</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-blue-200 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-blue-900">
                      <span>Total Amount:</span>
                      <span>${totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Card (only for existing users) */}
          {!isCreationMode && selectedCourses.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Payment Method</span>
              </h2>

              <div className="space-y-4">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("offline")}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        paymentMethod === "offline"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1" />
                      <div className="font-medium">Offline Payment</div>
                      <div className="text-xs text-gray-500">
                        Cash, Bank Transfer
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("free")}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        paymentMethod === "free"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <DollarSign className="w-5 h-5 mx-auto mb-1" />
                      <div className="font-medium">Free Enrollment</div>
                      <div className="text-xs text-gray-500">Complimentary</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("online")}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        paymentMethod === "online"
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1" />
                      <div className="font-medium">Online Payment</div>
                      <div className="text-xs text-gray-500">
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
                    {offlinePaymentDetails.amountPaid > 0 &&
                      offlinePaymentDetails.amountPaid !== totalAmount && (
                        <div className="mt-2 text-sm text-yellow-700">
                          <strong>Note:</strong> Paid amount ($
                          {offlinePaymentDetails.amountPaid}) differs from total
                          (${totalAmount})
                        </div>
                      )}
                  </div>
                )}

                {/* Payment Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Payment Summary
                  </h4>
                  <div className="flex justify-between text-sm">
                    <span>Total Course Fees:</span>
                    <span className="font-medium">${totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Payment Method:</span>
                    <span className="font-medium capitalize">
                      {paymentMethod}
                    </span>
                  </div>
                  {paymentMethod === "offline" &&
                    offlinePaymentDetails.amountPaid > 0 && (
                      <div className="flex justify-between text-sm mt-1">
                        <span>Amount Paid:</span>
                        <span className="font-medium text-green-600">
                          ${offlinePaymentDetails.amountPaid}
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

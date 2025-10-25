/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useEnrollmentContext } from "../../hooks/admin/useEnrollmentContext.js";
import PageContainer from "../../components/layout/PageContainer.jsx";
import PageTitle from "../../components/ui/PageTitle.jsx";
import FormField from "../../components/ui/FormField.jsx";
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import { createEnrollment } from "../../firebase/services_modular/enrollmentOperations.js";
import { manualEnrollmentFormConfig } from "../../configs/enrollmentFormConfigs.js";
import { getPublishedCourses } from "../../utils/helper/enrollmentHelpers.jsx";

const breadcrumbItems = [
  { label: "Admin", link: "/admin" },
  { label: "Enrollment Management", link: "/admin/enrollments" },
  { label: "Manual Enrollment", link: "/admin/enrollments/manual" },
];

const ManualEnrollmentForm = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { users, courses, refreshData } = useEnrollmentContext();
  
  // Form state
  const [form, setForm] = useState({
    userId: "",
    courseId: "",
    status: "SUCCESS",
    paidAmount: 0,
    paymentMethod: "offline",
    paymentReference: "",
  });
  
  const [processing, setProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: "", message: "" });

  // Toast notification helper
  const showToast = (message, type = "success") => {
    setActionMessage({ message, type });
    setTimeout(() => setActionMessage({ message: "", type: "" }), 5000);
  };

  const handleBack = () => {
    navigate("/admin/enrollments");
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCourseChange = (courseId) => {
    const selectedCourse = courses.find((c) => c.courseId === courseId);
    setForm((prev) => ({
      ...prev,
      courseId: courseId,
      paidAmount: selectedCourse?.price || 0,
    }));
  };

  const handleSave = async () => {
    const { userId, courseId, status, paidAmount, paymentMethod, paymentReference } = form;

    if (!userId || !courseId) {
      showToast("Please select both user and course", "error");
      return;
    }

    setProcessing(true);
    try {
      const selectedCourse = courses.find((c) => c.courseId === courseId);
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

      const result = await createEnrollment(enrollmentData);
      if (result.success) {
        showToast(
          `Successfully enrolled ${selectedUser?.displayName || selectedUser?.email} in ${selectedCourse?.title}`,
          "success"
        );
        
        // Reset form
        setForm({
          userId: "",
          courseId: "",
          status: "SUCCESS",
          paidAmount: 0,
          paymentMethod: "offline",
          paymentReference: "",
        });
        
        // Refresh data and navigate back after success
        refreshData();
        setTimeout(() => {
          navigate("/admin/enrollments");
        }, 2000);
      } else {
        throw new Error(result.error || "Failed to create enrollment");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  const getSelectedUser = () => users.find(user => user.uid === form.userId);
  const getSelectedCourse = () => courses.find(course => course.courseId === form.courseId);

  return (
    <PageContainer items={breadcrumbItems} className="min-h-screen bg-gray-50 py-8">
      <PageTitle
        title="Manual Enrollment"
        description="Manually enroll a user in a course"
        icon={UserPlus}
      />

      {/* Action Message Bar */}
      {actionMessage.message && (
        <div
          className={`p-4 rounded-lg mb-6 flex items-center ${
            actionMessage.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {actionMessage.type === "success" ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          <span>{actionMessage.message}</span>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="space-y-6">
            {/* User Selection */}
            <div>
              <FormField
                label={manualEnrollmentFormConfig.userId.label}
                type={manualEnrollmentFormConfig.userId.type}
                value={form.userId}
                onChange={(value) => handleFormChange("userId", value)}
                required
              >
                <option value="">Choose a user</option>
                {users.map((user) => (
                  <option key={user.uid} value={user.uid}>
                    {user.displayName || user.email} ({user.email})
                  </option>
                ))}
              </FormField>
              {form.userId && getSelectedUser() && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-800">
                    <strong>Selected User:</strong> {getSelectedUser().displayName || getSelectedUser().email}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Email: {getSelectedUser().email} | 
                    UID: {getSelectedUser().uid.substring(0, 8)}...
                  </div>
                </div>
              )}
            </div>

            {/* Course Selection */}
            <div>
              <FormField
                label={manualEnrollmentFormConfig.courseId.label}
                type={manualEnrollmentFormConfig.courseId.type}
                value={form.courseId}
                onChange={(value) => handleCourseChange(value)}
                required
              >
                <option value="">Choose a course</option>
                {getPublishedCourses(courses).map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.title} - ₹{course.price || 0}
                  </option>
                ))}
              </FormField>
              <p className="text-xs text-gray-500 mt-2">
                Only published courses are shown
              </p>
              
              {form.courseId && getSelectedCourse() && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-green-800">
                    <strong>Selected Course:</strong> {getSelectedCourse().title}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Price: ₹{getSelectedCourse().price} | 
                    Category: {getSelectedCourse().category} | 
                    Duration: {getSelectedCourse().duration || 'N/A'}
                  </div>
                </div>
              )}
            </div>

            {/* Course Fee Display */}
            {form.courseId && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-sm font-semibold text-yellow-800">
                  Course Fee: ₹{form.paidAmount}
                </div>
                <p className="text-xs text-yellow-600 mt-1">
                  This amount will be recorded as paid for the enrollment
                </p>
              </div>
            )}

            {/* Status */}
            <FormField
              label={manualEnrollmentFormConfig.status.label}
              type={manualEnrollmentFormConfig.status.type}
              value={form.status}
              onChange={(value) => handleFormChange("status", value)}
              helpText={manualEnrollmentFormConfig.status.helpText}
            >
              {manualEnrollmentFormConfig.status.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormField>

            {/* Payment Method */}
            <FormField
              label={manualEnrollmentFormConfig.paymentMethod.label}
              type={manualEnrollmentFormConfig.paymentMethod.type}
              value={form.paymentMethod}
              onChange={(value) => handleFormChange("paymentMethod", value)}
            >
              {manualEnrollmentFormConfig.paymentMethod.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormField>

            {/* Payment Reference */}
            <FormField
              label={manualEnrollmentFormConfig.paymentReference.label}
              type={manualEnrollmentFormConfig.paymentReference.type}
              value={form.paymentReference}
              onChange={(value) => handleFormChange("paymentReference", value)}
              placeholder={manualEnrollmentFormConfig.paymentReference.placeholder}
              helpText={manualEnrollmentFormConfig.paymentReference.helpText}
            />

            {/* Enrollment Summary */}
            {(form.userId && form.courseId) && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Enrollment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">User:</span>
                    <span className="font-medium">{getSelectedUser()?.displayName || getSelectedUser()?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course:</span>
                    <span className="font-medium">{getSelectedCourse()?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">₹{form.paidAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{form.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">{form.paymentMethod}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={processing}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={processing || !form.userId || !form.courseId}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enrolling...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Enroll User
                </>
              )}
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">About Manual Enrollment</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Manually enroll users who may have paid offline or through other methods</li>
            <li>Only published courses are available for enrollment</li>
            <li>Successful enrollments will grant users immediate access to the course content</li>
            <li>Payment reference is required for tracking purposes</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
};

export default ManualEnrollmentForm;
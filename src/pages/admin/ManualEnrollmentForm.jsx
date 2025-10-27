/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useEnrollmentContext } from "../../hooks/admin/useEnrollmentContext.js";
import { useRealtimeCoupons } from "../../hooks/useRealtimeFirebase.js";
import PageContainer from "../../components/layout/PageContainer.jsx";
import PageTitle from "../../components/ui/PageTitle.jsx";
import FormField from "../../components/ui/FormField.jsx";
import { UserPlus, AlertCircle, CheckCircle, BookOpen } from "lucide-react";
import { createEnrollment } from "../../firebase/services_modular/enrollmentOperations.js";
import { manualEnrollmentFormConfig } from "../../configs/enrollmentFormConfigs.js";
import { getPublishedCourses } from "../../utils/helper/enrollmentHelpers.jsx";
import { formatINR } from "../../utils/currency.js";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const breadcrumbItems = [
  { label: "Admin", link: "/admin" },
  { label: "Enrollment Management", link: "/admin/enrollments" },
  { label: "Manual Enrollment", link: "/admin/enrollments/manual" },
];

const ManualEnrollmentForm = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { users, courses, refreshData } = useEnrollmentContext();
  const { data: coupons = [] } = useRealtimeCoupons({ activeOnly: true, enabled: true });
  
  // Form state
  const [form, setForm] = useState({
    userId: "",
    courseId: "",
    status: "SUCCESS",
    paidAmount: 0,
    paymentMethod: "offline",
    paymentReference: "",
  });
  
  // Enhanced state from EnrollmentManagement
  const [includeDrafts, setIncludeDrafts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [processing, setProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: "", message: "" });
  const [selectedCouponId, setSelectedCouponId] = useState("");
  const selectedCoupon = useMemo(() => coupons.find(c => c.id === selectedCouponId), [coupons, selectedCouponId]);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponUsageCount, setCouponUsageCount] = useState(0);

  // Helper functions from EnrollmentManagement
  const getTitle = (c) => c?.title || c?.name || c?.courseTitle || c?.slug || "Untitled";
  
  const isPublishedLike = (c) => {
    if (!c || typeof c !== 'object') return false;
    // boolean flags commonly used across schema variants
    if (c.isPublished === true || c.published === true || c.publish === true || c.isPublic === true || c.public === true) return true;
    // status/state strings
    const status = String(c.status || c.state || '').toLowerCase();
    if (["published","active","live","public","visible","enabled"].includes(status)) return true;
    // visibility setting
    const visibility = String(c.visibility || '').toLowerCase();
    if (visibility === 'public') return true;
    // not a draft but explicitly marked otherwise
    if (c.isDraft === true) return false;
    return false;
  };

  const getCoursePrice = (c) => {
    if (!c) return 0;
    const p = c.price ?? c?.pricing?.price ?? c?.pricing?.currentPrice ?? c?.amount ?? c?.coursePrice;
    return Number.isFinite(Number(p)) ? Number(p) : 0;
  };

  const isCouponValid = (coupon) => {
    if (!coupon) return false;
    if (coupon.isActive === false) return false;
    if (coupon.expiresAt) {
      const exp = coupon.expiresAt?.toDate ? coupon.expiresAt.toDate() : new Date(coupon.expiresAt);
      if (exp && exp < new Date()) return false;
    }
    return true;
  };

  const computeDiscount = (price, coupon) => {
    if (!coupon || !isCouponValid(coupon)) return 0;
    const type = String(coupon.type || coupon.discountType || '').toLowerCase();
    const value = Number(coupon.value ?? coupon.discountValue ?? 0) || 0;
    if (type === 'percent') {
      return Math.max(0, Math.min(price, Math.round((price * value) / 100)));
    }
    if (type === 'flat') {
      return Math.max(0, Math.min(price, Math.round(value)));
    }
    return 0;
  };

  // Filter and process courses
  const categories = useMemo(() => {
    const set = new Set();
    (courses || []).forEach(c => {
      if (c?.category) set.add(String(c.category));
    });
    return Array.from(set).sort((a,b) => a.localeCompare(b));
  }, [courses]);

  const filteredCourses = useMemo(() => {
    let arr = (courses || []).slice();
    // By default (includeDrafts=false), show only published/active courses.
    if (!includeDrafts) {
      arr = arr.filter(c => isPublishedLike(c));
    }
    if (categoryFilter) {
      arr = arr.filter(c => String(c.category || '') === String(categoryFilter));
    }
    if (searchTerm.trim()) {
      const t = searchTerm.trim().toLowerCase();
      arr = arr.filter(c => String(getTitle(c)).toLowerCase().includes(t));
    }
    return arr.sort((a,b) => String(getTitle(a)).localeCompare(String(getTitle(b))));
  }, [courses, categoryFilter, searchTerm, includeDrafts]);

  const displayedCourses = useMemo(() => {
    return filteredCourses;
  }, [filteredCourses]);

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
    const selectedCourse = displayedCourses.find((c) => (c.courseId || c.id) === courseId);
    const base = selectedCourse ? getCoursePrice(selectedCourse) : 0;
    const discount = computeDiscount(base, selectedCoupon);
    const final = base - discount;
    setForm((prev) => ({
      ...prev,
      courseId: courseId,
      paidAmount: final,
    }));
  };

  const handleCouponChange = (couponId) => {
    setSelectedCouponId(couponId);
    const found = coupons.find(c => c.id === couponId);
    setCouponCodeInput(found?.code || "");
    const selectedCourse = getSelectedCourse();
    const base = selectedCourse ? getCoursePrice(selectedCourse) : 0;
    const coupon = coupons.find(c => c.id === couponId);
    const discount = computeDiscount(base, coupon);
    const final = base - discount;
    setForm((prev) => ({ ...prev, paidAmount: final }));
  };

  // Validate manual coupon code against live list and sync selection
  useEffect(() => {
    if (!couponCodeInput) {
      setCouponError("");
      if (selectedCouponId) setSelectedCouponId("");
      return;
    }
    const match = (coupons || []).find(c => String(c.code || "").toLowerCase() === String(couponCodeInput).trim().toLowerCase());
    if (match) {
      if (selectedCouponId !== match.id) setSelectedCouponId(match.id);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      if (selectedCouponId) setSelectedCouponId("");
    }
  }, [couponCodeInput, coupons]);

  // Track coupon usage in real-time to enforce usageLimit
  useEffect(() => {
    if (!selectedCoupon?.code) {
      setCouponUsageCount(0);
      return;
    }
    const q = query(collection(db, "enrollments"), where("couponCode", "==", selectedCoupon.code));
    const unsub = onSnapshot(q, (snap) => {
      setCouponUsageCount(snap.size || 0);
    });
    return () => {
      try { unsub && unsub(); } catch (_) {}
    };
  }, [selectedCoupon?.code]);

  const couponLimitExceeded = useMemo(() => {
    const limit = Number(selectedCoupon?.usageLimit ?? 0) || 0;
    return !!selectedCoupon && limit > 0 && couponUsageCount >= limit;
  }, [selectedCoupon, couponUsageCount]);

  const handleSave = async () => {
    const { userId, courseId, status, paidAmount, paymentMethod, paymentReference } = form;

    if (!userId || !courseId) {
      showToast("Please select both user and course", "error");
      return;
    }
    if (couponError) {
      showToast(couponError, "error");
      return;
    }
    if (couponLimitExceeded) {
      showToast("Coupon usage limit reached. Please remove or change the coupon.", "error");
      return;
    }

    setProcessing(true);
    try {
      const selectedCourse = displayedCourses.find((c) => (c.courseId || c.id) === courseId);
      const selectedUser = users.find((u) => u.uid === userId);

      // Prepare payload in the exact shape expected by the admin API, while still
      // including fields used by the client-side fallback in enrollmentOperations.
      const basePrice = selectedCourse ? getCoursePrice(selectedCourse) : 0;
      const coupon = selectedCoupon && isCouponValid(selectedCoupon) ? selectedCoupon : null;
      const discount = computeDiscount(basePrice, coupon);
      const finalPrice = Number.parseFloat(paidAmount) || (basePrice - discount);
      const couponCode = coupon?.code || coupon?.couponCode || null;
      const apiAlignedPayload = {
        userId: String(userId),
        courseId: String(courseId),
        courseTitle: getTitle(selectedCourse) || "Course",
        coursePrice: finalPrice,
        originalPrice: basePrice,
        finalPrice: finalPrice,
        couponApplied: !!coupon,
        couponDetails: coupon
          ? {
              id: coupon.id,
              code: couponCode,
              type: coupon.type || coupon.discountType,
              value: coupon.value || coupon.discountValue,
              title: coupon.title || coupon.name || undefined,
            }
          : null,
        status: status || "SUCCESS",
        enrolledBy: "admin",
        paymentData: {
          method: paymentMethod,
          reference: paymentReference,
          amountPaid: finalPrice,
          amount: finalPrice,
          couponCode: couponCode,
          couponDiscount: discount,
          paymentId: `ADMIN_${Date.now()}`,
        },
      };

      const result = await createEnrollment(apiAlignedPayload);
      if (result.success) {
        showToast(
          `Successfully enrolled ${selectedUser?.displayName || selectedUser?.email} in ${getTitle(selectedCourse)}`,
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
        setSelectedCouponId("");
  setCouponCodeInput("");
  setCouponError("");
  setCouponUsageCount(0);
        
        // Reset filters
        setIncludeDrafts(false);
        setSearchTerm("");
        setCategoryFilter("");
        
        // Refresh data and navigate back after success
        refreshData();
        setTimeout(() => {
          navigate("/admin/enrollments");
        }, 2000);
      } else {
        // Surface a more specific error if available
        const msg = result.error || result.message || "Failed to create enrollment";
        throw new Error(msg);
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  const getSelectedUser = () => users.find(user => user.uid === form.userId);
  const getSelectedCourse = () => displayedCourses.find(course => (course.courseId || course.id) === form.courseId);

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

      <div className="max-w-4xl mx-auto">
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

            {/* Course Selection with Enhanced Filters */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Include Drafts Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    id="toggle-drafts"
                    type="checkbox"
                    checked={includeDrafts}
                    onChange={(e) => setIncludeDrafts(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="toggle-drafts" className="text-sm text-gray-700">
                    Include draft courses
                  </label>
                </div>

                {/* Search Course */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search Courses
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by course title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">All categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Course Selector */}
              <FormField
                label={manualEnrollmentFormConfig.courseId.label}
                type={manualEnrollmentFormConfig.courseId.type}
                value={form.courseId}
                onChange={(value) => handleCourseChange(value)}
                required
              >
                <option value="">Choose a course</option>
                {displayedCourses.map((course) => {
                  const price = getCoursePrice(course);
                  const isDraft = !isPublishedLike(course);
                  const title = getTitle(course);
                  const courseId = course.courseId || course.id;
                  
                  return (
                    <option key={courseId} value={courseId}>
                      {title} - ₹{price.toFixed(0)}{isDraft ? ' [Draft]' : ''}
                    </option>
                  );
                })}
              </FormField>

              {/* Course Selection Info */}
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-500">
                  {includeDrafts ? 'Showing all courses (published and drafts)' : 'Showing only published courses'}
                  {searchTerm && ` • Filtered by: "${searchTerm}"`}
                  {categoryFilter && ` • Category: ${categoryFilter}`}
                </p>
                
                {displayedCourses.length === 0 && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>No courses found with current filters.</span>
                    {!includeDrafts && (
                      <button
                        type="button"
                        onClick={() => setIncludeDrafts(true)}
                        className="text-blue-600 underline text-xs"
                      >
                        Include drafts
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {form.courseId && getSelectedCourse() && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-green-800">
                    <strong>Selected Course:</strong> {getTitle(getSelectedCourse())}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Price: ₹{getCoursePrice(getSelectedCourse())} | 
                    Category: {getSelectedCourse().category || 'Uncategorized'} | 
                    Status: {isPublishedLike(getSelectedCourse()) ? 'Published' : 'Draft'}
                  </div>
                </div>
              )}
            </div>

            {/* Coupon Selection (dropdown + manual input) and Course Fee Display */}
            {form.courseId && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-yellow-900 mb-1">Apply Coupon</label>
                  <select
                    value={selectedCouponId}
                    onChange={(e) => handleCouponChange(e.target.value)}
                    className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm bg-white"
                  >
                    <option value="">No coupon</option>
                    {coupons.map((c) => {
                      const label = `${c.code} — ${String(c.type).toLowerCase()==='percent' ? c.value + '% off' : '₹' + (c.value||0) + ' off'}`;
                      return (
                        <option key={c.id} value={c.id}>{label}</option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-900 mb-1">Or enter coupon code</label>
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="Enter coupon code"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm bg-white ${couponError ? 'border-red-400' : 'border-yellow-300'}`}
                  />
                  {couponError && (
                    <p className="text-xs text-red-600 mt-1">{couponError}</p>
                  )}
                </div>

                {selectedCoupon && (
                  <div className="text-xs text-yellow-700">
                    <div className="flex justify-between">
                      <span>Coupon</span>
                      <span className="font-medium">{selectedCoupon.code}</span>
                    </div>
                    {Number(selectedCoupon.usageLimit || 0) > 0 && (
                      <div className={`flex justify-between ${couponLimitExceeded ? 'text-red-600' : ''}`}>
                        <span>Usage</span>
                        <span className="font-medium">{couponUsageCount} / {selectedCoupon.usageLimit}</span>
                      </div>
                    )}
                  </div>
                )}

                {(() => {
                  const course = getSelectedCourse();
                  const base = course ? getCoursePrice(course) : 0;
                  const coupon = selectedCoupon && isCouponValid(selectedCoupon) ? selectedCoupon : null;
                  const disc = computeDiscount(base, coupon);
                  const final = Math.max(0, base - disc);
                  return (
                    <div className="text-sm text-yellow-900 space-y-1">
                      <div className="flex justify-between"><span>Original Price</span><span className="font-medium">{formatINR(base)}</span></div>
                      <div className="flex justify-between"><span>Discount {coupon ? `(${coupon.code})` : ''}</span><span className="font-medium">-{formatINR(disc)}</span></div>
                      <div className="flex justify-between pt-1 border-t border-yellow-200"><span>Total Payable</span><span className="font-semibold">{formatINR(final)}</span></div>
                    </div>
                  );
                })()}

                <p className="text-xs text-yellow-700 mt-1">
                  This amount will be recorded as paid for the enrollment. You can modify it if different from the calculated total.
                </p>
              </div>
            )}

            {/* Paid Amount (Editable) */}
            <FormField
              label="Paid Amount"
              type="number"
              value={form.paidAmount}
              onChange={(value) => handleFormChange("paidAmount", value)}
              step="0.01"
              min="0"
              helpText="You can adjust the paid amount if it's different from the course price"
            />

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
                    <span className="font-medium">{getTitle(getSelectedCourse())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course Status:</span>
                    <span className="font-medium">
                      {isPublishedLike(getSelectedCourse()) ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  {(() => {
                    const course = getSelectedCourse();
                    const base = course ? getCoursePrice(course) : 0;
                    const coupon = selectedCoupon && isCouponValid(selectedCoupon) ? selectedCoupon : null;
                    const disc = computeDiscount(base, coupon);
                    const final = Math.max(0, base - disc);
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Original Price:</span>
                          <span className="font-medium">{formatINR(base)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Coupon:</span>
                          <span className="font-medium">{coupon ? `${coupon.code} (${String(coupon.type).toLowerCase()==='percent'? coupon.value + '%': formatINR(coupon.value)})` : '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-medium">-{formatINR(disc)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount Paid:</span>
                          <span className="font-medium">{formatINR(final)}</span>
                        </div>
                      </>
                    );
                  })()}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enrollment Status:</span>
                    <span className="font-medium">{form.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">{form.paymentMethod}</span>
                  </div>
                  {form.paymentReference && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Reference:</span>
                      <span className="font-medium">{form.paymentReference}</span>
                    </div>
                  )}
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
            <li>Use filters to find specific courses quickly</li>
            <li>Draft courses are hidden by default but can be included if needed</li>
            <li>Successful enrollments will grant users immediate access to the course content</li>
            <li>Payment reference is recommended for tracking purposes</li>
            <li>You can adjust the paid amount if it differs from the course price</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
};

export default ManualEnrollmentForm;
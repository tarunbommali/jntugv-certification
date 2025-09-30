/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase"; // Ensure this path is correct
import { Lock, DollarSign, CheckCircle, GraduationCap, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import useRazorpay from "../hooks/useRazorpay";
import { global_classnames } from "../utils/classnames.js";

// --- Local Fallback Data (Used if Firebase data fails) ---
const FALLBACK_COURSE_DATA = {
  id: "ai-ml-cert",
  title: "Advanced AI & Machine Learning Certification (Local Demo)",
  price: 5499, // Course Amount (₹5499)
  originalPrice: 6599, // For display
  platformDiscount: 1100,
  taxRate: 0.18, // 18% GST/Tax
};

// Define core colors based on established style
const PRIMARY_BLUE = "#004080";
const ACCENT_YELLOW = "#ffc107";
const ACCENT_GREEN = "#28a745";

const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // --- State Management ---

  const [course, setCourse] = useState(null);
  const [billingInfo, setBillingInfo] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    country: "India",
    college: "",
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(true);
  const [paymentError, setPaymentError] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [useTestPayment, setUseTestPayment] = useState(false); // --- Payment Integration ---

  const handlePaymentSuccess = useCallback(
    (enrollmentId, courseId) => {
      alert("Enrollment successful! Redirecting to course content.");
      navigate(`/learn/${courseId}`);
    },
    [navigate]
  );

  const {
    initializePayment,
    isLoading: isPaymentGatewayLoading,
    error: paymentGatewayError,
  } = useRazorpay(currentUser, handlePaymentSuccess); // --- Course Data Loading Logic (Resilient) ---

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setPaymentError(null);
        // 1. Attempt to fetch data from Firestore
        const ref = doc(db, "courses", courseId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setCourse({ id: snap.id, ...snap.data() });
        } else {
          // 2. Fallback if document doesn't exist (e.g., URL typo)
          setCourse(FALLBACK_COURSE_DATA);
          setPaymentError("Course not found in database. Using demo data.");
        }
      } catch (e) {
        // 3. Fallback if the database connection fails (e.g., Firestore Listen error)
        console.error(
          "Failed to load course from Firebase. Using local demo data.",
          e
        );
        setCourse(FALLBACK_COURSE_DATA);
        setPaymentError(
          "Connection error. Using local demo data. Payments will use test mode."
        );
        setUseTestPayment(true); // Force test payment if connection fails
      } finally {
        // Initialize billing info AFTER fetching course data (or setting fallback)
        if (currentUser) {
          setBillingInfo((prev) => ({
            ...prev,
            email: currentUser.email,
            name: currentUser.displayName || prev.name || "",
          }));
        }
        setLoading(false);
      }
    };
    load();
  }, [courseId, currentUser]);

  if (!course || loading)
    return (
      <div className="p-10 text-center text-xl font-medium">
                        Loading course details...            
      </div>
    ); // --- Calculation Logic ---

  const courseAmount = Number(course.price || 0);
  const platformDiscount = Number(course.platformDiscount || 0);
  const subtotal = courseAmount - platformDiscount;
  const taxRate = Number(course.taxRate || 0.18);
  const tax = subtotal * taxRate;

  const couponDiscount =
    appliedCoupon?.type === "percent"
      ? Math.min(subtotal, subtotal * (appliedCoupon.value / 100))
      : appliedCoupon?.type === "flat"
      ? Math.min(subtotal, appliedCoupon.value)
      : 0;

  const totalAmount = Math.max(0, subtotal - couponDiscount + tax);
  const totalSaved = Number(course.originalPrice || 0) - totalAmount; // --- Handlers ---

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setPaymentError(null); // Clear form-level errors on input
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault(); // Prevents form submission
    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed) return;

    // Hardcoded Coupon data (Ideally fetched from Firestore)
    const coupons = {
      WELCOME10: {
        code: "WELCOME10",
        type: "percent",
        value: 10,
        label: "10% OFF",
      },
      FLAT500: { code: "FLAT500", type: "flat", value: 500, label: "₹500 OFF" },
      COLLEGE50: {
        code: "COLLEGE50",
        type: "percent",
        value: 50,
        label: "50% OFF (special)",
      },
    };

    const found = coupons[trimmed];
    if (!found) {
      setAppliedCoupon(null);
      setCouponMessage("Invalid coupon code.");
    } else {
      setAppliedCoupon(found);
      setCouponMessage(`Coupon applied: ${found.label}`);
    }
  };

  const handleConfirmAndPay = async (e) => {
    e.preventDefault();
    setPaymentError(null); // Simple Validation

    if (!billingInfo.agreeTerms) {
      setPaymentError(
        "You must agree to the Terms and Policies before proceeding."
      );
      return;
    }
    if (!billingInfo.phone || !billingInfo.name) {
      setPaymentError("Name and Phone number are required fields.");
      return;
    }

    // Ensure course object is available before payment
    if (!course) {
      setPaymentError("Course data is missing. Cannot initiate payment.");
      return;
    } // 1. Test payment path

    if (useTestPayment) {
      try {
        const enrollmentDoc = await addDoc(collection(db, "enrollments"), {
          userId: currentUser.uid,
          courseId: course.id,
          courseTitle: course.title,
          status: "SUCCESS",
          paymentId: "TEST_PAYMENT_" + Math.random().toString(36).slice(2),
          amount: totalAmount,
          coupon: appliedCoupon?.code || null,
          couponDiscount,
          billingInfo,
          enrolledAt: new Date(),
          mode: "TEST",
        });
        handlePaymentSuccess(enrollmentDoc.id, course.id);
        return;
      } catch (err) {
        console.error("Test payment enrollment error", err);
        setPaymentError("Failed to record test enrollment in database.");
        return;
      }
    } // 2. 🚀 EXECUTE RAZORPAY PAYMENT 🚀

    const success = await initializePayment({
      amount: totalAmount,
      courseId: course.id,
      courseTitle: course.title,
      billingInfo: billingInfo,
      coupon: appliedCoupon?.code || null,
      couponDiscount,
    }); // If initializePayment fails *before* launching the modal
    if (!success && paymentGatewayError) {
      setPaymentError(paymentGatewayError);
    }
  }; // Determine the final error message to display

  const finalError = paymentError || paymentGatewayError; // --- Helper Component for Readability ---

  const PriceRow = ({
    label,
    value,
    isTotal = false,
    isDiscount = false,
    isTax = false,
  }) => (
    <div
      className={`flex justify-between py-2 ${
        isTotal ? "border-t-2 border-dashed font-bold text-lg pt-3 mt-2" : ""
      }`}
    >
           
      <span
        className={`${
          isDiscount
            ? "text-red-500"
            : isTax
            ? "text-gray-700"
            : "text-gray-700"
        }`}
      >
                {label}           
      </span>
           
      <span
        className={`${
          isDiscount ? "text-red-500" : isTotal ? "text-2xl" : "text-gray-900"
        } font-semibold`}
      >
                {isDiscount ? "- " : ""}₹{Math.abs(value).toFixed(2)}           
      </span>
         
    </div>
  );

  const baseInputClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition";

  return (
    <section className="py-4 bg-gray-50 min-h-screen">
           
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         
        <form
          onSubmit={handleConfirmAndPay}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
                             
          {/* LEFT COLUMN: Billing Information Form (2/3 width) */}             
          <div className="lg:col-span-2 space-y-8 p-8 bg-white rounded-2xl shadow-xl border border-blue-100">
                       
            <h2 className="text-2xl font-bold border-b-2 border-yellow-500 pb-3 text-gray-800 flex items-center gap-3">
                                                       
              <GraduationCap
                className="w-6 h-6"
                style={{ color: PRIMARY_BLUE }}
              />
              Enrollment Checkout           
            </h2>
                                   {/* Course Title Reminder */}               
                   
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                           
              <p className="font-semibold text-blue-800 text-lg">
                                               Enrolling in: {course.title}     
                                     
              </p>
                         
            </div>
                                               
            <div className="grid sm:grid-cols-2 gap-6">
                                                       
              <div>
                               
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                      Full Name                
                                 
                </label>
                               
                <input
                  type="text"
                  name="name"
                  value={billingInfo.name}
                  onChange={handleInputChange}
                  placeholder="Your Full Name"
                  required
                  className={baseInputClasses}
                />
                             
              </div>
                                                       
              <div>
                               
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                      Email Address
                  (Non-editable)                                
                </label>
                               
                <input
                  type="email"
                  name="email"
                  value={billingInfo.email}
                  readOnly
                  disabled
                  className={`${baseInputClasses} bg-gray-100 cursor-not-allowed`}
                />
                             
              </div>
                                                       
              <div>
                               
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                      Phone Number              
                                   
                </label>
                               
                <input
                  type="tel"
                  name="phone"
                  value={billingInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+91-XXXXXXXXXX"
                  required
                  className={baseInputClasses}
                />
                             
              </div>
                                                       
              <div>
                               
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    College / Institution                
                </label>
                               
                <input
                  type="text"
                  name="college"
                  value={billingInfo.college}
                  onChange={handleInputChange}
                  placeholder="Your College Name"
                  className={baseInputClasses}
                />
                             
              </div>
                         
            </div>
                        {/* Terms and Conditions  + Test Payment */}           
            <div className="pt-6 border-t border-gray-200">
                                                                     
              {/* Terms */}             
              <label className="flex items-center space-x-3 cursor-pointer mt-4">
                               
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={billingInfo.agreeTerms}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                  required
                />
                               
                <span className="text-sm text-gray-700">
                                    I agree to the                   
                  <Link
                    to="/terms"
                    target="_blank"
                    className="text-blue-600 hover:underline font-bold"
                  >
                                        Terms                  
                  </Link>
                                    and                   
                  <Link
                    to="/policies"
                    target="_blank"
                    className="text-blue-600 hover:underline font-bold"
                  >
                                        Policies                  
                  </Link>
                                 
                </span>
                             
              </label>
                           
              {finalError && (
                <p className="text-red-600 text-sm mt-3 font-medium flex items-center gap-1">
                                    <X className="w-4 h-4" />                   
                                  {finalError}                             
                </p>
              )}
                            {/* Test payment toggle */}             
              <div className="mt-4 flex items-center gap-3">
                               
                <input
                  id="useTestPayment"
                  type="checkbox"
                  checked={useTestPayment}
                  onChange={(e) => setUseTestPayment(e.target.checked)}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                />
                               
                <label
                  htmlFor="useTestPayment"
                  className="text-sm text-gray-700"
                >
                  Use Test Payment (No real charge)
                </label>
                             
              </div>
                         
            </div>
                     
          </div>
                              {/* RIGHT COLUMN: Order Summary (1/3 width) */}   
                         
          <div className="lg:col-span-1 space-y-6">
                                    {/* Course Summary Card */}                 
                 
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 sticky top-28">
                                                       
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                Payment Details                            
              </h2>
                                        {/* Detailed Pricing */}               
                         
              <div className="space-y-1">
                               
                <PriceRow label="Course Amount" value={courseAmount} />
                               
                <PriceRow
                  label="Platform Discount"
                  value={platformDiscount}
                  isDiscount={true}
                />
                {/* Coupon entry */}             
                <div className="grid sm:grid-cols-3 gap-4 items-end mb-4">
                                 
                  <div className="sm:col-span-2">
                                     
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Have a coupon?
                    </label>
                                     
                    <input
                      type="text"
                      value={couponCode}

                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter coupon code (e.g., WELCOME10)"
                      className={`${baseInputClasses} outline-none`}
                    />
                                   
                  </div>
                                 
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="h-12 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                                      Apply                
                  </button>
                               
                </div>
                             
                {couponMessage && (
                  <p
                    className={`text-sm ${
                      appliedCoupon ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}
                               
                <PriceRow label="Total (Pre-Tax)" value={subtotal} />
                               
                <PriceRow
                  label={`Tax (${(taxRate * 100).toFixed(0)}%)`}
                  value={tax}
                  isTax={true}
                />
                               
                {couponDiscount > 0 && (
                  <PriceRow
                    label={`Coupon Discount (${appliedCoupon?.code})`}
                    value={-couponDiscount}
                    isDiscount={true}
                  />
                )}
                             
              </div>
                                        {/* Total Final Price */}
                           
              <PriceRow
                label="Total Amount Payable"
                value={totalAmount}
                isTotal={true}
              />
                                        {/* Total Savings */}                   
                   
              <div className="bg-green-50 border border-green-300 p-4 mt-4 rounded-lg flex justify-between items-center text-green-700 font-bold shadow-inner">
                               
                <span className="flex items-center gap-2">
                                      Total Saved                
                </span>
                               
                <span className="text-xl">₹{totalSaved.toFixed(2)}</span>       
                             
              </div>
                                      {/* Confirm and Pay Button */}           
                         
              <button
                type="submit"
                disabled={isPaymentGatewayLoading || !billingInfo.agreeTerms}
                className={`w-full h-14 rounded-xl text-lg font-bold text-white transition-all shadow-xl ${
                  billingInfo.agreeTerms
                    ? "bg-green-600 hover:bg-green-700 transform hover:scale-[1.01]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                             
                {isPaymentGatewayLoading ? (
                  "Initiating Secure Payment..."
                ) : (
                  <>
                                      <Lock className="w-5 h-5 inline mr-2" /> 
                                        Confirm and Pay ₹
                    {totalAmount.toFixed(2)}                       
                  </>
                )}
                           
              </button>
                                 
            </div>
                     
          </div>
                 
        </form>
             
      </div>
         
    </section>
  );
};

export default CheckoutPage;

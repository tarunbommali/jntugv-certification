/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Lock, DollarSign, CheckCircle, GraduationCap, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import useRazorpay from "../hooks/useRazorpay"; // ✅ The custom hook is now correctly imported
import { global_classnames } from "../utils/classnames.js";

// --- Placeholder Data & Constants ---

// Define core colors based on established style
const PRIMARY_BLUE = "#004080";
const ACCENT_YELLOW = "#ffc107";
const ACCENT_GREEN = "#28a745";

const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Get real user from context

  // --- State Management ---
  const [course, setCourse] = useState(null);
  const [billingInfo, setBillingInfo] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    country: "India",
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(true); // Initial fetch loading state
  const [paymentError, setPaymentError] = useState(null); // --- Payment Integration --- // Callback executed upon successful payment (called by useRazorpay hook)

  const handlePaymentSuccess = useCallback(
    (enrollmentId, courseId) => {
      // Optionally show a success toast/notification here
      alert("Enrollment successful! Redirecting to course content."); // Redirect to the learning area
      navigate(`/learn/${courseId}`);
    },
    [navigate]
  ); // Initialize the Razorpay hook

  const {
    initializePayment,
    isLoading: isPaymentGatewayLoading, // Rename hook loading state
    error: paymentGatewayError, // Rename hook error state
  } = useRazorpay(currentUser, handlePaymentSuccess); // Placeholder: Fetch Course Data and Initialize Billing Info

  useEffect(() => {
    // Simulate fetching course data
    setCourse(sampleCourseData); // Set initial billing info based on authenticated user
    if (currentUser) {
      setBillingInfo((prev) => ({
        ...prev,
        email: currentUser.email,
        name: currentUser.displayName || currentUser.name || prev.name || "",
      }));
    } else {
      // Should ideally not happen if ProtectedRoute is working, but safety net
      setBillingInfo((prev) => ({ ...prev, email: "", name: "" }));
    }
    setLoading(false);
  }, [courseId, currentUser]);

  if (!course || loading)
    return (
      <div className="p-10 text-center text-xl font-medium">
                Loading course details...      
      </div>
    ); // --- Calculation Logic ---

  const courseAmount = course.price;
  const platformDiscount = course.platformDiscount;
  const subtotal = courseAmount - platformDiscount;
  const tax = subtotal * course.taxRate;
  const totalAmount = subtotal + tax;
  const totalSaved = course.originalPrice - totalAmount; // --- Handlers ---

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setPaymentError(null); // Clear form-level errors on input
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
    } // 🚀 EXECUTE RAZORPAY PAYMENT 🚀 // We don't set local 'loading' true here, as the hook handles payment loading

    const success = await initializePayment({
      amount: totalAmount,
      courseId: course.id,
      courseTitle: course.title,
      billingInfo: billingInfo,
    }); // If initializePayment fails *before* launching the modal (e.g., key missing)
    if (!success && paymentGatewayError) {
      setPaymentError(paymentGatewayError);
    } // Note: If the payment modal opens successfully, the hook handles the rest.
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
    <section className="py-16 bg-gray-50 min-h-screen">
           
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               
        <h1
          className={`text-4xl font-extrabold mb-12 text-center`}
          style={{ color: PRIMARY_BLUE }}
        >
                    Secure Enrollment Checkout 🔒        
        </h1>
               
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
                            1. Your Billing Details            
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
                                    Email Address (Non-editable)                
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
                                    Country                
                </label>
                               
                <select
                  name="country"
                  value={billingInfo.country}
                  onChange={handleInputChange}
                  className={baseInputClasses}
                >
                                    <option value="India">India</option>       
                            <option value="Other">Other</option>               
                </select>
                             
              </div>
                                       
            </div>
                        {/* Terms and Conditions */}           
            <div className="pt-6 border-t border-gray-200">
                           
              <label className="flex items-center space-x-3 cursor-pointer">
                               
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
                         
            </div>
                     
          </div>
                    {/* RIGHT COLUMN: Order Summary (1/3 width) */}         
          <div className="lg:col-span-1 space-y-6">
                        {/* Course Summary Card */}           
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 sticky top-28">
                           
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                                2. Payment Details              
              </h2>
                            {/* Detailed Pricing */}             
              <div className="space-y-1">
                               
                <PriceRow label="Course Amount" value={courseAmount} />
                               
                <PriceRow
                  label="Platform Discount"
                  value={platformDiscount}
                  isDiscount={true}
                />
                               
                <PriceRow label="Total (Pre-Tax)" value={subtotal} />
                               
                <PriceRow
                  label={`Tax (${course.taxRate * 100}%)`}
                  value={tax}
                  isTax={true}
                />
                             
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
                                    <DollarSign className="w-5 h-5" />         
                          Total Saved                
                </span>
                               
                <span className="text-xl">₹{totalSaved.toFixed(2)}</span>       
                     
              </div>
                         
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
                                Confirm and Pay ₹{totalAmount.toFixed(2)}       
                         
                </>
              )}
                         
            </button>
                        {/* Security Assurance */}           
            <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" /> 
                         
              <span>Payments powered by Razorpay. 100% Secure & Verified.</span>
                         
            </div>
                     
          </div>
                 
        </form>
             
      </div>
         
    </section>
  );
};

export default CheckoutPage;

/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { doc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase"; // Assuming you have a correct firebase config
import { Lock, DollarSign, CheckCircle, GraduationCap, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx"; // Assuming this is correct
import { usePayment } from "../contexts/PaymentContext.jsx"; // Assuming this is correct
import useRazorpay from "../hooks/useRazorpay"; // Assuming this is correct
import { global_classnames } from "../utils/classnames.js";

// 🚨 NEW IMPORT: Get the full list of courses for a robust fallback 🚨
import { courses as fallbackCourseList } from "../utils/fallbackData.js";
import { useCourseContext } from "../contexts/CourseContext.jsx"; // Assuming this is correct


// Define core colors based on established style
const PRIMARY_BLUE = "#004080";
const ACCENT_YELLOW = "#ffc107";
const ACCENT_GREEN = "#28a745";


// ----------------------------------------------------------------------
// Checkout Shimmer Component (Kept the same)
// ----------------------------------------------------------------------

const CheckoutShimmer = () => {
    const baseShimmer = "h-4 bg-gray-200 rounded";
    const PRIMARY_BLUE = "#004080";

    const SummaryRowShimmer = ({ width = "w-3/4" }) => (
        <div className="flex justify-between py-2">
            <div className={`${baseShimmer} h-5 ${width}`}></div>
            <div className={`${baseShimmer} h-5 w-1/4`}></div>
        </div>
    );

    return (
        <section className="py-16 bg-gray-50 min-h-screen animate-pulse">
            <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT COLUMN: Billing Information Shimmer */}
                    <div className="lg:col-span-2 space-y-8 p-8 bg-white rounded-2xl shadow-xl border border-blue-100">

                        <div className="h-8 bg-gray-300 rounded w-2/3 mb-6"></div>

                        {/* Course Title Shimmer */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                            <div className="h-6 bg-blue-200 rounded w-3/4"></div>
                        </div>

                        {/* Form Fields Shimmer */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className={`${baseShimmer} w-1/3`}></div>
                                    <div className="h-12 bg-gray-100 rounded-lg border"></div>
                                </div>
                            ))}
                        </div>

                        {/* Terms Shimmer */}
                        <div className="pt-6 border-t border-gray-200 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-5 w-5 bg-gray-200 rounded-sm"></div>
                                <div className={`${baseShimmer} w-1/2`}></div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Order Summary Shimmer */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 sticky top-28">

                            <div className="h-6 bg-gray-300 rounded w-1/2 mb-6 border-b pb-2"></div>

                            {/* Detailed Pricing Shimmer */}
                            <div className="space-y-1">
                                <SummaryRowShimmer width="w-2/5" />
                                <SummaryRowShimmer width="w-3/5" />
                                <SummaryRowShimmer width="w-2/5" />
                            </div>

                            {/* Coupon Shimmer */}
                            <div className="grid grid-cols-3 gap-4 items-end my-4">
                                <div className="col-span-2 h-12 bg-gray-100 rounded-lg"></div>
                                <div className="h-12 bg-gray-300 rounded-lg"></div>
                            </div>
                            <SummaryRowShimmer width="w-1/2" />

                            {/* Total Shimmer */}
                            <div className="border-t-2 border-dashed font-bold text-lg pt-3 mt-2">
                                <SummaryRowShimmer width="w-2/3" />
                            </div>

                            {/* Savings Shimmer */}
                            <div className="bg-green-50 p-4 mt-4 rounded-lg">
                                <SummaryRowShimmer width="w-3/5" />
                            </div>

                            {/* Pay Button Shimmer */}
                            <div className="w-full h-14 bg-gray-400 rounded-xl mt-6"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ----------------------------------------------------------------------
// Main Checkout Page Component
// ----------------------------------------------------------------------

const CheckoutPage = () => {
    const { courseId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { getCourseById } = useCourseContext();
    const { validateCoupon, couponValidation, calculateDiscount } = usePayment();

    const [course, setCourse] = useState(null);
    const [billingInfo, setBillingInfo] = useState({
        name: currentUser?.displayName || "",
        email: currentUser?.email || "",
        phone: "",
        country: "India",
        agreeTerms: false,
    });
    const [loading, setLoading] = useState(true);
    const [paymentError, setPaymentError] = useState(null);
    const [couponCode, setCouponCode] = useState("");
    const [useTestPayment, setUseTestPayment] = useState(false);

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
    } = useRazorpay(currentUser, handlePaymentSuccess);

    // --- Course Data Loading Logic (Resilient) ---

    useEffect(() => {
        const load = async () => {
            let foundCourse = null;
            let loadingError = null;

            try {
                setLoading(true);
                setPaymentError(null);

                // 1. Try course from route state or context cache first (no extra calls)
                const passedCourse = location.state?.course || null;
                const ctxCourse = passedCourse || getCourseById(courseId);
                if (ctxCourse) {
                    foundCourse = ctxCourse;
                }

                // 2. Fallback to local demo list if not found
                if (!foundCourse) {
                    const localCourse = fallbackCourseList.find(c => String(c.id) === String(courseId));
                    if (localCourse) {
                        foundCourse = localCourse;
                        setUseTestPayment(true);
                        loadingError = "Using local demo data. Payment will be simulated.";
                    }
                }

                // 3. Final normalization for pricing fields
                if (foundCourse) {
                    foundCourse = {
                        id: String(foundCourse.id),
                        title: foundCourse.title,
                        price: Number(foundCourse.price || 5000),
                        originalPrice: Number(foundCourse.originalPrice || (Number(foundCourse.price || 5000) + 1000)),
                        platformDiscount: Number((foundCourse.originalPrice || 0) - (foundCourse.price || 0)) || 0,
                        taxRate: 0.18,
                    };
                } else {
                    loadingError = "Course details unavailable. Please check the URL.";
                }
            } finally {
                if (foundCourse) {
                    setCourse(foundCourse);
                }
                if (loadingError) {
                    setPaymentError(loadingError);
                }

                // Initialize billing info
                if (currentUser) {
                    setBillingInfo((prev) => ({
                        ...prev,
                        email: currentUser.email,
                        name: currentUser.displayName || prev.name || "",
                    }));
                }
                // Add a slight delay to let the shimmer be seen
                setTimeout(() => setLoading(false), 500);
            }
        };
        load();
    }, [courseId, currentUser, location.state?.course, getCourseById]);

    // Check if course data loaded before calculating prices and rendering form
    if (!course || loading)
        return <CheckoutShimmer />;

    // --- Calculation Logic ---
    const courseAmount = Number(course.price || 0);
    const platformDiscount = Number(course.platformDiscount || 0);
    const subtotal = courseAmount; // Assuming course.price already accounts for platform discount
    const taxRate = Number(course.taxRate || 0.18);
    const tax = subtotal * taxRate;

    const couponDiscount = couponValidation.isValid
        ? calculateDiscount(couponValidation, subtotal)
        : 0;

    const amountBeforeTaxAndCoupon = courseAmount + platformDiscount; 
    const totalAmount = Math.max(0, subtotal - couponDiscount + tax);
    const totalSaved = (Number(course.originalPrice || 0) - totalAmount) + couponDiscount;

    // --- Handlers ---
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBillingInfo((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setPaymentError(null);
    };

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        const trimmed = couponCode.trim().toUpperCase();
        if (!trimmed) return;
        await validateCoupon(trimmed, course.id); // Use course.id
    };

    const handleConfirmAndPay = async (e) => {
        e.preventDefault();
        setPaymentError(null);

        if (!billingInfo.agreeTerms) {
            setPaymentError("You must agree to the Terms and Policies before proceeding.");
            return;
        }
        if (!billingInfo.phone || !billingInfo.name) {
            setPaymentError("Name and Phone number are required fields.");
            return;
        }
        if (!course) {
            setPaymentError("Course data is missing. Cannot initiate payment.");
            return;
        }

        // 🚨 CRITICAL: Check if totalAmount is zero or negative after all discounts
        if (totalAmount <= 0) {
            // Treat as a successful free/fully discounted enrollment
            try {
                const enrollmentDoc = await addDoc(collection(db, "enrollments"), {
                    userId: currentUser.uid,
                    courseId: course.id,
                    courseTitle: course.title,
                    status: "SUCCESS",
                    paymentId: "FREE_ENROLLMENT_" + Math.random().toString(36).slice(2),
                    amount: 0,
                    coupon: couponValidation.isValid ? couponCode : null,
                    couponDiscount: subtotal + tax,
                    billingInfo,
                    enrolledAt: new Date(),
                    mode: "FREE",
                });
                handlePaymentSuccess(enrollmentDoc.id, course.id);
            } catch (err) {
                console.error("Free enrollment error", err);
                setPaymentError("Failed to record free enrollment in database.");
            }
            return;
        }

        // 1. Test payment path (For courses loaded from fallbackData)
        if (useTestPayment) {
            try {
                const enrollmentDoc = await addDoc(collection(db, "enrollments"), {
                    userId: currentUser.uid,
                    courseId: course.id,
                    courseTitle: course.title,
                    status: "SUCCESS",
                    paymentId: "TEST_PAYMENT_" + Math.random().toString(36).slice(2),
                    amount: totalAmount,
                    coupon: couponValidation.isValid ? couponCode : null,
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
        }

        // 2. 🚀 EXECUTE RAZORPAY PAYMENT 🚀
        // Convert amount to paise (integer)
        const amountInPaise = Math.round(totalAmount * 100); 

        const success = await initializePayment({
            amount: amountInPaise, // <-- CRITICAL: Amount in PAISE
            currency: 'INR',
            courseId: course.id,
            courseTitle: course.title,
            billingInfo: billingInfo,
            coupon: couponValidation.isValid ? couponCode : null,
            couponDiscount,
        });

        if (!success && paymentGatewayError) {
            setPaymentError(paymentGatewayError);
        }
    };

    // Determine the final error message to display
    const finalError = paymentError || paymentGatewayError;

    // --- Helper Component for Readability (PriceRow) ---
    const PriceRow = ({ label, value, isTotal = false, isDiscount = false, isTax = false }) => (
        <div
            className={`flex justify-between py-2 ${isTotal ? "border-t-2 border-dashed font-bold text-lg pt-3 mt-2" : ""}`}
        >
            <span
                className={`${isDiscount ? "text-red-500" : isTax ? "text-gray-700" : "text-gray-700"}`}
            >
                {label}
            </span>

            <span
                className={`${isDiscount ? "text-red-500" : isTotal ? "text-2xl" : "text-gray-900"} font-semibold`}
            >
                {isDiscount ? "- " : ""}₹{Math.abs(value).toFixed(2)}
            </span>
        </div>
    );

    const baseInputClasses = "w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition";

    return (
        <section className="py-4 bg-gray-50 min-h-screen">
            <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8 `}>
                <form
                    onSubmit={handleConfirmAndPay}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                >
                    {/* LEFT COLUMN: Billing Information Form */}
                    <div className="lg:col-span-2 space-y-8 p-8 bg-white rounded-2xl shadow-xl border border-blue-100">
                        <h2 className="text-2xl font-bold border-b-2 border-yellow-500 pb-3 text-gray-800 flex items-center gap-3">
                            <GraduationCap className="w-6 h-6" style={{ color: PRIMARY_BLUE }} />
                            Enrollment Checkout
                        </h2>
                        
                        {/* Course Title Reminder */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                            <p className="font-semibold text-blue-800 text-lg">
                                Enrolling in: {course.title}
                            </p>
                            {useTestPayment && (
                                <p className="text-sm text-red-600 mt-1 font-medium">⚠️ Test Mode: Using local course data. Payment will be simulated.</p>
                            )}
                        </div>
                        
                        {/* Form Inputs */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div><label className="block text-sm font-semibold text-gray-800 mb-1">Full Name *</label><input type="text" name="name" value={billingInfo.name} onChange={handleInputChange} placeholder="Your Full Name" required className={`${baseInputClasses}`} /></div>
                            <div><label className="block text-sm font-semibold text-gray-800 mb-1">Email Address</label><input type="email" name="email" value={billingInfo.email} readOnly disabled className={`${baseInputClasses} text-gray-900 bg-gray-100 cursor-not-allowed`} /></div>
                            <div><label className="block text-sm font-semibold text-gray-800 mb-1">Phone Number *</label><input type="tel" name="phone" value={billingInfo.phone} onChange={handleInputChange} placeholder="+91-XXXXXXXXXX" required className={`${baseInputClasses}`} /></div>
                            <div><label className="block text-sm font-semibold text-gray-800 mb-1">Country</label><input type="text" name="country" value={billingInfo.country} onChange={handleInputChange} placeholder="Country" className={`${baseInputClasses}`} /></div>
                         </div>

                         {/* Terms Checkbox (Added) */}
                        <div className="pt-6 border-t border-gray-200 space-y-4">
                            <div className="flex items-start space-x-3">
                                <input 
                                    type="checkbox" 
                                    name="agreeTerms" 
                                    checked={billingInfo.agreeTerms} 
                                    onChange={handleInputChange} 
                                    id="agreeTerms"
                                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="agreeTerms" className="text-sm font-medium text-gray-700">
                                    I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-semibold underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-blue-600 hover:text-blue-800 font-semibold underline">Privacy Policy</Link> for this enrollment. *
                                </label>
                            </div>
                        </div>

                        {finalError && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center gap-3">
                                <X className="w-5 h-5" />
                                <p className="font-medium">{finalError}</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Order Summary (1/3 width) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 sticky top-28">
                            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Order Summary</h2>
                            
                            {/* Detailed Pricing */}
                            <div className="space-y-1">
                                <PriceRow label="Original Price" value={course.originalPrice} />
                                <PriceRow label="Platform Discount" value={platformDiscount} isDiscount={true} />
                                <PriceRow label="Amount (Pre-Tax)" value={subtotal} />

                                {/* Coupon entry */}
                                <div className="grid sm:grid-cols-3 gap-4 items-end mb-4 pt-2 border-t mt-2">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Have a coupon?</label>
                                        <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" className={`${baseInputClasses} outline-none`} />
                                    </div>
                                    <button type="button" onClick={handleApplyCoupon} className="h-12 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400" disabled={couponValidation.loading}>
                                        {couponValidation.loading ? "Checking..." : "Apply"}
                                    </button>
                                </div>
                                {couponValidation.error && (<p className="text-sm text-red-600">{couponValidation.error}</p>)}
                                {couponValidation.isValid && (<p className="text-sm text-green-700">Coupon applied: {couponValidation.coupon.name}</p>)}

                                {couponDiscount > 0 && (<PriceRow label={`Coupon Discount (${couponCode})`} value={couponDiscount} isDiscount={true} />)}

                                <PriceRow label={`Tax (${(taxRate * 100).toFixed(0)}% GST)`} value={tax} isTax={true} />
                            </div>
                            
                            {/* Total Final Price */}
                            <PriceRow label="Total Amount Payable" value={totalAmount} isTotal={true} />
                            
                            {/* Total Savings */}
                            <div className="bg-green-50 border border-green-300 p-4 mt-4 rounded-lg flex justify-between items-center text-green-700 font-bold shadow-inner">
                                <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Total Saved</span>
                                <span className="text-xl">₹{totalSaved.toFixed(2)}</span>
                            </div>
                            
                            {/* Confirm and Pay Button */}
                            <button
                                type="submit"
                                disabled={isPaymentGatewayLoading || !billingInfo.agreeTerms || totalAmount < 0}
                                className={`w-full h-14 rounded-xl text-lg font-bold text-white transition-all shadow-xl mt-6 ${billingInfo.agreeTerms
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
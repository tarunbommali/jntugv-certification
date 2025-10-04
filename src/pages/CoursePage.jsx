import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase.js";
import { createEnrollmentWithPayment } from "../firebase/services";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCourseContext } from "../contexts/CourseContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { global_classnames } from "../utils/classnames.js";
import CourseCard from "../components/Course/CourseCard.jsx";
import { AlertTriangle, UserCircle } from "lucide-react"; // Import icons for status messages
import Breadcrumbs from "../components/ui/breadcrumbs.jsx/Breadcrumbs.jsx";

const PRIMARY_BLUE = "#0056D2";

const CoursePage = () => {
    const { currentUser, isAuthenticated } = useAuth();
    const { courses, loading, error, refreshCourses } = useCourseContext();
    const { enrollments } = useUser();
    const [enrollmentStatus, setEnrollmentStatus] = useState({});

    const breadcrumbItems = [
        { label: "Home", link: "/" },
        { label: "Courses", link: "/courses" },

    ];


    useEffect(() => {
        // Refresh courses when the component mounts
        refreshCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !currentUser) {
            setEnrollmentStatus({});
            return;
        }
        // Calculate enrollment status
        const status = courses.reduce((acc, c) => {
            acc[c.id] = enrollments.some((e) => String(e.courseId) === String(c.id));
            return acc;
        }, {});
        setEnrollmentStatus(status);
    }, [courses, enrollments, isAuthenticated, currentUser]);

    // Handle enrollment payment logic (Kept the same)
    const handleEnroll = (course) => {
        if (!currentUser) {
            alert("Please sign in to enroll in a course.");
            return;
        }
        const priceNumber = Number(course.price);
        if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
            alert("Invalid course price. Please contact support.");
            return;
        }

        // --- Razorpay Initialization ---
        if (typeof window === "undefined" || !window.Razorpay) {
            alert("Payment system not loaded yet. Please try again in a moment.");
            return;
        }
        const amountInPaise = Math.round(priceNumber * 100);
        const razorpayOptions = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: amountInPaise,
            currency: "INR",
            name: "Certification Platform",
            description: `Enrollment for ${course.title}`,
            handler: async function (response) {
                try {
                    // Create enrollment + payment record in Firestore
                    await createEnrollmentWithPayment(
                        {
                            userId: currentUser.uid,
                            courseId: course.id,
                            courseTitle: course.title,
                            status: "SUCCESS",
                            paymentData: {
                                paymentId: response.razorpay_payment_id,
                                amount: priceNumber,
                            },
                        },
                        {
                            userId: currentUser.uid,
                            courseId: course.id,
                            courseTitle: course.title,
                            amount: priceNumber,
                            currency: "INR",
                            status: "captured",
                            razorpayData: {
                                paymentId: response.razorpay_payment_id,
                            },
                        }
                    );
                    alert(`Enrollment successful! Payment ID: ${response.razorpay_payment_id}`);
                    setEnrollmentStatus(prev => ({ ...prev, [course.id]: true }));
                } catch (err) {
                    console.error("Error saving enrollment to Firestore:", err);
                    alert("Payment successful but failed to record enrollment. Please contact support.");
                }
            },
            prefill: {
                name: currentUser.displayName || "Learner",
                email: currentUser.email,
            },
            theme: { color: "#007bff" },
        };
        // eslint-disable-next-line no-undef
        const rzp = new window.Razorpay(razorpayOptions);
        rzp.on("payment.failed", function (response) {
            alert(`Payment failed: ${response.error.description}. Please try again.`);
            console.error("Razorpay Error:", response.error);
        });
        rzp.open();
    };

    return (
        <div
            className={`${global_classnames.width.container}   min-h-screen`}
        >
            <Breadcrumbs items={breadcrumbItems} />




            {/* Loading/Error Messages */}
            {(loading || error) && (
                <div className="mt-4 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: error ? '#fee2e2' : '#eff6ff' }}>
                    {loading && <p className="text-gray-600">Loading available courses...</p>}
                    {error && (
                        <>
                            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <p className="text-red-700 font-medium">{error}</p>
                        </>
                    )}
                </div>
            )}

            <div className="flex flex-wrap mt-2 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm-px-2 ">

                {courses.length > 0 ? (
                    courses.map((c) => (
                        <CourseCard
                            key={c.id}
                            course={c}
                            isEnrolled={!enrollmentStatus[c.id]}
                            onEnroll={handleEnroll}
                        />
                    ))
                ) : (
                    // Display message when courses list is empty (and not currently loading)
                    !loading && (
                        <div className="lg:col-span-4 w-full text-center p-12 bg-gray-50 border border-gray-200 rounded-xl shadow-inner">
                            <p className="text-xl text-gray-600 font-medium">
                                No courses are currently available. Check back soon!
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default CoursePage;
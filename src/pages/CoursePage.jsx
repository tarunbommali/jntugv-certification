import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";
import { useAuth } from "../contexts/AuthContext.jsx";
// 🚨 FIX 1: Change import name from `useCourse` to `useCourseContext`
import { useCourseContext } from "../contexts/CourseContext.jsx"; 
import { useUser } from "../contexts/UserContext.jsx";
import { global_classnames } from "../utils/classnames.js";
// We don't need coursesData from fallbackData.js here since we use the context, but keep if other parts use it
import { courses as coursesData } from "../utils/fallbackData.js"; 
import CourseCard from "../components/CourseCard.jsx";
import CourseList from '../components/CourseList.jsx'; // Assuming this is your dynamic list component

const CoursePage = () => {
    const { currentUser, isAuthenticated } = useAuth();
    // 🚨 FIX 2: Use the correct hook name when destructuring
    const { courses, loading, error, refreshCourses } = useCourseContext(); 
    const { enrollments } = useUser();
    const [enrollmentStatus, setEnrollmentStatus] = useState({});

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
        // Calculate enrollment status based on the central lists from CourseContext and UserContext
        const status = courses.reduce((acc, c) => {
            // Note: course.id might be a number, enrollment.courseId might be a string, so use String()
            acc[c.id] = enrollments.some((e) => String(e.courseId) === String(c.id));
            return acc;
        }, {});
        setEnrollmentStatus(status);
    }, [courses, enrollments, isAuthenticated, currentUser]);

    // Handle enrollment payment logic
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
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_xxx",
            amount: amountInPaise,
            currency: "INR",
            name: "Certification Platform",
            description: `Enrollment for ${course.title}`,
            handler: async function (response) {
                try {
                    await addDoc(collection(db, "enrollments"), {
                        userId: currentUser.uid,
                        courseId: course.id,
                        courseTitle: course.title,
                        status: "SUCCESS",
                        paymentId: response.razorpay_payment_id,
                        amount: priceNumber,
                        enrolledAt: new Date(),
                    });
                    alert(
                        `Enrollment successful! Payment ID: ${response.razorpay_payment_id}`
                    );
                    // Force a refresh of the enrollment status after successful payment
                    // NOTE: You may need to call refreshEnrollments from useUser() here too
                    // if that context doesn't auto-update.
                    setEnrollmentStatus(prev => ({...prev, [course.id]: true}));
                } catch (err) {
                    console.error("Error saving enrollment to Firestore:", err);
                    alert(
                        "Payment successful but failed to record enrollment. Please contact support."
                    );
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
            className={`${global_classnames.width.container} page-container p-6`}
        >
            <h1 className="text-3xl font-bold">Courses</h1>
            <p className="text-sm text-gray-700 mt-2">
                {isAuthenticated && currentUser
                    ? `Welcome, ${currentUser.email}!`
                    : "Sign in to enroll and get instant access."}
            </p>
            
            {loading && <p className="mt-4">Loading courses...</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
            
            <div className="course-list mt-6 flex flex-wrap gap-5 justify-center">
                {/* 🚨 FIX: Only render CourseCard list if courses are available */}
                {courses.length > 0 ? (
                    courses.map((c) => (
                        <CourseCard
                            key={c.id}
                            course={c}
                            isEnrolled={enrollmentStatus[c.id]}
                            onEnroll={handleEnroll}
                        />
                    ))
                ) : (
                    // 🚨 FIX: Render CourseList (or a message) when courses are empty 🚨
                    <div className="w-full text-center p-10 bg-gray-50 rounded-lg">
                         <p className="text-lg text-gray-600">No courses available. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursePage;
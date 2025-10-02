import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext.jsx";
import { global_classnames } from "../utils/classnames.js";
import { courses as coursesData } from "../utils/fallbackData";
import CourseCard from "../components/CourseCard.jsx";
import CourseList from '../components/CourseList.jsx';

const HomeCourses = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setError("");
        const snapshot = await getDocs(collection(db, "courses"));
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCourses(list);
      } catch (e) {
        setError("Failed to load courses. Please try again later.");
        console.error("Fetch courses error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      courses.forEach((c) => checkEnrollmentStatus(c.id));
    } else {
      setEnrollmentStatus({});
    }
  }, [courses, isAuthenticated, currentUser]);

  const checkEnrollmentStatus = async (courseId) => {
    if (!currentUser) return;
    setEnrollmentStatus((p) => ({ ...p, [courseId]: null }));
    const qEnroll = query(
      collection(db, "enrollments"),
      where("userId", "==", currentUser.uid),
      where("courseId", "==", courseId),
      where("status", "==", "SUCCESS")
    );
    try {
      const snap = await getDocs(qEnroll);
      setEnrollmentStatus((p) => ({ ...p, [courseId]: !snap.empty }));
    } catch (e) {
      console.error("Check enrollment error", e);
      setEnrollmentStatus((p) => ({ ...p, [courseId]: false }));
    }
  };

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
          checkEnrollmentStatus(course.id);
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
      className={`${global_classnames.width.container} page-container   p-6`}
    >
      <h1 className="text-3xl font-bold">Courses</h1>
      {loading && <p className="mt-4">Loading courses...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      <div className="course-list mt-6 flex flex-wrap gap-5 justify-center">
        {courses.length === 0 ? (
          <CourseList /> 
        ) : (
          courses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              isEnrolled={enrollmentStatus[c.id]}
              onEnroll={handleEnroll}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomeCourses;

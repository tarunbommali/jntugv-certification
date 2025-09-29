import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext.jsx';

const CourseCard = ({ course, isEnrolled, onEnroll }) => (
  <div className="course-card border rounded p-4 w-80">
    <h3 className="text-lg font-semibold text-blue-700">{course.title}</h3>
    <p className="mt-2 text-sm">{course.description}</p>
    <p className="font-bold text-green-700 mt-2">Price: ₹{Number(course.price).toFixed(2)}</p>
    {isEnrolled === true ? (
      <Link to={`/course/${course.id}`} className="mt-3 inline-block bg-green-600 text-white px-3 py-2 rounded">Access Course</Link>
    ) : isEnrolled === false ? (
      <button onClick={() => onEnroll(course)} className="mt-3 w-full bg-yellow-400 text-black px-3 py-2 rounded">Pay ₹{Number(course.price).toFixed(2)} & Enroll</button>
    ) : (
      <button disabled className="mt-3 w-full bg-gray-200 text-gray-600 px-3 py-2 rounded">Checking Status...</button>
    )}
  </div>
);

const HomeCourses = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, 'courses'));
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCourses(list);
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
      collection(db, 'enrollments'),
      where('userId', '==', currentUser.uid),
      where('courseId', '==', courseId),
      where('status', '==', 'SUCCESS')
    );
    const snap = await getDocs(qEnroll);
    setEnrollmentStatus((p) => ({ ...p, [courseId]: !snap.empty }));
  };

  const handleEnroll = (course) => {
    if (!currentUser) {
      alert('Please sign in to enroll in a course.');
      return;
    }
    const amountInPaise = Number(course.price) * 100;
    const razorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxx',
      amount: amountInPaise,
      currency: 'INR',
      name: 'Certification Platform',
      description: `Enrollment for ${course.title}`,
      handler: async function (response) {
        try {
          await addDoc(collection(db, 'enrollments'), {
            userId: currentUser.uid,
            courseId: course.id,
            courseTitle: course.title,
            status: 'SUCCESS',
            paymentId: response.razorpay_payment_id,
            amount: Number(course.price),
            enrolledAt: new Date()
          });
          alert(`Enrollment successful! Payment ID: ${response.razorpay_payment_id}`);
          checkEnrollmentStatus(course.id);
        } catch (err) {
          console.error('Error saving enrollment to Firestore:', err);
          alert('Payment successful but failed to record enrollment. Please contact support.');
        }
      },
      prefill: {
        name: currentUser.displayName || 'Learner',
        email: currentUser.email
      },
      theme: { color: '#007bff' }
    };
    // eslint-disable-next-line no-undef
    const rzp = new window.Razorpay(razorpayOptions);
    rzp.on('payment.failed', function (response) {
      alert(`Payment failed: ${response.error.description}. Please try again.`);
      console.error('Razorpay Error:', response.error);
    });
    rzp.open();
  };

  return (
    <div className="page-container max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Available Certification Courses</h1>
      <p className="text-sm text-gray-700 mt-2">
        {isAuthenticated && currentUser ? `Welcome, ${currentUser.email}!` : 'Sign in to enroll and get instant access.'}
      </p>
      <div className="course-list mt-6 flex flex-wrap gap-5 justify-center">
        {courses.length === 0 ? (
          <p>No courses currently available. Check back soon!</p>
        ) : (
          courses.map((c) => (
            <CourseCard key={c.id} course={c} isEnrolled={enrollmentStatus[c.id]} onEnroll={handleEnroll} />
          ))
        )}
      </div>
    </div>
  );
};

export default HomeCourses;


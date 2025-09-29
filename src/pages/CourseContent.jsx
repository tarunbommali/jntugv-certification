import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext.jsx';

const CourseContent = () => {
  const { courseId } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const [courseDetails, setCourseDetails] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      setLoading(false);
      return;
    }
    const run = async () => {
      try {
        const qCourse = query(collection(db, 'courses'), where('__name__', '==', courseId));
        const courseSnapshot = await getDocs(qCourse);
        if (!courseSnapshot.empty) {
          const docData = courseSnapshot.docs[0].data();
          setCourseDetails({ id: courseSnapshot.docs[0].id, ...docData });
          const qEnrollment = query(
            collection(db, 'enrollments'),
            where('userId', '==', currentUser.uid),
            where('courseId', '==', courseSnapshot.docs[0].id),
            where('status', '==', 'SUCCESS')
          );
          const enrollmentSnapshot = await getDocs(qEnrollment);
          setIsAuthorized(!enrollmentSnapshot.empty);
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [isAuthenticated, currentUser, courseId]);

  if (loading) return <div className="page-container p-6">Loading course access...</div>;
  if (!isAuthorized)
    return (
      <div className="page-container p-6">
        <h1 className="text-2xl font-semibold">Access Denied 🔒</h1>
        <p className="mt-2">You must successfully complete the payment and enrollment process to access this course content.</p>
        <Link to="/" className="text-blue-600 underline mt-3 inline-block">Browse Courses</Link>
      </div>
    );

  return (
    <div className="page-container p-6">
      <h1 className="text-2xl font-semibold">Course Content: {courseDetails?.title || 'Unknown Course'}</h1>
      <p className="mt-2">Welcome! You are an enrolled student. Here is your content:</p>
      {courseDetails?.contentAccessURL && (
        <a href={courseDetails.contentAccessURL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block bg-blue-600 text-white px-3 py-2 rounded">
          Go to Course Material Link
        </a>
      )}
    </div>
  );
};

export default CourseContent;


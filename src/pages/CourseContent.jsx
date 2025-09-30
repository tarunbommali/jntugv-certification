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
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      setLoading(false);
      return;
    }
    const run = async () => {
      try {
        setError('');
        if (!courseId) throw new Error('Invalid course identifier');
        const qCourse = query(collection(db, 'courses'), where('__name__', '==', courseId));
        const courseSnapshot = await getDocs(qCourse);
        if (courseSnapshot.empty) {
          setError('Course not found.');
          setIsAuthorized(false);
          return;
        }
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
      } catch (e) {
        console.error('CourseContent error', e);
        setError('Failed to load course. Please try again later.');
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [isAuthenticated, currentUser, courseId]);

  if (loading) return <div className="page-container p-6">Loading course access...</div>;
  if (error)
    return (
      <div className="page-container p-6">
        <h1 className="text-2xl font-semibold">Error</h1>
        <p className="mt-2 text-red-600">{error}</p>
        <Link to="/courses" className="text-blue-600 underline mt-3 inline-block">Browse Courses</Link>
      </div>
    );
  if (!isAuthorized)
    return (
      <div className="page-container p-6">
        <h1 className="text-2xl font-semibold">Access Denied 🔒</h1>
        <p className="mt-2">You must successfully complete the payment and enrollment process to access this course content.</p>
        <Link to="/courses" className="text-blue-600 underline mt-3 inline-block">Browse Courses</Link>
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
      {Array.isArray(courseDetails?.modules) && courseDetails.modules.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Module Links</h2>
          <ul className="list-disc ml-5 space-y-2">
            {courseDetails.modules.map((m) => (
              <li key={m.id}>
                {m.title || m.id}: {m.url ? (
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Open</a>
                ) : (
                  <span className="text-gray-500">No link</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseContent;


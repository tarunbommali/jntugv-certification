import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../hooks/useFirebase';
import { useUserEnrollments } from '../hooks/useFirebase';
import PageContainer from '../components/layout/PageContainer';
import CourseList from '../components/course/CourseList';
import Breadcrumbs from '../components/ui/breadcrumbs.jsx/Breadcrumbs';
import { Alert, AlertDescription, AlertIcon } from '../components/ui/Alert';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CoursePage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { enrollments, loading: enrollmentsLoading, isEnrolled } = useUserEnrollments(currentUser?.uid);
  const [enrollmentStatus, setEnrollmentStatus] = useState({});

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Courses", link: "/courses" },
  ];

  // Calculate enrollment status
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      setEnrollmentStatus({});
      return;
    }

    const status = courses.reduce((acc, course) => {
      acc[course.id] = isEnrolled(course.id);
      return acc;
    }, {});
    
    setEnrollmentStatus(status);
  }, [courses, enrollments, isAuthenticated, currentUser, isEnrolled]);

  // Show loading state
  if (coursesLoading || enrollmentsLoading) {
    return (
      <PageContainer className="min-h-screen">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-8">
          <LoadingSpinner size="lg" message="Loading courses..." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="min-h-screen">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Error Messages */}
      {coursesError && (
        <Alert variant="destructive" className="mt-4">
          <AlertIcon variant="destructive" />
          <AlertDescription>
            {coursesError}
          </AlertDescription>
        </Alert>
      )}

      {/* Page Title */}
      <div className="mt-8 mb-6">
        <h1 className="text-3xl font-bold text-foreground">Available Courses</h1>
        <p className="text-muted-foreground mt-2">
          Explore our comprehensive certification programs
        </p>
      </div>

      {/* Course List */}
      <CourseList
        courses={courses}
        loading={coursesLoading}
        error={coursesError}
        enrollmentStatus={enrollmentStatus}
        className="mt-6"
      />
    </PageContainer>
  );
};

export default CoursePage;
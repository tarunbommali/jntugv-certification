import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRealtimeCourse, useRealtimeEnrollmentStatus, useRealtimeEnrollmentMutations } from '../hooks/useRealtimeFirebase';
import useRazorpay from '../hooks/useRazorpay';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Alert, AlertDescription, AlertIcon } from '../components/ui/Alert';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Breadcrumbs from '../components/ui/breadcrumbs/Breadcrumbs';
import { Clock, Globe, Star, Award, CheckCircle, Users, BookOpen } from 'lucide-react';
import Pagecontainer from '../components/layout/PageContainer';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  
  const { course, loading: courseLoading, error: courseError } = useRealtimeCourse(courseId);
  const { isEnrolled, enrollment, loading: enrollmentLoading } = useRealtimeEnrollmentStatus(currentUser?.uid, courseId);
  const { createEnrollment, loading: enrollmentCreating } = useRealtimeEnrollmentMutations();
  
  const { initializePayment, isLoading: paymentLoading, error: paymentError } = useRazorpay(
    currentUser,
    (enrollmentId, courseId) => {
      navigate(`/learn/${courseId}`);
    }
  );

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Courses", link: "/courses" },
    { label: course?.title || "Course", link: `/course/${courseId}` },
  ];

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/auth/signin');
      return;
    }

    if (!course) return;

    const priceNumber = Number(course.price);
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      alert("Invalid course price. Please contact support.");
      return;
    }

    const paymentDetails = {
      courseId: course.id,
      courseTitle: course.title,
      amount: priceNumber,
      billingInfo: {
        name: currentUser.displayName || "Learner",
        email: currentUser.email,
      },
    };

    await initializePayment(paymentDetails);
  };

  if (courseLoading) {
    return (
      <PageContainer items={breadcrumbItems} className="min-h-screen">
         <div className="mt-8">
          <LoadingSpinner size="lg" message="Loading course details..." />
        </div>
      </PageContainer>
    );
  }

  if (courseError || !course) {
    return (
      <PageContainer items={breadcrumbItems} className="min-h-screen">
         <Alert variant="destructive" className="mt-8">
          <AlertIcon variant="destructive" />
          <AlertDescription>
            {courseError || "Course not found"}
          </AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  const price = Number(course.price) || 0;
  const originalPrice = Number(course.originalPrice) || (price + 2000);

  return (
    <PageContainer items={breadcrumbItems} className="min-h-screen py-8">
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl font-bold mb-2">
                    {course.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-lg">
                    {course.description || course.courseDescription}
                  </p>
                </div>
                {course.isBestseller && (
                  <Badge variant="success" className="ml-4">
                    <Award size={16} className="mr-1" />
                    Bestseller
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {course.duration || 'Self-Paced'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={20} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {course.mode || 'Online'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-muted-foreground">
                    {course.rating || '4.5'} Rating
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {course.students || 0} Students
                  </span>
                </div>
              </div>

              {/* Course Modules */}
              {course.modules && course.modules.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen size={20} />
                    Course Modules
                  </h3>
                  <div className="space-y-3">
                    {course.modules.map((module, index) => (
                      <div key={module.moduleKey || index} className="border border-border rounded-lg p-4">
                        <h4 className="font-medium mb-2">
                          {module.moduleTitle || module.title || `Module ${index + 1}`}
                        </h4>
                        {module.videos && module.videos.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {module.videos.length} video{module.videos.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Image */}
          <Card>
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img
                src={course.imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUwCJYSnbBLMEGWKfSnWRGC_34iCCKkxePpg&s"}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              {/* Pricing */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-foreground">
                  ₹{price.toFixed(0)}
                </div>
                <div className="text-lg text-muted-foreground line-through">
                  ₹{originalPrice.toFixed(0)}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Save ₹{(originalPrice - price).toFixed(0)}
                </div>
              </div>

              {/* Enrollment Status */}
              {enrollmentLoading ? (
                <div className="text-center">
                  <LoadingSpinner size="sm" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Checking enrollment status...
                  </p>
                </div>
              ) : isEnrolled ? (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="text-green-600 font-medium">Enrolled</span>
                  </div>
                  <Button asChild className="w-full">
                    <a href={`/learn/${course.id}`}>
                      Continue Learning
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={handleEnroll}
                    disabled={paymentLoading || enrollmentCreating}
                    className="w-full"
                    size="lg"
                  >
                    {paymentLoading || enrollmentCreating ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Enroll Now'
                    )}
                  </Button>
                  
                  {!isAuthenticated && (
                    <p className="text-sm text-muted-foreground text-center">
                      <Button variant="link" asChild>
                        <a href="/auth/signin">Sign in</a>
                      </Button> to enroll
                    </p>
                  )}
                </div>
              )}

              {/* Payment Error */}
              {paymentError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertIcon variant="destructive" />
                  <AlertDescription>
                    {paymentError}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default CourseDetailsPage;
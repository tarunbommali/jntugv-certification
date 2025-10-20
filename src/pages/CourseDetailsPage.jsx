/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  useRealtimeCourse,
  useRealtimeEnrollmentStatus,
  useRealtimeEnrollmentMutations,
} from "../hooks/useRealtimeFirebase";
import useRazorpay from "../hooks/useRazorpay";
import PageContainer from "../components/layout/PageContainer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Alert, AlertDescription, AlertIcon } from "../components/ui/Alert";
import LoadingSpinner from "../components/ui/LoadingSpinner";

import {
  Clock,
  Globe,
  Star,
  Award,
  CheckCircle,
  Users,
  BookOpen,
} from "lucide-react";

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const {
    course,
    loading: courseLoading,
    error: courseError,
  } = useRealtimeCourse(courseId);
  const {
    isEnrolled,
    enrollment,
    loading: enrollmentLoading,
  } = useRealtimeEnrollmentStatus(currentUser?.uid, courseId);
  const { createEnrollment, loading: enrollmentCreating } =
    useRealtimeEnrollmentMutations();

  const {
    initializePayment,
    isLoading: paymentLoading,
    error: paymentError,
  } = useRazorpay(currentUser, (enrollmentId, courseId) => {
    navigate(`/learn/${courseId}`);
  });

  // Dummy data for when course is not found
  const dummyData = {
    id: courseId || "emerging-technologies-2024",
    title: "Emerging Technologies",
    description: "Master cutting-edge technologies shaping the future including AI, Blockchain, IoT, and Quantum Computing. Gain hands-on experience with real-world projects and industry applications.",
    courseDescription: "Comprehensive course covering the latest technological advancements and their practical implementations across various industries.",
    
    // Pricing
    price: 4999,
    originalPrice: 8999,
    
    // Course metadata
    isBestseller: true,
    duration: "8 weeks",
    mode: "Online",
    rating: 4.8,
    students: 1250,
    
    // Visual
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    
    // Course modules
    modules: [
      {
        moduleKey: "intro-emerging-tech",
        moduleTitle: "Introduction to Emerging Technologies",
        videos: [
          { title: "What are Emerging Technologies?", duration: "15:30" },
          { title: "Technology Adoption Lifecycle", duration: "18:45" },
          { title: "Future Trends Analysis", duration: "22:10" }
        ]
      },
      {
        moduleKey: "artificial-intelligence",
        moduleTitle: "Artificial Intelligence & Machine Learning",
        videos: [
          { title: "AI Fundamentals", duration: "25:15" },
          { title: "Machine Learning Algorithms", duration: "32:20" },
          { title: "Deep Learning & Neural Networks", duration: "28:45" },
          { title: "AI Ethics and Responsible AI", duration: "19:30" }
        ]
      },
      {
        moduleKey: "blockchain-web3",
        moduleTitle: "Blockchain & Web3 Technologies",
        videos: [
          { title: "Blockchain Fundamentals", duration: "20:15" },
          { title: "Smart Contracts & DApps", duration: "26:40" },
          { title: "Cryptocurrencies & DeFi", duration: "24:25" },
          { title: "NFTs and Digital Ownership", duration: "21:50" }
        ]
      },
      {
        moduleKey: "internet-of-things",
        moduleTitle: "Internet of Things (IoT)",
        videos: [
          { title: "IoT Architecture & Components", duration: "18:20" },
          { title: "IoT Sensors and Devices", duration: "23:15" },
          { title: "IoT Data Analytics", duration: "27:30" },
          { title: "Smart Cities & Industrial IoT", duration: "22:45" }
        ]
      },
      {
        moduleKey: "quantum-computing",
        moduleTitle: "Quantum Computing",
        videos: [
          { title: "Quantum Mechanics Basics", duration: "29:10" },
          { title: "Qubits and Quantum Gates", duration: "31:25" },
          { title: "Quantum Algorithms", duration: "26:40" },
          { title: "Quantum Cryptography", duration: "24:15" }
        ]
      }
    ]
  };

  // Use course data if available, otherwise use dummy data
  const displayCourse = course || dummyData;

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Courses", link: "/courses" },
    { label: displayCourse?.title || "Course", link: `/course/${courseId}` },
  ];

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/auth/signin");
      return;
    }

    if (!displayCourse) return;

    const priceNumber = Number(displayCourse.price);
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      alert("Invalid course price. Please contact support.");
      return;
    }

    const paymentDetails = {
      courseId: displayCourse.id,
      courseTitle: displayCourse.title,
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

  // Show warning if using dummy data but don't block rendering
  const showDummyDataWarning = courseError || !course;

  const price = Number(displayCourse.price) || 0;
  const originalPrice = Number(displayCourse.originalPrice) || price + 2000;

  return (
    <PageContainer items={breadcrumbItems} className="min-h-screen py-8">
      {/* Warning when using dummy data */}
      {showDummyDataWarning && (
        <Alert variant="warning" className="mb-6">
          <AlertIcon variant="warning" />
          <AlertDescription>
            {courseError ? `Error loading course: ${courseError}. Showing sample course.` : "Course not found. Showing sample course for demonstration."}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl font-bold mb-2">
                    {displayCourse.title}
                    {showDummyDataWarning && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Sample
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-muted-foreground text-lg">
                    {displayCourse.description || displayCourse.courseDescription}
                  </p>
                </div>
                {displayCourse.isBestseller && (
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
                    {displayCourse.duration || "Self-Paced"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={20} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {displayCourse.mode || "Online"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-muted-foreground">
                    {displayCourse.rating || "4.5"} Rating
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {displayCourse.students || 0} Students
                  </span>
                </div>
              </div>

              {/* Course Modules */}
              {displayCourse.modules && displayCourse.modules.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen size={20} />
                    Course Modules
                  </h3>
                  <div className="space-y-3">
                    {displayCourse.modules.map((module, index) => (
                      <div
                        key={module.moduleKey || index}
                        className="border border-border rounded-lg p-4"
                      >
                        <h4 className="font-medium mb-2">
                          {module.moduleTitle ||
                            module.title ||
                            `Module ${index + 1}`}
                        </h4>
                        {module.videos && module.videos.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {module.videos.length} video
                            {module.videos.length !== 1 ? "s" : ""}
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
                src={
                  displayCourse.imageUrl ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUwCJYSnbBLMEGWKfSnWRGC_34iCCKkxePpg&s"
                }
                alt={displayCourse.title}
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
                    <a href={`/learn/${displayCourse.id}`}>Continue Learning</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={handleEnroll}
                    disabled={paymentLoading || enrollmentCreating || showDummyDataWarning}
                    className="w-full"
                    size="lg"
                  >
                    {paymentLoading || enrollmentCreating ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Processing...
                      </>
                    ) : showDummyDataWarning ? (
                      "Course Not Available"
                    ) : (
                      "Enroll Now"
                    )}
                  </Button>

                  {showDummyDataWarning && (
                    <p className="text-sm text-muted-foreground text-center">
                      This is a sample course for demonstration purposes.
                    </p>
                  )}

                  {!isAuthenticated && !showDummyDataWarning && (
                    <p className="text-sm text-muted-foreground text-center">
                      <Button variant="link" asChild>
                        <a href="/auth/signin">Sign in</a>
                      </Button>{" "}
                      to enroll
                    </p>
                  )}
                </div>
              )}

              {/* Payment Error */}
              {paymentError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertIcon variant="destructive" />
                  <AlertDescription>{paymentError}</AlertDescription>
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
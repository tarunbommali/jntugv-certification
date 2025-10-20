/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRealtime } from "../contexts/RealtimeContext";
import PageContainer from "../components/layout/PageContainer";
import CourseList from "../components/Course/CourseList";
import Breadcrumbs from "../components/ui/breadcrumbs/Breadcrumbs";
import { Alert, AlertDescription, AlertIcon } from "../components/ui/Alert";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PageTitle from "../components/ui/PageTitle";

const CoursePage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const {
    courses,
    coursesLoading,
    coursesError,
    enrollments,
    enrollmentsLoading,
    isEnrolled,
  } = useRealtime();
  const [enrollmentStatus, setEnrollmentStatus] = useState({});

  const dummyData = [
    {
      id: "emerging-technologies-2024", // or use the actual courseId from your database
      title: "Emerging Technologies",
      description:
        "Master cutting-edge technologies shaping the future including AI, Blockchain, IoT, and Quantum Computing. Gain hands-on experience with real-world projects and industry applications.",
      courseDescription:
        "Comprehensive course covering the latest technological advancements and their practical implementations across various industries.",

      // Pricing
      price: 4999, // Current price
      originalPrice: 8999, // Original price for showing discount

      // Course metadata
      isBestseller: true,
      duration: "8 weeks",
      mode: "Online",
      rating: 4.8,
      students: 1250,

      // Visual
      imageUrl:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",

      // Course modules
      modules: [
        {
          moduleKey: "intro-emerging-tech",
          moduleTitle: "Introduction to Emerging Technologies",
          videos: [
            { title: "What are Emerging Technologies?", duration: "15:30" },
            { title: "Technology Adoption Lifecycle", duration: "18:45" },
            { title: "Future Trends Analysis", duration: "22:10" },
          ],
        },
        {
          moduleKey: "artificial-intelligence",
          moduleTitle: "Artificial Intelligence & Machine Learning",
          videos: [
            { title: "AI Fundamentals", duration: "25:15" },
            { title: "Machine Learning Algorithms", duration: "32:20" },
            { title: "Deep Learning & Neural Networks", duration: "28:45" },
            { title: "AI Ethics and Responsible AI", duration: "19:30" },
          ],
        },
        {
          moduleKey: "blockchain-web3",
          moduleTitle: "Blockchain & Web3 Technologies",
          videos: [
            { title: "Blockchain Fundamentals", duration: "20:15" },
            { title: "Smart Contracts & DApps", duration: "26:40" },
            { title: "Cryptocurrencies & DeFi", duration: "24:25" },
            { title: "NFTs and Digital Ownership", duration: "21:50" },
          ],
        },
        {
          moduleKey: "internet-of-things",
          moduleTitle: "Internet of Things (IoT)",
          videos: [
            { title: "IoT Architecture & Components", duration: "18:20" },
            { title: "IoT Sensors and Devices", duration: "23:15" },
            { title: "IoT Data Analytics", duration: "27:30" },
            { title: "Smart Cities & Industrial IoT", duration: "22:45" },
          ],
        },
        {
          moduleKey: "quantum-computing",
          moduleTitle: "Quantum Computing",
          videos: [
            { title: "Quantum Mechanics Basics", duration: "29:10" },
            { title: "Qubits and Quantum Gates", duration: "31:25" },
            { title: "Quantum Algorithms", duration: "26:40" },
            { title: "Quantum Cryptography", duration: "24:15" },
          ],
        },
        {
          moduleKey: "augmented-reality",
          moduleTitle: "Augmented & Virtual Reality",
          videos: [
            { title: "AR/VR Fundamentals", duration: "19:45" },
            { title: "3D Modeling and Animation", duration: "25:20" },
            { title: "Spatial Computing", duration: "22:30" },
            { title: "Metaverse Applications", duration: "20:15" },
          ],
        },
        {
          moduleKey: "biotechnology",
          moduleTitle: "Biotechnology & Bioinformatics",
          videos: [
            { title: "Genetic Engineering", duration: "26:50" },
            { title: "CRISPR and Gene Editing", duration: "24:25" },
            { title: "Bioinformatics Tools", duration: "28:10" },
            { title: "Personalized Medicine", duration: "23:45" },
          ],
        },
        {
          moduleKey: "robotics-automation",
          moduleTitle: "Robotics & Automation",
          videos: [
            { title: "Robotics Fundamentals", duration: "21:30" },
            { title: "Industrial Automation", duration: "25:45" },
            { title: "Autonomous Systems", duration: "27:20" },
            { title: "Human-Robot Interaction", duration: "22:15" },
          ],
        },
        {
          moduleKey: "capstone-project",
          moduleTitle: "Capstone Project",
          videos: [
            { title: "Project Ideation", duration: "16:40" },
            { title: "Technology Stack Selection", duration: "19:25" },
            { title: "Implementation Guide", duration: "32:10" },
            { title: "Deployment and Presentation", duration: "24:50" },
          ],
        },
      ],

      // Additional course details that might be used
      category: "Technology",
      level: "Intermediate",
      instructor: "Dr. Sarah Chen",
      language: "English",
      certificateIncluded: true,
      lastUpdated: "2024-01-15",
      requirements: [
        "Basic programming knowledge",
        "Understanding of computer science fundamentals",
        "Curiosity about technology trends",
      ],
      learningOutcomes: [
        "Understand and apply emerging technologies in real-world scenarios",
        "Develop AI and machine learning models",
        "Create blockchain applications and smart contracts",
        "Design IoT solutions for various industries",
        "Understand quantum computing principles",
        "Build AR/VR experiences",
        "Apply biotech concepts in healthcare",
        "Implement automation and robotics solutions",
      ],
    },
  ];

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
      <PageContainer className="min-h-screen" items={breadcrumbItems}>
        <div className="mt-8">
          <LoadingSpinner size="lg" message="Loading courses..." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="min-h-screen" items={breadcrumbItems}>
      {/* Error Messages */}
      {coursesError && (
        <Alert variant="destructive" className="mt-4">
          <AlertIcon variant="destructive" />
          <AlertDescription>{coursesError}</AlertDescription>
        </Alert>
      )}

      <PageTitle
        title="Available Courses"
        description="Explore our comprehensive certification programs"
      />

      {/* Course List */}
      <CourseList
        courses={dummyData}
        loading={coursesLoading}
        error={coursesError}
        enrollmentStatus={enrollmentStatus}
        className="mt-6"
      />
    </PageContainer>
  );
};

export default CoursePage;

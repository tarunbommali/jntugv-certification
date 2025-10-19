import { useCallback } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  School,
  Mail,
  LogOut,
  BookOpen,
  Shield,
  TrendingUp,
  UserCircle,
  PencilLine,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useUser } from "../contexts/UserContext.jsx"; // Context providing enrollments
import { global_classnames } from "../utils/classnames.js";
import PageContainer from "../components/layout/PageContainer.jsx";
const PRIMARY_BLUE = "var(--color-primary)";

// ----------------------------------------------------------------------
// Shimmer Loading Component (Kept the same)
// ----------------------------------------------------------------------

// Helper Shimmer component for a skeleton effect
const Shimmer = () => (
  <div className="animate-pulse space-y-8 py-16">
    <div
      className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}
    >
      {/* Header Shimmer */}
      <div className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-200"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/5"></div>
        </div>
        <div className="h-10 w-32 bg-gray-300 rounded-full"></div>
      </div>

      {/* Content Shimmer */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column Shimmer (Skills) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-8 w-16 bg-blue-100 rounded-full"></div>
              <div className="h-8 w-24 bg-blue-100 rounded-full"></div>
              <div className="h-8 w-16 bg-blue-100 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Column Shimmer (Courses) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Enrolled Courses Shimmer */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <div className="h-6 bg-gray-200 rounded w-2/5"></div>
            <div className="h-16 bg-gray-100 border rounded-lg"></div>
            <div className="h-16 bg-gray-100 border rounded-lg"></div>
          </div>
          {/* Recommended Courses Shimmer */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <div className="h-6 bg-gray-200 rounded w-2/5"></div>
            <div className="h-16 bg-yellow-50 border rounded-lg"></div>
            <div className="h-16 bg-yellow-50 border rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ----------------------------------------------------------------------
// Main Profile Component
// ----------------------------------------------------------------------

// Helper function to get initials for placeholder avatar
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

const ProfilePage = () => {
  // Destructure `logout` function from useAuth
  const {
    currentUser,
    userProfile,
    logout,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();
  // Access enrollment data from useUser context
  const { enrollments, loadingEnrollments, enrollmentsError } = useUser();

  // Using loadingEnrollments as the primary data loading state

  // ✅ Define editProfile function
  const editProfile = useCallback(() => {
    navigate("/profile/edit");
  }, [navigate]);

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Profile", link: "/profile" },
  ];

  // 🚨 FIX: Define handleLogout function 🚨
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/auth/signin", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  }, [logout, navigate]);

  // (Previously recommended courses were set here; removed as they were unused)

  // Placeholder for profile details
  const profileData = {
    fullName: userProfile?.name || currentUser?.displayName || "N/A",
    email: currentUser?.email || "N/A",
    phone: userProfile?.phone || "N/A",
    college: userProfile?.college || "JNTU-GV Student",
    gender: userProfile?.gender || "Not Specified",
    skills:
      userProfile?.skills && Array.isArray(userProfile.skills)
        ? userProfile.skills
        : ["AI", "ML Basics", "Python"],
    photoUrl: currentUser?.photoURL,
    initials: getInitials(userProfile?.name || currentUser?.displayName),
  };

  // Show loading or redirect if not authenticated
  if (!isAuthenticated && !authLoading) {
    return <Navigate to="/auth/signin" replace />;
  }

  // Use Shimmer when authentication state or enrollment data is loading
  if (authLoading || loadingEnrollments) {
    return <Shimmer />;
  }

  // Combine any data errors
  const combinedError = enrollmentsError;

  return (
    <PageContainer className="min-h-screen pb-4" items={breadcrumbItems}>
      {/* Error Message Banner */}
      {combinedError && (
        <div
          className="p-4 mb-8 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center gap-3"
          role="alert"
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium">{combinedError}</p>
        </div>
      )}

      {/* Header & Avatar Section */}
      <div
        className="p-8 rounded-2xl shadow-xl border-t-4 card"
        style={{ borderColor: PRIMARY_BLUE }}
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Picture */}
          {profileData.photoUrl ? (
            <img
              src={profileData.photoUrl}
              alt={profileData.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white text-4xl flex items-center justify-center font-bold">
              {profileData.initials}
            </div>
          )}

          {/* Title and Summary */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-semibold text-gray-800">
              {profileData.fullName}
            </h1>
            <p className="text-sm text-muted mt-1 flex items-center justify-center md:justify-start gap-1">
              <Mail className="w-4 h-4" />
              {profileData.email}
            </p>
            <p className="text-sm text-muted mt-1 flex items-center justify-center md:justify-start gap-1">
              <School className="w-4 h-4" /> {profileData.college}
            </p>
          </div>

          {/* Action Buttons Container */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Profile Edit button */}
            <button
              onClick={editProfile}
              className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-full font-medium hover:opacity-90 transition"
              style={{ background: "#dc2626" }}
            >
              <PencilLine className="w-5 h-5" /> Edit Profile
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-full font-medium hover:opacity-90 transition"
              style={{ background: "#6b7280" }}
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Details & Courses */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: User Details and Skills */}
        <div className="lg:col-span-1 space-y-6">
          {/* Skills Section */}
          <div className="p-6 rounded-xl shadow-md card">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
              Current Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ background: "#e0f2fe", color: "#0369a1" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Enrolled & Recommended Courses */}
        <div className="lg:col-span-2 space-y-8">
          {/* Enrolled Courses */}
          <div className="p-6 rounded-xl shadow-md card">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6" style={{ color: PRIMARY_BLUE }} />
              Enrolled Courses ({enrollments.length})
            </h2>

            {enrollments.length > 0 ? (
              <ul className="space-y-4">
                {enrollments.map((course, index) => (
                  <li
                    key={index}
                    className="p-4 rounded-lg flex justify-between items-center"
                    style={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <span className="font-semibold text-lg">
                      {course.courseTitle}
                    </span>
                    <button
                      onClick={() => navigate(`/learn/${course.courseId}`)}
                      className="px-4 py-1 text-white rounded-full text-sm hover:opacity-90 transition"
                      style={{ background: "var(--color-success)" }}
                    >
                      Go to Course
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                className="text-center py-6 border-2 border-dashed rounded-lg"
                style={{ borderColor: "var(--color-border)" }}
              >
                <p className="text-muted">
                  You are not currently enrolled in any courses. Time to start
                  learning!
                </p>
                <button
                  onClick={() => navigate("/courses")}
                  className="mt-3 px-4 py-2 text-white rounded-full text-sm hover:opacity-90 transition"
                  style={{ background: "var(--color-primary)" }}
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;

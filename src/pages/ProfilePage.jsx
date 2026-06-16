/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  School,
  Mail,
  LogOut,
  BookOpen,
  UserCircle,
  PencilLine,
  AlertTriangle,
  Phone,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  Share2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { global_classnames } from "../utils/classnames.js";
import PageContainer from "../components/layout/PageContainer.jsx";
import CertificateTemplate from "../components/Certificate/CertificateTemplate.jsx";
import { getCleanEnrollmentData } from "../utils/helper/enrollmentHelpers.jsx";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { apiRequest } from "../api/client.js";

const PRIMARY_BLUE = "var(--color-primary)";

// Shimmer Loading Component
const Shimmer = () => (
  <div className="animate-pulse space-y-8 py-16">
    <div
      className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}
    >
      {/* Header Shimmer */}
      <div className="bg-surface p-8 rounded-2xl shadow-xl flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-surface-elevated"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-surface-elevated rounded w-3/4"></div>
          <div className="h-4 bg-surface-elevated rounded w-1/2"></div>
          <div className="h-4 bg-surface-elevated rounded w-2/5"></div>
        </div>
        <div className="h-10 w-32 bg-gray-300 rounded-full"></div>
      </div>

      {/* Content Shimmer */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column Shimmer (Skills) */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-xl shadow-md space-y-4">
            <div className="h-6 bg-surface-elevated rounded w-1/3"></div>
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
          <div className="bg-surface p-6 rounded-xl shadow-md space-y-4">
            <div className="h-6 bg-surface-elevated rounded w-2/5"></div>
            <div className="h-16 bg-surface-elevated border rounded-lg"></div>
            <div className="h-16 bg-surface-elevated border rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Helper function to get initials for placeholder avatar
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.split(" ").filter(part => part.trim() !== "");
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

const ProfilePage = () => {
  const {
    currentUser,
    userProfile,
    logout,
    loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();
  const { enrollments, loadingEnrollments, enrollmentsError } = useUser();

  // State for inline certificate PDF generation
  const certificateRenderRef = useRef(null);
  const [certificatePreviewData, setCertificatePreviewData] = useState(null);
  const [generatingCertificateId, setGeneratingCertificateId] = useState(null);

  // New state for API certifications
  const [apiCertifications, setApiCertifications] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(false);

  useEffect(() => {
    const fetchCertifications = async () => {
      if (!currentUser) return;
      try {
        setLoadingCerts(true);
        const data = await apiRequest('/certifications');
        setApiCertifications(data || []);
      } catch (error) {
        console.error("Failed to fetch certifications", error);
      } finally {
        setLoadingCerts(false);
      }
    };
    fetchCertifications();
  }, [currentUser]);

  const editProfile = useCallback(() => {
    navigate("/profile/edit");
  }, [navigate]);

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Profile", link: "/profile" },
  ];

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/auth/signin", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  }, [logout, navigate]);

  const normalizedEnrollments = useMemo(
    () => (enrollments || []).map((enrollment) => getCleanEnrollmentData(enrollment)),
    [enrollments]
  );

  const certificationData = useMemo(() => {
    const fallbackId = currentUser?.uid?.substring(0, 8) || "STUDENT";

    return normalizedEnrollments.map((enrollment) => {
      const courseTitle = enrollment.course?.title || enrollment.courseTitle || "Course";
      const enrolledDate = enrollment.enrolledAt || new Date().toISOString();
      const progress = enrollment.progress || {
        totalVideos: 0,
        completedVideos: 0,
        completionPercentage: 0,
      };

      // Find matching API certification
      const apiCert = (apiCertifications || []).find(c => c.courseId === enrollment.courseId || c.enrollmentId === enrollment.id);

      const taskProgress = enrollment.taskProgress || {
        totalTasks: 0,
        completedTasks: 0,
        completionPercentage: 0,
        validated: false,
      };

      const totalLessons = progress.totalVideos || 0;
      const completedLessons = progress.completedVideos || 0;
      const hasTasks = taskProgress.totalTasks > 0;

      // Calculate video completion accurately
      // Use explicit completionPercentage from backend if available and reliable
      const videoPercent = Number.isFinite(progress.completionPercentage)
        ? progress.completionPercentage
        : (totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0);

      const meetsVideoRequirement = videoPercent >= 100 || (totalLessons > 0 && completedLessons >= totalLessons);

      const meetsTaskRequirement = hasTasks
        ? Boolean(taskProgress.validated) && (taskProgress.completionPercentage ?? 0) >= 90
        : true;

      // Determine status from API Cert or fallback to enrollment logic
      // If we have a backend cert record, use its status
      const isIssued = apiCert?.status === 'ISSUED';
      const isPending = apiCert?.status === 'PENDING';

      // If enrollment says downloadable (set by backend on 100%), trust it.
      // Also, if video progress is 100% locally, we should allow download for self-paced courses.
      // The user has completed the course content and deserves immediate access to their certificate.
      const certificateUnlocked = isIssued || Boolean(enrollment.certificateDownloadable) || meetsVideoRequirement;

      const requirementBreakdown = [
        {
          key: "video",
          label: "Complete all course videos",
          detail: totalLessons > 0
            ? `${completedLessons} of ${totalLessons} videos`
            : "No video content",
          satisfied: meetsVideoRequirement,
        },
        {
          key: "tasks",
          label: "Admin validated project tasks",
          detail: hasTasks
            ? `${taskProgress.completedTasks} of ${taskProgress.totalTasks} tasks`
            : "No tasks assigned",
          satisfied: meetsTaskRequirement || isIssued,
          pending: isPending || (hasTasks
            ? !taskProgress.validated && taskProgress.completedTasks >= taskProgress.totalTasks
            : false),
        },
      ];

      return {
        enrollmentId: enrollment.id,
        courseId: enrollment.courseId,
        courseTitle,
        enrolledDate,
        completionDate: apiCert?.issuedAt || enrollment.certificateUnlockedAt || null,
        completedDate: apiCert?.issuedAt || enrollment.certificateUnlockedAt || null,
        progressPercent: Math.min(100, Math.max(0, Math.round(videoPercent))),
        totalLessons,
        completedLessons,
        certificateUnlocked,
        certificateDownloadable: certificateUnlocked,
        certificateIssued: isIssued,
        certificatePending: isPending,
        certificateId: apiCert?.id || (enrollment.certificateUrl
          ? `CERT-${enrollment.courseId}`
          : `CERT-${enrollment.courseId}-${fallbackId}`),
        certificateUrl: apiCert?.certificateUrl || enrollment.certificateUrl || null,
        requirements: requirementBreakdown,
        meetsVideoRequirement,
        meetsTaskRequirement,
        taskProgress,
        progress,
        apiCert // attach raw
      };
    });
  }, [currentUser?.uid, normalizedEnrollments, apiCertifications]);

  // Profile data
  const profileData = {
    fullName: userProfile?.name || currentUser?.username || "N/A",
    email: currentUser?.email || "N/A",
    phone: userProfile?.phone || "N/A",
    college: userProfile?.college || "",
    gender: userProfile?.gender || "Not Specified",
    skills: userProfile?.skills && Array.isArray(userProfile.skills) ? userProfile.skills : [],
    bio: userProfile?.bio || "",
    socialLinks: userProfile?.socialLinks || {},
    dateOfBirth: userProfile?.dateOfBirth || null,
    studentId: currentUser?.uid?.substring(0, 8) || "N/A",
    initials: getInitials(userProfile?.name || currentUser?.username),
  };

  const buildCertificateTemplateData = useCallback((certification) => {
    if (!certification) {
      return null;
    }

    const issueDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const completionSource =
      certification.apiCert?.issuedAt ||
      certification.completedDate ||
      certification.completionDate ||
      certification.certificateUnlockedAt ||
      new Date().toISOString();

    const completionDate = new Date(completionSource).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    return {
      studentName: profileData.fullName,
      courseTitle: certification.courseTitle,
      certificateId: certification.certificateId,
      issueDate,
      completionDate,
      institution: "Aikya I/O",
      instructor: "Aikya I/O Instructor",
      duration: "Self-paced",
      grade: "Excellent",
      mode: "Online",
    };
  }, [profileData.fullName]);

  const handleDownloadCertificate = useCallback((certification) => {
    if (!certification?.certificateUnlocked || generatingCertificateId) {
      return;
    }

    const templateData = buildCertificateTemplateData(certification);
    if (!templateData) {
      return;
    }

    setCertificatePreviewData({ certification, templateData });
    setGeneratingCertificateId(certification.certificateId);
  }, [buildCertificateTemplateData, generatingCertificateId]);

  const handleShareCertificate = useCallback((platform, certification) => {
    if (!certification?.certificateUnlocked || typeof window === "undefined") {
      return;
    }

    const baseUrl = window.location.origin;
    const verifyUrl = `${baseUrl}/verify/${certification.certificateId}`;
    const shareUrl = certification.certificateUrl || verifyUrl;

    const studentName = profileData.fullName || "a student";
    const courseTitle = certification.courseTitle || "a course";
    const certId = certification.certificateId || "";
    const shortCertId = certId.length > 8 ? certId.substring(0, 8) : certId;

    let targetUrl = "";

    if (platform === "x") {
      // Preset message for X (Twitter) - optimized for character limits
      const xMessage = `🎓 Excited to share that I've completed "${courseTitle}" via @AikyaIO!\n\n📜 Certificate ID: ${shortCertId}\n\n#AikyaIO #Certification #Learning #Achievement`;
      targetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xMessage)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === "linkedin") {
      // LinkedIn sharing - using their newer share API
      // LinkedIn's sharing popup works best with just URL, they auto-generate preview
      const linkedInText = `I'm excited to share that I, ${studentName}, have successfully completed the course "${courseTitle}" via Aikya I/O!\n\nThis certification demonstrates my commitment to continuous learning and professional development.\n\n🎓 Certificate ID: ${shortCertId}\n\nVerify my achievement: ${shareUrl}\n\n#ProfessionalDevelopment #AikyaIO #Certification #LifelongLearning #Education`;

      // LinkedIn uses different parameters - we'll use shareArticle for the best experience
      targetUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`🎓 Completed: ${courseTitle}`)}&summary=${encodeURIComponent(linkedInText)}&source=${encodeURIComponent('Aikya I/O')}`;
    } else if (platform === "copy") {
      // Copy link to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Certificate link copied to clipboard!");
      }).catch(() => {
        alert("Failed to copy link. Please try again.");
      });
      return;
    }

    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer,width=600,height=600");
    }
  }, [profileData.fullName]);

  useEffect(() => {
    if (!certificatePreviewData || !certificateRenderRef.current) {
      return;
    }

    let cancelled = false;

    const renderPdf = async () => {
      try {
        // Wait for React to render the component
        await new Promise((resolve) => requestAnimationFrame(() => resolve()));
        // Give additional time for styles and layout to settle
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (!certificateRenderRef.current || cancelled) {
          return;
        }

        const canvas = await html2canvas(certificateRenderRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          allowTaint: false,
          removeContainer: false,
        });

        if (cancelled) {
          return;
        }

        const imageData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imageData, "PNG", 0, 0, pageWidth, pageHeight);

        const fileIdentifier =
          certificatePreviewData.certification?.certificateId ||
          certificatePreviewData.certification?.courseId ||
          "certificate";

        pdf.save(`${fileIdentifier}.pdf`);
      } catch (error) {
        console.error("Failed to generate certificate PDF", error);
        alert("Unable to generate the certificate PDF. Please try again.");
      } finally {
        if (!cancelled) {
          setCertificatePreviewData(null);
          setGeneratingCertificateId(null);
        }
      }
    };

    renderPdf();

    return () => {
      cancelled = true;
    };
  }, [certificatePreviewData]);

  // Format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) { return 'N/A'; }
  };

  // Calculate progress percentage
  const getProgressPercentage = (certification) => {
    return Math.min(100, Math.max(0, certification.progressPercent || 0));
  };

  if (authLoading || loadingEnrollments) {
    return <Shimmer />;
  }

  if (!currentUser) {
    return <Navigate to="/auth/signin" replace />;
  }

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
          {/* Profile Picture - Only Initials */}
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-3xl">
            {profileData.initials}
          </div>

          {/* Title and Summary */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-semibold text-foreground">
              {profileData.fullName}
            </h1>
            <p className="text-sm text-muted mt-1 flex items-center justify-center md:justify-start gap-1">
              <Mail className="w-4 h-4" />
              {profileData.email}
            </p>
            <p className="text-sm text-muted mt-1 flex items-center justify-center md:justify-start gap-1">
              <School className="w-4 h-4" /> {profileData.college || "Not specified"}
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
          {/* Profile Details Card */}
          <div className="p-6 rounded-xl shadow-md card">
            <h2 className="text-xl font-bold text-foreground border-b pb-3 mb-4">Profile Details</h2>
            <div className="space-y-3 text-sm text-muted">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted" />
                <span className="font-medium">{profileData.phone || "N/A"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted" />
                <span>{profileData.dateOfBirth ? formatDate(profileData.dateOfBirth) : "Date of birth not set"}</span>
              </div>

              <div className="flex items-center gap-2">
                <UserCircle className="w-4 h-4 text-muted" />
                <span>{profileData.gender}</span>
              </div>

              {profileData.bio ? (
                <div>
                  <h3 className="mt-2 text-sm font-semibold">About</h3>
                  <p className="text-sm text-muted">{profileData.bio}</p>
                </div>
              ) : null}

              {/* <div className="mt-2 flex items-center gap-3">
                {profileData.socialLinks?.linkedin && (
                  <a href={profileData.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}

                {profileData.socialLinks?.github && (
                  <a href={profileData.socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-foreground hover:underline">
                    <Code className="w-4 h-4" /> GitHub
                  </a>
                )}
              </div> */}
            </div>
          </div>

          {/* Skills Section */}
          <div className="p-6 rounded-xl shadow-md card">
            <h2 className="text-xl font-bold text-foreground border-b pb-3 mb-4">Current Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profileData.skills && profileData.skills.length > 0 ? (
                profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted">No skills added</span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Enrolled Courses & Certifications */}
        <div className="lg:col-span-2 space-y-8">
          {/* Enrolled Courses */}
          <div className="p-6 rounded-xl shadow-md card">
            <h2 className="text-2xl font-bold text-foreground border-b pb-3 mb-4 flex items-center gap-3">
              <BookOpen className="w-6 h-6" style={{ color: "var(--theme-primary)" }} />
              <span>Enrolled Courses</span>
              <span className="ml-2 inline-flex items-center justify-center px-3 py-1 rounded-full bg-surface-elevated text-sm font-medium text-muted">
                {loadingEnrollments ? '...' : (enrollments?.length || 0)}
              </span>
            </h2>

            {enrollments && enrollments.length > 0 ? (
              <ul className="space-y-4">
                {(enrollments || []).map((course, index) => (
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
                style={{ borderColor: "var(--theme-border)" }}
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

          {/* Certifications Section */}
          <div className="p-6 rounded-xl shadow-md card">
            <h2 className="text-2xl font-bold text-foreground border-b pb-3 mb-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6" style={{ color: "var(--theme-primary)" }} />
              <span>My Certifications</span>
              <span className="ml-2 inline-flex items-center justify-center px-3 py-1 rounded-full bg-surface-elevated text-sm font-medium text-muted">
                {certificationData.filter(cert => cert.certificateUnlocked || cert.certificatePending).length}
              </span>
            </h2>

            {certificationData && certificationData.length > 0 ? (
              <div className="space-y-4">
                {(certificationData || []).map((certification, index) => {
                  const isGeneratingThisCertificate =
                    generatingCertificateId === certification.certificateId;

                  return (
                    <div
                      key={index}
                      className="p-4 rounded-lg border"
                      style={{
                        background: "var(--color-card)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-foreground">
                            {certification.courseTitle}
                          </h3>
                          <p className="text-sm text-muted mt-1">
                            Enrolled on {formatDate(certification.enrolledDate)}
                          </p>

                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="flex justify-between text-sm text-muted mb-1">
                              <span>Progress</span>
                              <span>{getProgressPercentage(certification)}%</span>
                            </div>
                            <div className="w-full bg-surface-elevated rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getProgressPercentage(certification)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-muted mt-1">
                              {certification.completedLessons} of {certification.totalLessons} lessons completed
                            </p>
                          </div>
                        </div>

                        <div className="ml-4 flex flex-col items-center gap-2 w-full max-w-[180px]">
                          {certification.certificateUnlocked ? (
                            <>
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">Completed</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDownloadCertificate(certification)}
                                disabled={isGeneratingThisCertificate}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition-colors ${isGeneratingThisCertificate
                                  ? "bg-blue-400 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700"
                                  }`}
                              >
                                <Download className="w-4 h-4" />
                                {isGeneratingThisCertificate ? "Preparing..." : "Download PDF"}
                              </button>
                              <div className="flex flex-col gap-2 w-full">
                                <button
                                  type="button"
                                  onClick={() => handleShareCertificate("x", certification)}
                                  className="flex items-center justify-center gap-2 px-3 py-2 bg-background text-white rounded-lg text-sm hover:bg-surface-elevated transition-colors"
                                >
                                  <Share2 className="w-4 h-4" />
                                  Share on X
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleShareCertificate("linkedin", certification)}
                                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition-colors"
                                >
                                  <Linkedin className="w-4 h-4" />
                                  Share on LinkedIn
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleShareCertificate("copy", certification)}
                                  className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-muted hover:bg-surface-elevated transition-colors"
                                >
                                  📋 Copy Link
                                </button>
                              </div>
                              <p className="text-xs text-muted text-center">
                                ID: {certification.certificateId && certification.certificateId.length > 8 ? certification.certificateId.substring(0, 8) + '...' : certification.certificateId}
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-1 text-yellow-600">
                                <Clock className="w-5 h-5" />
                                <span className="text-sm font-medium">{certification.certificatePending ? 'Pending Review' : 'In Progress'}</span>
                              </div>
                              <button
                                type="button"
                                disabled
                                className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed text-sm"
                              >
                                {certification.certificatePending ? <Clock className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                                {certification.certificatePending ? 'Awaiting Review' : 'Complete Course'}
                              </button>
                              <div className="text-xs text-muted text-left space-y-1">
                                {(certification.requirements || []).map((req) => (
                                  <p key={req.key}>
                                    {req.satisfied ? '[x]' : '[ ]'} {req.label}
                                    {!req.satisfied && req.pending ? ' (awaiting review)' : ''}
                                  </p>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {!certification.certificateUnlocked && (
                        <div className="mt-3 pt-3 border-t text-xs text-muted">
                          <p className="font-medium mb-1">Requirements:</p>
                          <ul className="space-y-1">
                            {(certification.requirements || []).map((req) => (
                              <li key={req.key} className="flex items-start gap-2">
                                {req.satisfied ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-[2px]" />
                                ) : (
                                  <Clock className="w-4 h-4 text-yellow-500 mt-[2px]" />
                                )}
                                <span>
                                  <span className="font-medium">{req.label}</span>
                                  <span className="block text-muted">{req.detail}</span>
                                  {!req.satisfied && req.pending && (
                                    <span className="block text-orange-600">Awaiting admin validation</span>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="text-center py-6 border-2 border-dashed rounded-lg"
                style={{ borderColor: "var(--theme-border)" }}
              >
                <CheckCircle className="w-12 h-12 text-muted mx-auto mb-3" />
                <p className="text-muted mb-2">
                  No certifications yet
                </p>
                <p className="text-sm text-muted mb-4">
                  Complete your enrolled courses to earn certifications
                </p>
                <button
                  onClick={() => navigate("/courses")}
                  className="px-4 py-2 text-white rounded-full text-sm hover:opacity-90 transition"
                  style={{ background: "var(--color-primary)" }}
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden certificate rendering surface for PDF generation */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", top: "-9999px", left: "-9999px", zIndex: -1 }}
      >
        {certificatePreviewData ? (
          <div
            ref={certificateRenderRef}
            style={{
              width: "800px",
              height: "600px",
              backgroundColor: "#ffffff",
            }}
          >
            <CertificateTemplate {...certificatePreviewData.templateData} />
          </div>
        ) : null}
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
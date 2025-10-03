
export const FALLBACK_V2 = {
    users: [
        {
            uid: "1322242424",
            name: "Tarun Bommali",
            email: "btaruntej143@gmail.com",
            role: "admin",
            university: "Jntugv",
            skills: ["html", "react", "quantum", "AI/ML Basics"],
            totalCoursesEnrolled: 1,
            lastLoginAt: "2025-10-02T10:00:00Z",
            mobileNo: "9581193026"
        },
        {
            uid: "user-456789",
            name: "Deepika Reddy",
            email: "deepika@student.com",
            role: "user",
            university: "Andhra University",
            skills: ["Python", "Data Analysis"],
            totalCoursesEnrolled: 1,
            lastLoginAt: "2025-10-01T15:30:00Z"
        }
    ],
    courses: [
        {
            courseId: "emerging-tech-2025",
            courseTitle: "Emerging Technologies",
            courseDescription: "Comprehensive overview of AI, ML, IoT, Cybersecurity, and Quantum Computing.",
            originalPrice: 14999.0,
            platformDiscount: 5000.0,
            coursePrice: 9999.0,
            isPublished: true,
            modules: [
                {
                    moduleKey: "AI_M01",
                    moduleTitle: "Artificial Intelligence Fundamentals",
                    moduleVideoCount: 3,
                    videos: [
                        { videoId: "AI_V1", title: "Introduction to AI and its applications", videoKey: "bA9dF2xS", duration_min: 25 },
                        { videoId: "AI_V2", title: "Machine Learning algorithms overview", videoKey: "cK5yG8hW", duration_min: 35 }
                    ]
                },
                {
                    moduleKey: "CYBER_M04",
                    moduleTitle: "Cybersecurity & Defense Strategies",
                    moduleVideoCount: 2,
                    videos: [
                        { videoId: "CYB_V1", title: "Network Security Fundamentals", videoKey: "gZ3hL7pQ", duration_min: 45 }
                    ]
                }
            ]
        }
    ],
    enrollments: [
        {
            enrollmentId: "ENR-1A2B3C",
            userId: "1322242424",
            courseId: "emerging-tech-2025",
            courseTitle: "Emerging Technologies",
            status: "SUCCESS",
            paidAmount: 9999.0,
            enrolledAt: "2025-07-10T09:00:00Z",
            paymentDetails: {
                paymentId: "rzp_0987654321",
                paymentDate: "2025-07-10T09:00:00Z",
                paymentStatus: "Success"
            },
            progress: {
                completionPercentage: 50,
                modulesCompleted: 1,
                lastAccessedAt: "2025-10-02T10:00:00Z"
            }
        }
    ],
    user_progress: [
        {
            userCourseKey: "1322242424_emerging-tech-2025",
            userId: "1322242424",
            courseId: "emerging-tech-2025",
            completionPercentage: 50,
            videosWatched: [
                { videoId: "AI_V1", completed: true, progress: 100 },
                { videoId: "AI_V2", completed: false, progress: 50 }
            ],
            lastAccessedAt: "2025-10-02T10:00:00Z"
        }
    ],
    certifications: [
        {
            certificateId: "CERT-XYZ-999",
            userId: "user-456789",
            courseId: "emerging-tech-2025",
            courseTitle: "Emerging Technologies",
            dateGenerated: "2025-12-15T12:00:00Z",
            isVerified: true
        }
    ]
};

// Normalized UI-friendly courses from V2 fallback
export const fallbackCoursesV2Mapped = FALLBACK_V2.courses.map((c) => ({
    id: c.courseId,
    title: c.courseTitle,
    price: c.coursePrice,
    originalPrice: c.originalPrice,
    isPublished: c.isPublished,
    modules: Array.isArray(c.modules)
        ? c.modules.map((m, idx) => ({
            id: m.moduleKey || `M${idx + 1}`,
            title: m.moduleTitle || m.title || `Module ${idx + 1}`,
            videos: Array.isArray(m.videos)
                ? m.videos.map((v, vIdx) => ({ id: v.videoId || `V${vIdx + 1}`, title: v.title, url: v.videoKey }))
                : []
        }))
        : []
}));

// Legacy export names used across the app
export const courses = fallbackCoursesV2Mapped;

// Learn page fallback modules built from V2 data
export const EMERGING_TECH_COURSE_CONTENT = (FALLBACK_V2.courses[0]?.modules || []).map((m, idx) => ({
    id: m.moduleKey || `M${idx + 1}`,
    order: idx + 1,
    title: m.moduleTitle || m.title || `Module ${idx + 1}`,
    description: FALLBACK_V2.courses[0]?.courseDescription || '',
    duration: m.moduleVideoCount ? m.moduleVideoCount * 30 : undefined,
    videos: (m.videos || []).map((v, vIdx) => ({
        id: v.videoId || `V${vIdx + 1}`,
        title: v.title,
        url: v.videoKey,
        duration: v.duration_min || undefined,
    })),
}));

export const FALLBACK_COURSE_ID = 'emerging-tech-2025';

export const FALLBACK_ENROLLMENT_STATUS = {
    isEnrolled: true,
    enrollment: {
        courseTitle: FALLBACK_V2.courses[0]?.courseTitle || 'Course',
        courseId: FALLBACK_COURSE_ID,
    },
    loading: false,
    error: null,
};

export const FALLBACK_ENROLLMENT = FALLBACK_ENROLLMENT_STATUS;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, School, Mail, Phone, BookOpen, Edit, Shield, TrendingUp, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { global_classnames } from "../utils/classnames.js";

const PRIMARY_BLUE = "#004080";
const ACCENT_YELLOW = "#ffc107";

// Helper function to get initials for placeholder avatar (copied from Header)
const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
};

const ProfilePage = () => {
    const { currentUser, userProfile, logout, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Local State for Enrolled Courses and Data Fetching
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    // Placeholder: Fetch Enrolled and Recommended Courses
    useEffect(() => {
        if (!isAuthenticated || !currentUser) {
            setDataLoading(false);
            return;
        }

        const fetchProfileData = async () => {
            try {
                setDataLoading(true);

                // 1. Fetch Enrolled Courses
                // Queries the 'enrollments' collection for SUCCESS status enrollments belonging to the user
                const enrollmentQuery = query(
                    collection(db, 'enrollments'),
                    where('userId', '==', currentUser.uid),
                    where('status', '==', 'SUCCESS')
                );
                const enrollmentSnap = await getDocs(enrollmentQuery);
                const enrolled = enrollmentSnap.docs.map(doc => ({ 
                    id: doc.id, 
                    ...doc.data(), 
                    // Simulate fetching course details to display title
                    courseTitle: doc.data().courseTitle || "Emerging Technologies" 
                }));
                setEnrolledCourses(enrolled);

                // 2. Simulate Recommended Courses
                setRecommendedCourses([
                    { id: 'sec-cert', title: 'Advanced Cybersecurity', difficulty: 'Expert', icon: Shield },
                    { id: 'quantum-intro', title: 'Introduction to Quantum Computing', difficulty: 'Beginner', icon: TrendingUp },
                ]);

            } catch (error) {
                console.error("Error fetching user data:", error);
                // Fallback to empty state
                setEnrolledCourses([]);
            } finally {
                setDataLoading(false);
            }
        };

        fetchProfileData();
    }, [isAuthenticated, currentUser]);


    // Placeholder for profile details
    const profileData = {
        fullName: userProfile?.name || currentUser?.displayName || 'N/A',
        email: currentUser?.email || 'N/A',
        phone: userProfile?.phone || 'N/A',
        college: userProfile?.college || 'JNTU-GV Student',
        gender: userProfile?.gender || 'Not Specified',
        skills: userProfile?.skills || ['AI', 'ML Basics', 'Python'],
        photoUrl: currentUser?.photoURL,
        initials: getInitials(userProfile?.name || currentUser?.displayName),
    };
    
    // Show loading or redirect if not authenticated
    if (authLoading || dataLoading) {
        return <div className="p-10 text-center text-xl font-medium">Loading user dashboard...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/signin" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}>
                
                {/* Header & Avatar Section */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4" style={{ borderColor: PRIMARY_BLUE }}>
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
                            <h1 className="text-3xl font-extrabold text-gray-900">{profileData.fullName}</h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-1"><Mail className="w-4 h-4" />{profileData.email}</p>
                            <p className="text-sm text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-1">
                                <School className="w-4 h-4" /> {profileData.college}
                            </p>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={logout}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-full font-medium hover:bg-red-700 transition"
                        >
                            <Edit className="w-5 h-5" /> Edit
                        </button>
                    </div>
                </div>

                {/* Main Content: Details & Courses */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: User Details and Skills */}
                    <div className="lg:col-span-1 space-y-6">
                        

                        {/* Skills Section */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Current Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {profileData.skills.map((skill, index) => (
                                    <span 
                                        key={index} 
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
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
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
                                <BookOpen className="w-6 h-6" style={{ color: PRIMARY_BLUE }} /> 
                                Enrolled Courses ({enrolledCourses.length})
                            </h2>

                            {enrolledCourses.length > 0 ? (
                                <ul className="space-y-4">
                                    {enrolledCourses.map((course, index) => (
                                        <li 
                                            key={index} 
                                            className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center"
                                        >
                                            <span className="font-semibold text-lg">{course.courseTitle}</span>
                                            <button
                                                onClick={() => navigate(`/learn/${course.courseId}`)}
                                                className="px-4 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition"
                                            >
                                                Go to Course
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-gray-600">You are not currently enrolled in any courses. Time to start learning!</p>
                                    <button 
                                        onClick={() => navigate('/courses')}
                                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition"
                                    >
                                        Browse Courses
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Recommended Courses */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Recommended Courses</h2>
                            <ul className="space-y-4">
                                {recommendedCourses.map((course, index) => {
                                    const Icon = course.icon;
                                    return (
                                        <li key={index} className="p-4 border rounded-lg bg-yellow-50 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-5 h-5 text-yellow-700" />
                                                <span className="font-medium text-gray-800">{course.title}</span>
                                            </div>
                                            <span className="text-sm text-yellow-800 font-medium">{course.difficulty}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
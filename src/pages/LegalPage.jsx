/* eslint-disable no-unused-vars */
// src/pages/CourseContent.jsx

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLearnPage } from '../contexts/LearnPageContext.jsx';
import VideoPlayer from '../components/Course/VideoPlayer.jsx';
import CourseContentShimmer from '../components/Course/CourseContentShimmer.jsx';
import { global_classnames } from "../utils/classnames.js";
import { Shield, BookOpen, PlayCircle, List, ArrowRight, Clock, CheckCircle, Lock, AlertTriangle, Eye } from 'lucide-react';

const PRIMARY_BLUE = "#004080";

const dummyData = {
  id: "emerging-technologies-2024",
  title: "Emerging Technologies",
  description: "Master cutting-edge technologies shaping the future including AI, Blockchain, IoT, and Quantum Computing. Gain hands-on experience with real-world projects and industry applications.",
  courseDescription: "Comprehensive course covering the latest technological advancements and their practical implementations across various industries.",
  
  modules: [
    {
      id: "intro-emerging-tech",
      title: "Introduction to Emerging Technologies",
      description: "Get introduced to the world of emerging technologies and understand their impact on various industries.",
      duration: "45",
      objectives: [
        "Understand what constitutes emerging technologies",
        "Learn about technology adoption lifecycle",
        "Identify future technology trends"
      ],
      videos: [
        { 
          id: "video-1", 
          title: "What are Emerging Technologies?", 
          duration: "15:30",
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          description: "Introduction to emerging technologies and their characteristics"
        }
      ]
    },
    {
      id: "artificial-intelligence",
      title: "Artificial Intelligence & Machine Learning",
      description: "Dive into the world of AI and machine learning, understanding algorithms and practical applications.",
      duration: "120",
      objectives: [
        "Understand AI fundamentals",
        "Learn machine learning algorithms",
        "Explore deep learning concepts"
      ],
      videos: [
        { 
          id: "video-2", 
          title: "AI Fundamentals", 
          duration: "25:15",
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          description: "Basic concepts of artificial intelligence"
        }
      ]
    },
    {
      id: "blockchain-web3",
      title: "Blockchain & Web3 Technologies",
      description: "Explore blockchain technology, smart contracts, and the Web3 ecosystem.",
      duration: "95",
      objectives: [
        "Understand blockchain fundamentals",
        "Learn about smart contracts",
        "Explore Web3 applications"
      ],
      videos: [
        { 
          id: "video-3", 
          title: "Blockchain Fundamentals", 
          duration: "20:15",
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          description: "Introduction to blockchain technology"
        }
      ]
    }
  ]
};

const LearnPage = () => {
    const { courseId } = useParams();
    const { currentUser, isAuthenticated } = useAuth();
    const {
        courseContent,
        currentModule,
        enrollmentStatus,
        loadingContent,
        contentError,
        fetchCourseContent,
        setCurrentModule,
        markVideoWatched,
        markModuleCompleted,
        getModuleProgress,
        isModuleUnlocked,
        completionPercentage,
        timeSpent
    } = useLearnPage();

    const [usingDummyData, setUsingDummyData] = useState(false);
    const [dummyEnrollmentStatus, setDummyEnrollmentStatus] = useState({ isEnrolled: false });

    // 1. Initialize course content and enrollment check
    useEffect(() => {
        if (isAuthenticated && currentUser && courseId) {
            fetchCourseContent(courseId);
        }
    }, [isAuthenticated, currentUser, courseId, fetchCourseContent]);

    // Check if we need to use dummy data
    useEffect(() => {
        if (!loadingContent && (contentError || courseContent.length === 0)) {
            setUsingDummyData(true);
            // For demo purposes, auto-enroll in dummy course
            setDummyEnrollmentStatus({ isEnrolled: true });
        } else {
            setUsingDummyData(false);
        }
    }, [loadingContent, contentError, courseContent]);

    // Use real data or dummy data
    const displayCourseContent = usingDummyData ? dummyData.modules : courseContent;
    const displayCurrentModule = usingDummyData ? 
        (currentModule || dummyData.modules[0]) : currentModule;

    // Memoize active video data for the player
    const activeVideoData = displayCurrentModule?.videos?.[0] || null;

    // Handle video progress updates
    const handleVideoProgress = useCallback(async (progressData) => {
        if (!activeVideoData || !displayCurrentModule || !courseId) return;
        
        if (progressData.percentage >= 80 && !usingDummyData) {
            await markVideoWatched(
                courseId,
                displayCurrentModule.id,
                activeVideoData.id,
                progressData.currentTime,
                progressData.duration
            );
        }
    }, [displayCurrentModule, courseId, activeVideoData, markVideoWatched, usingDummyData]);

    // Handle video completion
    const handleVideoComplete = useCallback(async () => {
        if (!displayCurrentModule || !courseId || usingDummyData) return;
        await markModuleCompleted(courseId, displayCurrentModule.id);
    }, [displayCurrentModule, courseId, markModuleCompleted, usingDummyData]);

    // Handle module selection for dummy data
    const handleDummyModuleSelect = (module) => {
        if (usingDummyData) {
            setCurrentModule(module);
        }
    };

    // Check enrollment status (real or dummy)
    const isEnrolled = usingDummyData ? dummyEnrollmentStatus.isEnrolled : enrollmentStatus.isEnrolled;

    // --- Conditional Rendering Guards ---
    if (loadingContent && !usingDummyData) {
        return <CourseContentShimmer />;
    }
    
    // Access Gate: If not enrolled, block access and redirect to the sales page
    if (!isEnrolled && !usingDummyData) {
        return <Navigate to={`/course/${courseId}`} replace />;
    }
    
    // --- Main Content Display ---
    
    return (
        <section className="min-h-screen bg-gray-100 py-10">
            <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}>
                
                {/* 🚨 Dummy Data Preview Banner 🚨 */}
                {usingDummyData && (
                    <div className="p-4 mb-8 bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded-lg flex items-center gap-3" role="alert">
                        <Eye className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-medium mb-1">
                                Preview Mode - Sample Course Content
                            </p>
                            <p className="text-sm opacity-90">
                                You're viewing demo content. Progress tracking and video completion are disabled in preview mode.
                            </p>
                        </div>
                    </div>
                )}
                
                {/* 🚨 Real Error Banner 🚨 */}
                {contentError && !usingDummyData && (
                    <div className="p-4 mb-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-lg flex items-center gap-3" role="alert">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <p className="font-medium">
                            Warning: {contentError}
                        </p>
                    </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Video Player (2/3 width) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <PlayCircle className="w-5 h-5 text-blue-600" />
                                    {displayCurrentModule?.title || 'Video Title'}
                                </h2>
                                {usingDummyData && (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                        Preview
                                    </span>
                                )}
                            </div>
                            
                            {activeVideoData ? (
                                <div className="relative">
                                    <VideoPlayer
                                        video={activeVideoData}
                                        onProgressUpdate={handleVideoProgress}
                                        onVideoComplete={handleVideoComplete}
                                        className="w-full"
                                        showControls={true}
                                        allowDownload={false}
                                    />
                                    {usingDummyData && (
                                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg">
                                            <div className="bg-white p-4 rounded-lg text-center max-w-md">
                                                <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                                <p className="font-medium text-gray-800">Sample Video Preview</p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    This is a demo video. In the actual course, you would see real content here.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-white">
                                    <div className="text-center">
                                        <PlayCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                        <p className="text-lg">Select a module to start learning</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Module Description */}
                        {displayCurrentModule && (
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="font-semibold text-gray-800 mb-2">About this module</h3>
                                <p className="text-gray-600">{displayCurrentModule.description}</p>
                                
                                {/* Learning Objectives */}
                                {displayCurrentModule.objectives && displayCurrentModule.objectives.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-medium text-gray-800 mb-2">Learning Objectives</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                            {displayCurrentModule.objectives.map((objective, index) => (
                                                <li key={index}>{objective}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Demo Notice */}
                                {usingDummyData && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-800">
                                            <strong>Demo Content:</strong> This module shows sample learning objectives. 
                                            In the actual course, you would have detailed objectives and real video content.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Module Navigation (1/3 width) */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-lg border border-gray-200 sticky top-24 h-fit max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2" style={{ color: PRIMARY_BLUE }}>
                                <List className="w-6 h-6" />
                                Course Modules
                            </h2>
                            {usingDummyData && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                    Demo
                                </span>
                            )}
                        </div>
                        
                        <ul className="divide-y divide-gray-100">
                            {displayCourseContent.length > 0 ? (
                                displayCourseContent.map((module, index) => {
                                    const moduleProgress = usingDummyData ? 
                                        { isCompleted: false, completionPercentage: 0 } : 
                                        getModuleProgress(module.id);
                                    
                                    const isUnlocked = usingDummyData ? true : isModuleUnlocked(module, index);
                                    const isCompleted = moduleProgress?.isCompleted || false;
                                    const isCurrent = displayCurrentModule?.id === module.id;
                                    
                                    return (
                                        <li 
                                            key={module.id}
                                            onClick={() => isUnlocked ? 
                                                (usingDummyData ? handleDummyModuleSelect(module) : setCurrentModule(module)) : null}
                                            className={`p-4 transition-colors ${
                                                isCurrent 
                                                    ? 'bg-blue-50 border-l-4 border-blue-600 font-bold text-blue-800' 
                                                    : isUnlocked 
                                                        ? 'hover:bg-gray-50 text-gray-700 cursor-pointer' 
                                                        : 'text-gray-400 cursor-not-allowed'
                                            } ${usingDummyData ? 'cursor-pointer' : ''}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {!isUnlocked && !usingDummyData ? (
                                                            <Lock className="w-4 h-4" />
                                                        ) : isCompleted ? (
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <PlayCircle className="w-4 h-4" />
                                                        )}
                                                        <span className="text-sm font-medium">
                                                            Module {index + 1}
                                                        </span>
                                                    </div>
                                                    <span className="text-base block">{module.title}</span>
                                                    {module.duration && (
                                                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{module.duration} min</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {(isUnlocked || usingDummyData) && (
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                )}
                                            </div>
                                            
                                            {/* Progress indicator */}
                                            {(isUnlocked || usingDummyData) && moduleProgress && (
                                                <div className="mt-2">
                                                    <div className="w-full bg-gray-200 rounded-full h-1">
                                                        <div 
                                                            className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                                            style={{ 
                                                                width: `${moduleProgress.completionPercentage || 0}%` 
                                                            }}
                                                        />
                                                    </div>
                                                    {usingDummyData && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Progress tracking disabled in preview
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    );
                                })
                            ) : (
                                <p className="p-4 text-gray-500">No modules available for this course.</p>
                            )}
                        </ul>

                        {/* Demo Footer */}
                        {usingDummyData && (
                            <div className="p-4 bg-gray-50 border-t">
                                <p className="text-sm text-gray-600 text-center">
                                    This is a preview of the learning interface. 
                                    Enroll in the actual course to access real content.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LearnPage;
// src/pages/CourseContent.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCourseContent } from '../contexts/CourseContentContext.jsx';
import VideoPlayer from '../components/VideoPlayer.jsx';
import CourseContentShimmer from '../components/CourseContentShimmer.jsx'; // 🚨 NEW IMPORT 🚨
import { Shield, BookOpen, PlayCircle, List, ArrowRight, Clock, CheckCircle, Lock } from 'lucide-react';

const PRIMARY_BLUE = "#004080";

const CourseContent = () => {
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
    } = useCourseContent();

    // Initialize course content and enrollment check
    useEffect(() => {
        if (isAuthenticated && currentUser && courseId) {
            fetchCourseContent(courseId);
        }
    }, [isAuthenticated, currentUser, courseId, fetchCourseContent]);

    // Memoize active video data for the player
    const activeVideoData = currentModule?.videos?.[0] || null;

    // Handle video progress updates
    const handleVideoProgress = useCallback(async (progressData) => {
        if (!activeVideoData || !currentModule || !courseId) return;
        
        if (progressData.percentage >= 80) {
            await markVideoWatched(
                courseId,
                currentModule.id,
                activeVideoData.id,
                progressData.currentTime,
                progressData.duration
            );
        }
    }, [currentModule, courseId, activeVideoData, markVideoWatched]);

    // Handle video completion
    const handleVideoComplete = useCallback(async () => {
        if (!currentModule || !courseId) return;
        await markModuleCompleted(courseId, currentModule.id);
    }, [currentModule, courseId, markModuleCompleted]);

    // --- Conditional Rendering Guards ---
    if (loadingContent) {
        // 🚨 RENDER SHIMMER LOADING UI 🚨
        return <CourseContentShimmer />;
    }
    
    if (contentError && courseContent.length === 0) {
        return (
            <div className="min-h-[50vh] p-10 max-w-2xl mx-auto mt-10 text-center border-2 border-red-300 bg-red-50 rounded-lg">
                <h1 className="text-2xl font-bold text-red-700">Error Loading Course</h1>
                <p className="mt-2 text-red-600">{contentError}</p>
                <Link to="/courses" className="text-blue-600 underline mt-4 inline-block">Browse All Courses</Link>
            </div>
        );
    }
    
    // Access Gate: If not enrolled, block access 
    if (!enrollmentStatus.isEnrolled) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-white shadow-xl max-w-lg mx-auto mt-20 rounded-xl border border-red-400">
                <Shield className="w-12 h-12 text-red-600 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Access Denied 🔒</h1>
                <p className="text-gray-600 mt-2 text-center">You must have a successful enrollment to view this content.</p>
                <Link 
                    to={`/checkout/${courseId}`} 
                    className="mt-4 px-6 py-2 bg-yellow-500 text-gray-900 rounded-full font-semibold hover:bg-yellow-600 transition shadow-md"
                >
                    Complete Enrollment Now
                </Link>
            </div>
        );
    }

    // --- Main Content Display ---
    
    return (
        <section className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Course Header with Progress */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold mb-4" style={{ color: PRIMARY_BLUE }}>
                        <BookOpen className="w-8 h-8 inline mr-3 text-yellow-500" />
                        {enrollmentStatus.enrollment?.courseTitle || 'Course Content'}
                    </h1>
                    
                    {/* Progress Bar */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Course Progress</span>
                            <span className="text-sm font-medium text-gray-700">{completionPercentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <span>Time spent: {Math.round(timeSpent / 60)} minutes</span>
                            <span>{courseContent.length} modules</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Video Player (2/3 width) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2 mb-4">
                                <PlayCircle className="w-5 h-5 text-blue-600" />
                                {currentModule?.title || 'Select a module to begin'}
                            </h2>
                            
                            {activeVideoData ? (
                                <VideoPlayer
                                    video={activeVideoData}
                                    onProgressUpdate={handleVideoProgress}
                                    onVideoComplete={handleVideoComplete}
                                    className="w-full"
                                    showControls={true}
                                    allowDownload={true}
                                />
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
                        {currentModule && (
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="font-semibold text-gray-800 mb-2">About this module</h3>
                                <p className="text-gray-600">{currentModule.description}</p>
                                
                                {/* Learning Objectives */}
                                {currentModule.objectives && currentModule.objectives.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-medium text-gray-800 mb-2">Learning Objectives</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                            {currentModule.objectives.map((objective, index) => (
                                                <li key={index}>{objective}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Module Navigation (1/3 width) */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-lg border border-gray-200 sticky top-24 h-fit max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold p-4 border-b text-gray-800 flex items-center gap-2" style={{ color: PRIMARY_BLUE }}>
                            <List className="w-6 h-6" />
                            Course Modules
                        </h2>
                        
                        <ul className="divide-y divide-gray-100">
                            {courseContent.length > 0 ? (
                                courseContent.map((module, index) => {
                                    const moduleProgress = getModuleProgress(module.id);
                                    const isUnlocked = isModuleUnlocked(module, index);
                                    const isCompleted = moduleProgress?.isCompleted || false;
                                    const isCurrent = currentModule?.id === module.id;
                                    
                                    return (
                                        <li 
                                            key={module.id}
                                            onClick={() => isUnlocked ? setCurrentModule(module) : null}
                                            className={`p-4 transition-colors ${
                                                isCurrent 
                                                    ? 'bg-blue-50 border-l-4 border-blue-600 font-bold text-blue-800' 
                                                    : isUnlocked 
                                                        ? 'hover:bg-gray-50 text-gray-700 cursor-pointer' 
                                                        : 'text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {!isUnlocked ? (
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
                                                {isUnlocked && (
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                )}
                                            </div>
                                            
                                            {/* Progress indicator */}
                                            {isUnlocked && moduleProgress && (
                                                <div className="mt-2">
                                                    <div className="w-full bg-gray-200 rounded-full h-1">
                                                        <div 
                                                            className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                                            style={{ 
                                                                width: `${moduleProgress.completionPercentage || 0}%` 
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })
                            ) : (
                                <p className="p-4 text-gray-500">No modules available for this course.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CourseContent;
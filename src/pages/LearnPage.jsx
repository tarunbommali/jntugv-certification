// src/pages/CourseContent.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLearnPage } from '../contexts/LearnPageContext.jsx';
import VideoPlayer from '../components/course/VideoPlayer.jsx';
import CourseContentShimmer from '../components/course/CourseContentShimmer.jsx';
import { global_classnames } from "../utils/classnames.js";
import { Shield, BookOpen, PlayCircle, List, ArrowRight, Clock, CheckCircle, Lock, AlertTriangle } from 'lucide-react'; // Added AlertTriangle

const PRIMARY_BLUE = "#004080";

const LearnPage = () => {
    const { courseId } = useParams();
    const { currentUser, isAuthenticated } = useAuth();
    const {
        courseContent,
        currentModule,
        enrollmentStatus,
        loadingContent,
        contentError, // Used for showing the notification banner
        fetchCourseContent,
        setCurrentModule,
        markVideoWatched,
        markModuleCompleted,
        getModuleProgress,
        isModuleUnlocked,
        completionPercentage,
        timeSpent
    } = useLearnPage();

    // 1. Initialize course content and enrollment check
    useEffect(() => {
        if (isAuthenticated && currentUser && courseId) {
            fetchCourseContent(courseId);
        }
    }, [isAuthenticated, currentUser, courseId, fetchCourseContent]);

    // Memoize active video data for the player (Assumes the first video in the list)
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
        // RENDER SHIMMER LOADING UI
        return <CourseContentShimmer />;
    }
    
    // Access Gate: If not enrolled, block access and redirect to the sales page
    if (!enrollmentStatus.isEnrolled) {
        // Redirect to the public course view or checkout page
        return <Navigate to={`/course/${courseId}`} replace />;
    }
    
    // --- Main Content Display ---
    
    return (
        <section className="min-h-screen bg-gray-100 py-10">
            <div
             className={`${global_classnames.width.container}   mx-auto px-4 sm:px-6 lg:px-8`}>
                
                {/* 🚨 NEW: Fallback/Error Banner (Shown when contentError is set by context) 🚨 */}
                {contentError && (
                    <div className="p-4 mb-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-lg flex items-center gap-3" role="alert">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <p className="font-medium">
                            **Warning:** {contentError}
                        </p>
                    </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Video Player (2/3 width) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2 mb-4">
                                <PlayCircle className="w-5 h-5 text-blue-600" />
                                {currentModule?.title || 'Video Title'}
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

export default LearnPage;
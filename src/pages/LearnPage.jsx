/* eslint-disable no-unused-vars */
// src/pages/CourseContent.jsx

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLearnPage } from '../contexts/LearnPageContext.jsx';
import { useRealtimeEnrollmentStatus } from '../hooks/useRealtimeFirebase.js';
import { updateUserProgress } from '../firebase/services';
import VideoPlayer from '../components/Course/VideoPlayer.jsx';
import CourseContentShimmer from '../components/Course/CourseContentShimmer.jsx';
import { global_classnames } from "../utils/classnames.js";
import { Shield, BookOpen, PlayCircle, List, ArrowRight, Clock, CheckCircle, Lock, AlertTriangle, Play } from 'lucide-react'; // Added AlertTriangle

const PRIMARY_BLUE = "#004080";


   
const LearnPage = () => {
    const { courseId } = useParams();
    const { currentUser, isAuthenticated } = useAuth();
    // Real-time enrollment status for access gating
    const { isEnrolled, loading: enrollmentLoading } = useRealtimeEnrollmentStatus(currentUser?.uid, courseId);
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
        lastPlayed,
        contentType,
        completionPercentage,
        timeSpent
    } = useLearnPage();

    // Track the currently selected video within the current module
    const [selectedVideo, setSelectedVideo] = useState(null);
    // Expand/collapse state per module
    const [expandedModules, setExpandedModules] = useState({});

    // Build a stable storage key for last played video per user/course
    const lastPlayedKey = useMemo(() => (
        currentUser?.uid && courseId ? `lastPlayed:${currentUser.uid}:${courseId}` : null
    ), [currentUser?.uid, courseId]);

    // 1. Initialize course content and enrollment check
    useEffect(() => {
        if (isAuthenticated && currentUser && courseId && isEnrolled) {
            fetchCourseContent(courseId);
        }
    }, [isAuthenticated, currentUser, courseId, isEnrolled, fetchCourseContent]);

    // Initialize selected video on module/content changes, using last played if available
    useEffect(() => {
        if (!courseContent || courseContent.length === 0) return;
        if (!currentModule) {
            // No module selected yet — restore last played or default to first module/video
            // Prefer cloud lastPlayed over local
            if (lastPlayed?.moduleId && lastPlayed?.videoId) {
                const mod = courseContent.find(m => m.id === lastPlayed.moduleId);
                const vid = mod?.videos?.find(v => v.id === lastPlayed.videoId);
                if (mod && vid) {
                    setCurrentModule(mod);
                    setSelectedVideo(vid);
                    return;
                }
            }
            if (lastPlayedKey) {
                try {
                    const saved = JSON.parse(localStorage.getItem(lastPlayedKey) || 'null');
                    if (saved?.moduleId && saved?.videoId) {
                        const mod = courseContent.find(m => m.id === saved.moduleId);
                        const vid = mod?.videos?.find(v => v.id === saved.videoId);
                        if (mod && vid) {
                            setCurrentModule(mod);
                            setSelectedVideo(vid);
                            return;
                        }
                    }
                } catch { /* ignore */ }
            }
            // Fallback default
            const firstModule = courseContent[0];
            setCurrentModule(firstModule);
            setSelectedVideo(firstModule?.videos?.[0] || null);
        } else {
            // Ensure a selected video when module is known
            if (!selectedVideo) {
                setSelectedVideo(currentModule?.videos?.[0] || null);
            }
        }
    }, [courseContent, currentModule, lastPlayedKey]);

    // Initialize expand state: expand ALL modules by default so the full list is visible
    useEffect(() => {
        if (!courseContent || courseContent.length === 0) return;
        setExpandedModules(() => {
            const all = {};
            courseContent.forEach((m) => { all[m.id] = true; });
            return all;
        });
    }, [courseContent, currentModule]);

    // Compute all-expanded state and a handler to toggle all
    const allExpanded = useMemo(() => {
        if (!courseContent || courseContent.length === 0) return false;
        return courseContent.every((m) => expandedModules[m.id]);
    }, [courseContent, expandedModules]);

    const handleToggleAll = useCallback(() => {
        if (!courseContent || courseContent.length === 0) return;
        const next = {};
        courseContent.forEach((m) => { next[m.id] = !allExpanded; });
        setExpandedModules(next);
    }, [courseContent, allExpanded]);

    // Persist last played selection per course/user (local + cloud)
    useEffect(() => {
        if (!lastPlayedKey || !currentModule || !selectedVideo) return;
        const payload = { moduleId: currentModule.id, videoId: selectedVideo.id, ts: Date.now() };
        try { localStorage.setItem(lastPlayedKey, JSON.stringify(payload)); } catch { /* ignore */ }
        // Also persist to Firestore user_progress so it syncs across devices
        if (isAuthenticated && currentUser?.uid && courseId) {
            updateUserProgress(currentUser.uid, courseId, { lastPlayed: { moduleId: currentModule.id, videoId: selectedVideo.id, ts: Date.now() } });
        }
    }, [lastPlayedKey, currentModule, selectedVideo]);

    // Memoize active video for the player
    const activeVideoData = selectedVideo || currentModule?.videos?.[0] || null;

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
    if (loadingContent || enrollmentLoading) {
        // RENDER SHIMMER LOADING UI
        return <CourseContentShimmer />;
    }
    
    // Access Gate: If not enrolled, block access and redirect to the sales page
    if (!isEnrolled) {
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
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2" style={{ color: PRIMARY_BLUE }}>
                                <List className="w-6 h-6" />
                                {contentType === 'series' ? 'Video Series' : 'Course Modules'}
                            </h2>
                            {courseContent?.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleToggleAll}
                                    className="text-sm px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    {allExpanded ? 'Collapse all' : 'Expand all'}
                                </button>
                            )}
                        </div>
                        
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
                                            className={`p-4 transition-colors ${
                                                isCurrent 
                                                    ? 'bg-blue-50 border-l-4 border-blue-600 font-bold text-blue-800' 
                                                    : isUnlocked 
                                                        ? 'hover:bg-gray-50 text-gray-700 cursor-pointer' 
                                                        : 'text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            <div
                                                className="flex items-center justify-between"
                                                onClick={() => {
                                                    if (!isUnlocked) return;
                                                    setCurrentModule(module);
                                                    setSelectedVideo((prev) => {
                                                        const existsInModule = module.videos?.some(v => v.id === prev?.id);
                                                        return existsInModule ? prev : (module.videos?.[0] || null);
                                                    });
                                                }}
                                            >
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
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); setExpandedModules((p) => ({ ...p, [module.id]: !p[module.id] })); }}
                                                        className={`ml-2 transition-transform ${expandedModules[module.id] ? 'rotate-90' : ''}`}
                                                        aria-label={expandedModules[module.id] ? 'Collapse' : 'Expand'}
                                                    >
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
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

                                            {/* Videos list */}
                                            {isUnlocked && expandedModules[module.id] && Array.isArray(module.videos) && module.videos.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    {module.videos.map((vid, vIdx) => {
                                                        const isActive = selectedVideo?.id === vid.id;
                                                        // Show duration instead of links
                                                        return (
                                                            <div
                                                                key={vid.id || vIdx}
                                                                onClick={() => { setCurrentModule(module); setSelectedVideo(vid); }}
                                                                className={`p-2 rounded border transition-colors ${isActive ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50 border-gray-200'} ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="text-sm font-medium truncate">{vid.title || `Video ${vIdx + 1}`}</div>
                                                                    </div>
                                                                    {vid.duration && (
                                                                        <div className="text-xs text-gray-500 ml-3 flex-shrink-0 flex items-center gap-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            <span>{vid.duration}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
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
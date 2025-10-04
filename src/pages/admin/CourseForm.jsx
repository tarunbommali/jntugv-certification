// src/pages/admin/CourseForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { 
    ArrowLeft, 
    Save, 
    Eye, 
    DollarSign, 
    Users,
    BookOpen,
    Image,
} from 'lucide-react';
import { global_classnames } from '../../utils/classnames.js';
import BasicInfoTab from '../../components/admin/BasicInfoTab.jsx';
import PricingTab from '../../components/admin/PricingTab.jsx';
import ContentTab from '../../components/admin/ContentTab.jsx';
import MediaTab from '../../components/admin/MediaTab.jsx';
import PreviewTab from '../../components/admin/PreviewTab.jsx';


const CourseForm = () => {
    const { isAdmin } = useAuth();
    // The courseId will be the actual ID for edit, or 'new' for creation
    const { courseId } = useParams(); 
    const navigate = useNavigate();
    
    const isNewCourse = courseId === 'new';

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [activeTab, setActiveTab] = useState('basic');
    const [errors, setErrors] = useState({});

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    // Initial empty course state (moved inside the component as it's only needed here)
    const emptyCourse = {
        title: '',
        description: '',
        shortDescription: '',
        category: 'web-development',
        instructor: '',
        price: 0,
        originalPrice: 0,
        duration: '',
        level: 'beginner',
        language: 'english',
        isPublished: false,
        isFeatured: false,
        isBestseller: false,
        imageUrl: '',
        videoUrl: '',
        tags: [],
        requirements: [],
        whatYouLearn: []
    };

    /* --- Data Fetching and Initialization --- */
    useEffect(() => {
        const fetchCourseData = async () => {
            setLoading(true);
            try {
                if (isNewCourse) {
                    setCourse(emptyCourse);
                    setModules([]);
                } else {
                    // Simulate API call for existing course data
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setCourse({
                        id: courseId,
                        title: 'React Masterclass (ID: ' + courseId + ')', // Show ID for verification
                        description: 'Learn React from scratch with hands-on projects. Build real-world applications and master modern React development.',
                        shortDescription: 'Complete React development course with hands-on projects',
                        category: 'web-development',
                        instructor: 'John Doe',
                        price: 2999,
                        originalPrice: 4999,
                        duration: '12 hours',
                        level: 'beginner',
                        language: 'english',
                        isPublished: true,
                        isFeatured: false,
                        isBestseller: true,
                        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUwCJYSnbBLMEGWKfSnWRGC_34iCCKkxePpg&s',
                        videoUrl: '',
                        tags: ['react', 'javascript', 'frontend'],
                        requirements: ['Basic HTML/CSS knowledge', 'JavaScript fundamentals'],
                        whatYouLearn: ['React fundamentals', 'Hooks', 'State management', 'Project building']
                    });

                    setModules([
                        {
                            id: 1,
                            title: 'Introduction to React',
                            description: 'Get started with React basics and understand core concepts',
                            order: 1,
                            duration: '2 hours',
                            lessons: [
                                { id: 1, title: 'What is React?', duration: '15 min', type: 'video', content: 'https://example.com/video1' },
                                { id: 2, title: 'Setting up Environment', duration: '30 min', type: 'video', content: 'https://example.com/video2' }
                            ]
                        },
                        {
                            id: 2,
                            title: 'React Components',
                            description: 'Learn about components and props in depth',
                            order: 2,
                            duration: '3 hours',
                            lessons: [
                                { id: 3, title: 'Functional Components', duration: '45 min', type: 'video', content: 'https://example.com/video3' }
                            ]
                        }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch course:', error);
                setCourse(null); // Set to null to show "Not Found" message
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId]);

    /* --- Handlers & Helpers (passed to child components) --- */

    const validateForm = () => {
        const newErrors = {};
        
        if (!course.title?.trim()) newErrors.title = 'Course title is required';
        if (!course.shortDescription?.trim()) newErrors.shortDescription = 'Short description is required';
        if (!course.description?.trim()) newErrors.description = 'Description is required';
        if (!course.instructor?.trim()) newErrors.instructor = 'Instructor name is required';
        if (!course.duration?.trim()) newErrors.duration = 'Duration is required';
        if (course.price < 0) newErrors.price = 'Price must be positive';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCourseChange = (field, value) => {
        setCourse(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleModuleChange = (moduleIndex, field, value) => {
        setModules(prev => prev.map((module, index) => 
            index === moduleIndex ? { ...module, [field]: value } : module
        ));
    };

    const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
        setModules(prev => prev.map((module, index) => {
            if (index === moduleIndex) {
                const updatedLessons = module.lessons.map((lesson, lIndex) =>
                    lIndex === lessonIndex ? { ...lesson, [field]: value } : lesson
                );
                return { ...module, lessons: updatedLessons };
            }
            return module;
        }));
    };

    const addModule = () => {
        const newModule = {
            id: Date.now(),
            title: 'New Module',
            description: '',
            order: modules.length + 1,
            duration: '1 hour',
            lessons: []
        };
        setModules(prev => [...prev, newModule]);
    };

    const deleteModule = (moduleIndex) => {
        if (window.confirm('Are you sure you want to delete this module?')) {
            setModules(prev => prev.filter((_, index) => index !== moduleIndex));
        }
    };

    const addLesson = (moduleIndex) => {
        const newLesson = {
            id: Date.now(),
            title: 'New Lesson',
            duration: '15 min',
            type: 'video',
            content: ''
        };
        
        setModules(prev => prev.map((module, index) => {
            if (index === moduleIndex) {
                return {
                    ...module,
                    lessons: [...module.lessons, newLesson]
                };
            }
            return module;
        }));
    };

    const deleteLesson = (moduleIndex, lessonIndex) => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            setModules(prev => prev.map((module, index) => {
                if (index === moduleIndex) {
                    return {
                        ...module,
                        lessons: module.lessons.filter((_, lIndex) => lIndex !== lessonIndex)
                    };
                }
                return module;
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setActiveTab(Object.keys(errors)[0] === 'price' ? 'pricing' : 'basic'); // Switch to first tab with error
            alert('Please fix the errors before submitting.');
            return;
        }

        setSaving(true);
        
        try {
            // Placeholder for real API call (POST for new, PUT for edit)
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Course saved:', { course, modules });
            alert(isNewCourse ? 'Course created successfully!' : 'Course updated successfully!');
            navigate('/admin/courses');
        } catch (error) {
            console.error('Failed to save course:', error);
            alert('Failed to save course. Please try again.');
        } finally {
            setSaving(false);
        }
    };
    
    // Functions for Preview/Content Tabs
    const calculateTotalDuration = () => {
        return modules.reduce((total, module) => {
            const match = module.duration.match(/(\d+)\s*hour/i);
            const moduleHours = match ? parseInt(match[1]) : 0;
            return total + moduleHours;
        }, 0);
    };

    const calculateTotalLessons = () => {
        return modules.reduce((total, module) => total + module.lessons.length, 0);
    };

    /* --- Render Logic --- */

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // This check is important if the API returns a 404 for an invalid ID
    if (!course) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
                    <p className="text-gray-600">The course you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    const tabComponents = {
        basic: (
            <BasicInfoTab 
                course={course}
                handleCourseChange={handleCourseChange}
                errors={errors}
            />
        ),
        pricing: (
            <PricingTab 
                course={course}
                handleCourseChange={handleCourseChange}
                errors={errors}
            />
        ),
        content: (
            <ContentTab 
                modules={modules}
                handleModuleChange={handleModuleChange}
                handleLessonChange={handleLessonChange}
                addModule={addModule}
                deleteModule={deleteModule}
                addLesson={addLesson}
                deleteLesson={deleteLesson}
                calculateTotalLessons={calculateTotalLessons}
                calculateTotalDuration={calculateTotalDuration}
            />
        ),
        media: (
            <MediaTab 
                course={course}
                handleCourseChange={handleCourseChange}
            />
        ),
        preview: (
            <PreviewTab 
                course={course}
                modules={modules}
                calculateTotalLessons={calculateTotalLessons}
                calculateTotalDuration={calculateTotalDuration}
            />
        )
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}>
                
                {/* Header and Tabs */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                       
                        <div>
                            <h1 className="text-3xl font-extrabold italic text-gray-900">
                                {isNewCourse ? 'Create New Course' : `Edit Course: ${course.title}`}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {isNewCourse ? 'Add a new course to the platform' : `Editing Course ID: ${course.id}`}
                            </p>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200 mb-6 overflow-x-auto">
                        {[
                            { id: 'basic', label: 'Basic Info', icon: BookOpen },
                            { id: 'pricing', label: 'Pricing', icon: DollarSign },
                            { id: 'content', label: 'Course Content', icon: Users },
                            { id: 'media', label: 'Media', icon: Image },
                            { id: 'preview', label: 'Preview', icon: Eye }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dynamic Tab Content */}
                    {tabComponents[activeTab]}

                    {/* Submit Button - Show on all tabs except preview */}
                    {activeTab !== 'preview' && (
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/courses')}
                                className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Saving...' : (isNewCourse ? 'Create Course' : 'Save Changes')}
                            </button>
                        </div>
                    )}
                </form>

            </div>
        </div>
    );
};

export default CourseForm;
// src/pages/admin/AdminCourses.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Navigate, Link } from 'react-router-dom';
import { Plus, Search, BookOpen, Users, Star, Clock } from 'lucide-react';
import { global_classnames } from '../../utils/classnames.js';
import CourseCard from '../../components/Course/CourseCard.jsx';

const Courses = () => {
    const { isAdmin } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setCourses([
                {
                    id: 1,
                    title: 'React Masterclass',
                    instructor: 'John Doe',
                    category: 'Web Development',
                    price: 2999,
                    students: 1247,
                    rating: 4.8,
                    duration: '12 hours',
                    status: 'published',
                    createdAt: '2024-01-15'
                },
                {
                    id: 2,
                    title: 'Node.js Fundamentals',
                    instructor: 'Jane Smith',
                    category: 'Backend Development',
                    price: 1999,
                    students: 856,
                    rating: 4.6,
                    duration: '8 hours',
                    status: 'published',
                    createdAt: '2024-01-20'
                },
                {
                    id: 3,
                    title: 'Advanced Python Programming',
                    instructor: 'Bob Johnson',
                    category: 'Programming',
                    price: 2499,
                    students: 0,
                    rating: 0,
                    duration: '10 hours',
                    status: 'draft',
                    createdAt: '2024-02-01'
                }
            ]);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditCourse = (course) => {
        // This will be handled by the Link in CourseCard
        console.log('Edit course:', course);
    };

    const handleDeleteCourse = (course) => {
        if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
            setCourses(prev => prev.filter(c => c.id !== course.id));
        }
    };

    const handleViewCourse = (course) => {
        // Navigate to course preview or public page
        window.open(`/course/${course.id}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}>
                
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 italic">Course Management</h1>
                            <p className="text-gray-600 mt-1">Create and manage platform courses</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <Link 
                            to="/admin/courses/edit/new" 
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Course</span>
                        </Link>
                    </div>
                </div>


                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
                        <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
                        <div className="text-sm text-gray-600">Total Courses</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
                        <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                            {courses.filter(c => c.status === 'published').length}
                        </div>
                        <div className="text-sm text-gray-600">Published</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
                        <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                            {courses.reduce((acc, course) => acc + course.students, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Students</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
                        <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                            {courses.filter(c => c.status === 'draft').length}
                        </div>
                        <div className="text-sm text-gray-600">Drafts</div>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="flex flex-wrap items-center my-4">
                    {filteredCourses.map((course) => (
                        <CourseCard 
                            key={course.id}
                            course={course}
                            showAdminOptions={true}
                            onEdit={handleEditCourse}
                            onDelete={handleDeleteCourse}
                            onView={handleViewCourse}
                        />
                    ))}
                </div>

              
            </div>
        </div>
    );
};

export default Courses;
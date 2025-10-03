        // src/pages/admin/AdminCourseEditor.jsx

import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, BookOpen, Users, Star, Clock } from 'lucide-react';

const AdminCourseEditor = () => {
    const [courses, setCourses] = useState([
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

    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            case 'archived': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDeleteCourse = (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            setCourses(courses.filter(course => course.id !== courseId));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
                    <p className="text-gray-600 mt-1">Create and manage platform courses</p>
                </div>
                <button className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Create Course</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Categories</option>
                        <option value="web">Web Development</option>
                        <option value="backend">Backend Development</option>
                        <option value="programming">Programming</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                            <div className="absolute top-3 right-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                                    {course.status}
                                </span>
                            </div>
                            <div className="absolute bottom-3 left-3 text-white">
                                <h3 className="font-bold text-lg">{course.title}</h3>
                                <p className="text-sm opacity-90">{course.instructor}</p>
                            </div>
                        </div>
                        
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-600">{course.category}</span>
                                <span className="text-lg font-bold text-gray-900">₹{course.price}</span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 text-center mb-4">
                                <div className="flex flex-col items-center">
                                    <Users className="w-4 h-4 text-gray-500 mb-1" />
                                    <span className="text-xs font-medium">{course.students}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Star className="w-4 h-4 text-yellow-500 mb-1" />
                                    <span className="text-xs font-medium">{course.rating || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Clock className="w-4 h-4 text-gray-500 mb-1" />
                                    <span className="text-xs font-medium">{course.duration}</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between space-x-2">
                                <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                    <Edit className="w-3 h-3" />
                                    <span>Edit</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                                    <Eye className="w-3 h-3" />
                                    <span>View</span>
                                </button>
                                <button 
                                    onClick={() => handleDeleteCourse(course.id)}
                                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
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
        </div>
    );
};

export default AdminCourseEditor;
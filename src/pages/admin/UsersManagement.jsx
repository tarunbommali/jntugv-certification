// src/pages/admin/AdminUsers.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import { Search, Filter, Mail, Phone, Calendar, Shield, UserPlus, X, BookOpen, Send } from 'lucide-react';
import { global_classnames } from '../../utils/classnames.js';
import { getAllUsersData, createUserWithCredentials } from '../../firebase/services_modular/userOperations';
import { getAllCourses } from '../../firebase/services_modular/courseOperations';
import { createEnrollment } from '../../firebase/services_modular/enrollmentOperations';

const UsersManagement = () => {
    const { isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        fetchUsers();
        fetchCourses();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const result = await getAllUsersData(500);
        if (result.success) {
            setUsers(result.data);
        }
        setLoading(false);
    };

    const fetchCourses = async () => {
        const result = await getAllCourses();
        if (result.success) {
            setCourses(result.data);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const result = await createUserWithCredentials({
                email: formData.email,
                password: formData.password,
                displayName: formData.name,
                phone: formData.phone
            });

            if (result.success) {
                setSuccess(`User created successfully! Credentials: ${formData.email} / ${formData.password}`);
                setFormData({ name: '', email: '', phone: '', password: '' });
                fetchUsers();
                setTimeout(() => {
                    setShowCreateModal(false);
                    setSuccess('');
                }, 3000);
            } else {
                setError(result.error || 'Failed to create user');
            }
        } catch (err) {
            setError('An error occurred while creating the user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEnrollUser = async () => {
        if (!selectedUser || selectedCourses.length === 0) {
            setError('Please select at least one course');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            for (const courseId of selectedCourses) {
                const course = courses.find(c => c.courseId === courseId);
                await createEnrollment({
                    userId: selectedUser.uid,
                    courseId: courseId,
                    courseTitle: course?.title || 'Course',
                    status: 'SUCCESS',
                    paymentData: {
                        amount: 0,
                        paymentId: 'ADMIN_ENROLLMENT'
                    }
                });
            }
            setSuccess(`Successfully enrolled ${selectedUser.displayName || selectedUser.email} in ${selectedCourses.length} course(s)`);
            setSelectedCourses([]);
            fetchUsers();
            setTimeout(() => {
                setShowEnrollModal(false);
                setSuccess('');
            }, 2000);
        } catch (err) {
            setError('Failed to enroll user in courses');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const name = (user.displayName || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return name.includes(search) || email.includes(search);
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800';
            case 'instructor': return 'bg-blue-100 text-blue-800';
            case 'student': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}>
                
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        
                        <div>
                            <h1 className="text-3xl font-extrabold italic text-gray-900">User Management</h1>
                            <p className="text-gray-600 mt-1">Manage platform users and their permissions</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search users by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>Add User</span>
                        </button>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading users...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Courses
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Join Date
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 font-semibold">
                                                            {(user.displayName || user.email || 'U').substring(0, 2).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.displayName || 'No Name'}
                                                        </div>
                                                        <div className="text-sm text-gray-500 flex items-center">
                                                            <Mail className="w-3 h-3 mr-1" />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.isAdmin ? 'admin' : 'student')}`}>
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    {user.isAdmin ? 'admin' : 'student'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('active')}`}>
                                                    active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.totalCoursesEnrolled || 0} courses
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowEnrollModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 mr-3 flex items-center gap-1"
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                    Enroll
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                        <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {users.filter(u => u.status === 'active').length}
                        </div>
                        <div className="text-sm text-gray-600">Active Users</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {users.filter(u => u.role === 'instructor').length}
                        </div>
                        <div className="text-sm text-gray-600">Instructors</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {users.reduce((acc, user) => acc + (user.totalCoursesEnrolled || 0), 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Enrollments</div>
                    </div>
                </div>

                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Create User</h2>
                                <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Minimum 6 characters"
                                    />
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Creating...' : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showEnrollModal && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Enroll User</h2>
                                <button onClick={() => setShowEnrollModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <p className="text-gray-600 mb-4">Select courses to enroll <strong>{selectedUser.displayName || selectedUser.email}</strong></p>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                                    {success}
                                </div>
                            )}

                            <div className="max-h-96 overflow-y-auto space-y-2 mb-4">
                                {courses.map((course) => (
                                    <label key={course.courseId} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedCourses.includes(course.courseId)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedCourses([...selectedCourses, course.courseId]);
                                                } else {
                                                    setSelectedCourses(selectedCourses.filter(id => id !== course.courseId));
                                                }
                                            }}
                                            className="mt-1 mr-3"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{course.title}</div>
                                            <div className="text-sm text-gray-500">{course.category}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowEnrollModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEnrollUser}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Enrolling...' : 'Enroll'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersManagement;
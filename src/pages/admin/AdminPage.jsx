// src/pages/AdminPage.jsx

import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import { global_classnames } from '../../utils/classnames.js';
import AdminHeader from '../../components/admin/AdminHeader.jsx';

const AdminPage = () => {
    const { isAdmin, userProfile } = useAuth();

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }


    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}>

            <AdminHeader title="Admin" description="Overview" />


                {/* Stats */}
                <div className="mt-12 bg-white rounded-xl shadow-md p-6">
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">1,247</div>
                            <div className="text-sm text-gray-600">Total Users</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">23</div>
                            <div className="text-sm text-gray-600">Active Courses</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">3,456</div>
                            <div className="text-sm text-gray-600">Enrollments</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">₹12.5L</div>
                            <div className="text-sm text-gray-600">Revenue</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminPage;
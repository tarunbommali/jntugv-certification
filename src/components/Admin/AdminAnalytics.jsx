// src/pages/admin/AdminAnalytics.jsx

import React, { useState, useEffect } from 'react';
import { BarChart3, Users, BookOpen, DollarSign, TrendingUp, Eye } from 'lucide-react';

const AdminAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        totalRevenue: 0,
        activeUsers: 0,
        pageViews: 0
    });

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            setStats({
                totalUsers: 1247,
                totalCourses: 23,
                totalEnrollments: 3456,
                totalRevenue: 1256000,
                activeUsers: 289,
                pageViews: 15678
            });
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const StatCard = ({ icon: Icon, label, value, color = 'blue', format = 'number' }) => (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                        {loading ? (
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                        ) : format === 'currency' ? (
                            `₹${value.toLocaleString()}`
                        ) : (
                            value.toLocaleString()
                        )}
                    </p>
                </div>
                <div className={`p-3 rounded-lg bg-${color}-100`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    icon={Users} 
                    label="Total Users" 
                    value={stats.totalUsers}
                    color="blue"
                />
                <StatCard 
                    icon={BookOpen} 
                    label="Total Courses" 
                    value={stats.totalCourses}
                    color="green"
                />
                <StatCard 
                    icon={TrendingUp} 
                    label="Total Enrollments" 
                    value={stats.totalEnrollments}
                    color="purple"
                />
                <StatCard 
                    icon={DollarSign} 
                    label="Total Revenue" 
                    value={stats.totalRevenue}
                    color="emerald"
                    format="currency"
                />
                <StatCard 
                    icon={Users} 
                    label="Active Users" 
                    value={stats.activeUsers}
                    color="orange"
                />
                <StatCard 
                    icon={Eye} 
                    label="Page Views" 
                    value={stats.pageViews}
                    color="indigo"
                />
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trends</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-12 h-12 text-gray-400" />
                        <span className="ml-2 text-gray-500">Chart will be implemented soon</span>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analysis</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-12 h-12 text-gray-400" />
                        <span className="ml-2 text-gray-500">Revenue chart coming soon</span>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                    New user registration - User #{1250 + item}
                                </span>
                            </div>
                            <span className="text-xs text-gray-500">2 hours ago</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
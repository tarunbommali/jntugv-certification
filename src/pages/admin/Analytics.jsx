// src/pages/admin/AdminAnalytics.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import { BarChart3, Users, BookOpen, DollarSign, TrendingUp, Eye, Calendar, ArrowLeft } from 'lucide-react';
import { global_classnames } from '../../utils/classnames.js';

const Analytics = () =>  {
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d');

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const StatCard = ({ icon: Icon, label, value, change, color = 'blue' }) => (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                        {loading ? '...' : value}
                    </p>
                    {change && (
                        <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last period
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-lg bg-${color}-100`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}>
                
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                       
                        <div>
                            <h1 className="text-3xl font-extrabold italic text-gray-900">Analytics </h1>
                            <p className="text-gray-600 mt-1">Platform performance and insights</p>
                        </div>
                    </div>

                    {/* Time Range Selector */}
                    <div className="flex gap-2 mb-6">
                        {['7d', '30d', '90d', '1y'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    timeRange === range
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard 
                        icon={Users} 
                        label="Total Users" 
                        value="1,247"
                        change={12.5}
                        color="blue"
                    />
                    <StatCard 
                        icon={BookOpen} 
                        label="Active Courses" 
                        value="23"
                        change={8.2}
                        color="green"
                    />
                    <StatCard 
                        icon={TrendingUp} 
                        label="Enrollments" 
                        value="3,456"
                        change={15.3}
                        color="purple"
                    />
                    <StatCard 
                        icon={DollarSign} 
                        label="Revenue" 
                        value="₹12.5L"
                        change={22.1}
                        color="emerald"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trends</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                            <BarChart3 className="w-12 h-12 text-gray-400" />
                            <span className="ml-2 text-gray-500">Enrollment chart will be implemented</span>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analysis</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                            <DollarSign className="w-12 h-12 text-gray-400" />
                            <span className="ml-2 text-gray-500">Revenue chart coming soon</span>
                        </div>
                    </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        icon={Eye} 
                        label="Page Views" 
                        value="15,678"
                        change={5.7}
                        color="orange"
                    />
                    <StatCard 
                        icon={Users} 
                        label="Active Users" 
                        value="289"
                        change={-2.1}
                        color="indigo"
                    />
                    <StatCard 
                        icon={Calendar} 
                        label="Completion Rate" 
                        value="68%"
                        change={3.4}
                        color="green"
                    />
                </div>
            </div>
        </div>
    );
};

export default Analytics;
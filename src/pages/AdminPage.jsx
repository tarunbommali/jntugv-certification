// src/pages/AdminPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Navigate, useParams } from 'react-router-dom';
import { Trello } from 'lucide-react';
import {global_classnames} from '../utils/classnames.js'

import ErrorBoundary from '../components/Error/ErrorBoundary.jsx'; 

// Import Admin Components
import AdminAnalytics from '../components/Admin/AdminAnalytics.jsx';
import AdminUserDashboard from '../components/Admin/AdminUserDashboard.jsx';
import AdminCourseEditor from '../components/Admin/AdminCourseEditor.jsx';
import AdminCouponDashboard from '../components/Admin/AdminCouponDashboard.jsx';

const PRIMARY_BLUE = "#0056D2";
const BORDER_COLOR = "border-blue-600";

// Tab configuration with proper component references
const TABS = [
    { 
        id: 'analytics', 
        name: 'Analytics', 
        icon: '📊',
        component: AdminAnalytics
    },
    { 
        id: 'users', 
        name: 'User Management', 
        icon: '👥',
        component: AdminUserDashboard
    },
    { 
        id: 'courses', 
        name: 'Course Editor', 
        icon: '📚',
        component: AdminCourseEditor
    },
    { 
        id: 'coupons', 
        name: 'Coupon Manager', 
        icon: '🎫',
        component: AdminCouponDashboard
    },
];

const AdminPage = () => {
    const { isAdmin, userProfile } = useAuth();
    const { tabId } = useParams();
    
    // Determine initial active tab
    const defaultTabId = TABS.find(tab => tab.id === tabId) ? tabId : TABS[0].id;
    const [activeTab, setActiveTab] = useState(defaultTabId); 
    
    // Get active component
    const activeTabConfig = TABS.find(t => t.id === activeTab) || TABS[0];
    const ActiveComponent = activeTabConfig.component;

    // Sync with URL parameters
    useEffect(() => {
        if (tabId && tabId !== activeTab) {
            setActiveTab(tabId);
        }
    }, [tabId, activeTab]);

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}>
                
                {/* Header */}
                <div className={`mb-8 p-6 bg-white rounded-xl shadow-lg border-t-4 ${BORDER_COLOR}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 mb-4 sm:mb-0">
                            <Trello className="w-8 h-8" style={{ color: PRIMARY_BLUE }} />
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                    Admin Dashboard
                                </h1>
                            </div>
                        </div>
                        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                            <span className="text-sm font-medium text-blue-800">
                                Active Tab: <span className="font-bold capitalize">{activeTab.replace('-', ' ')}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
                    <nav className="flex overflow-x-auto">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-6 py-4 border-b-2 text-sm font-medium whitespace-nowrap transition-all duration-200
                                    ${activeTab === tab.id
                                        ? `${BORDER_COLOR} text-blue-600 bg-blue-50`
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Active Tab Content */}
                <div className="p-0">
                    <ErrorBoundary>
                        {ActiveComponent && <ActiveComponent />}
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
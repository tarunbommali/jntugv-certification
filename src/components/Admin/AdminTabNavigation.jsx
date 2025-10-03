// src/components/AdminTabNavigation.jsx (New File)

import React, { useState } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';

const PRIMARY_BLUE = "#0056D2";
const BORDER_COLOR = "border-blue-600";

// TABS configuration array (defined once here, or passed as a prop)
const TABS = [
    { id: 'analytics', name: 'Analytics', icon: 'BarChart3', component: 'Placeholder' }, // Placeholder icons/component types
    { id: 'users', name: 'User Management', icon: 'Users', component: 'AdminUserDashboard' },
    { id: 'courses', name: 'Course Editor', icon: 'BookOpen', component: 'Placeholder' },
    { id: 'coupons', name: 'Coupon Manager', icon: 'DollarSign', component: 'AdminCouponDashboard' },
];

const AdminTabNavigation = ({ tabs, activeTab, onTabChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const activeTabConfig = tabs.find(t => t.id === activeTab);
    const ActiveIcon = activeTabConfig.icon; // Assuming you pass Lucide components or use a map function in the parent

    // Helper to render the Lucide icon based on its name (needed here for dynamic rendering)
    const getLucideIcon = (IconName) => {
        // NOTE: This utility function would need to be defined or imported elsewhere if used dynamically
        // Since we are passing the function reference in the parent, this component should receive the icon directly
        // For simplicity and to match the structure, we'll assume the icon functions are passed in the 'tabs' prop.
        return activeTabConfig.icon; 
    };

    const handleTabClick = (newTabId) => {
        onTabChange(newTabId);
        setIsDropdownOpen(false); 
    };

    return (
        <div className="mb-6 bg-white rounded-xl shadow-md border-b border-gray-200 sm:rounded-t-xl sm:border-b-0">
            
            {/* 1. Mobile Dropdown Button */}
            <div className="sm:hidden p-4">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg text-lg font-bold text-gray-800 bg-gray-50 hover:bg-gray-100 transition"
                >
                    <span className="flex items-center gap-2">
                        {/* Render Active Icon */}
                        {activeTabConfig.icon && <activeTabConfig.icon className="w-5 h-5 text-blue-600" />}
                        {activeTabConfig.name}
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* 2. Mobile Dropdown List (Animated) */}
            <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${isDropdownOpen ? 'max-h-96 border-t border-gray-200' : 'max-h-0'}`}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-full text-left p-3 flex items-center gap-3 text-sm transition-colors duration-200 border-b border-gray-100 last:border-b-0 ${
                            activeTab === tab.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {/* Render Checkmark if active, otherwise the tab icon */}
                        {activeTab === tab.id ? <CheckCircle className="w-5 h-5" style={{ color: PRIMARY_BLUE }} /> : <tab.icon className="w-5 h-5 text-gray-400" />}
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* 3. Desktop Horizontal Tabs */}
            <nav className="hidden sm:flex border-b border-gray-200 px-4 sm:px-6 lg:px-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`
                            ${activeTab === tab.id
                                ? `border-b-2 ${BORDER_COLOR} text-blue-600 font-bold`
                                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                            group inline-flex items-center px-1 py-4 text-sm transition-colors duration-200 mx-4
                        `}
                    >
                        <tab.icon 
                            className={`w-5 h-5 mr-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} 
                        />
                        {tab.name}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default AdminTabNavigation;
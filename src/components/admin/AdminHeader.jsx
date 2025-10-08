import React from 'react';

const colorMap = {
    blue: {
        text: 'text-blue-600',
        bg: 'bg-blue-100'
    },
    green: {
        text: 'text-green-600',
        bg: 'bg-green-100'
    },
    purple: {
        text: 'text-purple-600',
        bg: 'bg-purple-100'
    },
    orange: {
        text: 'text-orange-600',
        bg: 'bg-orange-100'
    },
    indigo: {
        text: 'text-indigo-600',
        bg: 'bg-indigo-100'
    },
    emerald: {
        text: 'text-emerald-600',
        bg: 'bg-emerald-100'
    }
};

const AdminHeader = ({ title, description, badge, badgeColor = 'blue', rightSlot }) => {
    const classes = colorMap[badgeColor] || colorMap.blue;
    return (
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
                {badge && (
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes.bg} ${classes.text}`}>
                        {badge}
                    </div>
                )}
                <div className="flex-1">
                    <h1 className="text-3xl font-extrabold italic text-gray-900">{title}</h1>
                    {description && (
                        <p className="text-gray-600 mt-1">{description}</p>
                    )}
                </div>
                {rightSlot && (
                    <div className="flex-shrink-0">
                        {rightSlot}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHeader;


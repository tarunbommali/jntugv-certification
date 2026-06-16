/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";

const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ").filter(part => part.trim() !== "");
    if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
};

const UserAvatar = ({ currentUser, userProfile, navigate }) => {
    const name = userProfile?.name || currentUser?.username || currentUser?.email?.split("@")[0];
    const initials = getInitials(name);

    return (
        <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 p-1 rounded-full transition-colors"
            title={`View Profile: ${currentUser?.email}`}
        >
            <div className="w-10 h-10 rounded-full border-amber-200 border-2 bg-blue-600 text-white flex items-center justify-center font-light text-lg">
                {initials}
            </div>
        </button>
    );
};
  
export default UserAvatar;
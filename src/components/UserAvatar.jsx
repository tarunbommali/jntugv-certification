 
import { useState, useEffect } from "react";

const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
};


const UserAvatar = ({ currentUser, userProfile, navigate }) => {
    const photoUrl = currentUser?.photoURL;
    const name = userProfile?.name || currentUser?.displayName || currentUser?.email?.split("@")[0];
    const initials = getInitials(name);
    const [imageLoadError, setImageLoadError] = useState(false);

    useEffect(() => {
        setImageLoadError(false);
    }, [photoUrl]);

    

    return (
        <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 p-1 rounded-full  transition-colors"
            title={`View Profile: ${currentUser.email}`}
        >
            {photoUrl && !imageLoadError ? (
                <img
                    src={photoUrl}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                    onError={() => setImageLoadError(true)}
                />
            ) : (
                <div className="w-10 h-10 p-2 rounded-full border-amber-200 border-2 bg-blue-600 text-white flex items-center justify-center font-light text-lg">
                    {initials}
                </div>
            )}
        </button>
    );
};
  
  export default UserAvatar;
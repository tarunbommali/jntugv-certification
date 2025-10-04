/* eslint-disable no-unused-vars */
import { Menu, X, ArrowRight, UserCircle, Moon, Sun, Clock, Briefcase } from "lucide-react";
import { Link,  } from "react-router-dom";

const MobileNavigationDrawer = ({ 
    setIsMenuOpen, 
    navigate, 
    isAuthenticated, 
    currentUser, 
    handleLogout, 
    setIsContactModalOpen,
    isAdmin
}) => {
    
    // Helper to close menu and navigate
    const handleMobileLinkClick = (href) => {
        setIsMenuOpen(false);
        navigate(href);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setIsMenuOpen(false)}
            />
            {/* Drawer Content */}
            <div className="fixed top-0 right-0 w-64 xs:w-72 sm:w-80 h-full p-6 shadow-2xl z-50 transition-transform transform translate-x-0 ease-in-out duration-300 animate-slide-in-right" style={{ background: "var(--color-card)" }}>

                {/* Drawer Header (Close Button) */}
                <div className="flex justify-end mb-8">
                    <button
                        className="p-2"
                        style={{ color: "var(--color-primary)" }}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col space-y-4 border-b border-gray-200 pb-6">
                    
                    {/* Admin Link (Mobile) */}
                    {isAdmin && (
                        <button
                            onClick={() => handleMobileLinkClick("/admin")}
                            className="text-xl font-semibold text-amber-600 hover:text-amber-800 transition-colors py-2 border-b border-gray-100 text-left flex items-center gap-2"
                        >
                            <Briefcase className="w-6 h-6" />
                            Admin Dashboard
                        </button>
                    )}

                    {/* Profile Link */}
                    {isAuthenticated && (
                        <button
                            onClick={() => handleMobileLinkClick("/profile")}
                            className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors py-2 border-b border-gray-100 text-left flex items-center gap-2"
                        >
                            <UserCircle className="w-6 h-6" />
                            Profile
                        </button>
                    )}

                    <Link
                        to="/courses"
                        onClick={() => handleMobileLinkClick("/courses")}
                        className="text-xl font-semibold transition-colors py-2 text-left"
                        style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-border)" }}
                    >
                        Courses
                    </Link>
                    
                    {/* Mobile Contact Button */}
                    <button
                        onClick={() => {
                            setIsMenuOpen(false);
                            setIsContactModalOpen(true);
                        }}
                        className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors py-2 border-b border-gray-100 text-left"
                    >
                        Contact
                    </button>
                </nav>

                {/* Mobile Auth/User Status */}
                <div className="mt-8">
                    {isAuthenticated ? (
                        <div className="flex flex-col items-start space-y-3">
                            <p className="text-base font-medium" style={{ color: "var(--color-text)" }}>
                                Signed in as: <br />
                                <strong className="break-all" style={{ color: "var(--color-primary)" }}>
                                    {currentUser?.email}
                                </strong>
                            </p>
                            <button
                                onClick={handleLogout}
                                className="w-full h-12 rounded-md text-white text-base font-medium hover:opacity-90 transition-colors shadow-md"
                                style={{ background: "#dc2626" }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleMobileLinkClick("/auth/signin")}
                            className="w-full h-12 rounded-md text-white text-base font-medium hover:opacity-90 transition-shadow shadow-md"
                            style={{ background: "var(--color-primary)" }}
                        >
                            Login to Enroll
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}


export default MobileNavigationDrawer;
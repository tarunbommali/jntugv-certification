/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, UserCircle, Moon, Sun, Clock, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import useCountdownTimer from "../hooks/useCountdownTimer";
import OfferModal from "./ui/modal/OfferModal.jsx"; // Assumed to exist
import Contact from './ui/modal/Contact.jsx' // Assumed to exist
import { useAuth } from "../contexts/AuthContext.jsx"; // Assumed to provide isAdmin
import { global_classnames } from "../utils/classnames.js";
import { useTheme } from "../contexts/ThemeContext.jsx"; // Assumed to exist

// --- Local Storage Key ---
const OFFER_DISMISSED_KEY = "nxtgen_offer_dismissed";

// Helper function to get initials for placeholder avatar
const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
};

// --- 1. User Avatar Component (Refactored for cleaner imports) ---
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
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
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

// --- 2. Top Offer Bar Component (Refactored for reusability) ---
const TopOfferBar = ({ formattedTime, handleDismissOffer, setIsContactModalOpen, setIsOfferModalOpen }) => {
    return (
        <div className="w-full text-white py-2 shadow-inner z-50 bg-[#004080]">
            <div
                className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center text-sm font-semibold relative`}
            >
                {/* Contact Link */}
                <button
                    className="hidden md:flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsContactModalOpen(true)}
                >
                    New Course Enquiry: India - +91 7780351078
                </button>

                {/* Offer Countdown Button */}
                <button
                    className="flex items-center gap-2 cursor-pointer text-[#f1f1f1] rounded-full px-4 py-1.5 transition-all text-xs sm:text-sm shadow-lg mx-auto md:mx-0"
                    style={{ background: "#18bc62" }}
                    onClick={() => setIsOfferModalOpen(true)}
                >
                    <Clock className="w-4 h-4" /> Career Level Up Offer! Ends in: **{formattedTime}**
                    <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                {/* Close Button */}
                <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 text-gray-300 hover:text-white transition-colors text-right"
                    onClick={handleDismissOffer}
                    aria-label="Dismiss offer bar"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// --- 3. Mobile Navigation Drawer (Refactored for reusability) ---
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

// --- 4. Main Header Component (The Parent) ---

const Header = () => {
    const { toggleTheme, isDark, isAdmin } = useTheme(); // Assuming isAdmin is available via useTheme/useAuth setup
    const { isAuthenticated, currentUser, userProfile, logout, isAdmin: isUserAdmin } = useAuth(); // Destructure isAdmin from useAuth
    
    // --- State & Handlers ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isOfferBarVisible, setIsOfferBarVisible] = useState(true);
    const [activeAdminnav, setActiveAdminnav] = useState('Admin'); // State for admin nav selection
    const navigate = useNavigate();
    const formattedTime = useCountdownTimer(9 * 3600 + 17 * 60 + 10);
    
    // Determine if the user is an admin
    const isAdminUser = isUserAdmin; 

    // Load initial visibility state from localStorage on mount
    useEffect(() => {
        const dismissed = localStorage.getItem(OFFER_DISMISSED_KEY);
        if (dismissed === 'true') {
            setIsOfferBarVisible(false);
        }
    }, []);

    // Handler: Dismiss the offer bar and save the preference
    const handleDismissOffer = () => {
        setIsOfferBarVisible(false);
        localStorage.setItem(OFFER_DISMISSED_KEY, 'true');
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Admin Navigation Menu Definition
    const AdminNavMenu = [
        {id:"Admin", name:"Admin", link:"/admin" },
        { id: 'Analytics', name: 'Analytics', link: "/admin/analytics" },
        { id: 'users', name: 'Users', link: "/admin/users" },
        { id: 'courses', name: 'Courses', link: "/admin/courses" },
        { id: 'coupons', name: 'Coupons', link: "/admin/coupons" },
    ];
    
    // CSS Variables for Admin nav
    const BORDER_COLOR = 'border-blue-600'; 

    return (
        <>
            {/* Modals */}
            {isContactModalOpen && (
                <Contact onClose={() => setIsContactModalOpen(false)} />
            )}
            {isOfferModalOpen && (
                <OfferModal onClose={() => setIsOfferModalOpen(false)} />
            )}

            {/* Top Offer Bar - Conditionally Rendered */}
            {isOfferBarVisible && (
                <TopOfferBar 
                    formattedTime={formattedTime} 
                    handleDismissOffer={handleDismissOffer}
                    setIsContactModalOpen={setIsContactModalOpen}
                    setIsOfferModalOpen={setIsOfferModalOpen}
                />
            )}

            {/* Main Header (Sticky for desktop) */}
            <header className="sticky top-0 z-40 shadow-sm" style={{ background: "var(--color-card)", borderBottom: "1px solid var(--color-border)" }}>
                <div
                    className={`${global_classnames.width.container}  mx-auto px-4 sm:px-6 lg:px-8`}
                >
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo and Branding */}
                        <Link to="/" className="flex items-center space-x-2">
                            <img
                                src={logo}
                                alt="NxtGen Logo"
                                className="w-12 h-12 mr-2 md:w-14 md:h-14"
                            />
                            <div className="flex flex-col leading-tight">
                                <span className="text-xl md:text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                                    NxtGen Certification
                                </span>
                                <span className="text-xs md:text-sm text-gray-500 hidden sm:flex">
                                    <span className="font-semibold  italic">Powered by JNTU GV </span>
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation & Auth Toggle */}
                        <div className="hidden md:flex items-center gap-4">

                            {/* 🚀 Conditional Admin Navigation 🚀 */}
                            {isAdminUser && (
                                <nav className="flex overflow-x-auto border-r pr-4 mr-2" style={{ borderColor: 'var(--color-border)' }}>
                                    {AdminNavMenu.map((nav) => (
                                        <Link
                                            to={nav.link}
                                            key={nav.id}
                                            onClick={() => setActiveAdminnav(nav.id)}
                                            className={`
                                                flex items-center gap-2 px-3 py-1 border-b-2 text-sm font-medium whitespace-nowrap transition-all duration-200
                                                ${activeAdminnav === nav.id
                                                    ? `${BORDER_COLOR} text-blue-600 font-semibold`
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                                }
                                            `}
                                        >
                                             
                                            <span>{nav.name}</span>
                                        </Link>
                                    ))}
                                </nav>
                            )}
                            
                            {/* Standard Courses Link */}
                            <Link
                                to="/courses"
                                className="text-lg font-semibold transition-colors hover:text-blue-600"
                                style={{ color: "var(--color-text)" }}
                            >
                                Courses
                            </Link>

                            {/* Theme toggle (desktop) */}
                            <button
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                className="p-2 rounded-full hover:opacity-80 transition"
                                style={{ background: "transparent", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* User/Auth Status */}
                            {isAuthenticated ? (
                                <UserAvatar
                                    currentUser={currentUser}
                                    userProfile={userProfile}
                                    navigate={navigate}
                                />
                            ) : (
                                <button
                                    onClick={() => navigate("/auth/signin")}
                                    className="rounded-full text-sm font-medium h-10 px-5 hover:opacity-90 transition-shadow shadow-md"
                                    style={{ background: "var(--color-primary)", color: "var(--color-primary-contrast)" }}
                                >
                                    Login
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-2">
                            {/* Theme toggle (mobile) */}
                            <button
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                className="p-2 rounded-full"
                                style={{ color: "var(--color-text)", border: "1px solid var(--color-border)" }}
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <button
                                className="p-2 transition-colors"
                                style={{ color: "var(--color-primary)" }}
                                onClick={() => setIsMenuOpen(true)}
                            >
                                <Menu className="h-7 w-7" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Drawer (Rendered as separate component) */}
                {isMenuOpen && (
                    <MobileNavigationDrawer
                        setIsMenuOpen={setIsMenuOpen}
                        navigate={navigate}
                        isAuthenticated={isAuthenticated}
                        currentUser={currentUser}
                        handleLogout={handleLogout}
                        setIsContactModalOpen={setIsContactModalOpen}
                        isAdmin={isAdminUser}
                    />
                )}
            </header>
        </>
    );
};

export default Header;

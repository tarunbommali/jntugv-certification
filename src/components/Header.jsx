/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"; // ✅ FIX: useEffect added here for UserAvatar component
import { Menu, X, ArrowRight, UserCircle, Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
// Assuming these are present in your project:
import useCountdownTimer from "../hooks/useCountdownTimer";

import OfferModal from "./ui/modal/OfferModal.jsx";
import Contact from './ui/modal/Contact.jsx'
import { useAuth } from "../contexts/AuthContext.jsx";
import { global_classnames } from "../utils/classnames.js";
import { useTheme } from "../contexts/ThemeContext.jsx";

// Helper function to get initials for placeholder avatar
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

// --- User Avatar Component ---
const UserAvatar = ({ currentUser, userProfile, navigate }) => {
  const photoUrl = currentUser?.photoURL;
  // Prioritize Firestore name, then Google name, then email prefix
  const name =
    userProfile?.name ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0];
  const initials = getInitials(name);

  // State to manage image load status (Crucial for the onError fallback)
  const [imageLoadError, setImageLoadError] = useState(false);

  // Reset error state if photoUrl changes (e.g., user logs in with a different service)
  useEffect(() => {
    setImageLoadError(false);
  }, [photoUrl]);

  return (
    <button
      onClick={() => navigate("/profile")}
      className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
      title={`View Profile: ${currentUser.email}`}
    >
      {/* Conditional rendering for Image or Initials */}

      {photoUrl && !imageLoadError ? (
        <img
          src={photoUrl}
          alt="User Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
          // If the browser cannot load the image for ANY reason, this runs:
          onError={() => setImageLoadError(true)}
        />
      ) : (
        // This initials fallback is the clean result of the failure
        <div className="w-10 h-10 p-2 rounded-full border-amber-200 border-2 bg-blue-600 text-white flex items-center justify-center font-light text-lg">
          {initials}
        </div>
      )}
    </button>
  );
};

const Header = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const navigate = useNavigate(); // Access userProfile which contains Firestore details (e.g., name, college)
  const { isAuthenticated, currentUser, userProfile, logout } = useAuth(); // Assuming useCountdownTimer returns a string like "09:17:10"
  const formattedTime = useCountdownTimer(9 * 3600 + 17 * 60 + 10);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }; // This function remains largely unused in the final component, but kept for context.
  const handleMobileLinkClick = (href) => {
    setIsMenuOpen(false);
    if (href.startsWith("/#")) {
      // Anchor scroll logic here
    } else {
      navigate(href);
    }
  };

  return (
    <>
      {/* Modals */}
      {isContactModalOpen && (
        <Contact onClose={() => setIsContactModalOpen(false)} />
      )}

      {isOfferModalOpen && (
        <OfferModal onClose={() => setIsOfferModalOpen(false)} />
      )}
      {/* Top Offer Bar - Fixed height, highly visible */}
      <div className="w-full text-white py-2 shadow-inner z-50" style={{ background: "var(--color-primary)" }}>

        <div
          className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center md:justify-between items-center text-center text-sm font-semibold`}
        >
          {/* Contact Link (Hidden on small screens) */}

          <button
            className="hidden md:flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsContactModalOpen(true)}
          >
            New Course Enquiry: India - +91 7780351078
          </button>
          {/* Offer Countdown Button */}
          <button
            className="flex items-center gap-2 cursor-pointer rounded-full px-4 py-1.5 font-extrabold transition-all text-xs sm:text-sm shadow-lg"
            style={{ background: "#f59e0b", color: "var(--color-primary)" }}
            onClick={() => setIsOfferModalOpen(true)}
          >
            Career Level Up Offer! Ends in: {formattedTime}
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
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
                alt="JNTU-GV Logo"
                className="w-12 h-12 mr-2 md:w-14 md:h-14"
              />

              <div className="flex flex-col leading-tight">

                <span className="text-xl md:text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                  NxtGen Certification
                </span>

                <span className="text-xs md:text-sm text-gray-500 hidden sm:flex">
                  <span className="font-semibold  italic">Powered by JNTU GV </span>

                </span>

              </div>

            </Link>
            {/* Desktop Navigation */}                       {" "}
            {/* Auth Toggle (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/courses"
                className="text-lg font-semibold transition-colors"
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

              {isAuthenticated ? (
                <>

                  {/* User Avatar component with Profile link */}

                  <UserAvatar
                    currentUser={currentUser}
                    userProfile={userProfile}
                    navigate={navigate}
                  />



                </>
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
        {/* Mobile Navigation Drawer (Slide-in from right) */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            {/* Drawer Content */}
            {/* NOTE: Ensure you have the 'animate-slide-in-right' keyframes in your CSS! */}

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
                {/* Added Profile Link */}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/profile");
                    }}
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
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/auth/signin");
                    }}
                    className="w-full h-12 rounded-md text-white text-base font-medium hover:opacity-90 transition-shadow shadow-md"
                    style={{ background: "var(--color-primary)" }}
                  >
                    Login to Enroll
                  </button>
                )}

              </div>

            </div>

          </>
        )}

      </header>

    </>
  );
};

export default Header;

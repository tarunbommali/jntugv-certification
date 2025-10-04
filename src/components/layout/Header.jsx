import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, UserCircle, Moon, Sun, Clock, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import RealtimeNotificationCenter from '../ui/RealtimeNotificationCenter';
import { cn } from '../../utils/cn';
import logo from '../../assets/logo.jpg';
import useCountdownTimer from '../../hooks/useCountdownTimer';
import OfferModal from '../ui/modal/OfferModal';
import Contact from '../ui/modal/Contact';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

// Local Storage Key
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

// User Avatar Component
const UserAvatar = ({ currentUser, userProfile, navigate }) => {
  const photoUrl = currentUser?.photoURL;
  const name = userProfile?.name || currentUser?.displayName || currentUser?.email?.split("@")[0];
  const initials = getInitials(name);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    setImageLoadError(false);
  }, [photoUrl]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate("/profile")}
      className="flex items-center gap-2 p-1 rounded-full hover:bg-accent"
      title={`View Profile: ${currentUser.email}`}
    >
      {photoUrl && !imageLoadError ? (
        <img
          src={photoUrl}
          alt="User Profile"
          className="w-8 h-8 rounded-full object-cover border-2 border-primary"
          onError={() => setImageLoadError(true)}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
          {initials}
        </div>
      )}
    </Button>
  );
};

// Top Offer Bar Component
const TopOfferBar = ({ formattedTime, handleDismissOffer, setIsContactModalOpen, setIsOfferModalOpen }) => {
  return (
    <div className="w-full text-white py-2 shadow-inner z-50 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center text-sm font-semibold relative">
        {/* Contact Link */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:flex items-center gap-1 text-gray-300 hover:text-white"
          onClick={() => setIsContactModalOpen(true)}
        >
          New Course Enquiry: India - +91 7780351078
        </Button>

        {/* Offer Countdown Button */}
        <Button
          size="sm"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-1.5 shadow-lg mx-auto md:mx-0"
          onClick={() => setIsOfferModalOpen(true)}
        >
          <Clock className="w-4 h-4" />
          Career Level Up Offer! Ends in: **{formattedTime}**
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 text-gray-300 hover:text-white"
          onClick={handleDismissOffer}
          aria-label="Dismiss offer bar"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

// Mobile Navigation Drawer
const MobileNavigationDrawer = ({ 
  setIsMenuOpen, 
  navigate, 
  isAuthenticated, 
  currentUser, 
  handleLogout, 
  setIsContactModalOpen,
  isAdmin
}) => {
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
      <div className="fixed top-0 right-0 w-64 xs:w-72 sm:w-80 h-full p-6 shadow-2xl z-50 transition-transform transform translate-x-0 ease-in-out duration-300 animate-slide-in-right bg-card">
        {/* Drawer Header */}
        <div className="flex justify-end mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4 border-b border-border pb-6">
          {/* Admin Link */}
          {isAdmin && (
            <Button
              variant="ghost"
              className="text-xl font-semibold text-amber-600 hover:text-amber-800 py-2 border-b border-border text-left justify-start"
              onClick={() => handleMobileLinkClick("/admin")}
            >
              <Briefcase className="w-6 h-6 mr-2" />
              Admin Dashboard
            </Button>
          )}

          {/* Profile Link */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              className="text-xl font-semibold text-primary hover:text-primary/80 py-2 border-b border-border text-left justify-start"
              onClick={() => handleMobileLinkClick("/profile")}
            >
              <UserCircle className="w-6 h-6 mr-2" />
              Profile
            </Button>
          )}

          <Button
            variant="ghost"
            asChild
            className="text-xl font-semibold py-2 text-left justify-start"
          >
            <Link to="/courses" onClick={() => handleMobileLinkClick("/courses")}>
              Courses
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            className="text-xl font-semibold text-muted-foreground hover:text-primary py-2 border-b border-border text-left justify-start"
            onClick={() => {
              setIsMenuOpen(false);
              setIsContactModalOpen(true);
            }}
          >
            Contact
          </Button>
        </nav>

        {/* Mobile Auth/User Status */}
        <div className="mt-8">
          {isAuthenticated ? (
            <div className="flex flex-col items-start space-y-3">
              <p className="text-base font-medium text-foreground">
                Signed in as: <br />
                <strong className="break-all text-primary">
                  {currentUser?.email}
                </strong>
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              asChild
              className="w-full"
            >
              <Link to="/auth/signin" onClick={() => handleMobileLinkClick("/auth/signin")}>
                Login to Enroll
              </Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

// Main Header Component
const Header = () => {
  const { toggleTheme, isDark } = useTheme();
  const { isAuthenticated, currentUser, userProfile, logout, isAdmin } = useAuth();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isOfferBarVisible, setIsOfferBarVisible] = useState(true);
  const [activeAdminNav, setActiveAdminNav] = useState('Admin');
  const navigate = useNavigate();
  const formattedTime = useCountdownTimer(9 * 3600 + 17 * 60 + 10);

  // Admin Navigation Menu
  const AdminNavMenu = [
    { id: "Admin", name: "Admin", link: "/admin" },
    { id: 'Analytics', name: 'Analytics', link: "/admin/analytics" },
    { id: 'users', name: 'Users', link: "/admin/users" },
    { id: 'courses', name: 'Courses', link: "/admin/courses" },
    { id: 'coupons', name: 'Coupons', link: "/admin/coupons" },
  ];

  // Load initial visibility state from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem(OFFER_DISMISSED_KEY);
    if (dismissed === 'true') {
      setIsOfferBarVisible(false);
    }
  }, []);

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

  return (
    <>
      {/* Modals */}
      {isContactModalOpen && (
        <Contact onClose={() => setIsContactModalOpen(false)} />
      )}
      {isOfferModalOpen && (
        <OfferModal onClose={() => setIsOfferModalOpen(false)} />
      )}

      {/* Top Offer Bar */}
      {isOfferBarVisible && (
        <TopOfferBar 
          formattedTime={formattedTime} 
          handleDismissOffer={handleDismissOffer}
          setIsContactModalOpen={setIsContactModalOpen}
          setIsOfferModalOpen={setIsOfferModalOpen}
        />
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 shadow-sm bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo and Branding */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logo}
                alt="NxtGen Logo"
                className="w-12 h-12 mr-2 md:w-14 md:h-14"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-xl md:text-2xl font-bold text-primary">
                  NxtGen Certification
                </span>
                <span className="text-xs md:text-sm text-muted-foreground hidden sm:flex">
                  <span className="font-semibold italic">Powered by JNTU GV</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation & Auth */}
            <div className="hidden md:flex items-center gap-4">
              {/* Admin Navigation */}
              {isAdmin && (
                <nav className="flex overflow-x-auto border-r border-border pr-4 mr-2">
                  {AdminNavMenu.map((nav) => (
                    <Button
                      key={nav.id}
                      variant="ghost"
                      asChild
                      className={cn(
                        "flex items-center gap-2 px-3 py-1 border-b-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
                        activeAdminNav === nav.id
                          ? "border-primary text-primary font-semibold"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Link
                        to={nav.link}
                        onClick={() => setActiveAdminNav(nav.id)}
                      >
                        <span>{nav.name}</span>
                      </Link>
                    </Button>
                  ))}
                </nav>
              )}
              
              {/* Courses Link */}
              <Button variant="ghost" asChild>
                <Link to="/courses" className="text-lg font-semibold">
                  Courses
                </Link>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Notifications */}
              {isAuthenticated && (
                <RealtimeNotificationCenter />
              )}

              {/* User/Auth Status */}
              {isAuthenticated ? (
                <UserAvatar
                  currentUser={currentUser}
                  userProfile={userProfile}
                  navigate={navigate}
                />
              ) : (
                <Button asChild>
                  <Link to="/auth/signin">Login</Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-7 w-7" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <MobileNavigationDrawer
            setIsMenuOpen={setIsMenuOpen}
            navigate={navigate}
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            handleLogout={handleLogout}
            setIsContactModalOpen={setIsContactModalOpen}
            isAdmin={isAdmin}
          />
        )}
      </header>
    </>
  );
};

export default Header;
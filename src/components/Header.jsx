/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ArrowRight,
  UserCircle,
  Moon,
  Sun,
  Clock,
  Briefcase,
  Shield,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";
import useCountdownTimer from "../hooks/useCountdownTimer";
import OfferModal from "./ui/modal/OfferModal.jsx";
import Contact from "./ui/modal/Contact.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { global_classnames } from "../utils/classnames.js";
import { useTheme } from "../contexts/ThemeContext.jsx";
import UserAvatar from "./UserAvatar";
import TopOfferBar from "./TopOfferBar.jsx";
import MobileNavigationDrawer from "./MobileNavigationDrawer.jsx";

// --- Local Storage Keys ---
const OFFER_DISMISSED_KEY = "nxtgen_offer_dismissed";
const ADMIN_MODE_KEY = "nxtgen_admin_mode";

const NavigationMenu = ({ isAdminMode, isAdminUser }) => {
  const location = useLocation();

  // Standard user navigation
  const userNavMenu = [{ id: "courses", name: "Courses", link: "/courses" }];

  // Admin navigation
  const adminNavMenu = [
    { id: "admin", name: "Dashboard", link: "/admin" },
    { id: "enrollments", name: "Enrollments", link: "/admin/enrollments" },
    { id: "analytics", name: "Analytics", link: "/admin/analytics" },
    { id: "users", name: "Users", link: "/admin/users" },
    { id: "courses", name: "Courses", link: "/admin/courses" },
    { id: "coupons", name: "Coupons", link: "/admin/coupons" },
  ];

  const navMenu = isAdminMode ? adminNavMenu : userNavMenu;
  const BORDER_COLOR = "border-blue-600";

  // Function to check if a nav item is active based on current path
  const isActiveNav = (navLink) => {
    if (navLink === "/admin" && location.pathname === "/admin") {
      return true;
    }
    if (navLink !== "/admin" && location.pathname.startsWith(navLink)) {
      return true;
    }
    return false;
  };

  return (
    <nav
      className="flex overflow-x-auto border-r pr-4 mr-2"
      style={{ borderColor: "var(--color-border)" }}
    >
      {navMenu.map((nav) => {
        const isActive = isActiveNav(nav.link);
        return (
          <Link
            to={nav.link}
            key={nav.id}
            className={`
                            flex items-center gap-2 px-3 py-1  text-sm font-medium whitespace-nowrap transition-all duration-200
                            ${
                              isActive
                                ? ` text-primary font-semibold`
                                : "border-transparent text-medium hover:text-high"
                            }
                        `}
          >
            <span>{nav.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const Header = () => {
  const { toggleTheme, isDark } = useTheme();
  const {
    isAuthenticated,
    currentUser,
    userProfile,
    logout,
    isAdmin: isUserAdmin,
  } = useAuth();

  // --- State & Handlers ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isOfferBarVisible, setIsOfferBarVisible] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const formattedTime = useCountdownTimer(9 * 3600 + 17 * 60 + 10);

  // Determine if the user is an admin
  const isAdminUser = isUserAdmin;

  // Load admin mode from localStorage on component mount
  useEffect(() => {
    const savedAdminMode = localStorage.getItem(ADMIN_MODE_KEY);
    if (savedAdminMode !== null) {
      setIsAdminMode(savedAdminMode === "true");
    }

    const dismissed = localStorage.getItem(OFFER_DISMISSED_KEY);
    if (dismissed === "true") {
      setIsOfferBarVisible(false);
    }
  }, []);

  // Save admin mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(ADMIN_MODE_KEY, isAdminMode.toString());
  }, [isAdminMode]);

  // Reset admin mode when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setIsAdminMode(false);
      localStorage.setItem(ADMIN_MODE_KEY, "false");
    }
  }, [isAuthenticated]);

  // Auto-manage admin mode based on current route (except profile route)
  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith("/admin");
    const isProfileRoute = location.pathname === "/profile";

    // Don't change admin mode when navigating to profile
    if (isProfileRoute) {
      return;
    }

    // Auto-disable admin mode if not on admin routes
    if (!isAdminRoute && isAdminMode) {
      setIsAdminMode(false);
    }

    // Auto-enable admin mode if on admin routes
    if (isAdminRoute && !isAdminMode && isAdminUser) {
      setIsAdminMode(true);
    }
  }, [location.pathname, isAdminMode, isAdminUser]);

  // Handler: Dismiss the offer bar and save the preference
  const handleDismissOffer = () => {
    setIsOfferBarVisible(false);
    localStorage.setItem(OFFER_DISMISSED_KEY, "true");
  };

  // Handle admin mode toggle
  const handleAdminModeToggle = () => {
    const newMode = !isAdminMode;
    setIsAdminMode(newMode);

    if (newMode) {
      // If turning on admin mode, redirect to admin dashboard
      navigate("/admin");
    } else {
      // If turning off admin mode, redirect to home page
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAdminMode(false);
      localStorage.setItem(ADMIN_MODE_KEY, "false");
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
      <header
        className="sticky top-0 z-40 shadow-sm theme-transition"
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div
          className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 `}
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
                <span
                  className="text-xl md:text-2xl font-bold text-primary"
                >
                  NxtGen Certification
                </span>
                <span className="text-xs md:text-sm text-low hidden sm:flex">
                  <span className="font-semibold italic">
                    Powered by JNTU GV{" "}
                  </span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation & Auth Toggle */}
            <div className="hidden md:flex items-center gap-4">
              {/* Navigation Menu (Changes based on admin mode) */}
              <NavigationMenu
                isAdminMode={isAdminMode}
                isAdminUser={isAdminUser}
              />

              {/* Admin Mode Toggle */}
              {isAdminUser && (
                <div
                  className="flex items-center gap-2 border-r pr-4 mr-2"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <Shield className="w-4 h-4 text-medium" />
                  <span className="text-sm text-medium">Admin</span>
                  <button
                    onClick={handleAdminModeToggle}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      isAdminMode ? "bg-primary" : "bg-disabled"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        isAdminMode ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              )}

              {/* Theme toggle (desktop) */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-full hover:opacity-80 transition focus-ring"
                style={{
                  background: "transparent",
                  color: "var(--color-textHigh)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
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
                  className="btn-primary rounded-full text-sm font-medium h-10 px-5 hover:opacity-90 transition-shadow shadow-md"
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
                className="p-2 rounded-full focus-ring"
                style={{
                  color: "var(--color-textHigh)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button
                className="p-2 transition-colors focus-ring"
                style={{ color: "var(--color-primary)" }}
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-7 w-7" />
              </button>
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
            isAdminUser={isAdminUser}
            isAdminMode={isAdminMode}
            setIsAdminMode={handleAdminModeToggle}
          />
        )}
      </header>
    </>
  );
};

export default Header;

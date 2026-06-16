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
const OFFER_DISMISSED_KEY = "aikya_offer_dismissed";

const NavigationMenu = ({ isAdminUser }) => {
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
    {id:"certifications", name:"Certifications", link:"/admin/certifications"},
  ];

  const navMenu = isAdminUser ? adminNavMenu : userNavMenu;
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
  const navigate = useNavigate();
  const location = useLocation();
  const formattedTime = useCountdownTimer(9 * 3600 + 17 * 60 + 10);

  // Determine if the user is an admin
  const isAdminUser = isUserAdmin;

  useEffect(() => {
    const dismissed = localStorage.getItem(OFFER_DISMISSED_KEY);
    if (dismissed === "true") {
      setIsOfferBarVisible(false);
    }
  }, []);
  // Handler: Dismiss the offer bar and save the preference
  const handleDismissOffer = () => {
    setIsOfferBarVisible(false);
    localStorage.setItem(OFFER_DISMISSED_KEY, "true");
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
            <Link to="/" className="flex items-center outline-none border-none">
              <img
                src={isDark ? "/logo-dark.svg" : "/logo-light.svg"}
                alt="Aikya I/O"
                className="h-10 md:h-12 w-auto"
                style={{ maxWidth: '200px' }}
              />
            </Link>

            {/* Desktop Navigation & Auth Toggle */}
            <div className="hidden md:flex items-center gap-4">
              {/* Navigation Menu (Changes based on admin status) */}
              <NavigationMenu
                isAdminUser={isAdminUser}
              />

              {/* Theme toggle (desktop) */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`transition-all duration-300 rounded-full  ${
                  isDark
                    ? "bg-background text-white border-[var(--color-primary)] "
                    : "bg-surface text-foreground border-[var(--color-primary)] ]"
                }`}
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
            isAdmin={isAdminUser}
          />
        )}
      </header>
    </>
  );
};

export default Header;

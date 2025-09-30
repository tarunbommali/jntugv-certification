/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import useCountdownTimer from "../hooks/useCountdownTimer";
import ContactModal from "./ContactModal";
import OfferModal from "./OfferModal";
import { useAuth } from "../contexts/AuthContext.jsx"; 
import { global_classnames } from "../utils/classnames.js";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  
  const navigate = useNavigate();
  
  const { isAuthenticated, currentUser, logout } = useAuth(); 
  

  const formattedTime = useCountdownTimer(9 * 3600 + 17 * 60 + 10); 

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/#courses" },
    { name: "About", href: "/#about" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  const handleMobileLinkClick = (href) => {
    setIsMenuOpen(false);
    // Use navigate for internal routes, or direct href for anchors
    if (href.startsWith('/#')) {
      // Logic for scrolling to anchor if needed
    } else {
      navigate(href);
    }
  }

  return (
    <>
      {/* Modals */}
      {isContactModalOpen && <ContactModal onClose={() => setIsContactModalOpen(false)} />}
      {isOfferModalOpen && <OfferModal onClose={() => setIsOfferModalOpen(false)} />}

      {/* Top Offer Bar - Fixed height, highly visible */}
      <div className="w-full bg-[#004080] text-white py-2 shadow-inner z-50">
        <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center md:justify-between items-center text-center text-sm font-semibold`}>
          
          {/* Contact Link (Hidden on small screens) */}
          <button
            className="hidden md:flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsContactModalOpen(true)}
          >
            New Course Enquiry: India - +91 7780351078
          </button>

          {/* Offer Countdown Button */}
          <button
            className="flex items-center gap-2 cursor-pointer rounded-full bg-yellow-500 text-[#004080] px-4 py-1.5 font-extrabold hover:bg-yellow-400 transition-all text-xs sm:text-sm shadow-lg"
            onClick={() => setIsOfferModalOpen(true)}
          >
            Career Level Up Offer! Ends in: {formattedTime} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Header (Sticky for desktop) */}
      <header className="sticky top-0 bg-white border-b border-[#d1d9e0] z-40 shadow-sm">
        <div className={`${global_classnames.width.container}  mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className="flex h-20 items-center justify-between">
            
            {/* Logo and Branding */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="JNTU-GV Logo" className="w-12 h-12 mr-2 md:w-14 md:h-14" />
              <div className="flex flex-col leading-tight">
                <span className="text-xl md:text-2xl font-bold text-[#004080]">
                  NxtGen Certification
                </span>
                <span className="text-xs md:text-sm text-gray-500 hidden sm:flex">
                  Powered by JNTU-GV State University
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
                >
                  {item.name}
                  {/* Subtle hover underline */}
                  <span className="absolute left-0 bottom-[-5px] h-0.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
              
              {/* Contact Link (Moved from top bar for primary contact access) */}
              <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                  Contact
              </button>
            </nav>

            {/* Auth Toggle (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600 truncate max-w-[120px]" title={currentUser?.email}>
                    {currentUser?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="rounded-full text-sm font-medium h-10 px-5 bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/auth/signin")}
                  className="rounded-full text-sm font-medium h-10 px-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90 transition-shadow shadow-md"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[#004080] hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-7 w-7" />
            </button>
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
            <div className="fixed top-0 right-0 w-64 xs:w-72 sm:w-80 h-full bg-white p-6 shadow-2xl z-50 transition-transform transform translate-x-0 ease-in-out duration-300 animate-slide-in-right">
              
              {/* Drawer Header (Close Button) */}
              <div className="flex justify-end mb-8">
                <button 
                    className="p-2 text-[#004080] hover:text-red-500" 
                    onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-4 border-b border-gray-200 pb-6">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors py-2 border-b border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                
                {/* Mobile Contact Button */}
                <button 
                    onClick={() => {setIsMenuOpen(false); setIsContactModalOpen(true);}}
                    className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors py-2 border-b border-gray-100 text-left"
                >
                    Contact
                </button>
              </nav>

              {/* Mobile Auth/User Status */}
              <div className="mt-8">
                {isAuthenticated ? (
                  <div className="flex flex-col items-start space-y-3">
                    <p className="text-base text-gray-700 font-medium">
                      Signed in as: <br /><strong className="text-blue-600 break-all">{currentUser?.email}</strong>
                    </p>
                    <button
                      onClick={handleLogout}
                      className="w-full h-12 rounded-md bg-red-600 text-white text-base font-medium hover:bg-red-700 transition-colors shadow-md"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate("/auth/signin"); }}
                    className="w-full h-12 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-white text-base font-medium hover:opacity-90 transition-shadow shadow-md"
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
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { website } from "../utils/constants";
import useCountdownTimer from "../hooks/useCountdownTimer";
import ContactModal from "./ContactModal";
import OfferModal from "./OfferModal";
import { useAuth } from "../contexts/AuthContext.jsx";

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
    { name: "Capstone", href: "/#capstone" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <>
      {/* Contact Modal */}
      {isContactModalOpen && (
        <ContactModal onClose={() => setIsContactModalOpen(false)} />
      )}

      {/* Offer Modal */}
      {isOfferModalOpen && (
        <OfferModal onClose={() => setIsOfferModalOpen(false)} />
      )}

      {/* Top Bar */}
      <div className="max-w-full mx-auto md:px-4 lg:py-2 sm:px-6 lg:px-8 flex text-sm py-2 justify-between bg-[#004080] text-white">
        <h1
          className="cursor-pointer hidden md:flex"
          onClick={() => setIsContactModalOpen(true)}
        >
          New Course Enquiry : India - INR+91 7780351078
        </h1>

        <button
          className=" text-white md:px-3 cursor-pointer rounded"
          onClick={() => setIsOfferModalOpen(true)}
        >
          Career level Up Offer - Flat 10% + Buy 1 Get 1 Ends in : {formattedTime} GRAB NOW
        </button>
      </div>

      {/* Main Header */}
      <div className="max-w-full mx-auto px-2 md:px-4  lg:py-2 sm:px-6 lg:px-6 border-b  border-[#d1d9e0]">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" href={website}>
            <img src={logo} alt="JNTU-GV Logo" className="w-16 h-16 mr-2" />
            <div className="flex flex-col leading-tight">
              <span className="text-xl md:text-2xl font-bold" style={{ color: "#004080" }}>
                NxtGen Certification
              </span>
              <span className="text-xs lg:text-lg hidden md:flex text-muted-foreground">
                JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY GURAJADA VIZIANAGARAM
              </span>
              <span className="text-xs sm:flex md:hidden text-muted-foreground">JNTU-GV</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Auth Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">{currentUser?.email}</span>
                <button
                  onClick={async () => { await logout(); navigate('/'); }}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90 transition-shadow shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/auth/signin')}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90 transition-shadow shadow-md"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0  bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="fixed top-0 left-0 right-0 bg-[#f0f4f8] w-full z-50 h-full animate-slide-in-top  shadow-lg">
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between  ">
                  <div className="flex items-center space-x-3  cursor-pointer" href={website}>
                    <img src={logo} alt="JNTU-GV Logo" className="w-16 h-16 mr-2" />
                    <div className="flex flex-col leading-tight">
                      <span className="text-xl pb-2 font-bold" style={{ color: "#004080" }}>
                        NxtGen Certification
                      </span>
                      <span className="text-xs hidden md:flex text-muted-foreground">
                        JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY GURAJADA VIZIANAGARAM
                      </span>
                      <span className="text-xs sm:flex md:hidden text-muted-foreground">JNTU-GV</span>
                    </div>
                  </div>

                  <button className="p-2" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-6 w-6 text-primary" />
                  </button>
                </div>

                <nav className="py-6 flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-4xl font-light border-t border-[#d1d9e0]  text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}

                  {isAuthenticated ? (
                    <button
                      className="w-full h-12 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-shadow shadow-md"
                      onClick={async () => { await logout(); setIsMenuOpen(false); navigate('/'); }}
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      className="w-full h-12 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-shadow shadow-md"
                      onClick={() => { setIsMenuOpen(false); navigate('/auth/signin'); }}
                    >
                      Login
                    </button>
                  )}
                </nav>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Header;

import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { global_classnames } from "../utils/classnames";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { website } from "../utils/constants";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Overview", href: "/#overview" },
    { name: "Modules", href: "/#modules" },
    { name: "Capstone", href: "/#capstone" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header
      className={`bg-white sticky top-0 z-50 border-b  border-[#d1d9e0]  border-[${global_classnames.container.border}] `}
    >
      <div className="max-w-7xl mx-auto px-4 lg:py-2 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            href={website}
          >
            <img src={logo} alt="JNTU-GV Logo" className="w-16 h-16 mr-2" />
            <div className="flex flex-col leading-tight">
              <span
                className="text-xl pb-2 font-bold"
                style={{ color: "#004080" }}
              >
                NxtGen Certification
              </span>
              <span className="text-xs hidden md:flex text-muted-foreground">
                JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY GURAJADA VIZIANAGARAM
              </span>
              <span className="text-xs sm:flex md:hidden text-muted-foreground">
                JNTU-GV
              </span>
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

          {/* CTA Button on Desktop */}
          <div className="hidden md:flex">
            <Link
              to="/course-registration"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90 transition-shadow shadow-md"
            >
              Register Now
            </Link>
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
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="fixed top-0 left-0 right-0 bg-white z-50 animate-slide-in-top border-b shadow-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between border-b border-border">
                    <div
            className="flex items-center space-x-3 cursor-pointer"
            href={website}
          >
            <img src={logo} alt="JNTU-GV Logo" className="w-16 h-16 mr-2" />
            <div className="flex flex-col leading-tight">
              <span
                className="text-xl pb-2 font-bold"
                style={{ color: "#004080" }}
              >
                NxtGen Certification
              </span>
              <span className="text-xs hidden md:flex text-muted-foreground">
                JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY GURAJADA VIZIANAGARAM
              </span>
              <span className="text-xs sm:flex md:hidden text-muted-foreground">
                JNTU-GV
              </span>
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
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}

                  <button className="w-full h-12 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-shadow shadow-md">
                    Register Now
                  </button>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

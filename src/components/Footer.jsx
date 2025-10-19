import { global_classnames } from "../utils/classnames";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer 
      className="text-sm theme-transition"
      style={{
        background: isDark ? "var(--color-surfaceElevated)" : "var(--color-primary)",
        color: "white"
      }}
    >
      <div 
        className="py-4"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div
          className={`${global_classnames.width.container} md:mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-center`}
        >
          {/* Legal links */}
          <div className="order-1 md:order-2 flex space-x-4 w-full md:w-auto text-left md:text-right">
            {[
              { text: "Privacy Policy", to: "/legal/privacy-policy" },
              { text: "Terms of Service", to: "/legal/terms-of-service" },
            ].map((link) => (
              <Link
                key={link.text}
                to={link.to}
                className="text-white hover:underline theme-transition"
              >
                {link.text}
              </Link>
            ))}
          </div>

          {/* Copyright text */}
          <p className="order-2 md:order-1 w-full md:w-auto text-left md:text-left mt-3 md:mt-0 text-white">
            © {new Date().getFullYear()} JNTU-GV, Vizianagaram. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

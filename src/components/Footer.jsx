/* eslint-disable no-unused-vars */
import { global_classnames } from "../utils/classnames";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="text-sm theme-transition bg-[#0a66c2]"
      style={{
        color: "white",
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
            <Link
              to="/legal/privacy-policy"
              key="Privacy Policy"
              className="text-white hover:underline theme-transition"
            >
              Privacy Policy
            </Link>
            <Link
              to="/legal/terms-of-service"
              key="Terms of Service"
              className="text-white hover:underline theme-transition"
            >
              Terms of Service
            </Link>
          </div>

          {/* Copyright text */}
          <p className="order-2 md:order-1 w-full md:w-auto text-left md:text-left mt-3 md:mt-0 text-white">
            © {new Date().getFullYear()} JNTU-GV, Vizianagaram. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

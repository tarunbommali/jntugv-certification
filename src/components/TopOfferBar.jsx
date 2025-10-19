/* eslint-disable no-unused-vars */
import {
  Menu,
  X,
  ArrowRight,
  UserCircle,
  Moon,
  Sun,
  Clock,
  Briefcase,
} from "lucide-react";
import { global_classnames } from "../utils/classnames.js";

const TopOfferBar = ({
  formattedTime,
  handleDismissOffer,
  setIsContactModalOpen,
  setIsOfferModalOpen,
}) => {
  return (
    <div className="w-full text-white py-2 shadow-inner z-50 bg-[var(--color-primary)]">
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
          className="flex items-center gap-2 cursor-pointer text-[var(--color-onPrimary)] rounded-full px-4 py-1.5 transition-all text-xs sm:text-sm shadow-lg mx-auto md:mx-0"
          style={{ background: "var(--color-success)" }}
          onClick={() => setIsOfferModalOpen(true)}
        >
          <Clock className="w-4 h-4" /> Career Level Up Offer! Ends in: **
          {formattedTime}**
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

export default TopOfferBar;

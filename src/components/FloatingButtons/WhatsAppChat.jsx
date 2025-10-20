/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare } from "lucide-react";
// Assuming global_classnames provides primary colors for branding consistency
import { global_classnames } from "../../utils/classnames"; 
import { FaWhatsapp } from "react-icons/fa";

// Utility function to merge classes
const cn = (...classes) => classes.filter(Boolean).join(" ");

const queryOptions = [
  { value: "callback-request", label: "Callback Request" },
  { value: "course-fee", label: "Course Fee Inquiry" },
  { value: "other-query", label: "Other Query" },
];

const qualificationOptions = [
  { value: "12", label: "12th Completed" },
  { value: "graduation-complete", label: "Graduation Completed" },
  { value: "graduation-ongoing", label: "Graduation Ongoing" },
  { value: "pg-complete", label: "PG Completed" },
  { value: "pg-ongoing", label: "PG Ongoing" },
  { value: "professional", label: "Professional" },
];

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    queryType: "",
    qualification: "",
  });
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);

  // --- Utility: Use a more standard toast/notification system if available, 
  // but keeping 'alert' for simplicity here.
  const showToast = (options) => {
    // In a real app, replace this with a library like react-hot-toast or similar
    console.log(options.description); 
  };

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
    // Prevent scrolling when modal is open
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Your name is required.";
    if (!formData.queryType) newErrors.queryType = "Please select a query type.";
    if (!formData.qualification) newErrors.qualification = "Please select your qualification.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent full form submission/page reload
    
    if (!validateForm()) {
      showToast({
        title: "Validation Error",
        description: "Please fill all mandatory fields to proceed.",
        variant: "destructive",
      });
      return;
    }

    const selectedQuery = queryOptions.find(
      (q) => q.value === formData.queryType
    )?.label;

    const selectedQualification = qualificationOptions.find(
      (q) => q.value === formData.qualification
    )?.label;

    // Crafting a professional, formatted message
    const message = `Hi JNTU-GV Team, I'm interested in the Certification in Emerging Technologies course and have a query.\n\n*Name:* ${formData.name}\n*Qualification:* ${selectedQualification}\n*Query Type:* ${selectedQuery}\n\nPlease help me with further information.`;

    const encodedMessage = encodeURIComponent(message);
    // Hardcoding number (7780351078) as provided in the original code
    const whatsappUrl = `https://wa.me/917780351078?text=${encodedMessage}`; 

    window.open(whatsappUrl, "_blank");

    // Reset form after successful submission/redirection
    setFormData({ name: "", queryType: "", qualification: "" });
    setErrors({});
    setIsOpen(false);

    showToast({
      title: "Redirecting...",
      description: "You'll be redirected to WhatsApp to send your inquiry.",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const baseInputClasses = `
    flex h-10 w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400
    disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] mt-1
  `;

  // Use a fallback for the primary color from global_classnames
  const primaryColor = global_classnames.button?.primary?.bg || 'var(--color-primary)'; 

  return (
    <>
      {/* 1. Chat Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-[900]"> 
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center rounded-full h-16 w-16 bg-green-500 hover:bg-green-600 text-white shadow-xl transition-all duration-300 transform hover:scale-105"
          aria-label="Open WhatsApp Chat"
        >
          <FaWhatsapp className="h-8 w-8" />
        </button>
      </div>

      {/* 2. Chat Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[950]"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="fixed bottom-0 right-0 m-0 sm:m-6 w-full sm:w-96 bg-white rounded-t-xl sm:rounded-xl shadow-2xl z-[960] transition-transform duration-300 transform translate-y-0 sm:translate-y-0"
            // Use custom CSS for the size and animation on the root modal element
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 rounded-t-xl text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center space-x-3">
                <FaWhatsapp className="h-6 w-6 text-green-300" />
                <div className="flex flex-col">
                  <h3 className="font-bold text-lg">Chat with JNTU-GV Team</h3>
                  <p className="text-xs text-gray-200">
                    We'd love to hear from you - Online Now
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close chat window"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-5 max-h-[70vh] sm:max-h-[400px] overflow-y-auto space-y-4">
                
                <p className="text-sm text-gray-600 border-l-4 border-blue-400 pl-3 py-1 bg-blue-50/50 rounded-sm">
                    Fill out the form so we can quickly assist you on WhatsApp.
                </p>

                {/* Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className={cn(
                      baseInputClasses,
                      errors.name && "border-red-500 focus:ring-red-500 focus:border-red-500"
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Highest Qualification Dropdown */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Highest Qualification <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.qualification}
                    onChange={(e) =>
                      handleInputChange("qualification", e.target.value)
                    }
                    className={cn(
                      baseInputClasses,
                      "appearance-none", // Remove default arrow for custom styling if needed
                      errors.qualification && "border-red-500 focus:ring-red-500 focus:border-red-500"
                    )}
                  >
                    <option value="" disabled>Select your qualification</option>
                    {qualificationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.qualification && (
                    <p className="text-red-500 text-xs mt-1">{errors.qualification}</p>
                  )}
                </div>

                {/* Query Type Dropdown */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Query Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.queryType}
                    onChange={(e) => handleInputChange("queryType", e.target.value)}
                    className={cn(
                      baseInputClasses,
                      "appearance-none",
                      errors.queryType && "border-red-500 focus:ring-red-500 focus:border-red-500"
                    )}
                  >
                    <option value="" disabled>Select query type</option>
                    {queryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.queryType && (
                    <p className="text-red-500 text-xs mt-1">{errors.queryType}</p>
                  )}
                </div>
              </div>

              {/* Footer / Submit Button */}
                <div
                className="p-4 bg-gray-50 rounded-b-xl"
                style={{
                  borderTop: `1px solid var(--color-border)`,
                }}
              >
                <button
                  type="submit" // Set type to submit for form handling
                  className="inline-flex items-center justify-center text-white bg-green-600 hover:bg-green-700 rounded-lg font-bold w-full h-11 px-4 py-2 transition-colors shadow-lg transform hover:scale-[1.01]"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Continue to WhatsApp
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default WhatsAppChat;
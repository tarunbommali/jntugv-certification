import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { global_classnames } from "../utils/classnames";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    query: "",
  });
  const [errors, setErrors] = useState({});

  const showToast = (options) => {
    const title = options.title || "";
    const description = options.description || "";
    alert(`${title}\n${description}`);
  };

  const qualifications = [
    { value: "graduation-completed", label: "Graduation Completed" },
    { value: "graduation-ongoing", label: "Graduation Ongoing" },
    { value: "pg-completed", label: "PG Completed" },
    { value: "pg-ongoing", label: "PG Ongoing" },
    { value: "12-intermediate", label: "12th/Intermediate" },
    { value: "diploma", label: "Diploma" },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp number is required";
    } else if (!/^\d{10}$/.test(formData.whatsappNumber.replace(/\s/g, ""))) {
      newErrors.whatsappNumber = "Please enter a valid 10-digit number";
    }
    if (!formData.qualification)
      newErrors.qualification = "Qualification is required";
    if (!formData.query.trim()) newErrors.query = "Query is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      showToast({
        title: "Please fill all required fields",
        description: "All fields are mandatory",
        variant: "destructive",
      });
      return;
    }

    const selectedQualification =
      qualifications.find((q) => q.value === formData.qualification)?.label ||
      formData.qualification;
    const message = `Hi! I'm interested in the Certification in Emerging Technologies course.\n\n*Name:* ${formData.name}\n*WhatsApp Number:* ${formData.whatsappNumber}\n*Highest Qualification:* ${selectedQualification}\n*Query:* ${formData.query}\n\nPlease provide more information about the course.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919876543210?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    setFormData({ name: "", whatsappNumber: "", qualification: "", query: "" });
    setErrors({});
    setIsOpen(false);

    showToast({
      title: "Redirecting to WhatsApp",
      description: "You'll be redirected to WhatsApp with your message",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const baseInputClasses = `
    flex h-10 w-full rounded-md border bg-background px-3 text-sm
    disabled:cursor-not-allowed disabled:opacity-50
    focus:outline-none
  `;

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center rounded-full h-14 w-14 bg-green-500 hover:bg-green-600 text-white shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white border rounded-lg shadow-2xl z-50 animate-scale-in"
            style={{ borderColor: global_classnames.container.border }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 rounded-t-lg text-white"
              style={{ backgroundColor: global_classnames.button.primary.bg }}
            >
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <div className="flex flex-col">
                  <h3 className="font-semibold">WhatsApp Us</h3>

                  <p
                    className="text-sm "
                    style={{ color: global_classnames.text.muted }}
                  >
                    We'd love to hear from you
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    
                    className={cn(
                      baseInputClasses,
                      `border  border-[${global_classnames.container.border}]`,
                      errors.name && "border-red-500"
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Qualification */}
                <div>
                  <label className="text-sm font-medium">
                    Highest Qualification{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.qualification}
                    onChange={(e) =>
                      handleInputChange("qualification", e.target.value)
                    }
                    className={cn(
                      baseInputClasses,
                      `border  border-[${global_classnames.container.border}]`,
                      errors.qualification && "border-red-500"
                    )}
                  >
                    <option value="" disabled>
                      Select your qualification
                    </option>
                    {qualifications.map((qual) => (
                      <option key={qual.value} value={qual.value}>
                        {qual.label}
                      </option>
                    ))}
                  </select>
                  {errors.qualification && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.qualification}
                    </p>
                  )}
                </div>

                {/* Query */}
                <div>
                  <label className="text-sm font-medium">
                    Query <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.query}
                    onChange={(e) => handleInputChange("query", e.target.value)}
                    placeholder="Tell us about your query or interest in the course"
                    rows={3}
                    className={cn(
                      baseInputClasses,
                      `border  border-[${global_classnames.container.border}]`,
                      errors.query && "border-red-500"
                    )}
                  />
                  {errors.query && (
                    <p className="text-red-500 text-xs mt-1">{errors.query}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="p-4 rounded-b-lg"
              style={{
                borderTop: `1px solid ${global_classnames.container.border}`,
              }}
            >
              <button
                onClick={handleSubmit}
                className="inline-flex items-center justify-center text-white bg-green-500 hover:bg-green-600 rounded-md text-sm font-medium w-full h-10 px-4 py-2"
              >
                <Send className="h-4 w-4 mr-2" />
                WhatsApp Us
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default WhatsAppChat;

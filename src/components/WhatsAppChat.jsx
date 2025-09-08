import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { global_classnames } from "../utils/classnames";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const queryOptions = [
  { value: "callback-request", label: "Callback Request" },
  { value: "course-fee", label: "Course Fee Inquiry" },
  { value: "other-query", label: "Other Query" },
];

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    queryType: "",
  });
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);

  const showToast = (options) => {
    const title = options.title || "";
    const description = options.description || "";
    alert(`${title}\n${description}`);
  };

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.queryType) newErrors.queryType = "Query type is required";
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

    const selectedQuery = queryOptions.find(
      (q) => q.value === formData.queryType
    )?.label;

    const message = `Hi! I'm interested in the Certification in Emerging Technologies course.\n\n*Name:* ${formData.name}\n*Query Type:* ${selectedQuery}\n\nPlease provide more information.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    setFormData({ name: "", queryType: "" });
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
            className="fixed bottom-0 right-0 w-full sm:max-w-[calc(100vw-2rem)] md:w-96 bg-white border rounded-t-lg shadow-2xl z-50 animate-scale-in"
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
                    className="text-sm"
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
                    ref={nameInputRef}
                    value={formData.name}
                    onChange={(e) =>
                      handleInputChange("name", e.target.value)
                    }
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

                {/* Query Type Dropdown */}
                <div>
                  <label className="text-sm font-medium">
                    Query Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.queryType}
                    onChange={(e) =>
                      handleInputChange("queryType", e.target.value)
                    }
                    className={cn(
                      baseInputClasses,
                      `border  border-[${global_classnames.container.border}]`,
                      errors.queryType && "border-red-500"
                    )}
                  >
                    <option value="" disabled>
                      Select query type
                    </option>
                    {queryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.queryType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.queryType}
                    </p>
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

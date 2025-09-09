import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import { global_classnames } from "../utils/classnames";

const universities = [
  "JNTU-GV",
  "IIT Bombay",
  "IIT Delhi",
  "IIT Madras",
  "IISc Bangalore",
  "University of Delhi",
  "Anna University",
  "VIT Vellore",
  "BHU",
  "Other",
];

const qualifications = [
  "High School / 10th",
  "Intermediate / 12th",
  "Diploma",
  "Bachelor’s Degree",
  "Master’s Degree",
  "PhD",
  "Other",
];

const courses = [
  "IoT Systems and Applications",
  "Fundamentals of Quantum Computing",
  "Principles of Quantum Computing",
  "AI and Its Tools",
  "Applied Cybersecurity and Network Defense",
  "Emerging Technologies (3 months course)",
];

const RegisterForm = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);  // Added loading state
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    category: "",
    contactNumber: "",
    email: "",
    address: "",
    college: "",
    qualification: "",
    course: "",
    paymentDate: "",
    paymentRef: "",
  });

  const [files, setFiles] = useState({
    paymentReceipt: null,
    applicationForm: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) =>
    setFiles((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));

  const inputClass = `w-full p-3 border rounded border-[${global_classnames.container.border}] focus:outline-none focus:ring-2 focus:ring-[#004080]`;
  const inputErrorClass = `w-full p-3 border rounded border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500`;
  const buttonClass = `px-6 py-3 rounded text-[${global_classnames.button.primary.text}] bg-[${global_classnames.button.primary.bg}] hover:bg-[${global_classnames.button.primary.hover}] border-[${global_classnames.button.primary.border}] transition-all`;

  const tabs = ["Profile", "Education", "Payments"];

  const validateAll = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.contactNumber) newErrors.contactNumber = "Contact Number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.college) newErrors.college = "College/University is required";
    if (!formData.qualification) newErrors.qualification = "Qualification is required";
    if (!formData.course) newErrors.course = "Course is required";
    if (!formData.paymentDate) newErrors.paymentDate = "Payment Date is required";
    if (!formData.paymentRef) newErrors.paymentRef = "Payment Reference is required";
    if (!files.paymentReceipt) newErrors.paymentReceipt = "Payment Receipt is required";
    if (!files.applicationForm) newErrors.applicationForm = "Application Form is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);  // Set loading to true when submission starts

    const scriptURL = "https://script.google.com/macros/s/AKfycbwmEEb4JOrKePOKxi7WKOGA-l5D23pxGjUWps0avUqIOTwbviN1Ien8luPVuYt17kus8g/exec";
    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    Object.keys(files).forEach((key) => files[key] && form.append(key, files[key]));

    try {
      const res = await fetch(scriptURL, { method: "POST", body: form });
      if (res.ok) {
        alert("Registration submitted successfully!");
        setFormData({
          fullName: "",
          gender: "",
          category: "",
          contactNumber: "",
          email: "",
          address: "",
          college: "",
          qualification: "",
          course: "",
          paymentDate: "",
          paymentRef: "",
        });
        setFiles({ paymentReceipt: null, applicationForm: null });
        setErrors({});
        setTab(0);
      } else {
        alert("Submission failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form.");
    } finally {
      setLoading(false);  // Reset loading after submission finishes
    }
  };

  return (
    <div className={`max-w-7xl mx-auto p-8 my-4 rounded shadow bg-[${global_classnames.background.secondary}]`}>
      <h1 className={`text-3xl font-bold mb-8 text-[${global_classnames.heading.primary}]`}>
        Emerging & Advanced Technologies Course Registration
      </h1>

      <div className="flex mb-6 space-x-4">
        {tabs.map((t, idx) => (
          <div
            key={idx}
            onClick={() => setTab(idx)}
            className={`px-4 py-2 rounded-full cursor-pointer font-semibold transition-all
              ${tab === idx ? `bg-[#004080] text-white` : `bg-gray-200 text-gray-600`}`}
          >
            {t}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {tab === 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Full Name *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={errors.fullName ? inputErrorClass : inputClass} />
              {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName}</span>}
            </div>

            {/* Gender */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className={errors.gender ? inputErrorClass : inputClass}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Category *</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} className={errors.category ? inputErrorClass : inputClass} />
              {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
            </div>

            {/* Contact Number */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Contact Number *</label>
              <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={errors.contactNumber ? inputErrorClass : inputClass} />
              {errors.contactNumber && <span className="text-red-500 text-sm">{errors.contactNumber}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? inputErrorClass : inputClass} />
              {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Address *</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className={errors.address ? inputErrorClass : inputClass} />
              {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className="grid md:grid-cols-2 gap-4">
            {/* College */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">College/University *</label>
              <select name="college" value={formData.college} onChange={handleChange} className={errors.college ? inputErrorClass : inputClass}>
                <option value="">Select College/University</option>
                {universities.map((uni, idx) => <option key={idx} value={uni}>{uni}</option>)}
              </select>
              {errors.college && <span className="text-red-500 text-sm">{errors.college}</span>}
            </div>

            {/* Qualification */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Highest Qualification *</label>
              <select name="qualification" value={formData.qualification} onChange={handleChange} className={errors.qualification ? inputErrorClass : inputClass}>
                <option value="">Select Qualification</option>
                {qualifications.map((qual, idx) => <option key={idx} value={qual}>{qual}</option>)}
              </select>
              {errors.qualification && <span className="text-red-500 text-sm">{errors.qualification}</span>}
            </div>

            {/* Course */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Course *</label>
              <select name="course" value={formData.course} onChange={handleChange} className={errors.course ? inputErrorClass : inputClass}>
                <option value="">Select Course</option>
                {courses.map((course, idx) => <option key={idx} value={course}>{course}</option>)}
              </select>
              {errors.course && <span className="text-red-500 text-sm">{errors.course}</span>}
            </div>
          </div>
        )}

        {tab === 2 && (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Payment Date */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Payment Date *</label>
              <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} className={errors.paymentDate ? inputErrorClass : inputClass} />
              {errors.paymentDate && <span className="text-red-500 text-sm">{errors.paymentDate}</span>}
            </div>

            {/* Payment Reference */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Payment Reference Number *</label>
              <input type="text" name="paymentRef" value={formData.paymentRef} onChange={handleChange} className={errors.paymentRef ? inputErrorClass : inputClass} />
              {errors.paymentRef && <span className="text-red-500 text-sm">{errors.paymentRef}</span>}
            </div>

            {/* Payment Receipt Upload */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Upload Payment Receipt *</label>
              <label className={`flex items-center p-3 border rounded cursor-pointer w-full hover:bg-gray-200 ${errors.paymentReceipt ? "border-red-500" : ""}`}>
                <UploadCloud className="mr-2 text-[#004080]" />
                {files.paymentReceipt ? files.paymentReceipt.name : "Click to upload PDF/Image"}
                <input type="file" name="paymentReceipt" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
              </label>
              {errors.paymentReceipt && <span className="text-red-500 text-sm">{errors.paymentReceipt}</span>}
            </div>

            {/* Application Form Upload */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Upload Filled Application Form *</label>
              <label className={`flex items-center p-3 border rounded cursor-pointer w-full hover:bg-gray-200 ${errors.applicationForm ? "border-red-500" : ""}`}>
                <UploadCloud className="mr-2 text-[#004080]" />
                {files.applicationForm ? files.applicationForm.name : "Click to upload PDF"}
                <input type="file" name="applicationForm" onChange={handleFileChange} accept=".pdf" className="hidden" />
              </label>
              {errors.applicationForm && <span className="text-red-500 text-sm">{errors.applicationForm}</span>}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setTab(Math.max(tab - 1, 0))}
            className={`${buttonClass} ${tab === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            Previous
          </button>

          {tab < 2 ? (
            <button type="button" onClick={() => setTab(Math.min(tab + 1, 2))} className={buttonClass} disabled={loading}>
              Next
            </button>
          ) : (
            <button type="submit" className={buttonClass} disabled={loading}>
              {loading ? "Submitting..." : "Submit Registration"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;

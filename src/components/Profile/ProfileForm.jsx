/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Home,
  Calendar,
  Text,
  Code,
  Linkedin,
  Github,
  Save,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";

const Field = ({ label, name, value, onChange, type = "text", icon: Icon, disabled = false, hint = null }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      )}
      <input
        type={type}
        name={name}
        id={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className={`block w-full rounded-lg border-gray-300 ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "focus:border-indigo-500 focus:ring-indigo-500 border"
        } text-gray-900 placeholder-gray-400 sm:text-sm transition-colors duration-150`}
        placeholder={label}
      />
    </div>
    {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
  </div>
);

const ProfileForm = ({
  form,
  onChange,
  onSocialLinkChange,
  onSave,
  saving,
  statusMessage,
  loading,
  userProfile,
}) => {
  const memoContent = React.useMemo(() => {
    if (loading || !userProfile)
      return (
        <div className="p-8 text-center text-lg text-gray-600">Loading profile data...</div>
      );

    return (
      <form onSubmit={onSave} className="space-y-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* --- Basic Information --- */}
          <div className="sm:col-span-2 lg:col-span-3 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
            <p className="text-sm text-gray-500">This information will be visible on your public profile.</p>
          </div>

          <Field label="First Name" name="firstName" value={form.firstName} onChange={onChange("firstName")} icon={User} />
          <Field label="Last Name" name="lastName" value={form.lastName} onChange={onChange("lastName")} icon={User} />
          <Field label="Display Name" name="displayName" value={form.displayName} onChange={onChange("displayName")} icon={User} hint="Your public nickname." />

          <div className="sm:col-span-2">
            <Field label="Email Address" name="email" value={form.email} disabled icon={Mail} hint="To change your email, please contact support." />
          </div>

          <Field label="Phone Number" name="phone" value={form.phone} onChange={onChange("phone")} icon={Phone} type="tel" />
          <Field label="Date of Birth" name="dateOfBirth" value={form.dateOfBirth} onChange={onChange("dateOfBirth")} icon={Calendar} type="date" />

          {/* Gender as select */}
          <div>
            <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-1">
              Gender
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Text className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <select
                id="gender"
                name="gender"
                value={form.gender || ""}
                onChange={onChange("gender")}
                className={`block w-full rounded-lg border-gray-300 pl-10 pr-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 border text-gray-900 placeholder-gray-400 sm:text-sm transition-colors duration-150`}
              >
                <option value="" disabled>Choose gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* University */}
          <Field label="University" name="college" value={form.college} onChange={onChange("college")} icon={Home} />

          {/* --- Bio and Skills --- */}
          <div className="sm:col-span-2 lg:col-span-3 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Professional Summary</h2>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-1">Bio (About me)</label>
            <textarea id="bio" value={form.bio || ""} onChange={onChange("bio")} className="mt-1 block w-full pl-4 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm" rows={4} placeholder="A brief introduction about your goals and interests." />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <Field label="Skills" name="skills" value={form.skills} onChange={onChange("skills")} icon={Code} hint="List your skills, separated by a comma (e.g., React, JavaScript, Node.js)." />
          </div>

          {/* --- Social Links --- */}
          <div className="sm:col-span-2 lg:col-span-3 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Social Presence</h2>
          </div>

          <Field label="LinkedIn Profile URL" name="linkedin" value={form.socialLinks?.linkedin} onChange={onSocialLinkChange("linkedin")} icon={Linkedin} hint="Paste the full URL to your LinkedIn profile." />
          <Field label="GitHub Profile URL" name="github" value={form.socialLinks?.github} onChange={onSocialLinkChange("github")} icon={Github} hint="Paste the full URL to your GitHub profile." />

        </div>

        {/* --- Status Message --- */}
        {statusMessage.message && (
          <div className={`p-4 rounded-lg flex items-center space-x-3 font-medium text-sm ${statusMessage.type === "error" ? "bg-red-100 text-red-800 border border-red-300" : "bg-green-100 text-green-800 border border-green-300"}`}>
            {statusMessage.type === "error" ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{statusMessage.message}</span>
          </div>
        )}

        {/* --- Save Button --- */}
        <div className="flex justify-end pt-4 space-x-3">
          <Link to="/profile" className="flex items-center justify-center space-x-2 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150">
            <ChevronLeft className="w-5 h-5" />
            <span>Cancel</span>
          </Link>
          <button disabled={saving} type="submit" className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150">
            <Save className="w-5 h-5" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    );
  }, [form, loading, saving, statusMessage, userProfile]);

  return memoContent;
};

export default ProfileForm;

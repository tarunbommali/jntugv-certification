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
  Save,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";

const Field = ({ label, name, value, onChange, type = "text", icon: Icon, disabled = false, hint = null, placeholder = null }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-muted mb-1">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-muted" aria-hidden="true" />
        </div>
      )}
      <input
        type={type}
        name={name}
        id={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className={`block w-full rounded-lg border-border ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 ${
          disabled ? "bg-surface-elevated cursor-not-allowed" : "focus:border-indigo-500 focus:ring-indigo-500 border"
        } text-foreground placeholder-gray-400 sm:text-sm transition-colors duration-150`}
        placeholder={placeholder || label}
      />
    </div>
    {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
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
        <div className="p-8 text-center text-lg text-muted">Loading profile data...</div>
      );

    return (
      <form onSubmit={onSave} className="space-y-8 p-6 bg-surface rounded-xl shadow-lg border border-border">
        <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* --- Basic Information --- */}
          <div className="sm:col-span-2 lg:col-span-3 pb-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Personal Details</h2>
            <p className="text-sm text-muted">This information will be visible on your public profile.</p>
          </div>

          <Field label="First Name" name="firstName" value={form.firstName} onChange={onChange("firstName")} icon={User} />
          <Field label="Last Name" name="lastName" value={form.lastName} onChange={onChange("lastName")} icon={User} />
          <Field label="Username" name="username" value={form.username} onChange={onChange("username")} icon={User} placeholder="@username" hint="Your unique public username (only letters, numbers, dot, underscore)." />

          <div className="sm:col-span-2">
            <Field label="Email Address" name="email" value={form.email} disabled icon={Mail} hint="To change your email, please contact support." />
          </div>

          {/* Phone Number with +91 Country Code */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-muted mb-1">
              Mobile Number
            </label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-border bg-background text-muted sm:text-sm font-medium">
                +91
              </span>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={form.phone || ""}
                onChange={onChange("phone")}
                maxLength="10"
                className="flex-1 min-w-0 block w-full px-4 py-2.5 rounded-none rounded-r-lg focus:border-indigo-500 focus:ring-indigo-500 border border-border text-foreground placeholder-gray-400 sm:text-sm transition-colors duration-150"
                placeholder="10-digit mobile number"
              />
            </div>
          </div>
          
          <Field label="Date of Birth" name="dateOfBirth" value={form.dateOfBirth} onChange={onChange("dateOfBirth")} icon={Calendar} type="date" />

          {/* Gender as select */}
          <div>
            <label htmlFor="gender" className="block text-sm font-semibold text-muted mb-1">
              Gender
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Text className="h-5 w-5 text-muted" aria-hidden="true" />
              </div>
              <select
                id="gender"
                name="gender"
                value={form.gender || ""}
                onChange={onChange("gender")}
                className={`block w-full rounded-lg border-border pl-10 pr-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 border text-foreground placeholder-gray-400 sm:text-sm transition-colors duration-150`}
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
          <div className="sm:col-span-2 lg:col-span-3 pt-6 pb-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Professional Summary</h2>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="bio" className="block text-sm font-semibold text-muted mb-1">Bio (About me)</label>
            <textarea id="bio" value={form.bio || ""} onChange={onChange("bio")} className="mt-1 block w-full pl-4 pr-4 py-2.5 rounded-lg border border-border focus:border-indigo-500 focus:ring-indigo-500 shadow-sm" rows={4} placeholder="A brief introduction about your goals and interests." />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <Field label="Skills" name="skills" value={form.skills} onChange={onChange("skills")} hint="List your skills, separated by a comma (e.g., React, JavaScript, Node.js)." />
          </div>

          {/* --- Social Links --- */}
          <div className="sm:col-span-2 lg:col-span-3 pt-6 pb-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Social Presence</h2>
          </div>

          <Field label="LinkedIn Profile URL" name="linkedin" value={form.socialLinks?.linkedin} onChange={onSocialLinkChange("linkedin")} hint="Paste the full URL to your LinkedIn profile." />
          <Field label="GitHub Profile URL" name="github" value={form.socialLinks?.github} onChange={onSocialLinkChange("github")} hint="Paste the full URL to your GitHub profile." />

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
          <Link to="/profile" className="flex items-center justify-center space-x-2 px-6 py-2.5 border border-border rounded-lg text-muted hover:bg-background transition-colors duration-150">
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

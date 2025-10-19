/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { updateUserProfile } from "../firebase/services";
import {
  User,
  Mail,
  Phone,
  Home,
  Calendar,
  BookOpen,
  Text,
  Code,
  Linkedin,
  Github,
  Save,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";

const items = [
  { label: "Home", link: "/" },
  { label: "Profile", link: "/profile" },
  { label: "Edit Profile", link: "/profile/edit" },
];

const ProfileEdit = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

  useEffect(() => {
    if (userProfile) {
      setForm({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        displayName: userProfile.displayName || "",
        phone: userProfile.phone || "",
        college: userProfile.college || "",
        gender: userProfile.gender || "",
        dateOfBirth: userProfile.dateOfBirth || "",
        bio: userProfile.bio || "",
        skills: (userProfile.skills || []).join(", "),
        socialLinks: userProfile.socialLinks || {},
        email: userProfile.email || "",
      });
    }
  }, [userProfile]);

  const onChange = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((s) => ({ ...s, [key]: value }));
    // Clear status message on input change
    setStatusMessage({ type: "", message: "" });
  };

  const onSocialLinkChange = (key) => (e) => {
    setForm((s) => ({
      ...s,
      socialLinks: { ...s.socialLinks, [key]: e.target.value },
    }));
    setStatusMessage({ type: "", message: "" });
  };

  const onSave = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: "", message: "" });
    if (!currentUser) {
      setStatusMessage({
        type: "error",
        message: "User not signed in. Please log in again.",
      });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        firstName: form.firstName || "",
        lastName: form.lastName || "",
        // Fallback for display name if it's empty
        displayName:
          form.displayName ||
          `${form.firstName || ""} ${form.lastName || ""}`.trim() ||
          userProfile.email,
        phone: form.phone || "",
        college: form.college || "",
        gender: form.gender || "",
        dateOfBirth: form.dateOfBirth || null,
        bio: form.bio || "",
        // Convert comma-separated string back to array, removing empty values
        skills: form.skills
          ? form.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        socialLinks: form.socialLinks,
      };

      const res = await updateUserProfile(currentUser.uid, payload);
      if (!res.success)
        throw new Error(res.error || "Failed to update profile");

      setStatusMessage({
        type: "success",
        message: "Profile successfully updated!",
      });

      // Optionally redirect after a short delay
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      setStatusMessage({ type: "error", message: err.message || String(err) });
    } finally {
      setSaving(false);
    }
  };

  // Reusable Input Field Component with Icon
  const Field = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    icon: Icon,
    disabled = false,
    hint = null,
  }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
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
          className={`block w-full rounded-lg border-gray-300 ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 py-2.5 
                                ${
                                  disabled
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "focus:border-indigo-500 focus:ring-indigo-500 border"
                                } 
                                text-gray-900 placeholder-gray-400 sm:text-sm transition-colors duration-150`}
          placeholder={label}
        />
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );

  const memoContent = useMemo(() => {
    if (loading || !userProfile)
      return (
        <div className="p-8 text-center text-lg text-gray-600">
          Loading profile data...
        </div>
      );

    return (
      <form
        onSubmit={onSave}
        className="space-y-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* --- Basic Information --- */}
          <div className="sm:col-span-2 lg:col-span-3 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Personal Details
            </h2>
            <p className="text-sm text-gray-500">
              This information will be visible on your public profile.
            </p>
          </div>

          <Field
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={onChange("firstName")}
            icon={User}
          />
          <Field
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={onChange("lastName")}
            icon={User}
          />
          <Field
            label="Display Name"
            name="displayName"
            value={form.displayName}
            onChange={onChange("displayName")}
            icon={User}
            hint="Your public nickname."
          />

          <div className="sm:col-span-2">
            <Field
              label="Email Address"
              name="email"
              value={form.email}
              disabled
              icon={Mail}
              hint="To change your email, please contact support."
            />
          </div>

          <Field
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={onChange("phone")}
            icon={Phone}
            type="tel"
          />
          <Field
            label="Date of Birth"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={onChange("dateOfBirth")}
            icon={Calendar}
            type="date"
          />

          <Field
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={onChange("gender")}
            icon={Text}
          />
          <Field
            label="College/University"
            name="college"
            value={form.college}
            onChange={onChange("college")}
            icon={Home}
          />

          {/* --- Bio and Skills --- */}
          <div className="sm:col-span-2 lg:col-span-3 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Professional Summary
            </h2>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label
              htmlFor="bio"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Bio (About me)
            </label>
            <textarea
              id="bio"
              value={form.bio || ""}
              onChange={onChange("bio")}
              className="mt-1 block w-full pl-4 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
              rows={4}
              placeholder="A brief introduction about your goals and interests."
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <Field
              label="Skills"
              name="skills"
              value={form.skills}
              onChange={onChange("skills")}
              icon={Code}
              hint="List your skills, separated by a comma (e.g., React, JavaScript, Node.js)."
            />
          </div>

          {/* --- Social Links --- */}
          <div className="sm:col-span-2 lg:col-span-3 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Social Presence</h2>
          </div>

          <Field
            label="LinkedIn Profile URL"
            name="linkedin"
            value={form.socialLinks?.linkedin}
            onChange={onSocialLinkChange("linkedin")}
            icon={Linkedin}
            hint="Paste the full URL to your LinkedIn profile."
          />
          <Field
            label="GitHub Profile URL"
            name="github"
            value={form.socialLinks?.github}
            onChange={onSocialLinkChange("github")}
            icon={Github}
            hint="Paste the full URL to your GitHub profile."
          />

        </div>

        {/* --- Status Message --- */}
        {statusMessage.message && (
          <div
            className={`p-4 rounded-lg flex items-center space-x-3 font-medium text-sm ${
              statusMessage.type === "error"
                ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-green-100 text-green-800 border border-green-300"
            }`}
          >
            {statusMessage.type === "error" ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span>{statusMessage.message}</span>
          </div>
        )}

        {/* --- Save Button --- */}
        <div className="flex justify-end pt-4 space-x-3">
          <Link
            to="/profile"
            className="flex items-center justify-center space-x-2 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Cancel</span>
          </Link>
          <button
            disabled={saving}
            type="submit"
            className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    );
  }, [form, loading, saving, statusMessage, userProfile]);

  return (
    <PageContainer items={items} className="min-h-screen bg-gray-50 py-10">
      <PageTitle
        title="Edit Profile"
        description="Update your personal and professional information"
      />

      {memoContent}
    </PageContainer>
  );
};

export default ProfileEdit;

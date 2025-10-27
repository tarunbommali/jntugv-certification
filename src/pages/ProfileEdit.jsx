/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { updateUserProfile } from "../firebase/services";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import ProfileForm from "../components/Profile/ProfileForm.jsx";

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

  return (
    <PageContainer items={items} className="min-h-screen bg-gray-50 py-10">
      <PageTitle title="Edit Profile" description="Update your personal and professional information" />

      <ProfileForm
        form={form}
        onChange={onChange}
        onSocialLinkChange={onSocialLinkChange}
        onSave={onSave}
        saving={saving}
        statusMessage={statusMessage}
        loading={loading}
        userProfile={userProfile}
      />
    </PageContainer>
  );
};

export default ProfileEdit;

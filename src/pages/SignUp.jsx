/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Loader2, Eye, EyeOff } from "lucide-react";
import useSEO from "../hooks/useSEO.js";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signup, signinWithGoogle, currentUser } = useAuth();

  useSEO({ title: 'Create Account', description: 'Join Aikya I/O — the AI-powered learning marketplace. Sign up to start learning, practicing, and earning certifications.' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password);
    } catch (err) {
      setError(
        "Failed to create an account: " +
        (err?.message || "Please check your credentials.")
      );
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signinWithGoogle();
    } catch (err) {
      console.error('Google sign-up error:', err);
      let errorMessage = "Google sign-in failed. ";
      if (err?.message?.includes('cancelled')) {
        errorMessage += "Sign-in was cancelled.";
      } else if (err?.message?.includes('configured')) {
        errorMessage = err.message;
      } else {
        errorMessage += "Please try again.";
      }
      setError(errorMessage);
    }
    setGoogleLoading(false);
  };

  // Redirect authenticated users away from the signup page
  if (currentUser) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg bg-surface shadow-2xl rounded-xl p-8 sm:p-10 border border-border">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2"
          >
            <img src="/logo-light.svg" alt="Aikya I/O" className="h-12 w-auto" />
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-6">
          Create Your Account
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Email and Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Email Address
            </label>
            <input
              className="w-full border border-border p-3 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Password Input with Eye Toggle */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full border border-border p-3 pr-12 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-muted focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted mt-1">Must be at least 8 characters</p>
          </div>

          {/* Confirm Password Input with Eye Toggle */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                className="w-full border border-border p-3 pr-12 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-muted focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className={`w-full text-white py-3 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 ${loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[var(--color-primary)] hover:bg-[var(--color-primaryHover)]"
              }`}
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-muted text-sm">OR</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Google Sign Up Button */}
        <div>
          <button
            onClick={handleGoogle}
            disabled={loading || googleLoading}
            className={`w-full bg-surface border py-3 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-3 ${loading || googleLoading
              ? "bg-surface-elevated cursor-not-allowed"
              : "border-border text-muted hover:bg-background"
              }`}
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
            )}
            {googleLoading ? "Signing up..." : "Continue with Google"}
          </button>
        </div>

        {/* Link to Sign In */}
        <p className="mt-6 text-sm text-center text-muted">
          Already have an account?{" "}
          <Link
            to="/auth/signin"
            className="text-[var(--color-primary)] font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

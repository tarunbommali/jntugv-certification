/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Loader2, Eye, EyeOff } from "lucide-react";
import useSEO from "../hooks/useSEO.js";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signin, signinWithGoogle, currentUser } = useAuth();

  useSEO({ title: 'Sign In', description: 'Sign in to your Aikya I/O account and continue learning.' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signin(email, password);
    } catch (err) {
      setError(err?.message || "Login failed. Please check your email and password.");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signinWithGoogle();
    } catch (err) {
      console.error('Google sign-in error:', err);
      let errorMessage = "Google sign-in failed. ";
      if (err?.message?.includes('cancelled')) {
        errorMessage += "Sign-in was cancelled.";
      } else if (err?.message?.includes('configured')) {
        errorMessage = err.message;
      } else if (err?.message?.includes('popup')) {
        errorMessage += "Please allow popups for this site.";
      } else {
        errorMessage += "Please try again.";
      }
      setError(errorMessage);
    }
    setGoogleLoading(false);
  };

  // Redirect authenticated users away from the signin page
  if (currentUser) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg bg-surface shadow-2xl rounded-xl p-8 sm:p-10 border border-border">

        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center space-x-2">
            <img src="/logo-light.svg" alt="Aikya I/O" className="h-12 w-auto" />
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-6">
          Sign In
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Email and Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              className="w-full border border-border p-3 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />
          </div>

          <div>
            <div className="relative">
              <input
                className="w-full border border-border p-3 pr-12 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
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
          </div>

          <div className="flex justify-end -mt-2">
            <Link
              to="/auth/forgot-password"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className={`w-full text-white py-3 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-[var(--color-primary)] hover:bg-[var(--color-primaryHover)]"
              }`}
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-muted text-sm">OR</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Google Sign In Button */}
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
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>
        </div>

        {/* Link to Sign Up */}
        <p className="mt-6 text-sm text-center text-muted">
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            className="text-[var(--color-primary)] font-bold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
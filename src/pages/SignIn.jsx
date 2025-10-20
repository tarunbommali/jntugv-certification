/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import logo from "../assets/logo.jpg";
import { Loader2, ArrowRight } from "lucide-react"; 

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signin, signinWithGoogle, currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signin(email, password);
    } catch (err) {
      setError("Login failed. Please check your email and password.");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signinWithGoogle();
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    }
    setLoading(false);
  };

  // Redirect authenticated users away from the signin page
  if (currentUser) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-xl p-8 sm:p-10 border border-gray-100">
        
        {/* Logo and Branding (Same as SignUp) */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center space-x-2">
            <img src={logo} alt="JNTU-GV Logo" className="w-16 h-16" />
            <span className="text-2xl font-extrabold text-[var(--color-primary)]">
              NxtGen Certification
            </span>
          </Link>
        </div>

        <h2 className="text-3xl font-bold  text-gray-900 mb-6">
          Signin 
        </h2>
        

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Email and Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input fields are wrapped in a div for consistent spacing */}
            <div>
              <input
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
            </div>
            <div>
              <input
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              type="submit"
        className={`w-full text-white py-3 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 ${
        loading ? "bg-gray-500 cursor-not-allowed" : "bg-[var(--color-primary)] hover:bg-[var(--color-primaryHover)]"
      }`}
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? "Signing In..." : (
                <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-1" />
                </>
            )}
          </button>
          </form>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Sign In */}
        <div>
          <button
            onClick={handleGoogle}
            disabled={loading}
            className={`w-full bg-white border py-3 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-3 ${
              loading ? "bg-gray-100 cursor-not-allowed" : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>

        {/* Link to Sign Up */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
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
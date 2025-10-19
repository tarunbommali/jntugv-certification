/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import logo from "../assets/logo.jpg";
import { Loader2 } from "lucide-react"; // Import a loading icon for better feedback

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, signinWithGoogle, currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(email, password);
      // Optional: Clear form on success if redirect fails for some reason
    } catch (err) {
      setError("Failed to create an account: " + (err?.message || "Please check your credentials."));
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

  // Redirect authenticated users away from the signup page
  if (currentUser) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-xl p-8 sm:p-10 border border-gray-100">
        
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center space-x-2">
            <img src={logo} alt="JNTU-GV Logo" className="w-16 h-16" />
            <span className="text-2xl font-extrabold text-[#004080]">
              NxtGen Certification
            </span>
          </Link>
        </div>

        <h2 className="text-3xl font-bold  text-gray-900 mb-6">
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
          <input
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#004080] focus:border-[#004080] outline-none transition"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
          <input
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#004080] focus:border-[#004080] outline-none transition"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create Password"
            required
          />
          <button
            disabled={loading}
            type="submit"
            className={`w-full text-white py-3 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#004080] hover:bg-[#003366]"
            }`}
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social Sign Up */}
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

        {/* Link to Sign In */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/auth/signin" className="text-[#004080] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
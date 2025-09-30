import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

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
      alert("Account created successfully!");
    } catch (err) {
      setError("Failed to create an account: " + (err?.message || String(err)));
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signinWithGoogle();
    } catch (err) {
      setError("Google sign-in failed: " + (err?.message || String(err)));
    }
    setLoading(false);
  };

  if (currentUser) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
    
      {/* Main Section */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Create Your Account
          </h2>

          {error && (
            <p className="text-red-600 mb-3 text-center text-sm">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#004080] outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />
            <input
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#004080] outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#004080] text-white py-3 rounded-lg font-medium hover:bg-[#003366] transition-colors"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full bg-white border border-gray-300 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
          </div>

          <p className="mt-5 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/signin" className="text-[#004080] font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUp;

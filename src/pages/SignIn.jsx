import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signin, currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signin(email, password);
    } catch (err) {
      setError('Failed to log in: ' + (err?.message || String(err)));
    }
    setLoading(false);
  };

  if (currentUser) return <Navigate to="/" replace />;

  return (
    <div className="max-w-md mx-auto my-12 p-6 border rounded">
      <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input className="w-full border p-2 rounded" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>
      <p className="mt-3 text-sm">Don't have an account? <Link to="/auth/signup" className="text-blue-600">Sign Up</Link></p>
    </div>
  );
};

export default SignIn;


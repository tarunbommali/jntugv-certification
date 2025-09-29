import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading user status...</div>;
  if (!isAuthenticated) return <Navigate to="/auth/signin" replace />;
  if (requiredRole === 'admin' && !isAdmin) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;


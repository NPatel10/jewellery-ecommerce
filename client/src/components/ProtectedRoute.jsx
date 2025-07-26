import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser.role !== role) {
    // Redirect based on user role
    const redirectPath = currentUser.role === 'admin' ? '/admin' : '/user';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
import React from 'react';
import useAuthStore from '../store/useAuthStore';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoutes;

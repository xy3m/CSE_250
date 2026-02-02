import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePresence } from 'framer-motion';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    const [isPresent] = usePresence();

    if (loading) {
        // You can replace this with a proper loading spinner component
        return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
    }

    if (!isAuthenticated) {
        // If we are animating out, don't redirect (likely logging out)
        if (!isPresent) return null;

        // Redirect to login page with the return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check for role-based access
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // If user is authenticated but doesn't have the required role, redirect to home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;

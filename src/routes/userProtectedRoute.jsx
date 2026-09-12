import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const UserProtectedRoute = ({ isAuthenticated, isType = "", children }) => {
    // Not authenticated - redirect to login

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    // This build serves the client portal only; an admin session has no area
    // here, so send it back to the client sign-in rather than to /admin.
    if (isType && isType === "admin") {
        return <Navigate to="/sign-in" replace />;
    }

    return children;
};

export default UserProtectedRoute;

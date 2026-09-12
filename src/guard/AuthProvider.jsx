import React, { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode"; // Corrected import
import { authLogout } from "@/store/actions";
import isTokenExpired from "@/lib/isTokenExpired";

// Create authentication context
export const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const { isAuthenticated, isType, roleValue, userData, isSuperAdmin, permissions } = useSelector((state) => state?.Auth);
    const dispatch = useDispatch();

    // Authentication state
    const [authState, setAuthState] = useState({
        isType: isType,
        roleValue: roleValue,
        permissions: permissions,
        isSuperAdmin: isSuperAdmin,
    });

    // Token validation function
    const validateToken = useCallback(() => {
        const token = localStorage.getItem("jwt_token");

        if (!token || isTokenExpired(token)) {
            dispatch(authLogout());
            return {
                isType: "",
                roleValue: "",
                permissions: [],
                isSuperAdmin: false,
            };
        }

        try {
            const decoded = jwtDecode(token);

            return {
                isType: decoded.type || "",
                roleValue: decoded.role || "",
                permissions: decoded.permissions || [],
                isSuperAdmin: decoded.isSuperAdmin || false,
            };
        } catch (error) {
            console.error("Token decoding error:", error);
            dispatch(authLogout());
            return {
                isType: "",
                roleValue: "",
                permissions: [],
                isSuperAdmin: false,
            };
        }
    }, [dispatch, userData]);

    // Initial token validation on mount
    useEffect(() => {
        const tokenDetails = validateToken();
        setAuthState(tokenDetails);
    }, [validateToken]);

    // Memoized context value
    const contextValue = useMemo(
        () => ({
            isAuthenticated,
            ...authState,
        }),
        [isAuthenticated, authState]
    );

    // Listen for token changes across tabs
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "jwt_token") {
                const tokenDetails = validateToken();
                setAuthState(tokenDetails);
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [validateToken]);

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export default React.memo(AuthProvider);

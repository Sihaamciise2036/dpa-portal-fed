import React from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <main className="auth-liquid-shell">
            <Outlet />
        </main>
    );
}

export default AuthLayout;

import React, { useContext } from "react";
import { useRoutes } from "react-router-dom";
import UserRoutes from "./userRoutes";
import PublicViewRoutes from "./publicViewRoutes";
import { AuthContext } from "@/guard/AuthProvider";

function Routing() {
    const { isAuthenticated, isType } = useContext(AuthContext);

    // Generate routes based on authentication
    const userRouting = UserRoutes(isAuthenticated, isType);
    const publicRouting = PublicViewRoutes();

    const routing = useRoutes([...publicRouting, ...userRouting]);

    return routing;
}

export default Routing;

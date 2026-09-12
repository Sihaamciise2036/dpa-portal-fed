import { AUTH_REGISTER, AUTH_LOGIN, AUTH_CHECK, AUTH_LOGOUT, AUTH_FORGOT, AUTH_RESET, SET_USERDATA, AUTH_VERIFY_TOKEN } from "@/store/action-types";
import { setBearerToken } from "@/security/Axios";
import { jwtDecode } from "jwt-decode"; // Corrected import

const initialState = {
    isAuthenticated: false,
    isVerify: false,
    isType: "",
    userData: "",
    pageName: "",
    roleValue: "",
    permissions: [],
    isSuperAdmin: false,
};

const Auth = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case AUTH_REGISTER:
            return authRegister(state, payload);
        case AUTH_LOGIN:
            return authLogin(state, payload);
        case AUTH_CHECK:
            return checkAuth(state);
        case AUTH_LOGOUT:
            return logout(state);
        case AUTH_FORGOT:
            return authForgot(state, payload);
        case AUTH_RESET:
            return authReset(state, payload);
        case SET_USERDATA:
            return setUserData(state, payload);
        case AUTH_VERIFY_TOKEN:
            return authVerifyToken(state, payload);
        default:
            return state;
    }
};

const authRegister = (state, payload) => {
    state = Object.assign({}, state, {
        isAuthenticated: false,
        isVerify: false,
        pageName: "register",
        userData: payload.data.data,
    });
    return state;
};

const authLogin = (state, payload) => {
    const jwtToken = payload.data.token;
    localStorage.setItem("jwt_token", jwtToken);
    setBearerToken(jwtToken);
    const decoded = jwtDecode(jwtToken);

    state = Object.assign({}, state, {
        isAuthenticated: true,
        isVerify: true,
        isType: decoded?.type,
        pageName: "home",
        userData: payload.data.data,
        roleValue: decoded.role || "",
        permissions: decoded.permissions || [],
        isSuperAdmin: decoded.isSuperAdmin || false,
    });
    return state;
};

const setUserData = (state, payload) => {
    state = Object.assign({}, state, {
        isVerify: true,
        userData: payload.data,
    });
    return state;
};

const checkAuth = (state) => {
    const jwtToken = localStorage.getItem("jwt_token") || "";
    const decoded = jwtToken ? jwtDecode(jwtToken) : "";

    state = Object.assign({}, state, {
        isAuthenticated: !!localStorage.getItem("jwt_token"),
        isVerify: !!localStorage.getItem("jwt_token"),
        isType: decoded?.type,
        roleValue: decoded.role || "",
        permissions: decoded.permissions || [],
        isSuperAdmin: decoded.isSuperAdmin || false,
    });

    if (state.isAuthenticated) {
        setBearerToken(`${localStorage.getItem("jwt_token")}`);
    }

    return state;
};

const logout = (state) => {
    var userData = "";
    if (state.pageName && state.pageName === "register") {
        userData = state.userData;
    }

    localStorage.clear();
    state = Object.assign({}, state, {
        isAuthenticated: false,
        isVerify: false,
        isType: "",
        userData: userData,
        roleValue: "",
        permissions: [],
        isSuperAdmin: false,
    });
    return state;
};

const authForgot = (state, payload) => {
    state = Object.assign({}, state, {
        userData: payload.data.data,
        isAuthenticated: false,
        isVerify: false,
        isType: "",
        pageName: "FORGOT_PASSWORD",
        roleValue: "",
        permissions: [],
        isSuperAdmin: false,
    });
    return state;
};

const authReset = (state, payload) => {
    state = Object.assign({}, state, {
        userData: "",
        isAuthenticated: false,
        isVerify: false,
        isType: "",
        roleValue: "",
        permissions: [],
        isSuperAdmin: false,
    });
    return state;
};

const authVerifyToken = (state, payload) => {
    state = Object.assign({}, state, {
        userData: payload.data.data,
        isAuthenticated: false,
        isVerify: true,
        isType: "",
        pageName: "VERIFY_TOKEN",
        roleValue: "",
        permissions: [],
        isSuperAdmin: false,
    });
    return state;
};

export default Auth;

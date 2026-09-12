import { AUTH_REGISTER, AUTH_LOGIN, AUTH_CHECK, AUTH_LOGOUT, AUTH_FORGOT, AUTH_RESET, SET_USERDATA, AUTH_VERIFY_TOKEN, GENERAL_SETTING, DEVICE_TOKEN } from "@/store/action-types";

export function authRegister(payload) {
    return {
        type: AUTH_REGISTER,
        payload,
    };
}

export function authLogin(payload) {
    return {
        type: AUTH_LOGIN,
        payload,
    };
}

export function authLogout() {
    return {
        type: AUTH_LOGOUT,
    };
}

export function authForgot(payload) {
    return {
        type: AUTH_FORGOT,
        payload,
    };
}

export function authReset(payload) {
    return {
        type: AUTH_RESET,
        payload,
    };
}

export function authCheck() {
    return {
        type: AUTH_CHECK,
    };
}

export function setUserData(payload) {
    return {
        type: SET_USERDATA,
        payload,
    };
}

export function authVerifyToken(payload) {
    return {
        type: AUTH_VERIFY_TOKEN,
        payload,
    };
}

export function generalSetting(payload) {
    return {
        type: GENERAL_SETTING,
        payload,
    };
}

export function setDeviceToken(payload) {
    return {
        type: DEVICE_TOKEN,
        payload,
    };
}

import { authForgot, authLogin, authRegister, authLogout, authReset, authVerifyToken, generalSetting } from "@/store/actions";
import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function registerAuthService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/auth/register",
        data,
        onSuccess: (dispatch, res) => {
            dispatch(authRegister(res));
            ToastMe(res.data.message, "success");
        },
        onFailure: () => {},
    });
}

export function registerVerifyOtpAuthService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/auth/register/verify-otp",
        data,
        onSuccess: (dispatch, res) => {
            dispatch(authLogin(res));
            ToastMe(res.data.message, "success");
        },
        onFailure: () => {},
    });
}

// Reuses the register reducer on purpose: a resend replaces the stored
// challenge server-side and returns a NEW token, and authRegister is what puts
// the {email, token} pair into userData. Keeping the old token would make
// verification fail with a perfectly correct code.
export function resendRegisterOtpAuthService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/auth/register/resend-otp",
        data,
        onSuccess: (dispatch, res) => {
            dispatch(authRegister(res));
            ToastMe(res.data.message, "success");
        },
        onFailure: () => {},
    });
}

export function loginAuthService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/auth/login",
        data,
        onSuccess: (dispatch, res) => {
            dispatch(authLogin(res));
            ToastMe(res.data.message, "success");
        },
        onFailure: () => {},
    });
}

export function logoutAuthService() {
    return async (dispatch) => {
        dispatch(authLogout());
        ToastMe("Logged out successfully.", "success");
    };
}

export function forgetPasswordAuthService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/auth/forgot-password",
        data,
        onSuccess: (dispatch, res) => {
            dispatch(authForgot(res));
            ToastMe(res.data.message, "success");
        },
        onFailure: () => {},
    });
}

export function verifyTokenAuthService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/auth/verify-token",
        data,
        onSuccess: (dispatch, res) => {
            dispatch(authVerifyToken(res));
            ToastMe(res.data.message, "success");
        },
        onFailure: () => {},
    });
}

export function resetPasswordAuthService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/auth/update-password",
        data,
        onSuccess: (dispatch, res) => {
            dispatch(authReset(res));
            ToastMe(res.data.message, "success");
        },
        onFailure: () => {},
    });
}

export function loginVerifyCheckAuthService() {
    return apiService({
        userType: "user",
        method: "GET",
        url: "/site/check-verify",
        onSuccess: (dispatch, res) => {},
        onFailure: (dispatch) => {
            dispatch(authLogout());
        },
    });
}

export function getGeneralSettingStoreAfterLoginService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/setting/data",
        data,
        onSuccess: (dispatch, res) => {
            dispatch(generalSetting(res.data));
        },
        onFailure: () => {},
    });
}

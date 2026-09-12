import { apiService } from "../apiService";

export function getPaymentMethodService() {
    return apiService({
        userType: "user",
        method: "GET",
        url: "/payment-method/list",
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function addPremierPaymentService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/payment-method/premier",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function addEdahabPaymentService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/payment-method/edahab",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function addWaffiPaymentService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/payment-method/waafi",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function addPaymentMethodService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/payment-method/payment-gateway",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

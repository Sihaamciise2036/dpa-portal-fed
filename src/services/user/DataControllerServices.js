import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function getDataControllerService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/data/controller",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function getByIdDataControllerService(id) {
    return apiService({
        userType: "user",
        method: "GET",
        url: "/data/controller/" + id,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function getStatusByIdDataControllerService() {
    return apiService({
        userType: "user",
        method: "GET",
        url: "/data/controller/status",
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function addDataControllerService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/data/controller/add",
        data,
        onSuccess: (dispatch, res) => {
            ToastMe(res.data.message, "success");
        },
        onFailure: () => {},
    });
}

export function updateDataControllerService(id, data) {
    return apiService({
        userType: "user",
        method: "PUT",
        url: "/data/controller/" + id,
        data,
        onSuccess: (dispatch, res) => {
            ToastMe(res.data.message, "success");
        },
        onFailure: () => {},
    });
}

export function getDataDpoService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/data/dpo",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function getByIdsDataDpoService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/data/dpo/ids",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function getByIdCertificate(id) {
    return apiService({
        userType: "user",
        method: "GET",
        url: "/data/certificate/" + id,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function initiateCompliancePaymentService(id) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/data/controller/initiate-compliance-payment/" + id,
        onSuccess: (dispatch, res) => {
            ToastMe(res.data.message, "success");
        },
        onFailure: (error) => {
            ToastMe(error?.response?.data?.message || "Failed to initiate compliance payment", "error");
        },
    });
}

import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function getAdminService(data) {
    return apiService({
        userType: "admin",
        method: "POST",
        url: "/admin-user/data",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function getByIdAdminService(id) {
    return apiService({
        userType: "admin",
        method: "GET",
        url: "/admin-user/" + id,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function getAdminDataService(id) {
    return apiService({
        userType: "admin",
        method: "GET",
        url: "/admin-user/user/" + id,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function addAdminService(data) {
    return apiService({
        userType: "admin",
        method: "POST",
        url: "/admin-user",
        data,
        onSuccess: (dispatch, res) => {
            ToastMe(res?.data?.message);
        },
        onFailure: () => {},
    });
}

export function updateAdminService(id, data) {
    return apiService({
        userType: "admin",
        method: "PUT",
        url: "/admin-user/" + id,
        data,
        onSuccess: (dispatch, res) => {
            ToastMe(res?.data?.message);
        },
        onFailure: () => {},
    });
}
export function updateAdminPasswordService(id, data) {
    return apiService({
        userType: "admin",
        method: "PUT",
        url: "/admin-user/password/" + id,
        data,
        onSuccess: (dispatch, res) => {
            ToastMe(res?.data?.message);
        },
        onFailure: () => {},
    });
}

export function deleteAdminService(id) {
    return apiService({
        userType: "admin",
        method: "DELETE",
        url: "/admin-user/" + id,
        onSuccess: (dispatch, res) => {
            ToastMe(res?.data?.message);
        },
        onFailure: () => {},
    });
}

export function getAdminWiseOragnizationService(data) {
    return apiService({
        userType: "admin",
        method: "POST",
        url: "/admin-user/organize/data",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function getDataBreachService(data) {
    return apiService({
        userType: "viewer",
        method: "POST",
        url: "/data/breach",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function getDataComplaintService(data) {
    return apiService({
        userType: "viewer",
        method: "POST",
        url: "/data/complaint",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function getDataControllerService(data) {
    return apiService({
        userType: "viewer",
        method: "POST",
        url: "/data/controller",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}
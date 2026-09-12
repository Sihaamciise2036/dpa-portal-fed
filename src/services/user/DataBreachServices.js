import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function getDataBreachService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/data/breach",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function getByIdDataBreachService(id) {
    return apiService({
        userType: "user",
        method: "GET",
        url: "/data/breach/" + id,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function addDataBreachService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/data/breach/add",
        data,
        onSuccess: (dispatch, res) => {
            ToastMe(res.data.message, "success");
        },
        onFailure: () => {},
    });
}

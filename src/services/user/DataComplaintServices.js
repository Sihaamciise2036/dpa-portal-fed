import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function getDataComplaintService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/data/complaint",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function getByIdDataComplaintService(id) {
    return apiService({
        userType: "user",
        method: "GET",
        url: "/data/complaint/" + id,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function addDataComplaintService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/data/complaint/add",
        data,
        onSuccess: (dispatch, res) => {
            ToastMe(res.data.message, "success");
        },
        onFailure: () => {},
    });
}

import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function getTransactionService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/transaction/data",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function getByIdTransactionService(id) {
    return apiService({
        userType: "user",
        method: "GET",
        url: "/transaction/" + id,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function updateTransactionService(id, data) {
    return apiService({
        userType: "user",
        method: "PUT",
        url: "/transaction/" + id,
        data,
        onSuccess: (dispatch, res) => {
            ToastMe(res.data.message, "success");
        },
        onFailure: () => {},
    });
}

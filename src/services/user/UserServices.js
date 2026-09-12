import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function getByIdUserService(id) {
    return apiService({
        userType: "user",
        method: "GET",
        url: "/user/" + id,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function updateUserService(id, data) {
    return apiService({
        userType: "user",
        method: "PUT",
        url: "/user/" + id,
        data,
        onSuccess: (dispatch, res) => {
            ToastMe(res.data.message, "success");
        },
        onFailure: () => {},
    });
}

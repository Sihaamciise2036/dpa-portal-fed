import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function getFormDataReplyService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/data/form-reply/get",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function getFormDataTypeReplyService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/data/form-reply/type/get",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function getFAQService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/faq/list",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

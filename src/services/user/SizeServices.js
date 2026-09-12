import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function getActiveSizesService() {
    return apiService({
        userType: "user",
        method: "GET",
        url: "/size/active",
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

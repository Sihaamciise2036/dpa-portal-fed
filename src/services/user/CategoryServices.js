import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function getActiveCategoriesService() {
    return apiService({
        userType: "user",
        method: "GET",
        url: "/category/active",
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

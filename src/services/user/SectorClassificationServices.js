import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function getSectorClassificationService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/sector-classification/data",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function getCallbackPaymentGatewayService(data, isType) {
    return apiService({
        userType: isType,
        method: "POST",
        url: "/payment/callback/payment-gateway",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

import { authLogin } from "@/store/actions";
import { apiService } from "../apiService";

/**
 * Federated sign-in from eCitizen.
 *
 * One call, and it is the only thing eCitizen is involved in. Every service in
 * this portal — registrations, breach reports, complaints, transactions,
 * payments, tickets — still runs against this portal's own API with the token
 * this exchange returns, unchanged.
 *
 * `userType: "integration"` puts the request at
 * `${API_BASE_URL}/integration/ecitizen/exchange`, outside the `/user` tree,
 * because a citizen arriving from eCitizen has no DPA session yet — that is
 * exactly what this asks for.
 *
 * The response is the same shape the sign-in form receives, so `authLogin` is
 * dispatched here as it is there: the token lands in `jwt_token`, the axios
 * bearer header is set, and nothing downstream needs to know how the session
 * was obtained. It carries one extra field, `redirectTo`, which is the service
 * the citizen actually asked for on eCitizen.
 */
export function ecitizenExchangeService(data) {
    return apiService({
        userType: "integration",
        method: "POST",
        url: "/ecitizen/exchange",
        data,
        onSuccess: (dispatch, res) => {
            dispatch(authLogin(res));
        },
        onFailure: () => {},
    });
}

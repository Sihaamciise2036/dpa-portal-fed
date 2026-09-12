import { post as axiosPost, get as axiosGet, put as axiosPut, del as axiosDelete } from "@/security/Axios";
import ApiErrorHandler from "./ApiErrorHandler";
import { API_BASE_URL } from "@/constants/ApiConstant";

export function apiService({ userType = "admin", method = "GET", url, data = null, onSuccess = () => {}, onFailure = () => {} }) {
    return (dispatch) =>
        new Promise((resolve, reject) => {
            // Determine the method and call the respective axios function
            let request;
            let requestUrl = API_BASE_URL + "/" + userType + url;

            switch (method.toUpperCase()) {
                case "POST":
                    request = axiosPost(requestUrl, data);
                    break;
                case "GET":
                    request = data ? axiosGet(requestUrl, { params: data }) : axiosGet(requestUrl);
                    break;
                case "PUT":
                    request = axiosPut(requestUrl, data);
                    break;
                case "DELETE":
                    request = axiosDelete(requestUrl, { data });
                    break;
                default:
                    return reject(new Error(`Unsupported HTTP method: ${method}. Expected methods: POST, GET, PUT, DELETE.`));
            }

            request
                .then((res) => {
                    onSuccess(dispatch, res);
                    resolve(res);
                })
                .catch((err) => {
                    const errorData = ApiErrorHandler(err);
                    onFailure(dispatch, errorData);
                    reject(errorData);
                });
        });
}

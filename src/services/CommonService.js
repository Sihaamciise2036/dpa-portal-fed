import { post as axiosPost, get as axiosGet } from "@/security/Axios";
import ApiErrorHandler from "./ApiErrorHandler";
import { API_BASE_URL } from "@/constants/ApiConstant";

export function fileUpload(data, folderName) {
    const formData = new FormData();
    if (data != "") {
        Object.keys(data).map((key) => {
            formData.append(key, data[key]);
        });
    }
    return (dispatch) =>
        new Promise((resolve, reject) => {
            axiosPost(API_BASE_URL + "/file/upload/" + folderName, formData, { Accept: "multipart/form-data" })
                .then(function (res) {
                    return resolve(res);
                })
                .catch(function (err) {
                    // handle error
                    const data = ApiErrorHandler(err);
                    return reject(data);
                });
        });
}

export function getFileUrl(fileName, folderName) {
    // Files are guarded server-side; pass the JWT as a query param because
    // <img>/<iframe>/PDF-viewer requests cannot set an Authorization header.
    let token = "";
    try {
        token = localStorage.getItem("jwt_token") || "";
    } catch {
        token = "";
    }
    const base = API_BASE_URL + "/file/get/" + folderName + "/" + fileName;
    return token ? base + "?token=" + encodeURIComponent(token) : base;
}

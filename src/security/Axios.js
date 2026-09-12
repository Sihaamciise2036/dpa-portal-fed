import axios from "axios";
import store from "@/store";
import { authLogout } from "@/store/actions";
import ToastMe from "@/components/ui/ToastMe";

function AxiosMiddleware(method, url, data, options) {
    axios.defaults.headers.common["X-localization"] = `en`;
    switch (method) {
        case "get":
            return axios.get(url, data, options);
        case "post":
            return axios.post(url, data, options);
        case "head":
            return axios.head(url, data, options);
        case "patch":
            return axios.patch(url, data, options);
        case "put":
            return axios.put(url, data, options);
        case "delete":
            return axios.delete(url, { data: data, headers: options });
    }
}

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // No response means the request never completed: the API is down, the
        // host is unreachable, CORS blocked it, or it timed out. Reading
        // error.response.status here used to throw a TypeError, which replaced
        // the real failure with an unhandled rejection and left the caller's
        // .catch() with nothing usable.
        if (!error.response) {
            if (!axios.isCancel?.(error)) {
                ToastMe("Cannot reach the server. Check that the API is running and try again.", "error");
            }
            return Promise.reject(error);
        }
        if (error.response.status === 423) {
            store.dispatch(authLogout());
        }
        if (error.response.status === 401) {
            var userdata = localStorage.getItem("jwt_token");
            if (userdata) {
                ToastMe(error.response.data?.message);
            }
            store.dispatch(authLogout());
        }
        if (error.response.status === 451) {
            window.location.replace("/under-construction");
        }
        if (error.response.status === 406) {
            window.location.replace("/comingsoon");
        }
        return Promise.reject(error);
    }
);

export function get(url, data = [], options = {}) {
    return AxiosMiddleware("get", url, data, options);
}
export function post(url, data = [], options = {}) {
    return AxiosMiddleware("post", url, data, options);
}
export function head(url, data = [], options = {}) {
    return AxiosMiddleware("head", url, data, options);
}
export function patch(url, data = [], options = {}) {
    return AxiosMiddleware("patch", url, data, options);
}
export function put(url, data = [], options = {}) {
    return AxiosMiddleware("put", url, data, options);
}
export function del(url, data = [], options = {}) {
    return AxiosMiddleware("delete", url, data, options);
}

export function setBearerToken(token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

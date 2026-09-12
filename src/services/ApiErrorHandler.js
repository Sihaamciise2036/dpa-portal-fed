import ToastMe from "@/components/ui/ToastMe";

export default (err, toastShow = true) => {
    const statusCode = err.response?.status ?? 0;
    const data = {
        errorData: "",
        statusCode,
        message: "",
    };

    if (toastShow && err?.response?.data?.errors && err?.response?.data?.errors != "") {
        let errorDataArray = err.response.data.errors;
        for (const e in errorDataArray) {
            ToastMe(errorDataArray[e], "error");
            break;
        }
    } else if (toastShow && err.response && err.response.data && err.response.data.message && statusCode != 401) {
        ToastMe(err.response.data.message, "error");
    }

    if (statusCode === 400 || statusCode === 401 || statusCode === 422) {
        data.errorData = err.response && err.response.data && err.response.data.errors ? err.response.data.errors : "";
        data.message = err.response && err.response.data && err.response.data.message ? err.response.data.message : "";
    }
    if (statusCode === 500) {
        console.error(err);
        console.error(data);
    } else {
        console.log(err);
        console.log(data);
    }
    return data;
};

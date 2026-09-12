import { toast } from "react-toastify";

export default (message, type) => {
    if (message != undefined) {
        if (type == "error") {
            toast.error(message);
        } else {
            toast.success(message);
        }
    }
};

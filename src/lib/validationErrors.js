import ToastMe from "@/components/ui/ToastMe";

function validationErrors(errorData, message) {
    if (errorData && errorData.length > 0) {
        for (const field of errorData) {
            ToastMe(field?.msg, "error");
            break; // Stop after the first error
        }
    } else if (message && message != "") {
        ToastMe(message, "error");
    }
}
export default validationErrors;

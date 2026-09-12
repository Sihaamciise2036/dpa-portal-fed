import { cn } from "../../lib/utils";

export default function ErrorMessage({ errorType = "", errorData = "", customMessage = "", className = "" }) {
    const getMessageByType = (eType) => {
        switch (eType) {
            case "required":
                return "This field is required.";
            case "minLength":
                return `Minimum length is ${errorData?.minLength} characters.`;
            case "maxLength":
                return `Maximum length is ${errorData?.maxLength} characters.`;
            case "min":
                return `The value must be at least ${errorData?.min}.`;
            case "max":
                return `The value must not exceed ${errorData?.max}.`;
            case "valid_phone_no":
                return "Please enter a valid phone number.";
            case "valid_email":
                return "Please enter a valid email address.";
            case "pattern":
                if (errorData?.pattern === "number") {
                    return "Please enter a valid number.";
                } else if (errorData?.pattern === "link") {
                    return "Please enter a valid link.";
                } else {
                    return "The value does not match the required pattern.";
                }
            default:
                return "";
        }
    };

    return (
        <>
            {errorType && errorType !== "" ? (
                <p className={cn("error-label text-red-700 mt-1.5 !leading-none db-field-alert", className)}>{getMessageByType(errorType)}</p>
            ) : (
                <p className={cn("error-label text-red-700 mt-1.5 !leading-none db-field-alert", className)}>{customMessage}</p>
            )}
        </>
    );
}

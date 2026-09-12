import { Check, UploadCloudIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import React from "react";
import { PrimaryButton } from "../buttons/primary-button";
import ErrorMessage from "../../common/ErrorMessage";

const InputUpload = ({ id, labelText, labelClassName, inputClassName, iconClassName, groupClassName, errorType, errorData, customMessage, ...props }) => {
    const handleClick = () => {
        document.getElementById(id).click();
    };

    return (
        <div className={cn("form-input-item", groupClassName)}>
            <label
                htmlFor={id}
                className={cn(
                    "input-upload flex flex-col justify-center text-center w-full rounded-lg border px-4 py-2 border-dark-950 bg-white text-dark-950 outline-0 disabled:cursor-not-allowed disabled:opacity-50",
                    groupClassName
                )}>
                <div className="flex items-center flex-col justify-center">
                    <UploadCloudIcon className="size-16" />
                    <input {...props} id={id} type="file" className="hidden" />
                    {labelText && <span className={cn("input-label mb-2", labelClassName)}>{labelText}</span>}
                    <PrimaryButton type="button" onClick={handleClick}>
                        Upload File
                    </PrimaryButton>
                </div>
            </label>
            {errorType && <ErrorMessage errorType={errorType} errorData={errorData} customMessage={customMessage} />}
        </div>
    );
};

export default InputUpload;

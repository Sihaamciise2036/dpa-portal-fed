import { Check } from "lucide-react";
import { cn } from "../../../lib/utils";
import React from "react";
import ErrorMessage from "../../common/ErrorMessage";

const InputCheck = ({ id, labelText, labelClassName, inputClassName, iconClassName, className, groupClassName, size, errorType, errorData, customMessage, ...props }) => {
    const inputProps = { ...props };

    if (Object.prototype.hasOwnProperty.call(inputProps, "checked") && inputProps.checked == null) {
        inputProps.checked = false;
    }

    return (
        <div className={cn("form-input-item", groupClassName)}>
            <label htmlFor={id} className={cn("input-checkbox flex items-center gap-4 text-base 2xl:text-xl font-Inter font-normal text-dark-950", groupClassName)}>
                <div className={cn("custom-checkbox size-8 relative", size === "sm" ? "size-6" : "size-8", className)}>
                    <input
                        {...inputProps}
                        id={id}
                        type="checkbox"
                        className={cn(
                            "border peer transition-all duration-300 outline-none size-full border-[#8aa8c4] rounded-[5px] appearance-none checked:border-[#0b84ee] checked:bg-[#0b84ee]",
                            inputClassName
                        )}
                    />
                    <Check
                        className={cn(
                            "absolute transition-all duration-300 text-white top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 peer-checked:opacity-100 opacity-0 scale-0 peer-checked:scale-100",
                            size === "sm" ? "size-5" : "size-6"
                        )}
                    />
                </div>
                {labelText && <span className={cn("input-label", labelClassName)}>{labelText}</span>}
            </label>
            {errorType && <ErrorMessage errorType={errorType} errorData={errorData} customMessage={customMessage} />}
        </div>
    );
};

export default InputCheck;

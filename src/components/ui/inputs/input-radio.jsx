import React from "react";
import { cn } from "@/lib/utils";

const InputRadio = ({ id, labelText, labelClassName, groupClassName, inputClassName, iconClassName, size, errorType, errorData, customMessage, ...props }) => {
    const inputProps = { ...props };

    if (Object.prototype.hasOwnProperty.call(inputProps, "checked") && inputProps.checked == null) {
        inputProps.checked = false;
    }

    return (
        <div className={cn("form-input-item", groupClassName)}>
            <label htmlFor={id} className={cn("input-radio flex items-center gap-4 text-base 2xl:text-xl font-Inter font-normal text-dark-950", groupClassName)}>
                <div className={cn("custom-radio rounded-full relative", size === "sm" ? "size-6" : "size-8", inputClassName)}>
                    <input
                        {...inputProps}
                        id={id}
                        type="radio"
                        className={cn("border peer transition-all duration-300 outline-none size-full border-black rounded-full appearance-none ", inputClassName)}
                    />
                    <span
                        className={cn(
                            "custom-radio-span rounded-full bg-primary absolute transition-all duration-300 text-white top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 peer-checked:opacity-100 opacity-0 scale-0 peer-checked:scale-100",
                            size === "sm" ? "size-4" : "size-5",
                            iconClassName
                        )}></span>
                </div>
                {labelText && <span className={cn("input-label", labelClassName)}>{labelText}</span>}
            </label>
        </div>
    );
};

export default InputRadio;

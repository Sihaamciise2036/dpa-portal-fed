import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import ErrorMessage from "../../common/ErrorMessage";

const inputVariants = cva("flex w-full rounded-lg border px-4 py-3 border-dark-950 bg-transparent text-primary outline-0 disabled:cursor-not-allowed disabled:opacity-50", {
    variants: {
        variant: {
            default: "",
            outline: "",
        },
        size: {
            default: "px-4",
            sm: "px-4 text-sm",
            lg: "px-4 text-base",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

const InputTextarea = React.forwardRef(({ className, groupClassName, size, variant, type, labelClassName, labelStyleClassName, labelText, errorType, errorData, customMessage, id, ...props }, ref) => {
    const textareaProps = { ...props };

    if (Object.prototype.hasOwnProperty.call(textareaProps, "value") && textareaProps.value == null) {
        textareaProps.value = "";
    }

    return (
        <div className={cn("form-input-item", groupClassName)}>
            {labelText && (
                <label htmlFor={id} className={cn("text-base 2xl:text-xl font-Inter text-dark-950 capitalize mb-3 text-heading inline-block", labelClassName)}>
                    {labelText}
                </label>
            )}
            <textarea className={cn(inputVariants({ size, className, variant }), errorType ? "invalid" : "")} ref={ref} {...textareaProps} />
            {errorType && <ErrorMessage errorType={errorType} errorData={errorData} customMessage={customMessage} />}
        </div>
    );
});

export { InputTextarea, inputVariants };

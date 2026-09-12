import React from "react";
import { cva } from "class-variance-authority";
import ErrorMessage from "../../common/ErrorMessage";
import { cn } from "../../../lib/utils";

const inputVariants = cva("liquid-input flex w-full rounded-lg border px-4 py-2 border-dark-950 bg-transparent text-primary outline-0 disabled:cursor-not-allowed disabled:opacity-50", {
    variants: {
        variant: {
            default: "",
            outline: "",
        },
        size: {
            default: "h-12 2xl:h-14 px-4",
            sm: "h-10 px-4 text-sm",
            lg: "h-12 px-4 text-base",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

const Input = React.forwardRef(
    ({ className, groupClassName, size, variant, type = "text", labelClassName, labelStyleClassName, labelText, disabled = false, errorType, errorData, customMessage, id, ...props }, ref) => {
        const inputProps = { ...props };

        if (type !== "file" && Object.prototype.hasOwnProperty.call(inputProps, "value") && inputProps.value == null) {
            inputProps.value = "";
        }

        return (
            <div className={cn("form-input-item", groupClassName)}>
                {labelText && (
                    <label htmlFor={id} className={cn("text-base 2xl:text-xl font-Inter text-dark-950 capitalize mb-3 text-heading inline-block", labelClassName)}>
                        {labelText}
                    </label>
                )}
                <input
                    type={type}
                    disabled={disabled}
                    className={cn(inputVariants({ size, className, variant }), type === "file" && "input-control", errorType ? "invalid" : "")}
                    ref={ref}
                    {...inputProps}
                />
                {errorType && <ErrorMessage errorType={errorType} errorData={errorData} customMessage={customMessage} />}
            </div>
        );
    }
);

export { Input, inputVariants };

import React from "react";
import { cva } from "class-variance-authority";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { cn } from "../../../lib/utils";
import ErrorMessage from "../../common/ErrorMessage";

const inputVariants = cva("flex w-full rounded-none border border-dark-950 bg-transparent text-primary outline-0 disabled:cursor-not-allowed disabled:opacity-50 custom-select", {
    variants: {
        variant: {
            default: "",
            outline: "",
        },
        size: {
            default: "h-12 2xl:h-14 [&>.input-select__control]:px-4",
            sm: "h-10 rounded-md text-sm [&>.input-select__control]:px-3",
            lg: "h-12 rounded-md text-base [&>.input-select__control]:px-4",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

const InputAsyncSelect = React.forwardRef(({ className, groupClassName, size, variant, type, labelStyleClassName, labelClassName, labelText, options, errors, id, errorType, ...props }, ref) => {
    return (
        <div className={cn("form-input-item", groupClassName)}>
            {labelText && (
                <label htmlFor={id} className={cn("text-base 2xl:text-xl font-Inter text-dark-950 capitalize mb-3 text-heading inline-block", labelClassName)}>
                    {labelText}
                </label>
            )}
            <AsyncSelect
                className={cn(inputVariants({ size, className, variant }), errorType ? "invalid" : "")}
                classNamePrefix="input-select"
                options={options}
                placeholder="Select Option"
                noOptionsMessage={() => "Select Option"}
                {...props}
            />
            {errorType && <ErrorMessage errorType={errorType} />}
        </div>
    );
});

export { InputAsyncSelect, inputVariants };

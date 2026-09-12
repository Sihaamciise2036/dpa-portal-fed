import React, { useState } from "react";
import { cva } from "class-variance-authority";
import ErrorMessage from "@/components/common/ErrorMessage";
import { cn } from "@/lib/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const inputIconVariants = cva("flex gap-4 items-center w-full rounded-lg border px-4 py-2 border-dark-950 bg-transparent text-primary outline-0 disabled:cursor-not-allowed disabled:opacity-50", {
    variants: {
        variant: {
            default: "",
            outline: "",
        },
        size: {
            default: "h-12 2xl:h-14 px-4",
            sm: "h-10 text-sm",
            lg: "h-12 text-base",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

const InputDatepicker = React.forwardRef(
    (
        {
            className,
            groupClassName,
            size,
            variant,
            type,
            prefixIcon,
            prefixWrap,
            iconClassName,
            suffixWrap,
            suffixIcon,
            inputClassName,
            labelClassName,
            labelStyleClassName,
            labelText,
            id,
            errorType,
            ...props
        },
        ref
    ) => {
        return (
            <div className={cn("form-input-item", groupClassName)}>
                {labelText && (
                    <label htmlFor={id} className={cn("text-base 2xl:text-xl font-Inter text-dark-950 capitalize mb-3 text-heading inline-block", labelClassName)}>
                        {labelText}
                    </label>
                )}
                <div className={cn(inputIconVariants({ size, className, variant }), "[&_.react-datepicker-wrapper]:w-full")}>
                    {prefixWrap ? prefixWrap : prefixIcon && <span className={cn("block flex-shrink-0", iconClassName)}>{prefixIcon}</span>}
                    <DatePicker className="bg-transparent text-primary outline-0 disabled:cursor-not-allowed w-full" {...props} />
                    {suffixWrap ? suffixWrap : suffixIcon && <span className={cn("block flex-shrink-0", iconClassName)}>{suffixIcon}</span>}
                </div>
                {errorType && <ErrorMessage errorType={errorType} />}
            </div>
        );
    }
);

export { InputDatepicker };

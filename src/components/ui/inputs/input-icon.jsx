import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import ErrorMessage from "../../common/ErrorMessage";

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

const InputIcon = React.forwardRef(
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
            errorData,
            ...props
        },
        ref
    ) => {
        const inputProps = { ...props };

        if (Object.prototype.hasOwnProperty.call(inputProps, "value") && inputProps.value == null) {
            inputProps.value = "";
        }

        return (
            <div className={cn("form-input-item", groupClassName)}>
                {labelText && (
                    <label htmlFor={id} className={cn("text-base 2xl:text-xl font-Inter text-dark-950 capitalize mb-3 text-heading inline-block", labelClassName)}>
                        {labelText}
                    </label>
                )}
                <div className={cn(inputIconVariants({ size, className, variant }))}>
                    {prefixWrap ? prefixWrap : prefixIcon && <span className={cn("block flex-shrink-0 leading-none", iconClassName)}>{prefixIcon}</span>}
                    <input type={type} id={id} ref={ref} className={cn("outline-0 bg-transparent border-0 w-full h-full", inputClassName)} {...inputProps} />
                    {suffixWrap ? suffixWrap : suffixIcon && <span className={cn("block flex-shrink-0 leading-none", iconClassName)}>{suffixIcon}</span>}
                </div>
                {errorType && <ErrorMessage errorType={errorType} errorData={errorData} />}
            </div>
        );
    }
);

export { InputIcon };

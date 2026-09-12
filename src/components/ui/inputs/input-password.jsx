import React from "react";
import { cva } from "class-variance-authority";
import { forwardRef, useState } from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { cn } from "../../../lib/utils";
import { Eye, EyeClosed } from "lucide-react";

const inputPasswordVariants = cva("liquid-input flex items-center w-full rounded-lg border gap-4 px-4 py-2 border-dark-950 bg-transparent text-primary outline-0 disabled:cursor-not-allowed disabled:opacity-50", {
    variants: {
        variant: {
            default: "",
            outline: "",
        },
        size: {
            default: "h-12 2xl:h-14 px-4 text-base",
            sm: "h-10 px-4 text-sm",
            lg: "h-12 px-4 text-base",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

const InputPassWord = forwardRef(
    (
        {
            className,
            groupClassName,
            size,
            variant,
            type,
            icon,
            prefixIcon,
            prefixWrap,
            iconClassName,
            inputClassName,
            labelClassName,
            labelStyleClassName,
            labelText,
            id,
            errorType,
            errorData,
            customMessage,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        return (
            <div className={cn("form-input-item", groupClassName)}>
                {labelText && (
                    <label htmlFor={id} className={cn("text-base 2xl:text-xl font-Inter text-dark-950 capitalize mb-3 text-heading inline-block", labelClassName)}>
                        {labelText}
                    </label>
                )}
                <div className={cn(inputPasswordVariants({ size, className, variant }))}>
                    {prefixWrap ? prefixWrap : prefixIcon && <span className={cn("block flex-shrink-0 leading-none", iconClassName)}>{prefixIcon}</span>}
                    <input type={showPassword ? "text" : "password"} id={id} ref={ref} className={cn("outline-0 bg-transparent border-0 w-full h-full", inputClassName)} {...props} />
                    <button type="button" className={cn("text-base", iconClassName)} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Eye /> : <EyeClosed />}
                    </button>
                </div>
                {errorType && <ErrorMessage errorType={errorType} errorData={errorData} customMessage={customMessage} />}
            </div>
        );
    }
);

export { InputPassWord };

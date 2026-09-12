import React from "react";
import { cva } from "class-variance-authority";
import Select from "react-select";
import { cn } from "../../../lib/utils";
import ErrorMessage from "../../common/ErrorMessage";

const inputVariants = cva("flex w-full rounded-lg border border-dark-950 bg-transparent text-primary outline-0 disabled:cursor-not-allowed disabled:opacity-50 custom-select", {
    variants: {
        variant: {
            default: "",
            outline: "",
        },
        size: {
            default: "h-12 2xl:h-14 px-4",
            sm: "h-10 rounded-md text-sm px-3",
            lg: "h-12 rounded-md text-base px-4",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

const InputDefaultSelect = React.forwardRef(
    ({ className, groupClassName, size, variant, type, onChange, defaultText, labelStyleClassName, labelClassName, labelText, options, errors, id, errorType, ...props }, ref) => {
        return (
            <div className={cn("form-input-item", groupClassName)}>
                {labelText && (
                    <label htmlFor={id} className={cn("text-base 2xl:text-xl font-Inter text-dark-950 capitalize mb-3 text-heading inline-block", labelClassName)}>
                        {labelText}
                    </label>
                )}
                <select
                    className={cn(inputVariants({ size, className, variant }), "bg-no-repeat appearance-none leading-normal", errorType ? "invalid" : "")}
                    style={{ backgroundImage: 'url("/assets/images/arrow-down.svg")', backgroundSize: "14px", backgroundPosition: "right 10px center" }}
                    placeholder="Select Option"
                    onChange={(e) => onChange(e?.target?.value)}
                    {...props}>
                    {defaultText && <option value="">{defaultText}</option>}
                    {options.map((item, index) => (
                        <option value={item.value} key={index}>
                            {item.label}
                        </option>
                    ))}
                </select>
                {errorType && <ErrorMessage errorType={errorType} />}
            </div>
        );
    }
);

export { InputDefaultSelect, inputVariants };

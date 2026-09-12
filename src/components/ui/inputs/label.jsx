import React from "react";
import { cn } from "../../../lib/utils";

const Label = React.forwardRef(({ className, groupClassName, size, variant, type, labelClassName, labelStyleClassName, labelText, errorType, errorData, customMessage, id, ...props }, ref) => {
    return (
        labelText && (
            <label htmlFor={id} className={cn("text-base 2xl:text-xl font-Inter text-dark-950 capitalize mb-3 text-heading inline-block", labelClassName)}>
                {labelText}
            </label>
        )
    );
});

export { Label };

import { cva } from "class-variance-authority";
import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-center capitalize font-medium rounded-xl transition-colors outline-0 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "liquid-button liquid-button--secondary bg-secondary text-white",
                asLink: "text-xs font-medium text-secondary hover:underline",
                outline: "liquid-button liquid-button--outline",
            },
            size: {
                default: "px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                auto: "",
                "icon-sm": "h-8 w-8",
                "icon-md": "h-9 w-9",
                "icon-lg": "h-10 w-10",
                "icon-xl": "h-11 w-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const SecondaryButton = React.forwardRef(({ className, variant, to, size, isLoading, children, ...props }, ref) => {
    return to ? (
        <Link to={to} className={cn(buttonVariants({ variant, size, className }))} {...props}>
            {children}
        </Link>
    ) : (
        <button className={cn(buttonVariants({ variant, size, className }))} {...props}>
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <></>
            )}
            {children}
        </button>
    );
});

export { SecondaryButton, buttonVariants };

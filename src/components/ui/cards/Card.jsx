import React from "react";
import { cn } from "@/lib/utils";

function Card({ children, className, ...props }) {
    return (
        <div className={cn("db-card liquid-card", className)} {...props}>
            {children}
        </div>
    );
}

export default Card;

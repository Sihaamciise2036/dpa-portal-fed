import React from "react";
import { cn } from "../../lib/utils";

function CardHeader({ children, className, isBorder }) {
    return <div className={cn("db-card-header ", isBorder ? "" : "border-none", className)}>{children}</div>;
}

export default CardHeader;

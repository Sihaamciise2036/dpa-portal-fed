import React from "react";
import { cn } from "../../lib/utils";

function CardBody({ children, className }) {
    return <div className={cn("db-card-body stripe", className)}>{children}</div>;
}

export default CardBody;

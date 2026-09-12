import React from "react";
import { cn } from "../../lib/utils";

export default function CustomCard({ className, children }) {
    return <div className={cn("custom-card liquid-card", className)}>{children}</div>;
}

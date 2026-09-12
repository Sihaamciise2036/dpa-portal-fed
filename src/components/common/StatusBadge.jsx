import { cn } from "@/lib/utils";
import React from "react";

export default function StatusBadge({ label, className }) {
    return <span className={cn("permission-badge rounded-[4px] inline-block text-base text-white capitalize px-4 py-1", className)}>{label}</span>;
}

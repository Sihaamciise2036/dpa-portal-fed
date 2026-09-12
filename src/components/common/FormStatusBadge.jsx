import { cn } from "@/lib/utils";
import React from "react";

export default function FormStatusBadge({ label, className }) {
    const statusList = {
        1: { text: "Pending", bg: "bg-yellow-500" },
        2: { text: "Processing", bg: "bg-blue-500" },
        3: { text: "Validating", bg: "bg-purple-500" },
        4: { text: "Active", bg: "bg-green-500" },
        5: { text: "Rejection", bg: "bg-red-500" },
        6: { text: "Expired", bg: "bg-gray-500" },
        7: { text: "Draft", bg: "bg-gray-500" },
    };

    return <span className={cn("text-white font-medium text-base px-6 py-2 inline-flex rounded-full", statusList[label]?.bg, className)}>{statusList[label]?.text}</span>;
}

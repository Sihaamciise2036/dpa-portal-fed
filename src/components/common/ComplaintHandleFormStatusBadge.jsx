import { cn } from "@/lib/utils";
import React from "react";

export default function ComplaintHandleFormStatusBadge({ label, className }) {
    const statusList = {
        1: { text: "Submitted", bg: "bg-blue-500" },
        2: { text: "Preliminary Assessment", bg: "bg-yellow-500" },
        3: { text: "Investigation in Progress", bg: "bg-purple-500" },
        4: { text: "Confirmation", bg: "bg-green-500" },
        5: { text: "Rejected", bg: "bg-red-500" },
        6: { text: "Closed", bg: "bg-gray-500" },
        7: { text: "Notification", bg: "bg-indigo-500" },
        8: { text: "Remediation", bg: "bg-orange-500" },
        9: { text: "Compliance Verification", bg: "bg-teal-500" },
        10: { text: "Monitoring", bg: "bg-pink-500" },
    };

    return <span className={cn("text-white font-medium text-base px-6 py-2 inline-flex rounded-full", statusList[label]?.bg, className)}>{statusList[label]?.text}</span>;
}

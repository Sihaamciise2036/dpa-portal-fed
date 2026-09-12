import { cn } from "@/lib/utils";
import React from "react";

export default function ProgressBar({ labelText, totalCount, defaultValue, setPageProgress, className, progressFillBgColor, innerValue, progressMainBgColor }) {
    const [progress, setProgress] = React.useState(0 | defaultValue ?? 0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 10 : 100));
            if (setPageProgress) {
                setPageProgress((prev) => (prev < 100 ? prev + 10 : 100));
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {labelText && (
                <div className="flex justify-between text-sm font-medium items-center gap-2 mb-2">
                    <label htmlFor="">{labelText}</label>
                    <h6>{totalCount}</h6>
                </div>
            )}
            <div className={cn("rounded-xl h-5", progressMainBgColor ? progressMainBgColor : "bg-[#FFB200]/10", className)}>
                <div
                    value={progress}
                    max={100}
                    style={{ width: progress + "%" }}
                    className={cn("transition-all duration-500 rounded-xl h-full", progressFillBgColor ? progressFillBgColor : "bg-[#FFB200] ")}>
                    {innerValue && innerValue}
                </div>
            </div>
        </>
    );
}

import { cn } from "@/lib/utils";
import React from "react";

const MainContentPart = ({ children, className, style }) => {
    return (
        <div
            className={cn("front-content-part liquid-content-part px-4 sm:px-6 xl:px-10 py-10 bg-center bg-contain bg-no-repeat h-[calc(100%-128px)] overflow-y-auto", className)}
            style={{ backgroundImage: "none", ...style }}>
            {children}
        </div>
    );
};

export default MainContentPart;

import { cn } from "@/lib/utils";
import React from "react";
export default function InfoCountCard({ data }) {
    return (
        <div className="info-count-card front-action-card liquid-card p-5 3xl:p-5">
            <span className={cn("front-action-card__accent", data?.bgColor)} />
            <h3 className="mb-2 text-lg font-semibold">{data?.title}</h3>
            <p className="text-sm">{data?.text}</p>
        </div>
    );
}

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/cards/Card";

const Tabs = ({ tabsData }) => {
    const [tabsItem, setTabsItem] = useState(0);
    return (
        <div className="tabs-wrappers">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-5">
                {tabsData?.map((data, index) => (
                    <button
                        type="button"
                        onClick={() => setTabsItem(index)}
                        className={cn("tab-sub-btn w-full flex items-center gap-3 h-10 px-4 rounded-lg transition bg-white hover:text-primary hover:bg-primary/5", tabsItem === index && "active")}
                        key={index}>
                        <span className="capitalize whitespace-nowrap text-[15px]">{data.title}</span>
                    </button>
                ))}
            </div>
            {tabsData?.map((data, index) => (
                <Card className={cn("tab-sub-div", tabsItem === index && "active")}>{data?.content}</Card>
            ))}
        </div>
    );
};

export default Tabs;

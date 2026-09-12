import React from "react";
import InfoCountCard from "./InfoCountCard";
import { NavLink } from "react-router-dom";

export default function InfoCountSection() {
    const infoCountData = [
        {
            title: "DC/DP REGISTRATION",
            text: "I want to register as a Data Controller / Data Processor",
            link: "/dc-dp/registration",
            bgColor: "bg-primary",
        },
        {
            title: "EDIT MY PROFILE",
            text: "Manage Profile",
            link: "/user-profile",
            bgColor: "bg-secondary",
        },
        {
            title: "MAKE AN ENQUIRY",
            text: "Feel free to ask us a question",
            link: "/enquiries",
            bgColor: "bg-green",
        },
    ];
    return (
        <section className="dashboard-count-section mb-6">
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
                {infoCountData &&
                    infoCountData.map((item, index) => (
                        <NavLink to={item.link} key={index}>
                            <InfoCountCard data={item} />
                        </NavLink>
                    ))}
            </div>
        </section>
    );
}

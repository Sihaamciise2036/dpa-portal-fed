import React from "react";

const MainPart = ({ children }) => {
    return <main className="main front-liquid-shell xl:flex items-stretch h-[calc(100vh)]">{children}</main>;
};

export default MainPart;

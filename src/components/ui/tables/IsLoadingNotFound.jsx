import React from "react";
import DataLoading from "./DataLoading";
import NoDataFound from "./NoDataFound";

const IsLoadingNotFound = ({ isLoading, colSpan = 1 }) => {
    if (isLoading) {
        return <DataLoading colSpan={colSpan} />;
    } else {
        return <NoDataFound colSpan={colSpan} />;
    }
};

export default IsLoadingNotFound;

import React from "react";

const PaginationText = ({ CountFrom = 1, CountTo = 10, totalCount = 50 }) => {
    return (
        <p className="text-sm text-gray-700">
            Showing {CountFrom} to {CountTo} of {totalCount} entries
        </p>
    );
};

export default PaginationText;

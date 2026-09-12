import React from "react";

const NoDataFound = ({ colSpan = 1 }) => {
    return (
        <tr className="db-table-body-tr">
            <td colSpan="100%" className="text-center py-4" rowSpan={colSpan}>
                No data found
            </td>
        </tr>
    );
};

export default NoDataFound;

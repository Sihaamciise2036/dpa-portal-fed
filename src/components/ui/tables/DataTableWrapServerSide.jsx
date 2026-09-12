import React from "react";
import TablePagination from "./TablePagination";

const DataTableWrapServerSide = ({ totalDataCount, initialPage, onChangePage, per_page, children }) => {
    return (
        <div className="table-main liquid-table">
            <div className="table-responsive">{children}</div>
            <TablePagination items={totalDataCount} initialPage={initialPage} onChangePage={onChangePage} per_page={per_page} />
        </div>
    );
};

export default DataTableWrapServerSide;

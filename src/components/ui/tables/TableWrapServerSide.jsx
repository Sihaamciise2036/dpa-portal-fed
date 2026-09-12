import React from "react";
import TablePagination from "./TablePagination";

const TableWrapServerSide = ({ tableColumnList, totalDataCount, initialPage, onChangePage, per_page, children }) => {
    return (
        <div className="table-main liquid-table">
            <div className="table-responsive">
                <table className="table w-full text-center">
                    <thead>
                        <tr>
                            {tableColumnList.length > 0 &&
                                tableColumnList.map((data, index) => (
                                    <th key={index} className={`py-3 px-6 border-e border-secondary/60  bg-primary text-white ${data?.isAppendClass ? data?.isAppendClass : ""}`}>
                                        {data.name}
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    <tbody className="db-table-body">{children}</tbody>
                </table>
            </div>
            <TablePagination items={totalDataCount} initialPage={initialPage} onChangePage={onChangePage} per_page={per_page} />
        </div>
    );
};

export default TableWrapServerSide;

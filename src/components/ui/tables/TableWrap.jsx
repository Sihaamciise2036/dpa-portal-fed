import React from "react";
import { cn } from "../../lib/utils";

const TableWrap = (props) => {
    const tableDummyColumn = [
        { name: "Name", isIncludePrint: true },
        { name: "Size", isIncludePrint: true },
        { name: "status", isIncludePrint: true },
        { name: "Action", isIncludePrint: false },
    ];
    const tableDummyData = [
        {
            id: "545454545",
            name: "Lorem ipsum dolor sit amet consectetur adipisicing",
            size: "154",
            status: "Active",
        },
        {
            id: "545454545",
            name: "Lorem ipsum dolor sit amet consectetur adipisicing",
            size: "154",
            status: "Active",
        },
        {
            id: "545454545",
            name: "Lorem ipsum dolor sit amet consectetur adipisicing",
            size: "154",
            status: "Inactive",
        },
        {
            id: "545454545",
            name: "Lorem ipsum dolor sit amet consectetur adipisicing",
            size: "154",
            status: "Active",
        },
        {
            id: "545454545",
            name: "Lorem ipsum dolor sit amet consectetur adipisicing",
            size: "154",
            status: "Active",
        },
    ];
    return (
        <div className="table-main liquid-table">
            <div className="table-responsive">
                <table className="db-table stripe">
                    <thead className="db-table-head">
                        <tr className="db-table-head-tr">
                            {tableDummyColumn.length > 0 &&
                                tableDummyColumn.map((data) => (
                                    <th key={data.name} className={`db-table-head-th ${!data.print ? "hidden-print" : ""}`}>
                                        {data.name}
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    <tbody className="db-table-body">
                        {tableDummyData.length > 0
                            ? tableDummyData.map((data) => (
                                  <tr className="db-table-body-tr" key={data.id}>
                                      <td className="db-table-body-td">{data.name}</td>
                                      <td className="db-table-body-td">{data.size}</td>
                                      <td className="db-table-body-td">
                                          <span className={cn(data.status === "Active" ? "db-table-badge text-green-600 bg-green-100" : "db-table-badge text-red-600 bg-red-100")}>{data.status}</span>
                                      </td>
                                      <td className="db-table-body-td hidden-print">
                                          <div className="flex justify-start items-center sm:items-start sm:justify-start gap-1.5">
                                              <a className="db-table-action qr-code" href="#" download>
                                                  <i className="fa fa-qrcode"></i>
                                                  <span className="db-tooltip">qr</span>
                                              </a>
                                              <button className="db-table-action view">
                                                  <i className="lab lab-view"></i>
                                                  <span className="db-tooltip">view</span>
                                              </button>
                                              <button data-modal="#sidebar" className="db-table-action edit">
                                                  <i className="lab lab-edit-line"></i>
                                                  <span className="db-tooltip">edit</span>
                                              </button>
                                              <button className="db-table-action delete">
                                                  <i className="lab lab-delete"></i>
                                                  <span className="db-tooltip">delete</span>
                                              </button>
                                          </div>
                                      </td>
                                  </tr>
                              ))
                            : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableWrap;

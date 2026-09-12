import React, { useState } from "react";
import TableWrapServerSide from "@/components/ui/tables/TableWrapServerSide";
import IsLoadingNotFound from "@/components/ui/tables/IsLoadingNotFound";
import { Link, useNavigate } from "react-router-dom";
import Moment from "moment";
import FormStatusBadge from "@/components/common/FormStatusBadge";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { SecondaryButton } from "@/components/ui/buttons/secondary-button";

const DataTable = ({ isLoading, tableColumn, dataSource, totalRecord, dataFilter, onChangePage }) => {
    const navigate = useNavigate();

    const statusList = {
        1: "Unpaid",
        2: "Paid",
        3: "Failed",
        4: "Waiting For Approval",
    };

    return (
        <TableWrapServerSide tableColumnList={tableColumn} totalDataCount={totalRecord} initialPage={dataFilter?.page} onChangePage={onChangePage} per_page={dataFilter?.limit}>
            {dataSource.length > 0 ? (
                dataSource.map((data, index) => (
                    <tr key={index} className="bg-secondary/35 [&>td:last-child]:border-e-0">
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">
                            <div className="flex gap-2">
                                <SecondaryButton type="button" onClick={() => navigate("/transaction/" + data?._id + "/view")} className="rounded-full min-w-[94px] text-sm">
                                    View
                                </SecondaryButton>
                            </div>
                        </td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{Moment(data?.updatedAt).format("Y-M-D hh:mm:ss")}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{statusList[data?.status]}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.amount ?? 0}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.transaction_no ?? "-"}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.modelType}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.modelId}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.payment_method}</td>
                    </tr>
                ))
            ) : (
                <IsLoadingNotFound isLoading={isLoading} colSpan={tableColumn.length} />
            )}
        </TableWrapServerSide>
    );
};

export default DataTable;

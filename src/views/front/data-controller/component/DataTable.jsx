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

    const organizationTypeList = {
        1: "Public",
        2: "Private",
        3: "NGO",
        4: "Other",
    };
    const entityOptionList = {
        1: "Data Controller",
        2: "Data Processor",
        3: "Both",
    };

    return (
        <TableWrapServerSide tableColumnList={tableColumn} totalDataCount={totalRecord} initialPage={dataFilter?.page} onChangePage={onChangePage} per_page={dataFilter?.limit}>
            {dataSource.length > 0 ? (
                dataSource.map((data, index) => (
                    <tr key={index} className="bg-secondary/35 [&>td:last-child]:border-e-0">
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">
                            <div className="flex gap-2">
                                <SecondaryButton type="button" onClick={() => navigate("/dc-dp/" + data?._id + "/edit")} className="rounded-full min-w-[94px] text-sm">
                                    View
                                </SecondaryButton>
                            </div>
                        </td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">
                            <FormStatusBadge label={data?.status} />
                        </td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.contact?.name}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.organizationType?.name}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{entityOptionList[data.entityType]}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.dpaLicenceNumber ?? "-"}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.contact?.number}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.contact?.email}</td>
                    </tr>
                ))
            ) : (
                <IsLoadingNotFound isLoading={isLoading} colSpan={tableColumn.length} />
            )}
        </TableWrapServerSide>
    );
};

export default DataTable;

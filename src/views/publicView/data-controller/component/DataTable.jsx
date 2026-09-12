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
    console.log({dataSource});
    

    return (
        <TableWrapServerSide tableColumnList={tableColumn} totalDataCount={totalRecord} initialPage={dataFilter?.page} onChangePage={onChangePage} per_page={dataFilter?.limit}>
            {dataSource.length > 0 ? (
                dataSource.map((data, index) => (
                    <tr key={index} className="bg-secondary/35 [&>td:last-child]:border-e-0">
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.contact?.name}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{Moment(data?.createdAt).add(1, "years").format("DD-MM-YYYY")}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.dpaLicenceNumber ?? "-"}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.contact?.email}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.contact?.number}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">{data?.contact?.state}</td>
                        <td className="py-3 px-6 border-t border-e border-secondary/60 ">
                            {data?.status == '6' ?
                                <>
                                    ⚠️<br/>
                                    Expired
                                </>
                                :
                                <>
                                    ✅<br/>
                                    Active
                                </>
                            }
                        </td>
                    </tr>
                ))
            ) : (
                <IsLoadingNotFound isLoading={isLoading} colSpan={tableColumn.length} />
            )}
        </TableWrapServerSide>
    );
};

export default DataTable;

import React, { useState, useEffect, useRef } from "react";
import MainContentPart from "@/layout/front/MainContentPart";
import CustomCard from "@/components/common/CustomCard";
import { cn } from "@/lib/utils";
import { InputIcon } from "@/components/ui/inputs/input-icon";
import { PlusIcon, SearchIcon } from "lucide-react";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { SecondaryButton } from "@/components/ui/buttons/secondary-button";
import { getSupportTicketService } from "@/services/user/SupportTicketServices";
import DataTable from "./component/DataTable";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import validationErrors from "@/lib/validationErrors";

export default function EnquiriesPage(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectDataType, setSelectDataType] = useState(1);
    const [selectListing, setSelectListing] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [totalRecord, setTotalRecord] = useState(0);
    const [editDataId, setEditDataId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [dataFilter, setDataFilter] = useState({
        search: "",
        page: 1,
        limit: 10,
        extra_filter: {},
    });
    const tableColumn = [
        { name: "Action", isAppendClass: "rounded-tl-[10px]" },
        { name: "Status", isAppendClass: "" },
        { name: "Created At", isAppendClass: "" },
        { name: "Subject", isAppendClass: "rounded-tr-[10px]" },
    ];

    useEffect(() => {
        getTableData();
    }, [dataFilter]);

    const onChangeFilter = (name, value) => {
        if (name === "extra_filter") {
            setDataFilter({ ...dataFilter, extra_filter: value });
        } else {
            setDataFilter({ ...dataFilter, [name]: value });
        }
    };

    const getTableData = () => {
        setIsLoading(true);
        dispatch(getSupportTicketService(dataFilter))
            .then((res) => {
                setTotalRecord(res?.data?.data?.total);
                setDataSource(res?.data?.data?.data);
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
            });
    };

    return (
        <MainContentPart>
            <CustomCard className="p-6 !border-t-4 !border-t-green">
                <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                    <h2 className="text-xl font-semibold text-primary">{props?.pageTitle}</h2>
                </div>
                <div className="card-body">
                    <div className="flex items-right justify-end gap-2 sm:gap-3 mb-4">
                        <SecondaryButton className="max-sm:text-sm px-4 py-2 sm:py-3" onClick={() => navigate("/enquiries/add")}>
                            <PlusIcon className="size-6" /> New Enquiry
                        </SecondaryButton>
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable isLoading={isLoading} tableColumn={tableColumn} dataSource={dataSource} totalRecord={totalRecord} dataFilter={dataFilter} onChangePage={onChangeFilter} />
                    </div>
                </div>
            </CustomCard>
        </MainContentPart>
    );
}

import React, { useState, useEffect, useRef } from "react";
import MainContentPart from "@/layout/front/MainContentPart";
import CustomCard from "@/components/common/CustomCard";
import { InputIcon } from "@/components/ui/inputs/input-icon";
import { SearchIcon } from "lucide-react";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { SecondaryButton } from "@/components/ui/buttons/secondary-button";
import { getTransactionService } from "@/services/user/TransactionServices";
import PendingDataTable from "./component/PendingDataTable";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import validationErrors from "@/lib/validationErrors";
import Swal from "sweetalert2";

export default function PendingTransactionPage(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectFormType, setSelectFormType] = useState(1);
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
        extra_filter: { transactionStatusNotIn: [2, 3] },
    });
    const tableColumn = [
        { name: "Action", isAppendClass: "rounded-tl-[10px]" },
        { name: "Update At", isAppendClass: "" },
        { name: "Payment Status", isAppendClass: "" },
        { name: "Fees", isAppendClass: "" },
        { name: "Form Type", isAppendClass: "" },
        { name: "Form Id", isAppendClass: "rounded-tr-[10px]" },
    ];

    useEffect(() => {
        getTableData();
    }, [dataFilter]);

    const onChangeFilter = (name, value) => {
        if (name === "extra_filter") {
            let filterObj = value;
            setDataFilter({ ...dataFilter, extra_filter: filterObj });
        } else {
            setDataFilter({ ...dataFilter, [name]: value });
        }
    };

    const getTableData = () => {
        setIsLoading(true);
        dispatch(getTransactionService(dataFilter))
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
                    <div className="search-box flex items-center gap-6 mb-8">
                        <InputIcon
                            onChange={(event) => onChangeFilter("search", event?.target?.value)}
                            prefixIcon={<SearchIcon className="text-light-850" />}
                            className="border-muted rounded-[10px]"
                            groupClassName="flex-grow"
                            placeholder="Search"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <PendingDataTable isLoading={isLoading} tableColumn={tableColumn} dataSource={dataSource} totalRecord={totalRecord} dataFilter={dataFilter} onChangePage={onChangeFilter} />
                    </div>
                </div>
            </CustomCard>
        </MainContentPart>
    );
}

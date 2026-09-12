import React, { useState, useEffect, useRef } from "react";
import MainContentPart from "@/layout/front/MainContentPart";
import CustomCard from "@/components/common/CustomCard";
import { InputIcon } from "@/components/ui/inputs/input-icon";
import { SearchIcon } from "lucide-react";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { SecondaryButton } from "@/components/ui/buttons/secondary-button";
import { getFormDataReplyService, getFormDataTypeReplyService } from "@/services/user/FormDataReplyServices";
import RepliedDataList from "./component/RepliedDataList";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import validationErrors from "@/lib/validationErrors";
import Swal from "sweetalert2";
import Divider from "@/components/ui/divider";
import { cn } from "@/lib/utils";

export default function DataBreachRepliedPage(props) {
    const dispatch = useDispatch();
    const lastMessageRef = useRef(null);
    const [dataSource, setDataSource] = useState([]);
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [formDataSelect, setFormDataSelect] = useState({});
    const [dataFilter, setDataFilter] = useState({
        search: "",
        page: 1,
        limit: 10,
        extra_filter: {},
        modelType: "DataBreach",
    });

    useEffect(() => {
        getTableData();
    }, [dataFilter]);

    useEffect(() => {
        // Scroll to the last message when messages update
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleFromData = (formData) => {
        getChatData(formData?._id);
        setFormDataSelect(formData);
    };

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
        dispatch(getFormDataTypeReplyService(dataFilter))
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

    const getChatData = (replyFormId) => {
        setIsLoading(true);
        dispatch(getFormDataReplyService({ formDataId: replyFormId, formType: "DataBreach" }))
            .then((res) => {
                setMessages(res?.data?.data);
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
            });
    };

    return (
        <MainContentPart>
            <CustomCard className={cn("p-6 !border-t-4 !border-t-green min-h-[calc(100vh-168px)]")}>
                <div className="card-header flex items-center justify-between gap-4 pb-4">
                    <h2 className="text-xl font-semibold text-primary">{props.pageTitle}</h2>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-0 !border-t-4 !border-t-green min-h-[calc(100vh-265px)] max-h-full">
                    <div
                        className="summary-sidebar"
                        // hidden class toggle after xl
                    >
                        <CustomCard className="p-4 !rounded-none h-full">
                            <h3>All Replays</h3>
                            <Divider className="xl:my-4 my-4" />
                            <RepliedDataList
                                isLoading={isLoading}
                                handleFromData={handleFromData}
                                dataSource={dataSource}
                                totalRecord={totalRecord}
                                dataFilter={dataFilter}
                                onChangePage={onChangeFilter}
                            />
                        </CustomCard>
                    </div>
                    <div
                        className="xl:col-span-3  max-xl:hidden"
                        // hidden class toggle after xl
                    >
                        <CustomCard className="p-4 !rounded-none h-full">
                            <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                                <h2 className="text-xl font-semibold text-primary">{formDataSelect?.mandatedPerson?.licenseNumber}</h2>
                            </div>
                            <div className="card-body bg-light-800 rounded-lg p-4 max-h-[calc(100vh-364px)] overflow-y-auto h-full">
                                <div className="msg-list grid grid-cols-1 gap-3.5">
                                    {messages &&
                                        messages.map((msg, index) => (
                                            <div key={msg._id} className="msg-item flex items-start gap-3 max-w-[80%]" ref={index === messages.length - 1 ? lastMessageRef : null}>
                                                <span className="size-2 rounded-full block flex-shrink-0 bg-green-500 text-base mt-3.5" />
                                                <p className="bg-primary py-1.5 px-4 rounded-lg text-base text-white">{msg.message}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </CustomCard>
                    </div>
                </div>
            </CustomCard>
        </MainContentPart>
    );
}

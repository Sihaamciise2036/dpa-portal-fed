import React, { useState, useRef, useEffect, useContext } from "react";
import MainContentPart from "@/layout/front/MainContentPart";
import CustomCard from "@/components/common/CustomCard";
import { SecondaryButton } from "@/components/ui/buttons/secondary-button";
import { getByIdTransactionService } from "@/services/user/TransactionServices";
import validationErrors from "@/lib/validationErrors";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Moment from "moment";
import { cn } from "@/lib/utils";

export default function TransactionEditPage(props) {
    const selectRef = useRef(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const [dataSource, setDataSource] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isFormSumbmit, setIsFormSumbmit] = useState(false);

    const paymentStatusOptionList = [
        { value: 1, label: "Unpaid", cssColor: "text-gray-700 bg-gray-100 p-2 rounded-[10%]" },
        { value: 2, label: "Paid", cssColor: "text-green-700 bg-green-100 p-2 rounded-[10%]" },
        { value: 3, label: "Failed", cssColor: "text-red-700 bg-red-100 p-2 rounded-[10%]" },
        { value: 4, label: "Waiting For Approval", cssColor: "text-yellow-700 bg-yellow-100 p-2 rounded-[10%]" },
    ];

    useEffect(() => {
        if (id && id !== "") {
            getDataById(id);
        }
    }, [id]);

    const getDataById = (editId) => {
        setIsLoading(true);
        dispatch(getByIdTransactionService(editId))
            .then((res) => {
                setDataSource(res?.data?.data);

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
                    <p>Lets Us Help You With Accurate Answers</p>
                </div>
                <div className="card-body">
                    <div class="bg-white p-4 rounded-md shadow">
                        <table class="w-full">
                            <tbody>
                                <tr class="border-b">
                                    <td class={`py-2 font-semibold`}>Form Name</td>
                                    <td class="py-2">{dataSource?.modelType}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class={`py-2 font-semibold`}>Form Id</td>
                                    <td class="py-2">{dataSource?.modelId}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class={`py-2 font-semibold`}>Account No</td>
                                    <td class="py-2">{dataSource?.account_number}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class={`py-2 font-semibold`}>Amount</td>
                                    <td class="py-2">{dataSource?.amount}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class={`py-2 font-semibold`}>Payment Method</td>
                                    <td class="py-2">{dataSource?.payment_method}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class={`py-2 font-semibold`}>Invoice Id</td>
                                    <td class="py-2">{dataSource?.transaction_no}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class={`py-2 font-semibold`}> Status</td>
                                    <td class="py-2">
                                        <span
                                            className={cn(
                                                "text-xs capitalize rounded-3xl text-[#FB4E4E] bg-[#FFDADA]",
                                                paymentStatusOptionList.find((da) => da.value === dataSource?.status)?.cssColor
                                            )}>
                                            {dataSource?.status && paymentStatusOptionList.find((da) => da.value === dataSource?.status).label}
                                        </span>
                                    </td>
                                </tr>
                                <tr class="border-b">
                                    <td class={`py-2 font-semibold`}> Error Reason</td>
                                    <td class="py-2">{dataSource?.reason}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class={`py-2 font-semibold`}>Created At</td>
                                    <td class="py-2">{Moment(dataSource?.createdAt).format("Y-M-D hh:mm:ss")}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <SecondaryButton type="button" onClick={() => navigate("/transaction/list")} className="text-base xl:text-xl py-3.5 px-6 w-full mb-6 mt-6">
                                Back
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            </CustomCard>
        </MainContentPart>
    );
}

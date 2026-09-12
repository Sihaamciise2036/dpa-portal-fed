import React, { useState, useRef, useEffect } from "react";
import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import Divider from "@/components/ui/divider";
import { getPaymentMethodService } from "@/services/user/PaymentService";
import { InputSelect } from "@/components/ui/inputs/input-select";
import { Input } from "@/components/ui/inputs/input";
import { InputIcon } from "@/components/ui/inputs/input-icon";
import { InputTextarea } from "@/components/ui/inputs/input-textarea";
import InputRadio from "@/components/ui/inputs/input-radio";
import { Label } from "@/components/ui/inputs/label";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import ErrorMessage from "@/components/common/ErrorMessage";
import validationErrors from "@/lib/validationErrors";

export default function EightStepFormWidget({ control, errors, getValues, setValue, paymentGatewayOptionList, isFormSumbmit, isLoading, ...props }) {
    const dispatch = useDispatch();
    const [paymentMethodId, setPaymentMethodId] = useState();
    const [paymentMethodSlug, setPaymentMethodSlug] = useState();

    const handleOnChange = (name, value) => {
        if (name == "payment_method_id") {
            const paymentGatewayDetail = paymentGatewayOptionList.find((payment) => payment.gateway_id === value);
            setPaymentMethodId(value);
            setPaymentMethodSlug(paymentGatewayDetail?.slug);
        } else {
        }
    };

    useEffect(() => {
        if (getValues("transactionId") && getValues("transactionId.payment_method_id")) {
            setValue("transaction[payment_method_id]", getValues("transactionId.payment_method_id"));
        }
        if (getValues("transactionId") && getValues("transactionId.account_number")) {
            setValue("transaction[account_number]", getValues("transactionId.account_number"));
        }
    }, []);

    return (
        <CustomCard className="p-6 !border-t-4 !border-t-green">
            <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-primary">Payment</h2>
                {/* <div className="buttons-wrap flex items-center gap-2">
                    <PrimaryButton>
                        <ChevronLeftIcon />
                    </PrimaryButton>
                    <PrimaryButton>
                        <ChevronRightIcon />
                    </PrimaryButton>
                </div> */}
            </div>
            <div className="card-body">
                <p className="text-red-600 mb-6 font-medium bg-red-50 p-4 rounded-lg border border-red-200">Note: BEFORE YOU MAKE PAYMENT</p>
                <p className="mb-6">PAYMENT INFORMATION 1: DC / DP Registration</p>
                <div className=" mb-6">
                    <div className="flex max-md:flex-col md:items-center gap-4 md:gap-6 lg:gap-10">
                        {paymentGatewayOptionList &&
                            paymentGatewayOptionList?.length > 0 &&
                            paymentGatewayOptionList.map((paymentGateway, index) => {
                                return (
                                    <Controller
                                        key={paymentGateway?.gateway_id || paymentGateway?._id || index}
                                        control={control}
                                        rules={{ required: true }}
                                        name="transaction[payment_method_id]"
                                        render={({ field }) => (
                                            <div className="flex gap-4">
                                                <InputRadio
                                                    {...field}
                                                    id={index}
                                                    value={paymentGateway?.gateway_id}
                                                    checked={field.value == paymentGateway?.gateway_id}
                                                    size="sm"
                                                    labelText={paymentGateway?.name}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        handleOnChange("payment_method_id", e.target.value);
                                                    }}
                                                    errorType={errors?.["transaction"]?.["payment_method_id"]?.type}
                                                />
                                            </div>
                                        )}
                                    />
                                );
                            })}
                    </div>
                    {errors?.["transaction"] && errors?.["transaction"]?.["payment_method_id"] && <ErrorMessage errorType={errors?.["transaction"]?.["payment_method_id"]?.type} />}
                </div>
                <Controller
                    control={control}
                    rules={{ required: true, minLength: 9, maxLength: 9, pattern: /^[0-9]+$/ }}
                    name="transaction[account_number]"
                    render={({ field }) => (
                        <InputIcon
                            {...field}
                            placeholder="Enter Mobile Number"
                            labelText={"Mobile Number"}
                            id="transaction[account_number]"
                            groupClassName="mb-6"
                            prefixWrap={"+252"}
                            errorData={{ minLength: "9", maxLength: "9", pattern: "number" }}
                            errorType={errors?.["transaction"]?.["account_number"]?.type}
                        />
                    )}
                />

                <Divider className="my-6" />
                <div className="">
                    <PrimaryButton type="submit" isLoading={isFormSumbmit} disabled={isFormSumbmit}>
                        Save and Continue
                    </PrimaryButton>
                </div>
            </div>
        </CustomCard>
    );
}

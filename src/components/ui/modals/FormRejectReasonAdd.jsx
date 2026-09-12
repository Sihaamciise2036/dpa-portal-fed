import React, { useEffect } from "react";
import CommonModal from "./CommonModal";
import { PrimaryButton } from "../buttons/primary-button";
import { SecondaryButton } from "../buttons/secondary-button";
import InputCheck from "../inputs/input-check";
import { Input } from "../inputs/input";
import { InputTextarea } from "@/components/ui/inputs/input-textarea";
import { useForm, Controller } from "react-hook-form";

export default function FormRejectReasonAdd({ openModel, handleModelClose, isFormSumbmit, modelFomSubmit }) {
    const {
        register,
        setValue,
        getValues,
        formState: { errors },
        handleSubmit,
        control,
        watch,
        reset,
    } = useForm();

    useEffect(() => {
        setValue("rejectReason", "");
    }, [openModel]);

    const onSubmit = (data) => {
        modelFomSubmit(data);
    };

    return (
        <CommonModal dialogPanelClass="max-w-3xl" modelHeaderHide={false} openModel={openModel} modelTitle={"Reject Reason"} handleModelClose={handleModelClose}>
            <div className="modal-body text-center flex-col flex gap-4 items-center py-6">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[500px]">
                    <Controller
                        control={control}
                        rules={{ required: true, minLength: 5 }}
                        name={"rejectReason"}
                        render={({ field }) => (
                            <InputTextarea
                                row={3}
                                {...field}
                                size={"lg"}
                                groupClassName="w-full max-w-[450px] mb-6"
                                labelClassName={"text-base"}
                                placeholder="Reject Reason"
                                errorData={{ minLength: "5" }}
                                errorType={errors?.rejectReason?.type}
                            />
                        )}
                    />
                    <PrimaryButton type="submit" disabled={isFormSumbmit} className="min-w-[120px] sm:min-w-[200px] py-2.5 md:py-3">
                        Submit
                    </PrimaryButton>
                </form>
            </div>
        </CommonModal>
    );
}

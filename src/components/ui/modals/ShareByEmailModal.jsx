import React, { useEffect } from "react";
import CommonModal from "./CommonModal";
import { PrimaryButton } from "../buttons/primary-button";
import { SecondaryButton } from "../buttons/secondary-button";
import InputCheck from "../inputs/input-check";
import { Input } from "../inputs/input";
import { useForm, Controller } from "react-hook-form";

export default function ShareByEmailModal({ openModel, handleModelClose, isFormSumbmit, modelFomSubmit }) {
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
        setValue("email", "");
    }, [openModel]);

    const onSubmit = (data) => {
        modelFomSubmit(data);
    };

    return (
        <CommonModal dialogPanelClass="max-w-3xl" modelHeaderHide={true} openModel={openModel} modelTitle={"Share By email And Feel Free"} handleModelClose={handleModelClose}>
            <div className="modal-body text-center flex-col flex gap-4 items-center py-6">
                <h2 className="text-2xl font-semibold text-primary">Share By email And Feel Free</h2>
                <p>
                    We are happy to share with you. <br /> Your Data, Your Privacy Our Responsibility
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[500px]">
                    <Controller
                        control={control}
                        rules={{ required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ }}
                        name={"email"}
                        render={({ field }) => (
                            <Input {...field} size={"lg"} groupClassName="w-full max-w-[450px] mb-6" labelClassName={"text-base"} placeholder="Your E-Mail Address" errorType={errors?.email?.type} />
                        )}
                    />
                    <PrimaryButton type="submit" disabled={isFormSumbmit} className="min-w-[120px] sm:min-w-[200px] py-2.5 md:py-3">
                        Send Email
                        {isFormSumbmit ? (
                            <svg className="animate-spin ml-3 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <></>
                        )}
                    </PrimaryButton>
                </form>
            </div>
        </CommonModal>
    );
}

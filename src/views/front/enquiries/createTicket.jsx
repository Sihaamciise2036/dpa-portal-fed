import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomCard from "@/components/common/CustomCard";
import { fileUpload, getFileUrl } from "@/services/CommonService";
import { addSupportTicketService } from "@/services/user/SupportTicketServices"; // Replace with your API call
import { SecondaryButton } from "@/components/ui/buttons/secondary-button";
import MainContentPart from "../../../layout/front/MainContentPart";
import { Input } from "@/components/ui/inputs/input";
import { InputTextarea } from "@/components/ui/inputs/input-textarea";
import InputUpload from "@/components/ui/inputs/input-upload";
import { useForm, Controller } from "react-hook-form";
import validationErrors from "@/lib/validationErrors";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useSelector, useDispatch } from "react-redux";
import ToastMe from "@/components/ui/ToastMe";

const CreateTicket = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        setValue,
        getValues,
        formState: { errors },
        handleSubmit,
        control,
        reset,
        watch,
    } = useForm();
    const [isFormSumbmit, setIsFormSumbmit] = useState(false);
    const uploadFile = watch("uploadFile");

    const handleFileUpload = (event, fieldName) => {
        const file_preview = event.target.files[0];
        if (file_preview === "") {
            ToastMe("File is not valid", "error");
            return true;
        }
        const allowedTypes = [
            'image/', // for all image types (jpg, png, etc.)
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];

            const isValid = allowedTypes.some(type => event.target.files[0].type.includes(type));
        if (event.target.files.length === 0 || (event.target.files.length > 0 && isValid !== true)) {
            ToastMe("Please upload only image files", "error");
            return true;
        }
        dispatch(fileUpload({ file: file_preview }, "supportTicket"))
            .then((res) => {
                var formData = res?.data;
                if (formData) {
                    setValue(fieldName, formData?.fileName);
                }
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
            });
    };

    const onSubmit = (data) => {
        setIsFormSumbmit(true);
        dispatch(addSupportTicketService(data))
            .then((res) => {
                navigate("/enquiries");
                setIsFormSumbmit(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsFormSumbmit(false);
            });
    };

    return (
        <MainContentPart>
            <CustomCard className="!border-t-4 !border-t-green p-6">
                <h2 className="text-xl font-semibold text-primary mb-4">Create New Enquiry</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name={"title"}
                            render={({ field }) => <Input {...field} labelText="Title" placeholder="Enter Title" errorType={errors?.title?.type} />}
                        />
                    </div>
                    <div className="mb-6">
                        <Controller
                            control={control}
                            rules={{ required: true, minLength: 5 }}
                            name={"description"}
                            render={({ field }) => (
                                <InputTextarea row="3" {...field} labelText="Description" placeholder="Enter Description" errorData={{ minLength: "5" }} errorType={errors?.description?.type} />
                            )}
                        />
                    </div>
                    <div className={"grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 mt-8"}>
                        <Controller
                            control={control}
                            name={"tmp_file"}
                            render={({ field }) => (
                                <div className="relative w-[160px] h-[160px] border border-dashed border-gray-300 rounded flex items-center justify-center bg-white shadow-md p-2">
                                    {getValues("uploadFile") && getValues("uploadFile") !== "" ? (
                                        <>
                                            {getValues("uploadFile") != "" && (getValues("uploadFile").includes(".pdf") || getValues("uploadFile").includes(".doc") || getValues("uploadFile").includes(".docx")) ? 
                                                <a href={getFileUrl(getValues("uploadFile"), "supportTicket")} target="_blank" rel="noopener noreferrer">View File</a> 
                                            : 
                                                <img className="db-image object-contain max-w-full max-h-full" alt="slider" src={getFileUrl(getValues("uploadFile"), "supportTicket")} />
                                            }
                                            <button type="button" className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs" onClick={() => setValue("uploadFile", "")}>
                                                Remove
                                            </button>
                                        </>
                                    ) : (
                                        <InputUpload
                                            {...field}
                                            id="signature-file"
                                            labelText="Upload File"
                                            onChange={(e) => handleFileUpload(e, "uploadFile")}
                                            accept="image/png, image/jpeg, image/jpg , application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        />
                                    )}
                                </div>
                            )}
                        />
                    </div>
                    <SecondaryButton type="submit">Submit Ticket</SecondaryButton>
                </form>
            </CustomCard>
        </MainContentPart>
    );
};

export default CreateTicket;

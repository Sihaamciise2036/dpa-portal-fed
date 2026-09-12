import React, { useState, useRef, useEffect, useContext } from "react";
import MainContentPart from "@/layout/front/MainContentPart";
import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { Input } from "@/components/ui/inputs/input";
import InputUpload from "@/components/ui/inputs/input-upload";
import { Label } from "@/components/ui/inputs/label";
import InputCheck from "@/components/ui/inputs/input-check";
import InputRadio from "@/components/ui/inputs/input-radio";
import { InputDatepicker } from "@/components/ui/inputs/input-datepicker";
import { InputTextarea } from "@/components/ui/inputs/input-textarea";
import { InputSelect } from "@/components/ui/inputs/input-select";
import { useForm, Controller } from "react-hook-form";
import { fileUpload, getFileUrl } from "@/services/CommonService";
import { addDataComplaintService, getByIdDataComplaintService } from "@/services/user/DataComplaintServices";
import validationErrors from "@/lib/validationErrors";
import { useSelector, useDispatch } from "react-redux";
import ErrorMessage from "@/components/common/ErrorMessage";
import ToastMe from "@/components/ui/ToastMe";
import Moment from "moment";
import { AuthContext } from "@/guard/AuthProvider";
import { useParams, useNavigate } from "react-router-dom";

export default function ComplaintHandleFormPage(props) {
    const { generalSetting } = useSelector((state) => state?.GeneralSetting);
    const { userData } = useSelector((state) => state?.Auth);
    const { id } = useParams();
    const navigate = useNavigate();
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
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isFormSumbmit, setIsFormSumbmit] = useState(false);
    const organizationType = watch("organizationType");
    const attemptedContactValue = watch("attemptedContact");
    const deSignatureFileValue = watch("declaration.signature");
    const signaturefileValue = watch("signature");
    const roleWiseList = {
        data_checker: ["1", "2", "5"],
        data_validator: ["2", "3", "5"],
        data_completer: ["3", "4", "5"],
    };

    useEffect(() => {
        formReset();
        if (id && id != "") {
            getDataById(id);
        }
        setValue("registrationFee", 0);
    }, []);

    const handleFileUpload = (event, fieldName) => {
        const file_preview = event.target.files[0];
        if (file_preview === "") {
            ToastMe("File is not valid", "error");
            return true;
        }
        if (event.target.files.length === 0 || (event.target.files.length > 0 && event.target.files[0].type.includes("image/") !== true)) {
            ToastMe("Please upload only image files", "error");
            return true;
        }
        dispatch(fileUpload({ file: file_preview }, "complaintHandleData"))
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

    const formReset = async () => {
        try {
            var formData = getValues();
            for (const key in formData) {
                await setValue(key, "");
            }
            await reset();
        } catch (error) {
            console.error("Error in onReset:", error);
        }
    };

    const processFormData = (data, parentKey = "") => {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const fullKey = parentKey ? `${parentKey}.${key}` : key; // Create a key path

                if (typeof data[key] === "object" && data[key] !== null) {
                    // Recursive call for nested objects
                    processFormData(data[key], fullKey);
                } else {
                    setValue(fullKey, data[key] !== "" ? data[key] : "");
                }
            }
        }
    };

    const getDataById = (id) => {
        setIsLoading(true);
        dispatch(getByIdDataComplaintService(id))
            .then((res) => {
                var formData = res?.data?.data;
                processFormData(formData);
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
                navigate("/complaint-handle/list");
            });
    };

    const validateAtLeastOneCheckbox = () => {
        return Object.values(getValues("complaintDetails")).some((value) => value == true) || "At least one checkbox must be selected";
    };

    const onSubmit = (data) => {
        if (data?.declaration?.signature !== "") {
        } else {
            ToastMe("Please upload a valid signature file", "error");
            return true;
        }
        if (data?.signature !== "") {
        } else {
            ToastMe("Please upload a valid signature file", "error");
            return true;
        }

        setIsFormSumbmit(true);
        var addEditService = "";
        if (id && id != "") {
            setIsFormSumbmit(false);
            return true;
        } else {
            data.registrationFee = 0;
            data.userId = userData?._id;
            data.status = 1;
            data.payment_status = 1;
            addEditService = addDataComplaintService(data);
        }
        dispatch(addEditService)
            .then((res) => {
                formReset();
                navigate("/complaint-handle/list");
                setIsFormSumbmit(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsFormSumbmit(false);
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="bg-primary text-white py-3 px-6 text-center rounded-[8px] mb-6">
                            <Label labelClassName="font-medium mb-0" labelText="Personal Information" />
                        </div>
                        <Label labelClassName="font-bold mb-4 block" labelText="Are you making complaint as" />
                        <div className="mb-6 font-medium">
                            <Label labelClassName="font-medium" labelText="Tick as appropriate" />
                            <div className="mb-6">
                                <div className="flex max-md:flex-col md:items-center gap-4 md:gap-6 lg:gap-10">
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name="organizationType"
                                        value={getValues("organizationType")}
                                        render={({ field }) => (
                                            <div className="flex gap-4">
                                                <InputRadio {...field} value="1" checked={field.value == "1"} size="sm" labelText="Public" errorType={errors?.organizationType?.type} />
                                                <InputRadio {...field} value="2" checked={field.value == "2"} size="sm" labelText="Private" errorType={errors?.organizationType?.type} />
                                                <InputRadio {...field} value="3" checked={field.value == "3"} size="sm" labelText="NGO" errorType={errors?.organizationType?.type} />
                                                <InputRadio {...field} value="5" checked={field.value == "5"} size="sm" labelText="Person" errorType={errors?.organizationType?.type} />
                                                <InputRadio {...field} value="4" checked={field.value == "4"} size="sm" labelText="Other" errorType={errors?.organizationType?.type} />
                                            </div>
                                        )}
                                    />
                                </div>
                                {errors?.organizationType && <ErrorMessage errorType={errors?.organizationType?.type} />}
                            </div>
                        </div>
                        {getValues("organizationType") && getValues("organizationType") == "2" ? (
                            <div className="mb-6">
                                <div className="radio-group flex items-center gap-4 flex-wrap">
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name="companyType"
                                        value={getValues("companyType")}
                                        render={({ field }) => (
                                            <div className="flex gap-4">
                                                <InputRadio {...field} value="1" checked={field.value == "1"} size="sm" labelText="Individual" errorType={errors?.companyType?.type} />
                                                <InputRadio {...field} value="2" checked={field.value == "2"} size="sm" labelText="Organization" errorType={errors?.companyType?.type} />
                                            </div>
                                        )}
                                    />
                                </div>
                                {errors?.companyType && <ErrorMessage errorType={errors?.companyType?.type} />}
                            </div>
                        ) : (
                            <></>
                        )}

                        {getValues("organizationType") && getValues("organizationType") == "5" ? (
                            <>
                                <Label labelClassName="font-bold mb-6 block" labelText="A. PARTICULARS OF THE COMPLAINANT/REPRESENTATIVE" />
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"complainantDetails.name"}
                                        render={({ field }) => <Input {...field} labelText="Name" placeholder="Enter Full Name" errorType={errors?.complainantDetails?.name?.type} />}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ }}
                                        name={"complainantDetails.email"}
                                        render={({ field }) => <Input {...field} labelText="Email" placeholder="Enter Email" errorType={errors?.complainantDetails?.email?.type} />}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true, pattern: /^[0-9]+$/, minLength: 10, maxLength: 12 }}
                                        name={"complainantDetails.contactNumber"}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                labelText="Phone number"
                                                placeholder="Enter Contact Number"
                                                errorData={{ minLength: "10", maxLength: "12" }}
                                                errorType={errors?.complainantDetails?.contactNumber?.type}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"legalRepresentative.licenceNumber"}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                labelText="National ID / Passport Number"
                                                placeholder="Enter National ID / Passport Number"
                                                errorType={errors?.legalRepresentative?.licenceNumber?.type}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="">
                                    <Label labelClassName="font-bold mb-4 block" labelText="B. PARTICULARS OF THE RESPONDENT" />
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                                        <Controller
                                            control={control}
                                            rules={{ required: true }}
                                            name={"declaration.fullName"}
                                            render={({ field }) => (
                                                <InputTextarea
                                                    {...field}
                                                    labelText="Name (s) of the respondent (individual or institutional):"
                                                    placeholder="Enter Name (s) of the respondent (individual or institutional):"
                                                    errorType={errors?.declaration?.fullName?.type}
                                                />
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            rules={{ required: true }}
                                            name={"declaration.title"}
                                            render={({ field }) => (
                                                <InputTextarea
                                                    {...field}
                                                    labelText="Contact details of the respondent (individual or institutional):"
                                                    placeholder="Enter Contact details of the respondent (individual or institutional):"
                                                    errorType={errors?.declaration?.title?.type}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                            <Controller
                                                control={control}
                                                rules={{ required: true }}
                                                name={"declaration.date"}
                                                render={({ field }) => (
                                                    <InputDatepicker
                                                        {...field}
                                                        onChange={(date) => setValue("declaration.date", date)}
                                                        selected={getValues("declaration.date") && getValues("declaration.date") !== "" ? Moment(getValues("declaration.date")).format("Y-MM-DD") : ""}
                                                        value={getValues("declaration.date") && getValues("declaration.date") !== "" ? Moment(getValues("declaration.date")).format("Y-MM-DD") : ""}
                                                        placeholderText="Enter Date"
                                                        labelText="Date of occurrence of the alleged infringement"
                                                        type="date"
                                                        id="declaration.date"
                                                        className="db-field-control"
                                                        labelStyleClassName={"db-field-title after:hidden"}
                                                        errorType={errors?.declaration?.date?.type}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <Label labelClassName="font-bold mb-4 block" labelText="C. PARTICULARS OF THE COMPLAINT" />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"complaint.description"}
                                        render={({ field }) => (
                                            <InputTextarea
                                                {...field}
                                                labelText="Describe your complaint"
                                                placeholder="Enter Describe your complaint"
                                                groupClassName="mb-6"
                                                errorType={errors?.complaint?.description?.type}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"complaint.personName"}
                                        render={({ field }) => (
                                            <InputTextarea
                                                {...field}
                                                labelText="The name (s) of any persons that can provide further information relevant to the complaint, if any;"
                                                placeholder="Enter The name (s) of any persons that can provide further information relevant to the complaint, if any;"
                                                groupClassName="mb-6"
                                                errorType={errors?.complaint?.personName?.type}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"complaint.note"}
                                        render={({ field }) => (
                                            <InputTextarea
                                                {...field}
                                                labelText="Any actual or potential harm or any urgency to be taken note of:"
                                                placeholder="Enter Any actual or potential harm or any urgency to be taken note of:"
                                                groupClassName="mb-6"
                                                errorType={errors?.complaint?.note?.type}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="mb-6">
                                    <Label labelClassName="font-bold mb-4 block" labelText="D. REMEDY SOUGHT" />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"complaint.anticipating"}
                                        render={({ field }) => (
                                            <InputTextarea
                                                {...field}
                                                labelText="State in your view what redress/relief you are anticipating:"
                                                placeholder="Enter State in your view what redress/relief you are anticipating:"
                                                groupClassName="mb-6"
                                                errorType={errors?.complaint?.anticipating?.type}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"complaint.stepAlredyTaken"}
                                        render={({ field }) => (
                                            <InputTextarea
                                                {...field}
                                                labelText="Which other steps have you already taken in relation to the complaint; if any"
                                                placeholder="Enter Which other steps have you already taken in relation to the complaint; if any"
                                                groupClassName="mb-6"
                                                errorType={errors?.complaint?.stepAlredyTaken?.type}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"complaint.previouslyAttempts"}
                                        render={({ field }) => (
                                            <InputTextarea
                                                {...field}
                                                value={getValues("complaint.previouslyAttempts")}
                                                labelText="Particulars of any person or institution that has previously made attempts to resolve the matter:"
                                                placeholder="Enter Particulars of any person or institution that has previously made attempts to resolve the matter:"
                                                groupClassName="mb-6"
                                                errorType={errors?.complaint?.previouslyAttempts?.type}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="mb-2 font-medium mb-6">
                                    <Label labelClassName="font-medium" labelText="In the event that the Respondent is contacted, do you wish to remain anonymous? " />
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <div className="flex max-md:flex-col md:items-center gap-4 md:gap-6 lg:gap-10">
                                                <Controller
                                                    control={control}
                                                    rules={{
                                                        validate: (value) => (value !== undefined && value !== "") || "This field is required",
                                                    }}
                                                    name="attemptedContact"
                                                    render={({ field }) => (
                                                        <div className="flex gap-4">
                                                            <InputRadio {...field} value="1" checked={field.value == "1"} size="sm" labelText="Yes" errorType={errors?.attemptedContact?.type} />
                                                            <InputRadio {...field} value="0" checked={field.value == "0"} size="sm" labelText="No" errorType={errors?.attemptedContact?.type} />
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                            {errors?.attemptedContact && <ErrorMessage customMessage={errors?.attemptedContact?.message} />}
                                        </div>
                                        {getValues("attemptedContact") && getValues("attemptedContact") == "1" ? (
                                            <Label
                                                labelClassName="font-bold mb-2 block"
                                                labelText={
                                                    <>
                                                        If <b>Yes</b> so, please explain why?
                                                    </>
                                                }
                                            />
                                        ) : (
                                            <Label
                                                labelClassName="font-bold mb-2 block"
                                                labelText={
                                                    <>
                                                        If <b>No</b> so, please explain why?
                                                    </>
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    name={"correspondenceEvidence"}
                                    render={({ field }) => (
                                        <InputTextarea
                                            {...field}
                                            rows="5"
                                            groupClassName="mb-6"
                                            labelText="If so, please explain why?"
                                            placeholder="Enter If so, please explain why?"
                                            errorType={errors?.correspondenceEvidence?.type}
                                        />
                                    )}
                                />
                                <div className={"grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 mt-8"}>
                                    <Controller
                                        control={control}
                                        name={"temp_declaration.signature"}
                                        render={({ field }) => (
                                            <div className="relative w-[160px] h-[160px] border border-dashed border-gray-300 rounded flex items-center justify-center bg-white shadow-md p-2">
                                                {getValues("declaration.signature") && getValues("declaration.signature") !== "" ? (
                                                    <>
                                                        <img
                                                            className="db-image object-contain max-w-full max-h-full"
                                                            alt="slider"
                                                            src={getFileUrl(getValues("declaration.signature"), "complaintHandleData")}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs"
                                                            onClick={() => setValue("declaration.signature", "")}>
                                                            Remove
                                                        </button>
                                                    </>
                                                ) : (
                                                    <InputUpload
                                                        {...field}
                                                        id="declaration.signature"
                                                        labelText="Provide supporting documents that will assist in addressing this complaint. (For multiple documents, ensure to have all of them in a common folder)"
                                                        onChange={(e) => handleFileUpload(e, "declaration.signature")}
                                                        accept="image/png, image/jpeg, image/jpg"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <Controller
                                    rules={{ required: getValues("organizationType") && getValues("organizationType") == "4" ? true : false }}
                                    control={control}
                                    name={"organizationSpecify"}
                                    render={({ field }) => (
                                        <Input {...field} groupClassName="mb-6" labelText="Please specify" placeholder="Enter Please Specify" errorType={errors?.organizationSpecify?.type} />
                                    )}
                                />
                                <Label labelClassName="font-bold mb-6 block" labelText="A. Data Subject" />
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"complainantDetails.name"}
                                        render={({ field }) => <Input {...field} labelText="Name" placeholder="Enter Full Name" errorType={errors?.complainantDetails?.name?.type} />}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ }}
                                        name={"complainantDetails.email"}
                                        render={({ field }) => <Input {...field} labelText="Email" placeholder="Enter Email" errorType={errors?.complainantDetails?.email?.type} />}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true, pattern: /^[0-9]+$/, minLength: 10, maxLength: 12 }}
                                        name={"complainantDetails.contactNumber"}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                labelText="Contact Number"
                                                placeholder="Enter Contact Number"
                                                errorData={{ minLength: "10", maxLength: "12" }}
                                                errorType={errors?.complainantDetails?.contactNumber?.type}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"complainantDetails.address"}
                                        render={({ field }) => <Input {...field} labelText="Address" placeholder="Enter Address" errorType={errors?.complainantDetails?.address?.type} />}
                                    />
                                </div>
                                <div className="">
                                    <Label labelClassName="font-bold mb-4 block" labelText="B. Legal representative on behalf of a data subject" />
                                    <p className="mb-6 text-base 2xl:text-lg font-Inter text-dark-950">
                                        Please fill in this section if the complaint is submitted by thelegal representative on behalf of the Data Subject
                                    </p>
                                    <Label labelClassName="font-bold mb-4 block" labelText="DECLARATION" />
                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                                        <Controller
                                            control={control}
                                            rules={{ required: true }}
                                            name={"legalRepresentative.name"}
                                            render={({ field }) => <Input {...field} labelText="Name" placeholder="Enter Full Name" errorType={errors?.legalRepresentative?.name?.type} />}
                                        />
                                        <Controller
                                            control={control}
                                            rules={{ required: true }}
                                            name={"legalRepresentative.licenceNumber"}
                                            render={({ field }) => (
                                                <Input {...field} labelText="Licence" placeholder="Enter Licence Number" errorType={errors?.legalRepresentative?.licenceNumber?.type} />
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            rules={{ required: true }}
                                            name={"legalRepresentative.attorneyLetter"}
                                            render={({ field }) => (
                                                <Input {...field} labelText="Attorney" placeholder="Enter Letter of attorney" errorType={errors?.legalRepresentative?.attorneyLetter?.type} />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="">
                                    <Label labelClassName="font-bold mb-4 block" labelText="C. Natural person mandated by the data subject" />
                                    <p className="mb-6 text-base 2xl:text-lg font-Inter text-dark-950">
                                        Please fill in this section if the complaint is submitted by mandated on behalf of the Data Subject
                                    </p>
                                    <Label labelClassName="font-bold mb-4 block" labelText="DECLARATION" />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"mandatedPerson.name"}
                                        render={({ field }) => <Input {...field} labelText="Name" placeholder="Enter Full Name" groupClassName="mb-6" errorType={errors?.mandatedPerson?.name?.type} />}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"mandatedPerson.idNumber"}
                                        render={({ field }) => (
                                            <Input {...field} labelText="ID Number" placeholder="Enter ID Number" groupClassName="mb-6" errorType={errors?.mandatedPerson?.idNumber?.type} />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"mandatedPerson.relationship"}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                labelText="Relationship to the data subject"
                                                placeholder="Enter RelationShip"
                                                groupClassName="mb-6"
                                                errorType={errors?.mandatedPerson?.relationship?.type}
                                            />
                                        )}
                                    />
                                </div>
                                <Label labelClassName="font-bold mb-6 block" labelText=" " />
                                <div className="mb-6 font-medium">
                                    <Label labelClassName="font-medium" labelText="Have you granted explicit consent to the data controller/processor for the lawful processing your personal data?" />
                                    <div className="flex max-md:flex-col md:items-center gap-4 md:gap-6 lg:gap-10">
                                        <Controller
                                            control={control}
                                            rules={{
                                                validate: (value) => (value !== undefined && value !== "") || "This field is required",
                                            }}
                                            name="consentGiven"
                                            render={({ field }) => (
                                                <div className="flex gap-4">
                                                    <InputRadio {...field} value="1" checked={field.value == "1"} size="sm" labelText="Yes" errorType={errors?.consentGiven?.type} />
                                                    <InputRadio {...field} value="0" checked={field.value == "0"} size="sm" labelText="No" errorType={errors?.consentGiven?.type} />
                                                </div>
                                            )}
                                        />
                                    </div>
                                    {errors?.consentGiven && <ErrorMessage customMessage={errors?.consentGiven?.message} />}
                                </div>
                                <div className="mb-2 font-medium">
                                    <Label labelClassName="font-medium" labelText="Have you attempted to contact the organisation/individual to resolve the matter?" />
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <div className="flex max-md:flex-col md:items-center gap-4 md:gap-6 lg:gap-10">
                                                <Controller
                                                    control={control}
                                                    rules={{
                                                        validate: (value) => (value !== undefined && value !== "") || "This field is required",
                                                    }}
                                                    name="attemptedContact"
                                                    render={({ field }) => (
                                                        <div className="flex gap-4">
                                                            <InputRadio {...field} value="1" checked={field.value == "1"} size="sm" labelText="Yes" errorType={errors?.attemptedContact?.type} />
                                                            <InputRadio {...field} value="0" checked={field.value == "0"} size="sm" labelText="No" errorType={errors?.attemptedContact?.type} />
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                            {errors?.attemptedContact && <ErrorMessage customMessage={errors?.attemptedContact?.message} />}
                                        </div>
                                        {getValues("attemptedContact") && getValues("attemptedContact") == "1" ? (
                                            <Label
                                                labelClassName="font-bold mb-2 block"
                                                labelText={
                                                    <>
                                                        If <b>Yes</b>, please provide evidence of correspondence
                                                    </>
                                                }
                                            />
                                        ) : (
                                            <Label
                                                labelClassName="font-bold mb-2 block"
                                                labelText={
                                                    <>
                                                        If <b>No</b>, please explain why
                                                    </>
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    name={"correspondenceEvidence"}
                                    render={({ field }) => (
                                        <InputTextarea
                                            {...field}
                                            rows="5"
                                            groupClassName="mb-6"
                                            labelText="Evidence of correspondence"
                                            placeholder="Enter Evidence of correspondence"
                                            errorType={errors?.correspondenceEvidence?.type}
                                        />
                                    )}
                                />
                                <Label labelClassName="font-bold mb-6 block" labelText="Details of the organisation/individual your complaint refers to" />
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    name={"organizationDetails.name"}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            labelText="Name of the organization/individual"
                                            placeholder="Enter Name"
                                            groupClassName="mb-6"
                                            errorType={errors?.organizationDetails?.name?.type}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    name={"organizationDetails.address"}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            labelText="Address of the organization/individual"
                                            placeholder="Enter Address"
                                            groupClassName="mb-6"
                                            errorType={errors?.organizationDetails?.address?.type}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/, minLength: 10, maxLength: 12 }}
                                    name={"organizationDetails.telephone"}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            labelText="Telephone number of the organization/individual"
                                            placeholder="Enter Telephone"
                                            groupClassName="mb-6"
                                            errorData={{ minLength: "10", maxLength: "12" }}
                                            errorType={errors?.organizationDetails?.telephone?.type}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ }}
                                    name={"organizationDetails.email"}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            labelText="Email Address of the organization/individual"
                                            placeholder="Enter Email"
                                            groupClassName="mb-6"
                                            errorType={errors?.organizationDetails?.email?.type}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    name={"organizationDetails.relationship"}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            labelText="Your relationship with the organization/individual (if any)"
                                            placeholder="Enter Relationship with the organization/individual"
                                            groupClassName="mb-6"
                                            errorType={errors?.organizationDetails?.relationship?.type}
                                        />
                                    )}
                                />
                                <Label labelClassName="font-bold mb-6 block" labelText="Is your complaint about your own personal data?" />
                                <div className="mb-6 flex flex-col gap-5 font-medium">
                                    <Controller
                                        control={control}
                                        rules={{ validate: validateAtLeastOneCheckbox }}
                                        name={"complaintDetails.unauthorizedDisclosure"}
                                        render={({ field }) => (
                                            <InputCheck
                                                {...field}
                                                labelText="Unauthorized disclosure of your personal data unsolicited direct marketing"
                                                checked={getValues("complaintDetails.unauthorizedDisclosure")}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ validate: validateAtLeastOneCheckbox }}
                                        name={"complaintDetails.inaccurateData"}
                                        render={({ field }) => (
                                            <InputCheck
                                                {...field}
                                                labelText="An organisation/individual holds personal data which is inaccurate"
                                                checked={getValues("complaintDetails.inaccurateData")}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ validate: validateAtLeastOneCheckbox }}
                                        name={"complaintDetails.failedSubjectAccess"}
                                        render={({ field }) => (
                                            <InputCheck
                                                {...field}
                                                labelText="An organisation/individual has failed to respond to a Subject Access Request"
                                                checked={getValues("complaintDetails.failedSubjectAccess")}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ validate: validateAtLeastOneCheckbox }}
                                        name={"complaintDetails.lackOfTransparency"}
                                        render={({ field }) => (
                                            <InputCheck
                                                {...field}
                                                labelText="An organisation/individual is not transparent about how they process your personal data"
                                                checked={getValues("complaintDetails.lackOfTransparency")}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ validate: validateAtLeastOneCheckbox }}
                                        name={"complaintDetails.deniedDataPortability"}
                                        render={({ field }) => (
                                            <InputCheck
                                                {...field}
                                                labelText="An organisation/individual has not applied your right to data portability"
                                                checked={getValues("complaintDetails.deniedDataPortability")}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ validate: validateAtLeastOneCheckbox }}
                                        name={"complaintDetails.thirdPartyTransfer"}
                                        render={({ field }) => (
                                            <InputCheck
                                                {...field}
                                                labelText="An organisation/individual has transferred personal data to third party"
                                                checked={getValues("complaintDetails.thirdPartyTransfer")}
                                            />
                                        )}
                                    />
                                    {errors?.complaintDetails?.thirdPartyTransfer && errors?.complaintDetails?.thirdPartyTransfer?.message && (
                                        <ErrorMessage customMessage={errors?.complaintDetails?.thirdPartyTransfer?.message} />
                                    )}
                                </div>
                                <div className="mb-6">
                                    <Label labelClassName="font-bold mb-4 block" labelText="Details of your complaint" />
                                    <p className="mb-6 text-base 2xl:text-lg font-Inter text-dark-950">
                                        Please explain and provide details of the complaint, in as much detail as possible. In particular, please ensure your identify the specific data protection
                                        issues that your complaint intends to raise in order to assist with the Information Commissioner's assessment of your concerns.
                                    </p>
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"complaintDetails.details"}
                                        render={({ field }) => (
                                            <InputTextarea
                                                {...field}
                                                rows="6"
                                                groupClassName="mb-6"
                                                placeholder="Enter Details of your complaint"
                                                errorType={errors?.complaintDetails?.details?.type}
                                            />
                                        )}
                                    />
                                    <p className="mb-6 text-base 2xl:text-lg font-Inter text-dark-950">
                                        I hereby declare that the information given in this application is true and correct to the best of my knowledge and belief.
                                    </p>
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        <Controller
                                            control={control}
                                            rules={{ required: true }}
                                            name={"declaration.fullName"}
                                            render={({ field }) => <Input {...field} labelText="Name" placeholder="Entity Full Name" errorType={errors?.declaration?.fullName?.type} />}
                                        />
                                        <Controller
                                            control={control}
                                            rules={{ required: true }}
                                            name={"declaration.title"}
                                            render={({ field }) => <Input {...field} labelText="Title" placeholder="Entity Title" errorType={errors?.declaration?.title?.type} />}
                                        />
                                    </div>
                                </div>
                                <div className={"grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 mt-8"}>
                                    <Controller
                                        control={control}
                                        name={"temp_declaration.signature"}
                                        render={({ field }) => (
                                            <div className="relative w-[160px] h-[160px] border border-dashed border-gray-300 rounded flex items-center justify-center bg-white shadow-md p-2">
                                                {getValues("declaration.signature") && getValues("declaration.signature") !== "" ? (
                                                    <>
                                                        <img
                                                            className="db-image object-contain max-w-full max-h-full"
                                                            alt="slider"
                                                            src={getFileUrl(getValues("declaration.signature"), "complaintHandleData")}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs"
                                                            onClick={() => setValue("declaration.signature", "")}>
                                                            Remove
                                                        </button>
                                                    </>
                                                ) : (
                                                    <InputUpload
                                                        {...field}
                                                        id="declaration.signature"
                                                        labelText="Upload Signature"
                                                        onChange={(e) => handleFileUpload(e, "declaration.signature")}
                                                        accept="image/png, image/jpeg, image/jpg"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="mb-6">
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        <Controller
                                            control={control}
                                            rules={{ required: true }}
                                            name={"declaration.date"}
                                            render={({ field }) => (
                                                <InputDatepicker
                                                    {...field}
                                                    onChange={(date) => setValue("declaration.date", date)}
                                                    selected={getValues("declaration.date") && getValues("declaration.date") !== "" ? Moment(getValues("declaration.date")).format("Y-MM-DD") : ""}
                                                    value={getValues("declaration.date") && getValues("declaration.date") !== "" ? Moment(getValues("declaration.date")).format("Y-MM-DD") : ""}
                                                    placeholderText="Enter Date"
                                                    labelText="Date"
                                                    type="date"
                                                    id="declaration.date"
                                                    className="db-field-control"
                                                    labelStyleClassName={"db-field-title after:hidden"}
                                                    errorType={errors?.declaration?.date?.type}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"caseTracking.referenceNumber"}
                                        render={({ field }) => <Input {...field} labelText="Reference number" placeholder="Enter Number" errorType={errors?.caseTracking?.referenceNumber?.type} />}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"caseTracking.departmentInvolved"}
                                        render={({ field }) => (
                                            <Input {...field} labelText="Department Involved" placeholder="Enter Department" errorType={errors?.caseTracking?.departmentInvolved?.type} />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"caseTracking.employeeInvolved"}
                                        render={({ field }) => <Input {...field} labelText="Employee Involved" placeholder="Enter Employee" errorType={errors?.caseTracking?.employeeInvolved?.type} />}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"caseTracking.initialResponse"}
                                        render={({ field }) => (
                                            <Input {...field} labelText="Initial response to complaint" placeholder="Enter Response" errorType={errors?.caseTracking?.initialResponse?.type} />
                                        )}
                                    />
                                </div>
                                <div className={"grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 mt-8"}>
                                    <Controller
                                        control={control}
                                        name={"tmp_signature"}
                                        render={({ field }) => (
                                            <div className="relative w-[160px] h-[160px] border border-dashed border-gray-300 rounded flex items-center justify-center bg-white shadow-md p-2">
                                                {getValues("signature") && getValues("signature") !== "" ? (
                                                    <>
                                                        <img className="db-image object-contain max-w-full max-h-full" alt="slider" src={getFileUrl(getValues("signature"), "complaintHandleData")} />
                                                        <button
                                                            type="button"
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs"
                                                            onClick={() => setValue("signature", "")}>
                                                            Remove
                                                        </button>
                                                    </>
                                                ) : (
                                                    <InputUpload
                                                        {...field}
                                                        id="signature"
                                                        labelText="Upload Signature"
                                                        onChange={(e) => handleFileUpload(e, "signature")}
                                                        accept="image/png, image/jpeg, image/jpg"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"formDate"}
                                        render={({ field }) => (
                                            <InputDatepicker
                                                {...field}
                                                onChange={(date) => setValue("formDate", date)}
                                                selected={getValues("formDate") && getValues("formDate") !== "" ? Moment(getValues("formDate")).format("Y-MM-DD") : ""}
                                                value={getValues("formDate") && getValues("formDate") !== "" ? Moment(getValues("formDate")).format("Y-MM-DD") : ""}
                                                placeholderText="Enter Date"
                                                labelText="Date"
                                                type="date"
                                                id="formDate"
                                                className="db-field-control"
                                                labelStyleClassName={"db-field-title after:hidden"}
                                                errorType={errors?.formDate?.type}
                                            />
                                        )}
                                    />
                                </div>
                            </>
                        )}

                        {getValues("status") && getValues("status") == "5" ? (
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"rejectReason"}
                                render={({ field }) => (
                                    <InputTextarea {...field} rows="3" groupClassName="mb-6" labelText="Reject Reason" placeholder="Reject Reason" errorType={errors?.rejectReason?.type} />
                                )}
                            />
                        ) : (
                            <></>
                        )}

                        {id && id != "" ? (
                            <PrimaryButton type="button" onClick={() => navigate("/complaint-handle/list")} className="w-full py-4 text-2xl">
                                Back
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton type="submit" disabled={isFormSumbmit || isLoading ? true : false} className="w-full py-4 text-2xl">
                                Register
                                {isFormSumbmit ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                        )}
                    </form>
                </div>
            </CustomCard>
        </MainContentPart>
    );
}

import React, { useState, useRef, useEffect, useContext } from "react";
import MainContentPart from "@/layout/front/MainContentPart";
import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { Input } from "@/components/ui/inputs/input";
import InputUpload from "@/components/ui/inputs/input-upload";
import { Label } from "@/components/ui/inputs/label";
import InputCheck from "@/components/ui/inputs/input-check";
import InputRadio from "@/components/ui/inputs/input-radio";
import { InputSelect } from "@/components/ui/inputs/input-select";
import { InputDatepicker } from "@/components/ui/inputs/input-datepicker";
import { InputTextarea } from "@/components/ui/inputs/input-textarea";
import { useForm, Controller } from "react-hook-form";
import { fileUpload, getFileUrl } from "@/services/CommonService";
import { addDataBreachService, getByIdDataBreachService } from "@/services/user/DataBreachServices";
import validationErrors from "@/lib/validationErrors";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useSelector, useDispatch } from "react-redux";
import ToastMe from "@/components/ui/ToastMe";
import Moment from "moment";
import { AuthContext } from "@/guard/AuthProvider";
import { useParams, useNavigate } from "react-router-dom";

export default function DataBreachFormPage(props) {
    const { generalSetting } = useSelector((state) => state?.GeneralSetting);
    const { userData } = useSelector((state) => state?.Auth);
    const { id } = useParams();
    const navigate = useNavigate();
    const selectRef = useRef(null);
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
    const deSignatureFileValue = watch("contractFile");
    const signaturefileValue = watch("declarationSignature");
    const breachDetailsCyberIncidentValue = watch("breachDetails.cyberIncident");
    const breachDetailsHighRiskToDataSubjectValue = watch("breachDetails.highRiskToDataSubject");
    const breachDetailsChooseActionValue = watch("breachDetails.chooseAction");
    const roleWiseList = {
        data_checker: ["1", "2", "5"],
        data_validator: ["2", "3", "5"],
        data_completer: ["3", "4", "5"],
    };

    const statusOptionList = [
        {
            label: "Pending",
            value: "1",
        },
        {
            label: "Processing",
            value: "2",
        },
        {
            label: "Validating",
            value: "3",
        },
        {
            label: "Active",
            value: "4",
        },
        {
            label: "Rejection",
            value: "5",
        },
    ];

    const chooseOptionList = [
        {
            label: "Yes",
            value: "1",
        },
        {
            label: "No",
            value: "0",
        },
    ];

    const entityOptionList = [
        {
            label: "Data Protector",
            value: "1",
        },
        {
            label: "Data Controller",
            value: "2",
        },
        {
            label: "Both",
            value: "3",
        },
    ];

    const securityIncidents = [
        { value: "1", label: "Hacking/IT Incident" },
        { value: "2", label: "Malware Attack" },
        { value: "3", label: "Phishing" },
        { value: "4", label: "Lost or Stolen Devices" },
        { value: "5", label: "Insider Threat" },
        { value: "6", label: "Human Error" },
        { value: "7", label: "Improper Disposal of Data" },
        { value: "8", label: "Social Engineering" },
        { value: "9", label: "Vendor/Third-Party Breach" },
        { value: "10", label: "Ransomware Attack" },
        { value: "11", label: "Data Transfer Vulnerabilities" },
        { value: "12", label: "Unpatched Software Vulnerability" },
        { value: "13", label: "Brute Force Attack" },
        { value: "14", label: "SQL Injection" },
        { value: "15", label: "Denial of Service (DoS) Attack" },
        { value: "16", label: "Man-in-the-Middle (MITM) Attack" },
        { value: "17", label: "Zero-Day Exploit" },
        { value: "18", label: "Credential Stuffing" },
        { value: "19", label: "Privilege Escalation" },
        { value: "20", label: "Weak Authentication" },
        { value: "21", label: "Data Scraping" },
        { value: "22", label: "Cross-Site Scripting (XSS)" },
        { value: "23", label: "Cloud Misconfiguration" },
        { value: "24", label: "Unencrypted Data" },
        { value: "25", label: "Insecure APIs" },
        { value: "26", label: "Email Spoofing" },
        { value: "27", label: "Physical Security Lapse" },
        { value: "28", label: "Application Vulnerabilities" },
        { value: "29", label: "Data Leakage" },
        { value: "30", label: "Exploitation of Legacy Systems" },
    ];

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
        dispatch(fileUpload({ file: file_preview }, "breachData"))
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
        dispatch(getByIdDataBreachService(id))
            .then((res) => {
                var formData = res?.data?.data;
                processFormData(formData);
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
                navigate("/data-breach/list");
            });
    };

    const validateAtLeastOneCheckbox = () => {
        return Object.values(getValues("discoveryMethod")).some((value) => value == true) || "At least one checkbox must be selected";
    };

    const onSubmit = (data) => {
        if (data?.declarationSignature !== "") {
        } else {
            ToastMe("Please upload a valid signature file", "error");
            return true;
        }
        if (data?.contractFile !== "") {
        } else {
            ToastMe("Please upload a valid file", "error");
            return true;
        }
        if (data?.contractFile !== "") {
        } else {
            ToastMe("Please upload a valid file", "error");
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
            addEditService = addDataBreachService(data);
        }
        dispatch(addEditService)
            .then((res) => {
                formReset();
                navigate("/data-breach/list");
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
                            <Label labelClassName="font-medium mb-0" labelText="OPERATIONAL DETAILS" />
                        </div>
                        <div className="mb-6 font-medium">
                            <Label labelClassName="font-medium" labelText="Tick as appropriate" />
                            <div className="mb-6">
                                <div className="flex max-md:flex-col md:items-center gap-4 md:gap-6 lg:gap-10">
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name="entityType"
                                        value={getValues("entityType")}
                                        render={({ field }) => (
                                            <div className="flex gap-4">
                                                <InputRadio {...field} value="1" checked={field.value == "1"} size="sm" labelText="Public" errorType={errors?.entityType?.type} />
                                                <InputRadio {...field} value="2" checked={field.value == "2"} size="sm" labelText="Private" errorType={errors?.entityType?.type} />
                                                <InputRadio {...field} value="3" checked={field.value == "3"} size="sm" labelText="NGO" errorType={errors?.entityType?.type} />
                                                <InputRadio {...field} value="4" checked={field.value == "4"} size="sm" labelText="Other" errorType={errors?.entityType?.type} />
                                            </div>
                                        )}
                                    />
                                </div>
                                {errors?.entityType && <ErrorMessage errorType={errors?.entityType?.type} />}
                            </div>
                        </div>
                        <div className="bg-primary text-white py-3 px-6 text-center rounded-[8px] mb-8">
                            <Label labelClassName="font-medium mb-0" labelText="BASIC INFORMATION OF THE DATA USER" />
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"entityName"}
                                render={({ field }) => <Input {...field} labelText="Name" placeholder="Enter Entity Name" errorType={errors?.entityName?.type} />}
                            />
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"entitySector"}
                                render={({ field }) => <Input {...field} labelText="Entity Sector" placeholder="Enter Entity Sector" errorType={errors?.entitySector?.type} />}
                            />
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"licenseNumber"}
                                render={({ field }) => <Input {...field} labelText="License Number" placeholder="Enter License Number" errorType={errors?.licenseNumber?.type} />}
                            />
                        </div>
                        <div className="bg-primary text-white py-3 px-6 text-center rounded-[8px] mb-8">
                            <Label labelClassName="font-medium mb-0" labelText="ORGANISATION INFORMATION CONTACT" />
                        </div>
                        <div className="">
                            <Controller
                                control={control}
                                rules={{ required: true, pattern: /^[0-9]+$/, minLength: 10, maxLength: 12 }}
                                name={"contact.phone"}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        groupClassName="mb-6"
                                        labelText="Phone"
                                        placeholder="Enter Phone Number"
                                        errorData={{ minLength: "10", maxLength: "12" }}
                                        errorType={errors?.contact?.phone?.type}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                rules={{ required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ }}
                                name={"contact.email"}
                                render={({ field }) => <Input {...field} groupClassName="mb-6" labelText="Email" placeholder="Enter Email" errorType={errors?.contact?.email?.type} />}
                            />
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"contact.address"}
                                render={({ field }) => <Input {...field} groupClassName="mb-6" labelText="Address" placeholder="Enter Address" errorType={errors?.contact?.address?.type} />}
                            />
                            <Controller
                                control={control}
                                rules={{ required: true, pattern: /^[a-zA-Z]+$/ }}
                                name={"contact.state"}
                                render={({ field }) => <Input {...field} groupClassName="mb-6" labelText="State" placeholder="Enter State" errorType={errors?.contact?.state?.type} />}
                            />
                            <Controller
                                control={control}
                                rules={{ required: true, pattern: /^[a-zA-Z]+$/ }}
                                name={"contact.city"}
                                render={({ field }) => <Input {...field} groupClassName="mb-8" labelText="City" placeholder="Enter City" errorType={errors?.contact?.city?.type} />}
                            />
                        </div>
                        <div className="bg-primary text-white py-3 px-6 text-center rounded-[8px] mb-8">
                            <Label labelClassName="font-medium mb-0" labelText="DATA PROTECTION OFFICER CONTACT DETAILS" />
                        </div>
                        <div className="mb-6 font-medium">
                            <Label labelClassName="font-medium" labelText="Name of the Data Protection Officer" />
                            <div className="mb-6">
                                <div className="flex max-md:flex-col md:items-center gap-4 md:gap-6 lg:gap-10">
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name="dpo.type"
                                        render={({ field }) => (
                                            <div className="flex gap-4">
                                                <InputRadio {...field} value="1" checked={field.value == "1"} size="sm" labelText="Mr" errorType={errors?.dpo?.type?.type} />
                                                <InputRadio {...field} value="2" checked={field.value == "2"} size="sm" labelText="Mrs" errorType={errors?.dpo?.type?.type} />
                                                <InputRadio {...field} value="3" checked={field.value == "3"} size="sm" labelText="Miss" errorType={errors?.dpo?.type?.type} />
                                            </div>
                                        )}
                                    />
                                </div>
                                {errors?.dpo && errors?.dpo.type && <ErrorMessage errorType={errors?.dpo?.type?.type} />}
                            </div>
                        </div>
                        <div className="">
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"dpo.name"}
                                render={({ field }) => <Input {...field} groupClassName="mb-6" labelText="Name" placeholder="Enter Name" errorType={errors?.dpo?.name?.type} />}
                            />
                            <Controller
                                control={control}
                                rules={{ required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ }}
                                name={"dpo.email"}
                                render={({ field }) => <Input {...field} groupClassName="mb-6" labelText="Email" placeholder="Enter Email" errorType={errors?.dpo?.email?.type} />}
                            />
                            <Controller
                                control={control}
                                rules={{ required: true, pattern: /^[0-9]+$/, minLength: 10, maxLength: 12 }}
                                name={"dpo.phone"}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        groupClassName="mb-6"
                                        labelText="Phone "
                                        placeholder="Enter Phone"
                                        errorData={{ minLength: "10", maxLength: "12" }}
                                        errorType={errors?.dpo?.phone?.type}
                                    />
                                )}
                            />
                        </div>
                        <div className="mb-6 font-medium">
                            <Label labelClassName="font-medium" labelText="Is it your first time that breach occur in your organisation?" />
                            <div className="mb-6">
                                <div className="flex max-md:flex-col md:items-center gap-4 md:gap-6 lg:gap-10">
                                    <Controller
                                        control={control}
                                        rules={{
                                            validate: (value) => (value !== undefined && value !== "") || "This field is required",
                                        }}
                                        name="dpo.firstOccurrence"
                                        render={({ field }) => (
                                            <div className="flex gap-4">
                                                <InputRadio {...field} value="1" checked={field.value == "1"} size="sm" labelText="Yes" errorType={errors?.dpo?.firstOccurrence?.type} />
                                                <InputRadio {...field} value="0" checked={field.value == "0"} size="sm" labelText="No" errorType={errors?.dpo?.firstOccurrence?.type} />
                                            </div>
                                        )}
                                    />
                                </div>
                                {errors?.dpo && errors?.dpo?.firstOccurrence && <ErrorMessage customMessage={errors?.dpo?.firstOccurrence?.message} />}
                            </div>
                        </div>
                        <div className="mb-6">
                            <Label labelClassName="font-bold mb-4 block" labelText="Number of data breach victims" />
                            <Controller
                                control={control}
                                rules={{ required: true, pattern: /^[0-9]+$/, minLength: 10, maxLength: 12 }}
                                name={"dpo.phoneNumber"}
                                render={({ field }) => (
                                    <Input {...field} labelText="Phone" placeholder="Enter Phone Number" errorData={{ minLength: "10", maxLength: "12" }} errorType={errors?.dpo?.phoneNumber?.type} />
                                )}
                            />
                        </div>
                        <div className="">
                            <Label labelClassName="font-bold mb-4 block" labelText="Please select type of organisation you are" />
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"dpo.typeOrganization"}
                                render={({ field }) => (
                                    <InputSelect
                                        {...field}
                                        ref={selectRef}
                                        id={"dpo?.typeOrganization"}
                                        labelText="Type Of Organization"
                                        groupClassName="mb-4"
                                        value={entityOptionList.find((data) => data.value == getValues("dpo?.typeOrganization")) || null}
                                        onChange={(e) => setValue("dpo?.typeOrganization", e)}
                                        options={entityOptionList}
                                        errorType={errors?.dpo?.typeOrganization?.type}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"dpo.typeOther"}
                                render={({ field }) => (
                                    <Input {...field} groupClassName="mb-6" labelText="Others, please specify" placeholder="Enter Others, please specify" errorType={errors?.dpo?.typeOther?.type} />
                                )}
                            />
                        </div>
                        <div className="bg-primary text-white py-3 px-6 text-center rounded-[8px] mb-8">
                            <Label labelClassName="font-medium mb-0" labelText="Information involved in the breach" />
                        </div>
                        <div className="">
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"breachDetails.informationType"}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        groupClassName="mb-6"
                                        labelText="Kind of the personal information involved in the breach."
                                        placeholder="Enter Kind of the personal information involved in the breach."
                                        errorType={errors?.breachDetails?.informationType?.type}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"breachDetails.informationOther"}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        groupClassName="mb-6"
                                        labelText="Others, please specify"
                                        placeholder="Others, please specify"
                                        errorType={errors?.breachDetails?.informationOther?.type}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"breachDetails.breachDescription"}
                                render={({ field }) => (
                                    <InputSelect
                                        {...field}
                                        ref={selectRef}
                                        id={"breachDetails.breachDescription"}
                                        labelText="Description of the Breach"
                                        groupClassName="mb-4"
                                        value={securityIncidents.find((data) => data.value == getValues("breachDetails.breachDescription")) || null}
                                        onChange={(e) => setValue("breachDetails.breachDescription", e)}
                                        options={securityIncidents}
                                        errorType={errors?.breachDetails?.breachDescription?.type}
                                    />
                                )}
                            />
                        </div>
                        <div className="mb-6 font-medium">
                            <Label labelClassName="font-medium" labelText="How did the organisation discover the breach?" />
                            <div className="flex flex-col gap-4">
                                <Controller
                                    control={control}
                                    rules={{ validate: validateAtLeastOneCheckbox }}
                                    name={"discoveryMethod.userReports"}
                                    render={({ field }) => <InputCheck {...field} labelText="User Reports" checked={getValues("discoveryMethod.userReports")} />}
                                />
                                <Controller
                                    control={control}
                                    rules={{ validate: validateAtLeastOneCheckbox }}
                                    name={"discoveryMethod.securityMonitoringSystems"}
                                    render={({ field }) => <InputCheck {...field} labelText="Security Monitoring Systems" checked={getValues("discoveryMethod.securityMonitoringSystems")} />}
                                />
                                <Controller
                                    control={control}
                                    rules={{ validate: validateAtLeastOneCheckbox }}
                                    name={"discoveryMethod.endpointDetectionAndResponse"}
                                    render={({ field }) => <InputCheck {...field} labelText="Endpoint Detection and Response" checked={getValues("discoveryMethod.endpointDetectionAndResponse")} />}
                                />
                                <Controller
                                    control={control}
                                    rules={{ validate: validateAtLeastOneCheckbox }}
                                    name={"discoveryMethod.incidentResponsePlans"}
                                    render={({ field }) => <InputCheck {...field} labelText="Incident Response Plans" checked={getValues("discoveryMethod.incidentResponsePlans")} />}
                                />
                                <Controller
                                    control={control}
                                    rules={{ validate: validateAtLeastOneCheckbox }}
                                    name={"discoveryMethod.securityAuditsAndAssessments"}
                                    render={({ field }) => <InputCheck {...field} labelText="Security Audits and Assessments" checked={getValues("discoveryMethod.securityAuditsAndAssessments")} />}
                                />
                                <Controller
                                    control={control}
                                    rules={{ validate: validateAtLeastOneCheckbox }}
                                    name={"discoveryMethod.thirdPartyAlerts"}
                                    render={({ field }) => <InputCheck {...field} labelText="Third-Party Alerts" checked={getValues("discoveryMethod.thirdPartyAlerts")} />}
                                />
                                {errors?.discoveryMethod?.thirdPartyAlerts && errors?.discoveryMethod?.thirdPartyAlerts?.message && (
                                    <ErrorMessage customMessage={errors?.discoveryMethod?.thirdPartyAlerts?.message} />
                                )}
                            </div>
                        </div>
                        <div className="mb-6 font-medium">
                            <Label labelClassName="font-medium" labelText="Was the breach caused by cyber incident?" />
                            <div className="flex flex-col gap-4">
                                <Controller
                                    control={control}
                                    rules={{
                                        validate: (value) => (value !== undefined && value !== "") || "This field is required",
                                    }}
                                    name="breachDetails.cyberIncident"
                                    render={({ field }) => (
                                        <div className="flex gap-4">
                                            <InputRadio {...field} value="1" checked={field.value == "1"} size="sm" labelText="Yes" errorType={errors?.breachDetails?.cyberIncident?.type} />
                                            <InputRadio {...field} value="0" checked={field.value == "0"} size="sm" labelText="No" errorType={errors?.breachDetails?.cyberIncident?.type} />
                                            <InputRadio
                                                {...field}
                                                value="2"
                                                checked={field.value == "2"}
                                                size="sm"
                                                labelText="Others, please specify"
                                                errorType={errors?.breachDetails?.cyberIncident?.type}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            {errors?.breachDetails && errors?.breachDetails?.cyberIncident && <ErrorMessage customMessage={errors?.breachDetails?.cyberIncident?.message} />}
                        </div>
                        {getValues("breachDetails.cyberIncident") == "2" && (
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"breachDetails.cyberIncidentDetails"}
                                render={({ field }) => (
                                    <InputTextarea
                                        {...field}
                                        rows="5"
                                        groupClassName="mb-6"
                                        labelText="If NO, please specify"
                                        placeholder="Enter If NO, please specify"
                                        errorType={errors?.breachDetails?.cyberIncidentDetails?.type}
                                    />
                                )}
                            />
                        )}
                        <div className="mb-6">
                            <Label labelClassName="font-bold mb-4 block" labelText="When did the breach happened?" />
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    name={"breachDetails.breachDate"}
                                    render={({ field }) => (
                                        <InputDatepicker
                                            {...field}
                                            onChange={(date) => setValue("breachDetails.breachDate", date)}
                                            selected={
                                                getValues("breachDetails.breachDate") && getValues("breachDetails.breachDate") !== ""
                                                    ? Moment(getValues("breachDetails.breachDate")).format("Y-MM-DD")
                                                    : ""
                                            }
                                            value={
                                                getValues("breachDetails.breachDate") && getValues("breachDetails.breachDate") !== ""
                                                    ? Moment(getValues("breachDetails.breachDate")).format("Y-MM-DD")
                                                    : ""
                                            }
                                            placeholderText="Enter Date"
                                            labelText="Date"
                                            type="date"
                                            id="breachDetails.breachDate"
                                            className="db-field-control"
                                            labelStyleClassName={"db-field-title after:hidden"}
                                            errorType={errors?.breachDetails?.breachDate?.type}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <Label labelClassName="font-bold mb-4 block" labelText="When did you discover the breach?" />
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    name={"breachDetails.discoveryDate"}
                                    render={({ field }) => (
                                        <InputDatepicker
                                            {...field}
                                            onChange={(date) => setValue("breachDetails.discoveryDate", date)}
                                            selected={
                                                getValues("breachDetails.discoveryDate") && getValues("breachDetails.discoveryDate") !== ""
                                                    ? Moment(getValues("breachDetails.discoveryDate")).format("Y-MM-DD")
                                                    : ""
                                            }
                                            value={
                                                getValues("breachDetails.discoveryDate") && getValues("breachDetails.discoveryDate") !== ""
                                                    ? Moment(getValues("breachDetails.discoveryDate")).format("Y-MM-DD")
                                                    : ""
                                            }
                                            placeholderText="Enter Date"
                                            labelText="Date"
                                            type="date"
                                            id="breachDetails.discoveryDate"
                                            className="db-field-control"
                                            labelStyleClassName={"db-field-title after:hidden"}
                                            errorType={errors?.breachDetails?.discoveryDate?.type}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="mb-6 font-medium">
                            <Label labelClassName="font-medium" labelText="Is the breach likely to result in a high risk to data subject?" />
                            <div className="flex flex-col gap-4">
                                <Controller
                                    control={control}
                                    rules={{
                                        validate: (value) => (value !== undefined && value !== "") || "This field is required",
                                    }}
                                    name="breachDetails.highRiskToDataSubject"
                                    render={({ field }) => (
                                        <div className="flex gap-4">
                                            <InputRadio {...field} value="1" checked={field.value == "1"} size="sm" labelText="Yes" errorType={errors?.breachDetails?.highRiskToDataSubject?.type} />
                                            <InputRadio {...field} value="0" checked={field.value == "0"} size="sm" labelText="No" errorType={errors?.breachDetails?.highRiskToDataSubject?.type} />
                                            <InputRadio
                                                {...field}
                                                value="2"
                                                checked={field.value == "2"}
                                                size="sm"
                                                labelText="Not yet given, Please give details"
                                                errorType={errors?.breachDetails?.highRiskToDataSubject?.type}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            {errors?.breachDetails && errors?.breachDetails?.highRiskToDataSubject && <ErrorMessage customMessage={errors?.breachDetails?.highRiskToDataSubject?.message} />}
                        </div>
                        {getValues("breachDetails.highRiskToDataSubject") == "2" && (
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"breachDetails.riskDetails"}
                                render={({ field }) => (
                                    <InputTextarea
                                        {...field}
                                        rows="5"
                                        groupClassName="mb-6"
                                        labelText="If No, please specify"
                                        placeholder="Enter If No, please specify"
                                        errorType={errors?.breachDetails?.riskDetails?.type}
                                    />
                                )}
                            />
                        )}
                        <div className="">
                            <Label labelClassName="font-bold mb-4 block" labelText="Have you taken any action to limit the breach?" />
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"breachDetails.chooseAction"}
                                render={({ field }) => (
                                    <InputSelect
                                        {...field}
                                        ref={selectRef}
                                        id={"breachDetails.chooseAction"}
                                        labelText="Choose Action"
                                        groupClassName="mb-4"
                                        value={chooseOptionList.find((data) => data.value == getValues("breachDetails.chooseAction")) || null}
                                        onChange={(e) => setValue("breachDetails.chooseAction", e)}
                                        options={chooseOptionList}
                                        errorType={errors?.breachDetails?.chooseAction?.type}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                rules={{ required: getValues("breachDetails.chooseAction") == "0" ? true : false }}
                                name={"breachDetails.giveDetails"}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        groupClassName="mb-6"
                                        labelText="Not yet given, Please give details"
                                        placeholder="Enter Not yet given, Please give details"
                                        errorType={errors?.breachDetails?.giveDetails?.type}
                                    />
                                )}
                            />
                        </div>
                        <div className="mb-6 font-medium">
                            <Label labelClassName="font-medium" labelText="Have you told data subjects about the breach?" />
                            <div className="flex flex-col gap-4">
                                <Controller
                                    control={control}
                                    rules={{
                                        validate: (value) => (value !== undefined && value !== "") || "This field is required",
                                    }}
                                    name="breachDetails.dataSubjectsInformed"
                                    render={({ field }) => (
                                        <div className="flex gap-4">
                                            <InputRadio {...field} value="1" checked={field.value == "1"} size="sm" labelText="Yes" errorType={errors?.breachDetails?.dataSubjectsInformed?.type} />
                                            <InputRadio {...field} value="0" checked={field.value == "0"} size="sm" labelText="No" errorType={errors?.breachDetails?.dataSubjectsInformed?.type} />
                                            <InputRadio
                                                {...field}
                                                value="2"
                                                checked={field.value == "2"}
                                                size="sm"
                                                labelText="If No, Please specify"
                                                errorType={errors?.breachDetails?.dataSubjectsInformed?.type}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            {errors?.breachDetails && errors?.breachDetails?.dataSubjectsInformed && <ErrorMessage customMessage={errors?.breachDetails?.dataSubjectsInformed?.message} />}
                        </div>
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name={"breachDetails.reasonForNotInforming"}
                            render={({ field }) => (
                                <InputTextarea
                                    {...field}
                                    rows="5"
                                    groupClassName="mb-6"
                                    labelText="Please specify"
                                    placeholder="Enter Please specify"
                                    errorType={errors?.breachDetails?.reasonForNotInforming?.type}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name={"breachDetails.furtherActions"}
                            render={({ field }) => (
                                <InputTextarea
                                    {...field}
                                    rows="5"
                                    groupClassName="mb-6"
                                    labelText="Describe any further action you have taken/ or purpose to take as a result of the breach"
                                    placeholder="Enter Please specify"
                                    errorType={errors?.breachDetails?.furtherActions?.type}
                                />
                            )}
                        />
                        <p className="mb-6 text-base 2xl:text-lg font-Inter text-dark-950">
                            I hereby declare that the information given in this application is true and correct to the best of my knowledge and belief.
                        </p>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"declaration.name"}
                                render={({ field }) => <Input {...field} labelText="Name" placeholder="Enter Name" errorType={errors?.declaration?.name?.type} />}
                            />
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name={"declaration.title"}
                                render={({ field }) => <Input {...field} labelText="Title" placeholder="Enter Title" errorType={errors?.declaration?.title?.type} />}
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
                                            type="date"
                                            id="declaration.date"
                                            labelText="Date"
                                            className="db-field-control"
                                            labelStyleClassName={"db-field-title after:hidden"}
                                            errorType={errors?.declaration?.date?.type}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className={"grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 mt-8"}>
                            <Controller
                                control={control}
                                name={"tmp_signature"}
                                render={({ field }) => (
                                    <div className="relative w-[160px] h-[160px] border border-dashed border-gray-300 rounded flex items-center justify-center bg-white shadow-md p-2">
                                        {getValues("declarationSignature") && getValues("declarationSignature") !== "" ? (
                                            <>
                                                <img className="db-image object-contain max-w-full max-h-full" alt="slider" src={getFileUrl(getValues("declarationSignature"), "breachData")} />
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs"
                                                    onClick={() => setValue("declarationSignature", "")}>
                                                    Remove
                                                </button>
                                            </>
                                        ) : (
                                            <InputUpload
                                                {...field}
                                                id="signature"
                                                labelText="Upload Signature"
                                                onChange={(e) => handleFileUpload(e, "declarationSignature")}
                                                accept="image/png, image/jpeg, image/jpg"
                                            />
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        <div className={"grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 mt-8"}>
                            <Controller
                                control={control}
                                name={"tmp_file"}
                                render={({ field }) => (
                                    <div className="relative w-[160px] h-[160px] border border-dashed border-gray-300 rounded flex items-center justify-center bg-white shadow-md p-2">
                                        {getValues("contractFile") && getValues("contractFile") !== "" ? (
                                            <>
                                                <img className="db-image object-contain max-w-full max-h-full" alt="slider" src={getFileUrl(getValues("contractFile"), "breachData")} />
                                                <button type="button" className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs" onClick={() => setValue("contractFile", "")}>
                                                    Remove
                                                </button>
                                            </>
                                        ) : (
                                            <InputUpload
                                                {...field}
                                                id="signature-file"
                                                labelText="Upload File"
                                                onChange={(e) => handleFileUpload(e, "contractFile")}
                                                accept="image/png, image/jpeg, image/jpg"
                                            />
                                        )}
                                    </div>
                                )}
                            />
                        </div>

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
                            <PrimaryButton type="button" onClick={() => navigate("/data-breach/list")} className="w-full py-4 text-2xl">
                                Back
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton type="submit" disabled={isFormSumbmit || isLoading ? true : false} className="w-full py-4 text-2xl">
                                Submit
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

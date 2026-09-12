import React, { useState, useEffect, useRef } from "react";
import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import Divider from "@/components/ui/divider";
import { Input } from "@/components/ui/inputs/input";
import { InputSelect } from "@/components/ui/inputs/input-select";
import InputCheck from "@/components/ui/inputs/input-check";
import InputRadio from "@/components/ui/inputs/input-radio";
import { InputTextarea } from "@/components/ui/inputs/input-textarea";
import { Label } from "@/components/ui/inputs/label";
import { BriefcaseBusinessIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, MapPin, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import ErrorMessage from "@/components/common/ErrorMessage";
import countriesList from "@/lib/countries.json";

export default function ThirdStepFormWidget({ control, watch, errors, getValues, setValue, ...props }) {
    const dataTransferOutsideCountry = watch("dataTransferOutsideCountry");
    const sesitivePersonalData = watch("sesitivePersonalData");
    const dataAuthorizationsData = watch("dataAuthorizations");
    const dataControllersData = watch("dataControllers");
    const dataCountryData = watch("dataCountry");
    const [dataControllers, setDataControllers] = useState([{ index: 1 }]);
    const [dataAuthorizations, setDataAuthorizations] = useState([{ index: 1 }]);
    const [dataProcessors, setDataProcessors] = useState([{ index: 1 }]);
    const [dataCountry, setDataCountry] = useState([{ index: 1 }]);

    const numberOfSubjectOptionList = [
        {
            label: "> 200",
            value: "1",
        },
        {
            label: ">1000",
            value: "2",
        },
        {
            label: "> 5000",
            value: "3",
        },
    ];

    const numberOfEmployeeOptionList = [
        {
            label: "1-10",
            value: "1",
        },
        {
            label: "11-200",
            value: "2",
        },
        {
            label: "> 200",
            value: "3",
        },
    ];

    useEffect(() => {
        // if (getValues("contact.sectorType") && getValues("contact.sectorType") !== "") {
        //     setValue("dataSubjects", numberOfSubjectOptionList.find((data) => data.value == getValues("contact.sectorType")).value || "");
        // }
        if (getValues("dataAuthorizations") && getValues("dataAuthorizations").length > 0 && getValues("dataAuthorizations")[0] && getValues("dataAuthorizations")[0] !== "") {
            setDataAuthorizations(getValues("dataAuthorizations"));
        }
        if (getValues("dataProcessors") && getValues("dataProcessors").length > 0 && getValues("dataProcessors")[0] && getValues("dataProcessors")[0] !== "") {
            setDataProcessors(getValues("dataProcessors"));
        }
        if (getValues("dataControllers") && getValues("dataControllers").length > 0 && getValues("dataControllers")[0] && getValues("dataControllers")[0] !== "") {
            setDataControllers(getValues("dataControllers"));
        }
        if (getValues("dataCountry") && getValues("dataCountry").length > 0 && getValues("dataCountry")[0] && getValues("dataCountry")[0] !== "") {
            setDataCountry(getValues("dataCountry"));
        }
    }, []);

    const categorySubjectOptionList = [
        {
            label: "Sensitive Personal Data",
            value: "1",
        },
        {
            label: "Non-Sensitive Personal Data",
            value: "2",
        },
    ];

    const validateSubjectAtLeastOneCheckbox = () => {
        return Object.values(getValues("categorySubject")).some((value) => value == true) || "At least one checkbox must be selected";
    };

    const validatePersonalAtLeastOneCheckbox = () => {
        return Object.values(getValues("personalData")).some((value) => value == true) || "At least one checkbox must be selected";
    };

    const validateGroundAtLeastOneCheckbox = () => {
        return Object.values(getValues("groundData")).some((value) => value == true) || "At least one checkbox must be selected";
    };

    const addDataController = () => {
        setDataControllers([...dataControllers, { index: dataControllers.length + 1 }]);
    };

    const removeDataController = (index) => {
        if (dataControllers.length > 1) {
            setDataControllers(dataControllers.filter((item) => item.index !== index));
        }
    };

    const addDataAuthorization = () => {
        setDataAuthorizations([...dataAuthorizations, { index: dataAuthorizations.length + 1 }]);
    };

    const removeDataAuthorization = (index) => {
        if (dataAuthorizations.length > 1) {
            setDataAuthorizations(dataAuthorizations.filter((item) => item.index !== index));
        }
    };

    const addDataProcessor = () => {
        setDataProcessors([...dataProcessors, { index: dataProcessors.length + 1 }]);
    };

    const removeDataProcessor = (index) => {
        if (dataProcessors.length > 1) {
            setDataProcessors(dataProcessors.filter((item) => item.index !== index));
        }
    };

    const addDataCountry = () => {
        setDataCountry([...dataCountry, { index: dataCountry.length + 1 }]);
    };

    const removeDataCountry = (index) => {
        if (dataCountry.length > 1) {
            setDataCountry(dataCountry.filter((item) => item.index !== index));
        }
    };

    return (
        <CustomCard className="p-6 !border-t-4 !border-t-green">
            <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-primary capitalize">Data Processing Details</h2>
                <div className="buttons-wrap flex items-center gap-2">
                    {/* <PrimaryButton>
                        <ChevronLeftIcon />
                    </PrimaryButton>
                    <PrimaryButton>
                        <ChevronRightIcon />
                    </PrimaryButton> */}
                </div>
            </div>
            <div className="card-body">
                <p className="text-red-600 mb-6 font-medium bg-red-50 p-4 rounded-lg border border-red-200">Note: Information captured in this section cannot be edited after payment</p>

                <Controller
                    control={control}
                    rules={{ required: true }}
                    name={"dataSubjects"}
                    render={({ field }) => (
                        <InputSelect
                            {...field}
                            groupClassName="mb-6"
                            labelText="Kind of Data Subjects"
                            placeholder="Select Kind of Data Subjects"
                            value={numberOfSubjectOptionList.find((data) => data.value == getValues("dataSubjects")) || null}
                            onChange={(e) => setValue("dataSubjects", e)}
                            options={numberOfSubjectOptionList}
                            errorType={errors?.dataSubjects?.dataSubjects}
                        />
                    )}
                />
                <Controller
                    control={control}
                    rules={{ required: true }}
                    name={"numberOfEmployee"}
                    render={({ field }) => (
                        <InputSelect
                            {...field}
                            groupClassName="mb-6"
                            labelText="Number of Employee"
                            placeholder="Select Number of Employee"
                            value={numberOfEmployeeOptionList.find((data) => data.value == getValues("numberOfEmployee")) || null}
                            onChange={(e) => setValue("numberOfEmployee", e)}
                            options={numberOfEmployeeOptionList}
                            errorType={errors?.dataSubjects?.numberOfEmployee}
                        />
                    )}
                />
                <Controller
                    control={control}
                    rules={{
                        required: true,
                        pattern: /^\d+(\.\d{1,2})?$/,
                        min: 0,
                    }}
                    name="revenue"
                    render={({ field }) => (
                        <Input
                            {...field}
                            groupClassName="mb-6"
                            labelText="REVENUE"
                            placeholder="Enter REVENUE"
                            type="number"
                            errorData={{
                                pattern: "Only numbers are allowed",
                                min: "Revenue must be a positive number",
                            }}
                            errorType={errors?.revenue?.type}
                        />
                    )}
                />
                <div className="mb-6 font-medium">
                    <Label labelClassName="font-medium" labelText="PERSONAL DATA" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-5">
                            <Label labelClassName="font-medium mb-3" labelText="CATEGORY OF DATA SUBJECTS" />
                            <Controller
                                control={control}
                                rules={{ validate: validateSubjectAtLeastOneCheckbox }}
                                name={"categorySubject.employee"}
                                render={({ field }) => <InputCheck {...field} labelText="Employee" checked={getValues("categorySubject.employee")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateSubjectAtLeastOneCheckbox }}
                                name={"categorySubject.customer"}
                                render={({ field }) => <InputCheck {...field} labelText="Customer" checked={getValues("categorySubject.customer")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateSubjectAtLeastOneCheckbox }}
                                name={"categorySubject.financialData"}
                                render={({ field }) => <InputCheck {...field} labelText="Financial Data" checked={getValues("categorySubject.financialData")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateSubjectAtLeastOneCheckbox }}
                                name={"categorySubject.healthData"}
                                render={({ field }) => <InputCheck {...field} labelText="Health Data" checked={getValues("categorySubject.healthData")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateSubjectAtLeastOneCheckbox }}
                                name={"categorySubject.supplier"}
                                render={({ field }) => <InputCheck {...field} labelText="Supplier" checked={getValues("categorySubject.supplier")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateSubjectAtLeastOneCheckbox }}
                                name={"categorySubject.biometricData"}
                                render={({ field }) => <InputCheck {...field} labelText="Biometric Data" checked={getValues("categorySubject.biometricData")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateSubjectAtLeastOneCheckbox }}
                                name={"categorySubject.educationData"}
                                render={({ field }) => <InputCheck {...field} labelText="Education Data" checked={getValues("categorySubject.educationData")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateSubjectAtLeastOneCheckbox }}
                                name={"categorySubject.criminalData"}
                                render={({ field }) => <InputCheck {...field} labelText="Education Data" checked={getValues("categorySubject.criminalData")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateSubjectAtLeastOneCheckbox }}
                                name={"categorySubject.etc"}
                                render={({ field }) => <InputCheck {...field} labelText="Etc" checked={getValues("categorySubject.etc")} />}
                            />
                            {errors?.categorySubject?.criminalData && errors?.categorySubject?.criminalData?.message && <ErrorMessage customMessage={errors?.categorySubject?.criminalData?.message} />}
                            <Controller
                                control={control}
                                name={"categorySubject.extra"}
                                render={({ field }) => <Input {...field} groupClassName="mb-6" labelText="" placeholder="..........." errorType={errors?.categorySubject?.extra?.type} />}
                            />
                        </div>
                        <div className="flex flex-col gap-5">
                            <Label labelClassName="font-medium mb-3" labelText="DESCRIPTION OF PERSONAL DATA" />
                            <Controller control={control} name={"personalData.name"} render={({ field }) => <InputCheck {...field} labelText="Name" checked={getValues("personalData.name")} />} />
                            <Controller
                                control={control}
                                rules={{ validate: validatePersonalAtLeastOneCheckbox }}
                                name={"personalData.dataOfBirth"}
                                render={({ field }) => <InputCheck {...field} labelText="Data of birth" checked={getValues("personalData.dataOfBirth")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validatePersonalAtLeastOneCheckbox }}
                                name={"personalData.address"}
                                render={({ field }) => <InputCheck {...field} labelText="Address" checked={getValues("personalData.address")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validatePersonalAtLeastOneCheckbox }}
                                name={"personalData.phoneNumber"}
                                render={({ field }) => <InputCheck {...field} labelText="Phone number" checked={getValues("personalData.phoneNumber")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validatePersonalAtLeastOneCheckbox }}
                                name={"personalData.medicalHistory"}
                                render={({ field }) => <InputCheck {...field} labelText="Medical History" checked={getValues("personalData.medicalHistory")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validatePersonalAtLeastOneCheckbox }}
                                name={"personalData.bankAccount"}
                                render={({ field }) => <InputCheck {...field} labelText="Bank Account" checked={getValues("personalData.bankAccount")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validatePersonalAtLeastOneCheckbox }}
                                name={"personalData.academicTranscription"}
                                render={({ field }) => <InputCheck {...field} labelText="Academic transcription" checked={getValues("personalData.academicTranscription")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validatePersonalAtLeastOneCheckbox }}
                                name={"personalData.fingerprint"}
                                render={({ field }) => <InputCheck {...field} labelText="Fingerprint" checked={getValues("personalData.fingerprint")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validatePersonalAtLeastOneCheckbox }}
                                name={"personalData.etc"}
                                render={({ field }) => <InputCheck {...field} labelText="Etc" checked={getValues("personalData.etc")} />}
                            />
                            {errors?.personalData?.fingerprint && errors?.personalData?.fingerprint?.message && <ErrorMessage customMessage={errors?.personalData?.fingerprint?.message} />}
                            <Controller
                                control={control}
                                name={"personalData.extra"}
                                render={({ field }) => <Input {...field} groupClassName="mb-6" labelText="" placeholder="..........." errorType={errors?.personalData?.extra?.type} />}
                            />
                        </div>
                        <div className="flex flex-col gap-5">
                            <Label labelClassName="font-medium mb-3" labelText="GROUND FOR PROCESSING" />
                            <Controller
                                control={control}
                                rules={{ validate: validateGroundAtLeastOneCheckbox }}
                                name={"groundData.consentOfDataSubject"}
                                render={({ field }) => <InputCheck {...field} labelText="Consent of data subject" checked={getValues("groundData.consentOfDataSubject")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateGroundAtLeastOneCheckbox }}
                                name={"groundData.contractualNecessity"}
                                render={({ field }) => <InputCheck {...field} labelText="Contractual necessity" checked={getValues("groundData.contractualNecessity")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateGroundAtLeastOneCheckbox }}
                                name={"groundData.legalObligation"}
                                render={({ field }) => <InputCheck {...field} labelText="Legal obligation" checked={getValues("groundData.legalObligation")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateGroundAtLeastOneCheckbox }}
                                name={"groundData.publicInterest"}
                                render={({ field }) => <InputCheck {...field} labelText="Public interest" checked={getValues("groundData.publicInterest")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateGroundAtLeastOneCheckbox }}
                                name={"groundData.legitimateInterest"}
                                render={({ field }) => <InputCheck {...field} labelText="Legitimate interest" checked={getValues("groundData.legitimateInterest")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateGroundAtLeastOneCheckbox }}
                                name={"groundData.researchUponAuthorization"}
                                render={({ field }) => <InputCheck {...field} labelText="Research upon authorization" checked={getValues("groundData.researchUponAuthorization")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateGroundAtLeastOneCheckbox }}
                                name={"groundData.performanceOfDuties"}
                                render={({ field }) => <InputCheck {...field} labelText="Performance of duties of public entity" checked={getValues("groundData.performanceOfDuties")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateGroundAtLeastOneCheckbox }}
                                name={"groundData.vitalInterests"}
                                render={({ field }) => <InputCheck {...field} labelText="Vital interests of the data subject" checked={getValues("groundData.vitalInterests")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateGroundAtLeastOneCheckbox }}
                                name={"groundData.etc"}
                                render={({ field }) => <InputCheck {...field} labelText="Etc" checked={getValues("groundData.etc")} />}
                            />
                            {errors?.groundData?.vitalInterests && errors?.groundData?.vitalInterests?.message && <ErrorMessage customMessage={errors?.groundData?.vitalInterests?.message} />}
                            <Controller
                                control={control}
                                name={"groundData.extra"}
                                render={({ field }) => <Input {...field} groupClassName="mb-6" labelText="" placeholder="..........." errorType={errors?.groundData?.extra?.type} />}
                            />
                        </div>
                    </div>
                </div>
                {getValues("entityType") && (getValues("entityType") == "1" || getValues("entityType") == "3") && (
                    <>
                        <div className="bg-primary text-white py-3 px-6 text-center rounded-[8px] mb-6">
                            <Label labelClassName="font-medium mb-0" labelText="PROCESSING AUTHORIZATIONS" />
                        </div>
                        <div className="mb-6 font-medium">
                            <Label labelClassName="font-medium" labelText="Please list your Data Controllers in the section below" />
                            <PrimaryButton type="button" onClick={addDataAuthorization} size="sm" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded ml-5 w-[100px]">
                                Add
                            </PrimaryButton>
                            {dataAuthorizations.map((authorization, index) => (
                                <div className="flex items-center gap-6 border p-2 rounded-md">
                                    <Controller
                                        control={control}
                                        rules={{ required: true, pattern: /^[a-zA-Z\s]+$/, maxLength: 50 }}
                                        name={`dataAuthorizations[${index}].name`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                groupClassName="mb-6"
                                                labelText="NAME OF THE CONTROLLER"
                                                placeholder="Enter NAME OF THE CONTROLLER"
                                                errorData={{ maxLength: "50" }}
                                                errorType={errors?.dataAuthorizations?.[index]?.name?.type}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={`dataAuthorizations[${index}].dpaLicence`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                groupClassName="mb-6"
                                                labelText="DPA LICENCE OF CONTROLLER"
                                                placeholder="Enter DPA LICENCE OF CONTROLLER"
                                                errorType={errors?.dataAuthorizations?.[index]?.dpaLicence?.type}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={`dataAuthorizations[${index}].country`}
                                        render={({ field }) => (
                                            <InputSelect
                                                {...field}
                                                groupClassName="mb-6"
                                                labelText="COUNTRY"
                                                placeholder="Enter COUNTRY"
                                                value={(countriesList && countriesList?.countries.find((data) => data.value == field.value)) || null}
                                                onChange={(e) => setValue(field.name, e)}
                                                options={countriesList && countriesList?.countries}
                                                errorType={errors?.dataAuthorizations?.[index]?.country?.type}
                                            />
                                        )}
                                    />
                                    {dataAuthorizations.length > 1 && (
                                        <PrimaryButton
                                            type="button"
                                            onClick={() => removeDataAuthorization(authorization.index)}
                                            size="sm"
                                            className="mt-1 bg-red-500 text-white px-4 py-2 rounded w-[100px] mb-6">
                                            Remove
                                        </PrimaryButton>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {getValues("entityType") && (getValues("entityType") == "2" || getValues("entityType") == "3") && (
                    <>
                        <div className="bg-primary text-white py-3 px-6 text-center rounded-[8px] mb-6">
                            <Label labelClassName="font-medium mb-0" labelText="DATA PROCESSORS INVOLVEMENT" />
                        </div>
                        <div className="mb-6 font-medium">
                            <Label labelClassName="font-medium" labelText="Please list your Data Processors in the section below" />
                            <PrimaryButton type="button" onClick={addDataProcessor} size="sm" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded ml-5 w-[100px]">
                                Add
                            </PrimaryButton>
                            {dataProcessors.map((processor, index) => (
                                <div className="flex items-center gap-6 border p-2 rounded-md">
                                    <Controller
                                        control={control}
                                        rules={{ required: true, pattern: /^[a-zA-Z\s]+$/, maxLength: 50 }}
                                        name={`dataProcessors[${index}].name`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                groupClassName="mb-6"
                                                labelText="NAME OF THE DATA PROCESSORS"
                                                placeholder="Enter NAME OF THE DATA PROCESSORS"
                                                errorData={{ maxLength: "50" }}
                                                errorType={errors?.dataProcessors?.[index]?.name?.type}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={`dataProcessors[${index}].dpaLicence`}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                groupClassName="mb-6"
                                                labelText="DPA LICENCE OF PROCESSORS"
                                                placeholder="Enter DPA LICENCE OF PROCESSORS"
                                                errorType={errors?.dataProcessors?.[index]?.dpaLicence?.type}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={`dataProcessors[${index}].country`}
                                        render={({ field }) => (
                                            <InputSelect
                                                {...field}
                                                groupClassName="mb-6"
                                                labelText="COUNTRY"
                                                placeholder="Enter COUNTRY"
                                                value={(countriesList && countriesList?.countries.find((data) => data.value == field.value)) || null}
                                                onChange={(e) => setValue(field.name, e)}
                                                options={countriesList && countriesList?.countries}
                                                errorType={errors?.dataProcessors?.[index]?.country?.type}
                                            />
                                        )}
                                    />
                                    {dataProcessors.length > 1 && (
                                        <PrimaryButton
                                            type="button"
                                            onClick={() => removeDataProcessor(processor.index)}
                                            size="sm"
                                            className="mt-1 bg-red-500 text-white px-4 py-2 rounded w-[100px] mb-6">
                                            Remove
                                        </PrimaryButton>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <div className="mb-6 font-medium">
                    <Label labelClassName="font-medium" labelText="Data Transfer to Other Countries" />
                    <div className="flex max-md:flex-col md:items-center gap-4 md:gap-6 md:gap-6 lg:gap-10">
                        <Controller
                            control={control}
                            rules={{
                                validate: (value) => (value !== undefined && value !== "") || "This field is required",
                            }}
                            name="dataTransferOutsideCountry"
                            render={({ field }) => (
                                <div className="flex gap-4">
                                    <InputRadio {...field} value="1" checked={field.value == "1"} size="sm" labelText="Yes" errorType={errors?.dataTransferOutsideCountry?.type} />
                                    <InputRadio {...field} value="0" checked={field.value == "0"} size="sm" labelText="No" errorType={errors?.dataTransferOutsideCountry?.type} />
                                </div>
                            )}
                        />
                    </div>
                    {errors?.dataTransferOutsideCountry && <ErrorMessage customMessage={errors?.dataTransferOutsideCountry?.message} />}
                </div>
                {dataTransferOutsideCountry == "1" && (
                    <div className="mb-6 font-medium">
                        <Label labelClassName="font-medium" labelText="Country List" />
                        <PrimaryButton type="button" onClick={addDataCountry} size="sm" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded ml-5 w-[100px]">
                            Add
                        </PrimaryButton>
                        {dataCountry.map((country, index) => (
                            <div className="flex items-center gap-6 border p-2 rounded-md mb-2">
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    name={`dataCountry[${index}]`}
                                    render={({ field }) => (
                                        <InputSelect
                                            {...field}
                                            groupClassName="mb-6"
                                            labelText="COUNTRY"
                                            placeholder="Enter COUNTRY"
                                            value={(countriesList && countriesList?.countries.find((data) => data.value == field.value)) || null}
                                            onChange={(e) => setValue(field.name, e)}
                                            options={countriesList && countriesList?.countries}
                                            errorType={errors?.country?.[index]?.type}
                                        />
                                    )}
                                />
                                {dataCountry.length > 1 && (
                                    <PrimaryButton type="button" onClick={() => removeDataCountry(country.index)} size="sm" className="mt-1 bg-red-500 text-white px-4 py-2 rounded w-[100px] mb-6">
                                        Remove
                                    </PrimaryButton>
                                )}
                            </div>
                        ))}

                        <Controller
                            control={control}
                            rules={{ required: true, maxLength: 500 }}
                            name={"purposeOfDataProcessing"}
                            render={({ field }) => (
                                <InputTextarea
                                    {...field}
                                    rows="3"
                                    groupClassName="mb-6"
                                    labelText="Purpose of Data Processing"
                                    placeholder="Purpose of Data Processing"
                                    errorData={{ maxLength: "500" }}
                                    errorType={errors?.purposeOfDataProcessing?.type}
                                />
                            )}
                        />
                    </div>
                )}
                <div className="flex max-md:flex-col md:items-center gap-4 md:gap-6 md:gap-6 lg:gap-10">
                    <Controller
                        control={control}
                        rules={{
                            validate: (value) => (value !== undefined && value !== "") || "This field is required",
                        }}
                        name="sesitivePersonalData"
                        render={({ field }) => (
                            <div className="flex gap-4">
                                <InputRadio
                                    {...field}
                                    value="1"
                                    checked={field.value == "1"}
                                    inputClassName="appearance-auto"
                                    labelText={
                                        <div className="bg-primary text-white py-3 px-6 text-center rounded-[8px] mb-6">
                                            <Label labelClassName="font-medium mb-0" labelText="Sensitive Personal Data" />
                                            <br />
                                            Personal information that can cause discrimination/distress to data subjects if compromised.
                                        </div>
                                    }
                                    errorType={errors?.sesitivePersonalData?.type}
                                />
                                <InputRadio
                                    {...field}
                                    value="0"
                                    checked={field.value == "0"}
                                    inputClassName="appearance-auto"
                                    labelText={
                                        <div className="bg-primary text-white py-3 px-6 text-center rounded-[8px] mb-6">
                                            <Label labelClassName="font-medium mb-0" labelText="Non-Sensitive Personal Data" />
                                            <br />
                                            Personal information that does not fall into the sensitive category.
                                        </div>
                                    }
                                    errorType={errors?.sesitivePersonalData?.type}
                                />
                            </div>
                        )}
                    />
                </div>
                {sesitivePersonalData == "1" && (
                    <div className="mb-6 font-medium">
                        <Label labelClassName="font-medium" labelText="Please list your Data Controllers in the section below" />
                        <PrimaryButton type="button" onClick={addDataController} size="sm" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded ml-5 w-[100px]">
                            Add
                        </PrimaryButton>
                        {dataControllers.map((contrller, index) => (
                            <div className="flex items-center gap-6 border p-2 rounded-md">
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    name={`dataControllers[${index}].dataSubject`}
                                    render={({ field }) => (
                                        <InputSelect
                                            {...field}
                                            groupClassName="mb-6"
                                            labelText="Kind of Data Subjects"
                                            placeholder="Select Kind of Data Subjects"
                                            value={categorySubjectOptionList.find((data) => data.value == field.value) || null}
                                            onChange={(selectedOptionValue) => field.onChange(selectedOptionValue)}
                                            options={categorySubjectOptionList}
                                            errorType={errors?.dataControllers?.[index]?.dataSubject?.type}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true, maxLength: 100 }}
                                    name={`dataControllers[${index}].description`}
                                    render={({ field }) => (
                                        <InputTextarea
                                            {...field}
                                            rows="3"
                                            groupClassName="mb-6"
                                            labelText="Description"
                                            placeholder="Enter Description"
                                            errorData={{ maxLength: "100" }}
                                            errorType={errors?.dataControllers?.[index]?.description?.type}
                                        />
                                    )}
                                />
                                {dataControllers.length > 1 && (
                                    <PrimaryButton
                                        type="button"
                                        onClick={() => removeDataController(contrller.index)}
                                        size="sm"
                                        className="mt-1 bg-red-500 text-white px-4 py-2 rounded w-[100px] mb-6">
                                        Remove
                                    </PrimaryButton>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <Divider className="my-6" />
                <div className="">
                    <PrimaryButton type="submit">Save and Continue</PrimaryButton>
                </div>
            </div>
        </CustomCard>
    );
}

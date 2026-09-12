import React, { useState, useRef, useEffect, useContext } from "react";
import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import Divider from "@/components/ui/divider";
import { InputSelect } from "@/components/ui/inputs/input-select";
import { Input } from "@/components/ui/inputs/input";
import { InputTextarea } from "@/components/ui/inputs/input-textarea";
import InputCheck from "@/components/ui/inputs/input-check";
import InputRadio from "@/components/ui/inputs/input-radio";
import { Label } from "@/components/ui/inputs/label";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import ErrorMessage from "@/components/common/ErrorMessage";
import AssignRegestrationDropdwon from "@/components/common/AssignRegestrationDropdwon";
import { AuthContext } from "@/guard/AuthProvider";

export default function SixStepFormWidget({ control, errors, getValues, setValue, editId = "", ...props }) {
    const { roleValue } = useContext(AuthContext);
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
        {
            label: "Draft",
            value: "6",
        },
    ];

    const filteredStatusOptions =
        roleWiseList[roleValue] && Array.isArray(roleWiseList[roleValue]) ? statusOptionList.filter((option) => roleWiseList[roleValue].includes(option.value)) : statusOptionList;

    const riskLevelOptionList = [
        {
            label: "Low",
            value: "1",
        },
        {
            label: "Medium",
            value: "2",
        },
        {
            label: "High",
            value: "3",
        },
    ];

    const validateAtLeastOneTechnicalCheckbox = () => {
        return Object.values(getValues("technicalMeasures")).some((value) => value == true) || "At least one checkbox must be selected";
    };

    const validateAtLeastOneOrganizationCheckbox = () => {
        return Object.values(getValues("organizationalMeasures")).some((value) => value == true) || "At least one checkbox must be selected";
    };

    const validateAtLeastOneSensitiveCheckbox = () => {
        return Object.values(getValues("categoriesSensitive")).some((value) => value == true) || "At least one checkbox must be selected";
    };

    return (
        <CustomCard className="p-6 !border-t-4 !border-t-green">
            <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-primary">Safety Precautions</h2>
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
                <p className="text-red-600 mb-6 font-medium bg-red-50 p-4 rounded-lg border border-red-200">Note: Information captured in this section cannot be edited after payment</p>

                <Controller
                    control={control}
                    rules={{ required: true }}
                    name={"riskLevel"}
                    render={({ field }) => (
                        <InputSelect
                            {...field}
                            groupClassName="mb-6"
                            labelText="Risk Level of Data Processing"
                            placeholder="Risk Level of Data Processing"
                            value={riskLevelOptionList.find((data) => data.value == getValues("riskLevel")) || null}
                            onChange={(e) => setValue("riskLevel", e)}
                            options={riskLevelOptionList}
                            errorType={errors?.riskLevel?.type}
                        />
                    )}
                />
                <div className="mb-6 font-medium">
                    <Label labelClassName="font-medium" labelText="PLEASE SELECT THE TYPE OF CATEGORIES OF SENSITIVE PERSONAL DATA" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-5">
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneSensitiveCheckbox }}
                                name={"categoriesSensitive.biometricData"}
                                render={({ field }) => <InputCheck {...field} labelText="Biometric data" checked={getValues("categoriesSensitive.biometricData")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneSensitiveCheckbox }}
                                name={"categoriesSensitive.clan"}
                                render={({ field }) => <InputCheck {...field} labelText="Clan" checked={getValues("categoriesSensitive.clan")} />}
                            />
                        </div>
                        <div className="flex flex-col gap-5">
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneSensitiveCheckbox }}
                                name={"categoriesSensitive.healthStatus"}
                                render={({ field }) => <InputCheck {...field} labelText="Health status" checked={getValues("categoriesSensitive.healthStatus")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneSensitiveCheckbox }}
                                name={"categoriesSensitive.maritalStatus"}
                                render={({ field }) => <InputCheck {...field} labelText="Marital status" checked={getValues("categoriesSensitive.maritalStatus")} />}
                            />
                        </div>
                        <div className="flex flex-col gap-5">
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneSensitiveCheckbox }}
                                name={"categoriesSensitive.criminalRecords"}
                                render={({ field }) => <InputCheck {...field} labelText="Criminal records" checked={getValues("categoriesSensitive.criminalRecords")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneSensitiveCheckbox }}
                                name={"categoriesSensitive.financialInformation"}
                                render={({ field }) => <InputCheck {...field} labelText="Financial Information" checked={getValues("categoriesSensitive.financialInformation")} />}
                            />
                        </div>
                        {errors?.categoriesSensitive?.financialInformation && errors?.categoriesSensitive?.financialInformation?.message && (
                            <ErrorMessage customMessage={errors?.categoriesSensitive?.financialInformation?.message} />
                        )}
                    </div>
                </div>

                <div className="mb-6 font-medium">
                    <Label labelClassName="font-medium" labelText="Safeguards (Security Measures)" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-5">
                            <Label labelClassName="font-medium mb-3" labelText="Technical Measures*" />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneTechnicalCheckbox }}
                                name={"technicalMeasures.networkSecurityFirewalls"}
                                render={({ field }) => <InputCheck {...field} labelText="Network Security & Firewalls" checked={getValues("technicalMeasures.networkSecurityFirewalls")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneTechnicalCheckbox }}
                                name={"technicalMeasures.dataSecuritySystems"}
                                render={({ field }) => <InputCheck {...field} labelText="Data Security Systems" checked={getValues("technicalMeasures.dataSecuritySystems")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneTechnicalCheckbox }}
                                name={"technicalMeasures.dataLossPreventionSolutions"}
                                render={({ field }) => <InputCheck {...field} labelText="Data Loss Prevention Solutions" checked={getValues("technicalMeasures.dataLossPreventionSolutions")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneTechnicalCheckbox }}
                                name={"technicalMeasures.dataRecoverySystems"}
                                render={({ field }) => <InputCheck {...field} labelText="Data Recovery Systems" checked={getValues("technicalMeasures.dataRecoverySystems")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneTechnicalCheckbox }}
                                name={"technicalMeasures.dataEncryption"}
                                render={({ field }) => <InputCheck {...field} labelText="Data Encryption" checked={getValues("technicalMeasures.dataEncryption")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneTechnicalCheckbox }}
                                name={"technicalMeasures.auditTrailAndLogging"}
                                render={({ field }) => <InputCheck {...field} labelText="Audit Trail and Logging" checked={getValues("technicalMeasures.auditTrailAndLogging")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneTechnicalCheckbox }}
                                name={"technicalMeasures.dataAccessAuthorizationAuthentication"}
                                render={({ field }) => (
                                    <InputCheck {...field} labelText="Data Access Authorization & Authentication" checked={getValues("technicalMeasures.dataAccessAuthorizationAuthentication")} />
                                )}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneTechnicalCheckbox }}
                                name={"technicalMeasures.dataMinimization"}
                                render={({ field }) => <InputCheck {...field} labelText="Data Minimization" checked={getValues("technicalMeasures.dataMinimization")} />}
                            />
                            {errors?.technicalMeasures?.dataMinimization && errors?.technicalMeasures?.dataMinimization?.message && (
                                <ErrorMessage customMessage={errors?.technicalMeasures?.dataMinimization?.message} />
                            )}
                        </div>
                        <div className="flex flex-col gap-5">
                            <Label labelClassName="font-medium mb-3" labelText="Organizational Measures*" />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneOrganizationCheckbox }}
                                name={"organizationalMeasures.dataRetentionPolicies"}
                                render={({ field }) => <InputCheck {...field} labelText="Data Retention Policies" checked={getValues("organizationalMeasures.dataRetentionPolicies")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneOrganizationCheckbox }}
                                name={"organizationalMeasures.dataProtectionPolicies"}
                                render={({ field }) => <InputCheck {...field} labelText="Data Protection Policies" checked={getValues("organizationalMeasures.dataProtectionPolicies")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneOrganizationCheckbox }}
                                name={"organizationalMeasures.remediationAndIncidenceResponseSystems"}
                                render={({ field }) => (
                                    <InputCheck
                                        {...field}
                                        labelText="Remediation and Incidence Response Systems"
                                        checked={getValues("organizationalMeasures.remediationAndIncidenceResponseSystems")}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneOrganizationCheckbox }}
                                name={"organizationalMeasures.specialisedTrainings"}
                                render={({ field }) => <InputCheck {...field} labelText="Specialised Trainings" checked={getValues("organizationalMeasures.specialisedTrainings")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneOrganizationCheckbox }}
                                name={"organizationalMeasures.publicityOfDataSubjectRights"}
                                render={({ field }) => (
                                    <InputCheck {...field} labelText="Publicity of Data Subject Rights" checked={getValues("organizationalMeasures.publicityOfDataSubjectRights")} />
                                )}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneOrganizationCheckbox }}
                                name={"organizationalMeasures.activeGrievanceRedressMechanism"}
                                render={({ field }) => (
                                    <InputCheck {...field} labelText="Active Grievance Redress Mechanism" checked={getValues("organizationalMeasures.activeGrievanceRedressMechanism")} />
                                )}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneOrganizationCheckbox }}
                                name={"organizationalMeasures.cookieConsent"}
                                render={({ field }) => <InputCheck {...field} labelText="Cookie Consent" checked={getValues("organizationalMeasures.cookieConsent")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneOrganizationCheckbox }}
                                name={"organizationalMeasures.dpoDesignation"}
                                render={({ field }) => <InputCheck {...field} labelText="DPO Designation" checked={getValues("organizationalMeasures.dpoDesignation")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneOrganizationCheckbox }}
                                name={"organizationalMeasures.regularSecurityAudits"}
                                render={({ field }) => <InputCheck {...field} labelText="Regular Security Audits" checked={getValues("organizationalMeasures.regularSecurityAudits")} />}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneOrganizationCheckbox }}
                                name={"organizationalMeasures.vendorandThirdPartyManagement"}
                                render={({ field }) => (
                                    <InputCheck {...field} labelText="Vendor and Third Party Management" checked={getValues("organizationalMeasures.vendorandThirdPartyManagement")} />
                                )}
                            />
                            <Controller
                                control={control}
                                rules={{ validate: validateAtLeastOneOrganizationCheckbox }}
                                name={"organizationalMeasures.dataPrivacyImpactAssessmentsDpias"}
                                render={({ field }) => (
                                    <InputCheck {...field} labelText="Data Privacy Impact Assessments (DPIAs)" checked={getValues("organizationalMeasures.dataPrivacyImpactAssessmentsDpias")} />
                                )}
                            />
                            {errors?.organizationalMeasures?.dataPrivacyImpactAssessmentsDpias && errors?.organizationalMeasures?.dataPrivacyImpactAssessmentsDpias?.message && (
                                <ErrorMessage customMessage={errors?.organizationalMeasures?.dataPrivacyImpactAssessmentsDpias?.message} />
                            )}
                        </div>
                    </div>
                    <Controller
                        control={control}
                        name={"employeeInvolved"}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Input {...field} groupClassName="mb-6" labelText="Employee Involved" placeholder="Enter Employee Involved" errorType={errors?.groundData?.extra?.type} />
                        )}
                    />

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
                </div>

                <Divider className="my-6" />
                <div className="">
                    <PrimaryButton type="submit">Save and Continue</PrimaryButton>
                </div>
            </div>
        </CustomCard>
    );
}

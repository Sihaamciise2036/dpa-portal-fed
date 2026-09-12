import React, { useState, useRef, useEffect } from "react";
import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import Divider from "@/components/ui/divider";
import { InputSelect } from "@/components/ui/inputs/input-select";
import { Input } from "@/components/ui/inputs/input";
import { InputIcon } from "@/components/ui/inputs/input-icon";
import { InputTextarea } from "@/components/ui/inputs/input-textarea";
import InputRadio from "@/components/ui/inputs/input-radio";
import { Label } from "@/components/ui/inputs/label";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function FiveStepFormWidget({ control, errors, getValues, setValue, ...props }) {
    const [dataRepresentatives, setDataRepresentatives] = useState([{ index: 1 }]);

    useEffect(() => {
        if (getValues("dataRepresentatives") && getValues("dataRepresentatives").length > 0 && getValues("dataRepresentatives")[0] && getValues("dataRepresentatives")[0] !== "") {
            setDataRepresentatives(getValues("dataRepresentatives"));
        }
    }, []);

    const addDataProcessor = () => {
        setDataRepresentatives([...dataRepresentatives, { index: dataRepresentatives.length + 1 }]);
    };

    const removeDataProcessor = (index) => {
        if (dataRepresentatives.length > 1) {
            setDataRepresentatives(dataRepresentatives.filter((item) => item.index !== index));
        }
    };

    return (
        <CustomCard className="p-6 !border-t-4 !border-t-green">
            <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-primary">Data Controller / Processor Representatives</h2>
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

                <div className="mb-6 font-medium">
                    {dataRepresentatives.map((processor, index) => (
                        <div className="mt-2 border p-2 rounded-md">
                            <div className="flex items-center gap-6 rounded-md">
                                <Controller
                                    control={control}
                                    rules={{ required: true, maxLength: 50 }}
                                    name={`dataRepresentatives[${index}].firstName`}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            groupClassName="mb-6"
                                            labelText="First Name"
                                            placeholder="Enter First Name"
                                            errorData={{ maxLength: "50" }}
                                            errorType={errors?.dataRepresentatives?.[index]?.firstName?.type}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true, maxLength: 50 }}
                                    name={`dataRepresentatives[${index}].lastName`}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            groupClassName="mb-6"
                                            labelText="Last Name"
                                            placeholder="Enter Last Name"
                                            errorData={{ maxLength: "50" }}
                                            errorType={errors?.dataRepresentatives?.[index]?.lastName?.type}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ }}
                                    name={`dataRepresentatives[${index}].email`}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            groupClassName="mb-6"
                                            labelText="Official Email Address"
                                            placeholder="Enter Email Address"
                                            errorType={errors?.dataRepresentatives?.[index]?.dpaLicense?.email}
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex items-center gap-6 rounded-md">
                                <Controller
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/, minLength: 9, maxLength: 9 }}
                                    name={`dataRepresentatives[${index}].phoneNo`}
                                    render={({ field }) => (
                                        <InputIcon
                                            {...field}
                                            groupClassName="mb-6"
                                            labelText="Official Phone Number"
                                            placeholder="Enter Phone Number"
                                            prefixIcon={<span className="text-gray-500">+252</span>}
                                            errorData={{ minLength: "9", maxLength: "9" }}
                                            errorType={errors?.dataRepresentatives?.[index]?.phoneNo?.type}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true, maxLength: 70 }}
                                    name={`dataRepresentatives[${index}].address`}
                                    render={({ field }) => (
                                        <InputTextarea
                                            {...field}
                                            rows="3"
                                            groupClassName="mb-6"
                                            labelText="Official Contact Address"
                                            placeholder="Enter Contact Address"
                                            errorData={{ maxLength: "70" }}
                                            errorType={errors?.dataRepresentatives?.[index]?.address?.type}
                                        />
                                    )}
                                />
                                {dataRepresentatives.length > 1 && (
                                    <PrimaryButton type="button" onClick={() => removeDataProcessor(processor.index)} size="sm" className="mt-1 bg-red-500 text-white px-4 py-2 rounded w-[100px] mb-6">
                                        Remove
                                    </PrimaryButton>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <PrimaryButton type="button" onClick={addDataProcessor} size="sm" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded ml-5 w-[100px]">
                    Add More
                </PrimaryButton>
                <Divider className="my-6" />
                <div className="">
                    <PrimaryButton type="submit">Save and Continue</PrimaryButton>
                </div>
            </div>
        </CustomCard>
    );
}

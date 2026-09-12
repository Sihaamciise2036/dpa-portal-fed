import React, { useState, useRef, useEffect } from "react";
import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import Divider from "@/components/ui/divider";
import { InputSelect } from "@/components/ui/inputs/input-select";
import { InputAsyncSelect } from "@/components/ui/inputs/input-async-select";
import { Input } from "@/components/ui/inputs/input";
import { InputTextarea } from "@/components/ui/inputs/input-textarea";
import InputRadio from "@/components/ui/inputs/input-radio";
import { Label } from "@/components/ui/inputs/label";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import ErrorMessage from "@/components/common/ErrorMessage";
import { getDataDpoService, getByIdsDataDpoService } from "@/services/user/DataControllerServices";
import validationErrors from "@/lib/validationErrors";

export default function FourStepFormWidget({ control, errors, getValues, setValue, ...props }) {
    const dispatch = useDispatch();
    const [protectionOfficers, setProtectionOfficers] = useState([{ index: 1, dpoId: "", firstName: "", lastName: "", contactNumber: "", email: "", address: "" }]);
    const [dpoOptionList, setDpoOptionList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (getValues("dpoId") && getValues("dpoId").length > 0 && getValues("dpoId")[0] && getValues("dpoId")[0] !== "") {
            getDataByIds(getValues("dpoId"));
        }
    }, []);

    const loadDpoOptions = async (inputValue, callback) => {
        setIsLoading(true);
        try {
            const response = await dispatch(
                getDataDpoService({
                    search: inputValue,
                    page: 1,
                    limit: 10,
                    extra_filter: {},
                })
            );
            const dpoArr = response?.data?.data?.data || [];

            const options = dpoArr.map((element) => ({
                value: element?._id,
                label: element?.organisationName,
                extra: element,
            }));

            callback(options);
        } catch (error) {
            console.error("Error fetching DPOs:", error);
        }
        setIsLoading(false);
    };

    const getDataByIds = (ids) => {
        setIsLoading(true);
        dispatch(getByIdsDataDpoService({ ids: ids }))
            .then((res) => {
                var formData = res?.data?.data;
                getValues("dpoId").forEach((element, index) => {
                    const selectValue = formData.find((item) => item._id == element);
                    setProtectionOfficers((prev) => {
                        const updatedOfficers = [...prev];
                        updatedOfficers[index] = {
                            ...updatedOfficers[index],
                            dpoId: selectValue?._id,
                            organisationName: selectValue?.organisationName,
                            firstName: selectValue?.dataProtectionApplier?.firstName,
                            lastName: selectValue?.dataProtectionApplier?.lastName,
                            contactNumber: selectValue?.dataProtectionApplier?.contactNumber,
                            email: selectValue?.dataProtectionApplier?.email,
                            address: selectValue?.dataProtectionApplier?.contact?.address,
                        };
                        return updatedOfficers;
                    });
                    setValue(`dpoId[${index}]`, selectValue?._id);
                });

                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
            });
    };

    const addDataProcessor = () => {
        setProtectionOfficers([...protectionOfficers, { index: protectionOfficers.length + 1, dpoId: "", firstName: "", lastName: "", contactNumber: "", email: "", address: "" }]);
    };

    const removeDataProcessor = (index) => {
        if (protectionOfficers.length > 1) {
            setProtectionOfficers(protectionOfficers.filter((item) => item.index !== index));
        }
    };

    const selectOnchangeValue = (selectValue, index) => {
        setProtectionOfficers((prev) => {
            const updatedOfficers = [...prev];
            updatedOfficers[index] = {
                ...updatedOfficers[index],
                dpoId: selectValue?.extra?._id,
                organisationName: selectValue?.extra?.organisationName,
                firstName: selectValue?.extra?.dataProtectionApplier?.firstName,
                lastName: selectValue?.extra?.dataProtectionApplier?.lastName,
                contactNumber: selectValue?.extra?.dataProtectionApplier?.contactNumber,
                email: selectValue?.extra?.dataProtectionApplier?.email,
                address: "",
            };
            return updatedOfficers;
        });
        setValue(`dpoId[${index}]`, selectValue?.extra?._id);
    };

    return (
        <CustomCard className="p-6 !border-t-4 !border-t-green">
            <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-primary">Data Protection Officers</h2>
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
                    {protectionOfficers.map((processor, index) => (
                        <div className="mt-2 border p-2 rounded-md">
                            <div className="flex items-center gap-6 rounded-md">
                                <Controller
                                    control={control}
                                    name={`dpoId[${index}]`}
                                    render={({ field }) => (
                                        <InputAsyncSelect
                                            {...field}
                                            groupClassName="mb-6"
                                            labelText="Data Protection Officers"
                                            placeholder="Select Data Protection Officers"
                                            isSearchable
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={loadDpoOptions}
                                            value={processor.dpoId && processor.dpoId !== "" ? { label: processor.organisationName, value: processor.dpoId } : null}
                                            onChange={(selectedOption) => selectOnchangeValue(selectedOption, index)}
                                            errorType={errors?.protectionOfficers?.[index]?.dpoId?.type}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`tempData[${index}].firstName`}
                                    render={({ field }) => (
                                        <Input {...field} disabled={true} value={processor?.firstName} groupClassName="mb-6" labelText="First Name" placeholder="Enter First Name" />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`tempData[${index}].lastName`}
                                    render={({ field }) => <Input {...field} disabled={true} groupClassName="mb-6" value={processor?.lastName} labelText="Last Name" placeholder="Enter Last Name" />}
                                />
                            </div>
                            <div className="flex items-center gap-6 rounded-md">
                                <Controller
                                    control={control}
                                    name={`tempData[${index}].email`}
                                    render={({ field }) => (
                                        <Input {...field} disabled={true} value={processor?.email} groupClassName="mb-6" labelText="Official Email Address" placeholder="Enter Email Address" />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`tempData[${index}].phoneNo`}
                                    render={({ field }) => (
                                        <Input {...field} disabled={true} value={processor?.contactNumber} groupClassName="mb-6" labelText="Official Phone Number" placeholder="Enter Phone Number" />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`tempData[${index}].address`}
                                    render={({ field }) => (
                                        <InputTextarea
                                            {...field}
                                            disabled={true}
                                            value={processor?.address}
                                            rows="3"
                                            groupClassName="mb-6"
                                            labelText="Official Contact Address"
                                            placeholder="Enter Contact Address"
                                        />
                                    )}
                                />
                                {protectionOfficers.length > 1 && (
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

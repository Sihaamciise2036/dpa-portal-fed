import React, { useState, useRef, useEffect } from "react";
import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import Divider from "@/components/ui/divider";
import { InputSelect } from "@/components/ui/inputs/input-select";
import { Input } from "@/components/ui/inputs/input";
import { InputIcon } from "@/components/ui/inputs/input-icon";
import { Label } from "@/components/ui/inputs/label";
import { InputTextarea } from "@/components/ui/inputs/input-textarea";
import InputRadio from "@/components/ui/inputs/input-radio";
import InputUpload from "@/components/ui/inputs/input-upload";
import { fileUpload, getFileUrl } from "@/services/CommonService";
import { getSectorClassificationService } from "@/services/user/SectorClassificationServices";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import ErrorMessage from "@/components/common/ErrorMessage";
import ToastMe from "@/components/ui/ToastMe";
import { useDispatch, useSelector } from "react-redux";
import validationErrors from "@/lib/validationErrors";

export default function TwoStepFormWidget({ control, errors, watch, getValues, setValue, categoriesOptionList, sizesOptionList, ...props }) {
    const dispatch = useDispatch();
    const organizationType = watch("organizationType");
    const personalLogoFileValue = watch("personalLogo");
    const contactSectorType = watch("contact.sectorType");
    const [isLoading, setIsLoading] = useState(false);
    const [sectorOptionList, setSectorOptionList] = useState([]);
    const sectorFilterRef = useRef({ categoryId: "", sizeId: "" });
    const [personalBio, setPersonalBio] = useState("Personal Bio");
    useEffect(() => {
        setValue("companyType", 0);
    }, []);

    useEffect(() => {
        if (getValues("organizationType") === "68c52ec14d91214ebb5702ac" || getValues("organizationType") === "68c52ec14d91214ebb5702b0") {
            setPersonalBio("Profile");
        } else {
            setPersonalBio("Personal Bio");
        }
        const categoryId = organizationType || "";
        const sizeId = contactSectorType || "";
        const previousFilter = sectorFilterRef.current;
        const hasLoadedFilter = previousFilter.categoryId && previousFilter.sizeId;
        const filterChanged = hasLoadedFilter && (previousFilter.categoryId !== categoryId || previousFilter.sizeId !== sizeId);

        if (filterChanged) {
            setValue("contact.sector", "");
        }

        sectorFilterRef.current = { categoryId, sizeId };

        if (!categoryId || !sizeId) {
            setSectorOptionList([]);
            setIsLoading(false);
            return;
        }

        getSectorList(categoryId, sizeId);
    }, [organizationType, contactSectorType]);

    const getSectorList = (selectCategory, selectSize) => {
        setIsLoading(true);
        dispatch(
            getSectorClassificationService({
                search: "",
                page: 1,
                limit: 1000,
                extra_filter: { category_id: selectCategory, size_id: selectSize },
            })
        )
            .then((res) => {
                const sectors = res?.data?.data?.data || [];
                console.log("sectors", sectors);
                const formatted = sectors
                    .filter((item) => item?._id && item?.sector_id?.name)
                    .map((item) => ({
                        value: item._id,
                        label: item.sector_id.name,
                    }));

                setSectorOptionList(formatted);
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
            });
    };

    const getSectorSelectMessage = () => {
        if (!organizationType) return "Select organization type first";
        if (!contactSectorType) return "Select sector type first";
        if (isLoading) return "Loading sectors...";
        return "No sectors found for this organization and sector type";
    };

    const entityOptionList = [
        {
            label: "Data Controller",
            value: "1",
        },
        {
            label: "Data Processor",
            value: "2",
        },
        {
            label: "Both",
            value: "3",
        },
    ];

    const stateOptionList = [
        { label: "Awdal", value: "Awdal" },
        { label: "Bakool", value: "Bakool" },
        { label: "Banaadir", value: "Banaadir" },
        { label: "Bari", value: "Bari" },
        { label: "Bay", value: "Bay" },
        { label: "Galguduud", value: "Galguduud" },
        { label: "Gedo", value: "Gedo" },
        { label: "Hiraan", value: "Hiraan" },
        { label: "Jubbada Dhexe", value: "Jubbada Dhexe" },
        { label: "Jubbada Hoose", value: "Jubbada Hoose" },
        { label: "Mudug", value: "Mudug" },
        { label: "Nugaal", value: "Nugaal" },
        { label: "Sanaag", value: "Sanaag" },
        { label: "Shabeellaha Dhexe", value: "Shabeellaha Dhexe" },
        { label: "Shabeellah Hoose", value: "Shabeellah Hoose" },
        { label: "Sool", value: "Sool" },
        { label: "Togdheer", value: "Togdheer" },
        { label: "Woqooyi Galbeed", value: "Woqooyi Galbeed" },
    ];

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
        dispatch(fileUpload({ file: file_preview }, "controllerData"))
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

    return (
        <CustomCard className="p-6 !border-t-4 !border-t-green">
            <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-primary">DATA CONTROLLER / PROCESSOR</h2>
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
                                        {categoriesOptionList &&
                                            categoriesOptionList.map((element) => (
                                                <InputRadio
                                                    key={element._id}
                                                    {...field}
                                                    value={element._id}
                                                    checked={field.value == element._id}
                                                    size="sm"
                                                    labelText={element.name}
                                                    errorType={errors?.organizationType?.type}
                                                />
                                            ))}
                                    </div>
                                )}
                            />
                        </div>
                        {errors?.organizationType && <ErrorMessage errorType={errors?.organizationType?.type} />}
                    </div>
                </div>
                {getValues("organizationType") && getValues("organizationType") == "68c52ec14d91214ebb5702b0" ? (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        name={"entityType"}
                        render={({ field }) => (
                            <InputSelect
                                {...field}
                                groupClassName="mb-6"
                                labelText="Type"
                                placeholder="Type"
                                value={entityOptionList.find((data) => data.value == getValues("entityType")) || null}
                                onChange={(e) => setValue("entityType", e)}
                                options={entityOptionList}
                                errorType={errors?.entityType?.type}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        name={"rcNumber"}
                        render={({ field }) => <Input {...field} labelText="License Number" placeholder="License Number" errorType={errors?.rcNumber?.type} />}
                    />
                </div>
                <Controller
                    control={control}
                    rules={{ required: true, maxLength: 50 }}
                    name={"contact.name"}
                    render={({ field }) => <Input {...field} groupClassName="mb-6" labelText="Name" placeholder="Name" errorData={{ maxLength: "50" }} errorType={errors?.contact?.name?.type} />}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Controller
                        control={control}
                        rules={{ required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ }}
                        name={"contact.email"}
                        render={({ field }) => <Input {...field} groupClassName="mb-6" labelText="Official Email Address" placeholder="Enter Email" errorType={errors?.contact?.email?.type} />}
                    />
                    <Controller
                        control={control}
                        rules={{ required: true, pattern: /^[0-9]+$/, minLength: 9, maxLength: 9 }}
                        name={"contact.number"}
                        render={({ field }) => (
                            <InputIcon
                                {...field}
                                groupClassName="mb-6"
                                labelText="Official Phone Number"
                                placeholder="Enter Number"
                                prefixIcon={<span className="text-gray-500">+252</span>}
                                errorData={{ minLength: "9", maxLength: "9" }}
                                errorType={errors?.contact?.number?.type}
                            />
                        )}
                    />
                </div>
                <Controller
                    control={control}
                    rules={{ required: true, maxLength: 70 }}
                    name={"contact.address"}
                    render={({ field }) => (
                        <InputTextarea
                            {...field}
                            rows="3"
                            groupClassName="mb-6"
                            labelText="Official Contact Address"
                            placeholder="Enter Contact Address"
                            errorData={{ maxLength: "70" }}
                            errorType={errors?.contact?.address?.type}
                        />
                    )}
                />
                <Controller
                    control={control}
                    rules={{ required: true }}
                    name={"contact.state"}
                    render={({ field }) => (
                        <InputSelect
                            {...field}
                            groupClassName="mb-6"
                            labelText="State"
                            placeholder="Enter State"
                            value={stateOptionList.find((data) => data.value == getValues("contact.state")) || null}
                            onChange={(e) => setValue("contact.state", e)}
                            options={stateOptionList}
                            errorType={errors?.contact?.state?.type}
                        />
                    )}
                />
                <div className="grid grid-cols-1">
                    <Label labelClassName="font-medium" labelText="Sector Type" />
                    <div className="mb-6">
                        <div className="flex max-md:flex-col md:items-center gap-4 md:gap-6 lg:gap-10">
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                name="contact.sectorType"
                                value={getValues("contact.sectorType")}
                                render={({ field }) => (
                                    <div className="flex gap-4">
                                        {sizesOptionList &&
                                            sizesOptionList.map((element) => (
                                                <InputRadio
                                                    key={element._id}
                                                    {...field}
                                                    value={element._id}
                                                    checked={field.value == element._id}
                                                    size="sm"
                                                    labelText={element.name}
                                                    errorType={errors?.contact?.sectorType?.type}
                                                />
                                            ))}
                                    </div>
                                )}
                            />
                        </div>
                        {errors?.contact?.sectorType && <ErrorMessage errorType={errors?.contact?.sectorType?.type} />}
                    </div>
                </div>

                <Controller
                    control={control}
                    rules={{ required: true }}
                    name={"contact.sector"}
                    render={({ field }) => (
                        <InputSelect
                            {...field}
                            groupClassName="mb-6"
                            labelText="Sector"
                            placeholder={getSectorSelectMessage()}
                            value={(sectorOptionList && sectorOptionList.find((data) => data.value == getValues("contact.sector"))) || null}
                            onChange={(e) => setValue("contact.sector", e)}
                            options={sectorOptionList}
                            errorType={errors?.contact?.sector?.type}
                            isDisabled={!organizationType || !contactSectorType || isLoading}
                            noOptionsMessage={getSectorSelectMessage}
                        />
                    )}
                />
                <Controller
                    rules={{ required: true, maxLength: 100 }}
                    control={control}
                    name={"personalBio"}
                    render={({ field }) => <InputTextarea {...field} rows="3" groupClassName="mb-6" labelText={personalBio} errorData={{ maxLength: "100" }} errorType={errors?.personalBio?.type} />}
                />
                <div className={"grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 mt-8"}>
                    <Controller
                        control={control}
                        name={"tmp_personal_logo"}
                        render={({ field }) => (
                            <div className="relative w-[160px] h-[160px] border border-dashed border-gray-300 rounded flex items-center justify-center bg-white shadow-md p-2">
                                {getValues("personalLogo") && getValues("personalLogo") !== "" ? (
                                    <>
                                        <img className="db-image object-contain max-w-full max-h-full" alt="slider" src={getFileUrl(getValues("personalLogo"), "controllerData")} />
                                        <button type="button" className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs" onClick={() => setValue("personalLogo", "")}>
                                            Remove
                                        </button>
                                    </>
                                ) : (
                                    <InputUpload
                                        {...field}
                                        id="upload-personalLogo"
                                        labelText="Upload Logo"
                                        onChange={(e) => handleFileUpload(e, "personalLogo")}
                                        accept="image/png, image/jpeg, image/jpg"
                                    />
                                )}
                            </div>
                        )}
                    />
                </div>
                <Divider className="my-6" />
                <div className="">
                    <PrimaryButton type="submit">Save and Continue</PrimaryButton>
                </div>
            </div>
        </CustomCard>
    );
}

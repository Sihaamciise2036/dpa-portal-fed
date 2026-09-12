import React, { useState, useRef, useEffect } from "react";
import CustomCard from "@/components/common/CustomCard";
import Divider from "@/components/ui/divider";
import MainContentPart from "@/layout/front/MainContentPart";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { fileUpload, getFileUrl } from "@/services/CommonService";
import { getPaymentMethodService, addPremierPaymentService, addEdahabPaymentService, addWaffiPaymentService, addPaymentMethodService } from "@/services/user/PaymentService";
import { addDataControllerService, updateDataControllerService, getByIdDataControllerService, getStatusByIdDataControllerService } from "@/services/user/DataControllerServices";
import { getActiveCategoriesService } from "@/services/user/CategoryServices";
import { getActiveSizesService } from "@/services/user/SizeServices";
import validationErrors from "@/lib/validationErrors";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useSelector, useDispatch } from "react-redux";
import ToastMe from "@/components/ui/ToastMe";
import Moment from "moment";
import FirstStepFormWidget from "./formStep/FirstStepFormWidget";
import TwoStepFormWidget from "./formStep/TwoStepFormWidget";
import ThirdStepFormWidget from "./formStep/ThirdStepFormWidget";
import FourStepFormWidget from "./formStep/FourStepFormWidget";
import FiveStepFormWidget from "./formStep/FiveStepFormWidget";
import SixStepFormWidget from "./formStep/SixStepFormWidget";
import SevenStepFormWidget from "./formStep/SevenStepFormWidget";
import EightStepFormWidget from "./formStep/EightStepFormWidget";
import NineStepFormWidget from "./formStep/NineStepFormWidget";
import { useParams, useNavigate } from "react-router-dom";

export default function DataControllerFormPage(props) {
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
    const [summarySteps, setSummarySteps] = useState(1);
    const [submitData, setSubmitData] = useState({});
    const [draftDataId, setDraftDataId] = useState();
    const [paymentGatewayOptionList, setPaymentGatewayOptionList] = useState([]);
    const [paymentFormSubmit, setPaymentFormSubmit] = useState(false);
    const [categoriesOptionList, setCategoriesOptionList] = useState([]);
    const [sizesOptionList, setSizesOptionList] = useState([]);
    const [registrationFee, setRegistrationFee] = useState(0);
    const deSignatureFileValue = watch("contractFile");
    const signaturefileValue = watch("signature");

    const formTabs = [
        { id: 1, value: "Instructions" },
        { id: 2, value: "Data Controller / Processor" },
        { id: 3, value: "Data Processing Details" },
        { id: 4, value: "Data Protection Officers" },
        { id: 5, value: "Data Controller / Processor Representatives" },
        { id: 6, value: "Safety Precautions" },
        { id: 7, value: "Verify Information" },
        { id: 8, value: "Registration Payment" },
        { id: 9, value: "Finish" },
    ];

    useEffect(() => {
        formReset();
        if (id && id != "") {
            getDataById(id);
        } else {
            getDraftStatusById();
        }
        getPaymentGateways();
        getCategories();
        getSizes();
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
                    if (!Array.isArray(data[key]) && data[key]._id) {
                        setValue(fullKey, data[key]._id);
                    }
                    processFormData(data[key], fullKey);
                } else {
                    setValue(fullKey, data[key] !== "" ? data[key] : "");
                }
            }
        }
    };

    const getDraftStatusById = () => {
        setIsLoading(true);
        dispatch(getStatusByIdDataControllerService())
            .then((res) => {
                var formData = res?.data?.data;
                if (formData && formData?.status) {
                    setDraftDataId(formData?._id);
                    setSummarySteps(formData?.formStepComplete);
                    processFormData(formData);
                }
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
            });
    };

    const getDataById = (editId) => {
        setIsLoading(true);
        dispatch(getByIdDataControllerService(editId))
            .then((res) => {
                var formData = res?.data?.data;
                processFormData(formData);
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
                navigate("/dc-dp/list");
            });
    };

    const getPaymentGateways = () => {
        setIsFormSumbmit(true);
        dispatch(getPaymentMethodService())
            .then((res) => {
                setPaymentGatewayOptionList(res?.data?.data);
                setIsFormSumbmit(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsFormSumbmit(false);
            });
    };

    const getCategories = () => {
        setIsFormSumbmit(true);
        dispatch(getActiveCategoriesService())
            .then((res) => {
                setCategoriesOptionList(res?.data?.data);
                setIsFormSumbmit(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsFormSumbmit(false);
            });
    };

    const getSizes = () => {
        setIsFormSumbmit(true);
        dispatch(getActiveSizesService())
            .then((res) => {
                setSizesOptionList(res?.data?.data);
                setIsFormSumbmit(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsFormSumbmit(false);
            });
    };

    const onSubmit = (data) => {
        // summarySteps
        setSubmitData((prev) => ({ ...prev, ...data }));

        if (summarySteps == "2") {
            if (data?.personalLogo && data?.personalLogo !== "") {
            } else {
                ToastMe("Please upload a valid logo image.", "error");
                return true;
            }
        }

        if (summarySteps < "9" && summarySteps != "8") {
            setSummarySteps(summarySteps + 1);
        } else if (summarySteps == "8") {
            //payment form
            setPaymentFormSubmit(true);
        } else {
            navigate("/dc-dp/list");
            formReset();
            setIsFormSumbmit(false);
        }
    };

    useEffect(() => {
        if (id && id != "") {
        } else {
            if (summarySteps > "2" && summarySteps < "10") {
                handleSubmitData(submitData);
            }
        }
    }, [submitData]);

    const handleSubmitData = (data) => {
        setIsFormSumbmit(true);
        data.formStepComplete = summarySteps;
        var addEditService = "";
        data.registrationFee = registrationFee;
        if (id && id != "") {
            addEditService = updateDataControllerService(id, data);
        } else if (draftDataId && draftDataId != "") {
            addEditService = updateDataControllerService(draftDataId, data);
        } else {
            data.userId = userData?._id;
            data.payment_status = 1;
            data.formDate = Moment();

            addEditService = addDataControllerService(data);
        }
        dispatch(addEditService)
            .then((res) => {
                if (res.data && res.data?.data && res.data.data?._id) {
                    setDraftDataId(res.data.data?._id);
                    // Update submitData state with new registrationFee
                    const updatedRegistrationFee = res.data.data?.registrationFee || data.registrationFee;
                    setRegistrationFee(updatedRegistrationFee);
                }

                if (summarySteps == "8" && paymentFormSubmit) {
                    paymentGatewayRedirect(res?.data?.data?._id, data.transaction?.account_number, data.transaction?.payment_method_id);
                } else if (summarySteps == "10") {
                    setPaymentFormSubmit(false);
                    formReset();
                    navigate("/dc-dp/list");
                    setIsFormSumbmit(false);
                } else {
                    setPaymentFormSubmit(false);
                    setIsFormSumbmit(false);
                }
            })
            .catch(({ message, errorData, statusCode }) => {
                setPaymentFormSubmit(false);
                validationErrors(errorData, message);
                setIsFormSumbmit(false);
            });
    };

    const paymentGatewayRedirect = (formId, accountNumber, paymentMethodId) => {
        var paymetService = "";
        var data = {
            accountNumber: accountNumber,
            formId: formId,
            formType: "DataController",
        };
        if (paymentMethodId) {
            const paymentGatewayDetail = paymentGatewayOptionList.find((payment) => payment._id === paymentMethodId);
            paymetService = addPaymentMethodService(data);
            // if (paymentGatewayDetail && paymentGatewayDetail.slug === "premier_wallets") {
            //     data = {
            //         accountNumber: "00252" + accountNumber,
            //         formId: formId,
            //         formType: "DataController",
            //     };
            //     paymetService = addPremierPaymentService(data);
            // } else if (paymentGatewayDetail && paymentGatewayDetail.slug === "edahab") {
            //     paymetService = addEdahabPaymentService(data);
            // } else {
            //     paymetService = addWaffiPaymentService(data);
            // }
            setIsLoading(true);
            setIsFormSumbmit(true);
            dispatch(paymetService)
                .then((res) => {
                    if (res?.data && res?.data?.data && res?.data?.data?.data && res?.data?.data?.data?.transactionId && res?.data?.data?.data?.redirect && res?.data?.data?.data?.state == "Pending") {
                        window.location.href = res?.data?.data?.data?.redirect;
                        // setIsLoading(false);
                        // setIsFormSumbmit(false);
                    } else {
                        navigate(`/dc-dp/list`);
                        setIsLoading(false);
                        setIsFormSumbmit(false);
                    }
                })
                .catch(({ message, errorData, statusCode }) => {
                    validationErrors(errorData, message);
                    setSummarySteps(8);
                    setIsLoading(false);
                    setIsFormSumbmit(false);
                });
        } else {
            ToastMe("Payment Gateway is not selected", "error");
        }
    };

    return (
        <MainContentPart>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="summary-sidebar">
                    <CustomCard className="p-6 !border-t-4 !border-t-green">
                        <h3>Summary</h3>
                        <Divider className="xl:my-4 my-4" />
                        <ul className="text-base">
                            {formTabs.length > 0 &&
                                formTabs.map((tab, index) => (
                                    <>
                                        {id && id != "" ? (
                                            <li
                                                key={index}
                                                onClick={() => setSummarySteps(tab?.id)}
                                                className={`border-b border-light-850/20 py-2.5 px-2 [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:border-s-primary hover:text-primary hover:bg-primary/10 border-s-2 border-s-transparent hover:border-s-primary transition-all duration-500 block ${summarySteps && summarySteps === tab?.id ? "active" : ""}`}>
                                                <Link to={"#"} className="">
                                                    {tab?.id}. {tab?.value}
                                                </Link>
                                            </li>
                                        ) : (
                                            <>
                                                {index < summarySteps ? (
                                                    <li
                                                        key={index}
                                                        onClick={() => setSummarySteps(tab?.id)}
                                                        className={`border-b border-light-850/20 py-2.5 px-2 [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:border-s-primary hover:text-primary hover:bg-primary/10 border-s-2 border-s-transparent hover:border-s-primary transition-all duration-500 block ${summarySteps && summarySteps === tab?.id ? "active" : ""}`}>
                                                        <Link to={"#"} className="">
                                                            {tab?.id}. {tab?.value}
                                                        </Link>
                                                    </li>
                                                ) : (
                                                    <li key={index} className={`border-b border-light-850/20 py-2.5 px-2  transition-all duration-500 disabled opacity-50 cursor-not-allowed`}>
                                                        <Link to={"#"} className="pointer-events-none">
                                                            {tab?.id}. {tab?.value}
                                                        </Link>
                                                    </li>
                                                )}
                                            </>
                                        )}
                                    </>
                                ))}
                        </ul>
                    </CustomCard>
                </div>

                <div className="xl:col-span-3">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {(() => {
                            switch (summarySteps) {
                                case 1:
                                    return <FirstStepFormWidget control={control} errors={errors} setValue={setValue} getValues={getValues} />;
                                case 2:
                                    return (
                                        <TwoStepFormWidget
                                            control={control}
                                            errors={errors}
                                            setValue={setValue}
                                            getValues={getValues}
                                            watch={watch}
                                            categoriesOptionList={categoriesOptionList}
                                            sizesOptionList={sizesOptionList}
                                        />
                                    );
                                case 3:
                                    return <ThirdStepFormWidget control={control} errors={errors} setValue={setValue} getValues={getValues} watch={watch} />;
                                case 4:
                                    return <FourStepFormWidget control={control} errors={errors} setValue={setValue} getValues={getValues} />;
                                case 5:
                                    return <FiveStepFormWidget control={control} errors={errors} setValue={setValue} getValues={getValues} />;
                                case 6:
                                    return <SixStepFormWidget control={control} errors={errors} setValue={setValue} getValues={getValues} editId={id} />;
                                case 7:
                                    return (
                                        <SevenStepFormWidget
                                            control={control}
                                            errors={errors}
                                            setValue={setValue}
                                            getValues={getValues}
                                            editId={id}
                                            categoriesOptionList={categoriesOptionList}
                                            sizesOptionList={sizesOptionList}
                                        />
                                    );
                                case 8:
                                    return (
                                        <EightStepFormWidget
                                            control={control}
                                            errors={errors}
                                            setValue={setValue}
                                            getValues={getValues}
                                            paymentGatewayOptionList={paymentGatewayOptionList}
                                            isFormSumbmit={isFormSumbmit}
                                            isLoading={isLoading}
                                        />
                                    );
                                case 9:
                                    return <NineStepFormWidget control={control} errors={errors} setValue={setValue} getValues={getValues} isFormSumbmit={isFormSumbmit} isLoading={isLoading} />;
                                default:
                                    return <></>;
                            }
                        })()}
                    </form>
                </div>
            </div>
        </MainContentPart>
    );
}

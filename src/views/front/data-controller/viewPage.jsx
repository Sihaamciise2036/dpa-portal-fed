import React, { useState, useEffect } from "react";
import CustomCard from "@/components/common/CustomCard";
import Divider from "@/components/ui/divider";
import MainContentPart from "@/layout/front/MainContentPart";
import { useSelector, useDispatch } from "react-redux";
import ToastMe from "@/components/ui/ToastMe";
import Moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import validationErrors from "@/lib/validationErrors";
import { getSectorClassificationService } from "@/services/user/SectorClassificationServices";
import { getActiveSizesService } from "@/services/user/SizeServices";
import { getDataDpoService, getByIdsDataDpoService, getByIdDataControllerService, getStatusByIdDataControllerService, initiateCompliancePaymentService } from "@/services/user/DataControllerServices";
import { getPaymentMethodService, addPaymentMethodService } from "@/services/user/PaymentService";
import { getFileUrl } from "@/services/CommonService";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { useForm, Controller } from "react-hook-form";
import InputRadio from "@/components/ui/inputs/input-radio";
import ErrorMessage from "@/components/common/ErrorMessage";
import { InputIcon } from "@/components/ui/inputs/input-icon";

export default function DataControllerViewPage() {
    const { generalSetting } = useSelector((state) => state?.GeneralSetting);
    const { userData } = useSelector((state) => state?.Auth);
    const [protectionOfficers, setProtectionOfficers] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [sizesOptionList, setSizesOptionList] = useState([]);
    const [sectorOptionList, setSectorOptionList] = useState([]);
    const [formData, setFormData] = useState({});
    const [paymentGatewayOptionList, setPaymentGatewayOptionList] = useState([]);
    const [paymentMethodId, setPaymentMethodId] = useState();
    const [paymentMethodSlug, setPaymentMethodSlug] = useState();
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

    // Option lists (same as before)
    const entityOptionList = [
        { label: "Data Controller", value: 1 },
        { label: "Data Processor", value: 2 },
        { label: "Both", value: 3 },
    ];
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
    const categorySubjectOptionList = [
        { label: "Sensitive Personal Data", value: 1 },
        { label: "Non-Sensitive Personal Data", value: 2 },
    ];
    const riskLevelOptionList = [
        { label: "Low", value: 1 },
        { label: "Medium", value: 2 },
        { label: "High", value: 3 },
    ];
    const statusOptionList = [
        { label: "Pending", value: 1 },
        { label: "Processing", value: 2 },
        { label: "Validating", value: 3 },
        { label: "Active", value: 4 },
        { label: "Rejection", value: 5 },
        { label: "Draft", value: 6 },
    ];

    const paymentStatusOptionList = [
        { value: 1, label: "Unpaid" },
        { value: 2, label: "Paid" },
        { value: 3, label: "Failed" },
        { value: 4, label: "Waiting For Approval" },
    ];
    // Status helpers for badge
    const getStatus = (val) => {
        switch (val) {
            case 1:
                return "Pending";
            case 2:
                return "Processing";
            case 3:
                return "Validating";
            case 4:
                return "Active";
            case 5:
                return "Rejection";
            case 6:
                return "Draft";
            default:
                return "-";
        }
    };
    const getStatusColor = (val) => {
        switch (val) {
            case 1:
                return "bg-yellow-400 text-black";
            case 2:
                return "bg-blue-400 text-white";
            case 3:
                return "bg-purple-400 text-white";
            case 4:
                return "bg-green-500 text-white";
            case 5:
                return "bg-red-500 text-white";
            case 6:
                return "bg-gray-400 text-black";
            default:
                return "bg-gray-300 text-black";
        }
    };

    function getSectorLabelByValue(value) {
        switch (value) {
            // Small Sector
            case "1":
                return "SMEs";
            case "2":
                return "Local NGOs";
            case "3":
                return "Retailers";
            case "4":
                return "Private Schools";
            case "5":
                return "Contractors";

            // Medium Sector
            case "6":
                return "Private Clinics";
            case "7":
                return "MicroFinance Institutions (MFIs)";
            case "8":
                return "Insurance Companies";
            case "9":
                return "Universities";
            case "10":
                return "Government MDAs";
            case "11":
                return "Media Organizations";
            case "12":
                return "Notaries";
            case "13":
                return "Travel Agencies";
            case "14":
                return "Hotels";

            // Large Sector
            case "15":
                return "Commercial Banks";
            case "16":
                return "Telecom Companies";
            case "17":
                return "Mobile Money Operators";
            case "18":
                return "Digital ID Firms";
            case "19":
                return "Hospitals";
            case "20":
                return "INGOs (International NGOs)";
            case "21":
                return "Multinationals";
            case "22":
                return "Airlines";
            case "23":
                return "ECommerce Platforms";
            case "24":
                return "Fintech Apps";
            case "25":
                return "Energy Companies";
            case "26":
                return "Social Media Platforms";

            default:
                return null;
        }
    }

    const getDraftStatusById = () => {
        setIsLoading(true);
        dispatch(getStatusByIdDataControllerService())
            .then((res) => {
                const data = res?.data?.data;
                if (data) {
                    setFormData(data);
                }
                setIsLoading(false);
            })
            .catch(({ message, errorData }) => {
                ToastMe(message || "Error fetching draft status", "error");
                setIsLoading(false);
            });
    };

    const getDataById = (editId) => {
        setIsLoading(true);
        dispatch(getByIdDataControllerService(editId))
            .then((res) => {
                const data = res?.data?.data;
                if (data) {
                    setFormData(data);
                }
                setIsLoading(false);
            })
            .catch(({ message, errorData }) => {
                ToastMe(message || "Error fetching data", "error");
                setIsLoading(false);
                navigate("/dc-dp/list");
            });
    };

    const getPaymentGateways = () => {
        dispatch(getPaymentMethodService())
            .then((res) => {
                setPaymentGatewayOptionList(res?.data?.data);
            })
            .catch(({ message, errorData }) => {
                ToastMe(message || "Error fetching payment gateways", "error");
            });
    };

    const getSizes = () => {
        setIsLoading(true);
        dispatch(getActiveSizesService())
            .then((res) => {
                setSizesOptionList(res?.data?.data);
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
            });
    };

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

    useEffect(() => {
        if (id && id !== "") {
            getDataById(id);
        } else {
            getDraftStatusById();
        }
        getPaymentGateways();
        getSizes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Helper to safely get nested values
    const getValue = (key, fallback = "") => {
        return key.split(".").reduce((o, i) => (o ? o[i] : fallback), formData) || fallback;
    };

    const getId = (value) => {
        if (!value) return "";
        return typeof value === "object" ? value._id || "" : value;
    };

    // Helper for array fields
    const getArray = (key) => {
        const arr = getValue(key, []);
        return Array.isArray(arr) ? arr : [];
    };

    // Helper for object fields
    const getObject = (key) => {
        const obj = getValue(key, {});
        return typeof obj === "object" && obj !== null ? obj : {};
    };

    // Data Protection Officers (if dpoId exists)
    useEffect(() => {
        if (formData.dpoId && Array.isArray(formData.dpoId) && formData.dpoId.length > 0) {
            setIsLoading(true);
            dispatch(getByIdsDataDpoService({ ids: formData.dpoId }))
                .then((res) => {
                    setProtectionOfficers(res?.data?.data || []);
                    setIsLoading(false);
                })
                .catch(() => setIsLoading(false));
        }
    }, [dispatch, formData.dpoId]);

    useEffect(() => {
        const categoryId = getId(formData.organizationType);
        const sizeId = getId(formData.contact?.sectorType);
        if (categoryId && sizeId) {
            getSectorList(categoryId, sizeId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.organizationType, formData.contact?.sectorType]);

    const handleOnChange = (name, value) => {
        if (name == "payment_method_id") {
            const paymentGatewayDetail = paymentGatewayOptionList.find((payment) => payment.gateway_id === parseInt(value));
            console.log("paymentGatewayDetail", paymentGatewayDetail);
            setPaymentMethodId(value);
            setPaymentMethodSlug(paymentGatewayDetail?.slug);
        } else {
        }
    };

    const handleSubmitForm = () => {
        console.log("getValues", getValues("account_number"), getValues("payment_method_id"));

        // This is a compliance fee payment
        initiateCompliancePaymentAndRedirect();
    };

    // Function to initiate compliance fee payment and redirect to payment gateway
    const initiateCompliancePaymentAndRedirect = async () => {
        try {
            setIsLoading(true);
            setIsFormSumbmit(true);

            // Get the payment details
            const accountNumber = getValues("account_number");
            const paymentMethodId = getValues("payment_method_id");

            if (!accountNumber || !paymentMethodId) {
                ToastMe("Please provide both mobile number and payment method", "error");
                setIsLoading(false);
                setIsFormSumbmit(false);
                return;
            }

            // Call backend API to initiate compliance fee payment - this should create transaction if not exists
            const response = await dispatch(initiateCompliancePaymentService(formData._id));
            console.log("initiateCompliancePaymentService response", response);
            if (response && response.data && response.data?.data?.transaction) {
                // Now call the payment gateway with the compliance fee transaction
                const data = {
                    accountNumber: accountNumber,
                    payment_method_id: paymentMethodId,
                    formId: formData?._id, // This is the DataController ID
                    formType: "DataController",
                };

                // Since the transaction already exists, we can call the payment gateway directly
                paymentGatewayRedirect(formData?._id, data.accountNumber, data.payment_method_id, true); // true indicates compliance fee
            } else {
                ToastMe("Failed to initiate compliance fee payment. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error initiating compliance fee payment:", error);
            ToastMe("Error initiating compliance fee payment", "error");
        } finally {
            setIsLoading(false);
            setIsFormSumbmit(false);
        }
    };

    const paymentGatewayRedirect = (formId, accountNumber, paymentMethodId, isComplianceFee = false) => {
        var paymetService = "";
        var data = {
            accountNumber: accountNumber,
            formId: formId,
            formType: "DataController",
            paymentMethodId: paymentMethodId,
            isComplianceFee: isComplianceFee, // Indicate if it's a compliance fee payment
        };
        if (paymentMethodId) {
            console.log("paymentMethodId", paymentMethodId, paymentGatewayOptionList);
            const paymentGatewayDetail = paymentGatewayOptionList.find((payment) => payment.gateway_id === parseInt(paymentMethodId));

            // If it's a compliance fee, we might need a different service or approach
            // For now, using the same service, but the backend will handle it based on the data controller's state
            paymetService = addPaymentMethodService(data);
            console.log("paymentGatewayDetail", paymentGatewayDetail, paymetService);
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
                    setIsLoading(false);
                    setIsFormSumbmit(false);
                });
        } else {
            ToastMe("Payment Gateway is not selected", "error");
        }
    };

    return (
        <MainContentPart>
            <CustomCard className="p-6 !border-t-4 !border-t-green shadow-lg">
                <div className="flex items-center justify-between gap-4 border-b-2 border-green/20 pb-5 mb-6">
                    <h2 className="text-2xl font-bold text-primary">Data Controller Details</h2>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${getStatusColor(formData?.status)}`}>{getStatus(formData?.status)}</span>
                </div>
                <div className="card-body">
                    {/* Two Column Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* DATA CONTROLLER / PROCESSOR Section */}
                        <div className="rounded-xl border-2 border-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
                                <h3 className="text-base font-bold text-blue-900 uppercase tracking-wide">📋 DATA CONTROLLER / PROCESSOR</h3>
                            </div>
                            <div className="card-body p-6 bg-white space-y-4">
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">Tick as appropriate</p>
                                        <p className="text-base text-gray-900 font-medium">{formData?.organizationType?.name || formData?.organizationType || "-"}</p>
                                    </div>
                                    {(formData.organizationType == "68c52ec14d91214ebb5702b0" || formData.organizationType?._id == "68c52ec14d91214ebb5702b0") && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs font-bold text-gray-600 uppercase mb-1">Company Type</p>
                                            <p className="text-base text-gray-900 font-medium">{formData.companyType === "1" ? "Individual" : formData.companyType === "2" ? "Organization" : "-"}</p>
                                        </div>
                                    )}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">Type</p>
                                        <p className="text-base text-gray-900 font-medium">{entityOptionList.find((item) => item.value === formData.entityType)?.label}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">License Number</p>
                                        <p className="text-base text-gray-900 font-medium">{formData.rcNumber}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">Name</p>
                                        <p className="text-base text-gray-900 font-medium">{getValue("contact.name")}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">📧 Official Email Address</p>
                                        <p className="text-base text-blue-600 font-medium">{getValue("contact.email")}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">📞 Official Phone Number</p>
                                        <p className="text-base text-gray-900 font-medium">{"+252" + getValue("contact.number")}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">📍 Official Contact Address</p>
                                        <p className="text-base text-gray-900 font-medium">{getValue("contact.address")}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">State</p>
                                        <p className="text-base text-gray-900 font-medium">{getValue("contact.state")}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">Sector Type</p>
                                        <p className="text-base text-gray-900 font-medium">{sizesOptionList && sizesOptionList.find((data) => data._id == getId(getValue("contact.sectorType")))?.name}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">Sector</p>
                                        <p className="text-base text-gray-900 font-medium">{sectorOptionList && sectorOptionList.find((data) => data.value == getId(getValue("contact.sector")))?.label}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">Personal Bio</p>
                                        <p className="text-base text-gray-900 font-medium">{formData.personalBio}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">Logo File</p>
                                        <img
                                            className="db-image w-[150px] h-[150px] object-contain mt-2 border-2 border-gray-200 rounded-lg p-3 bg-white"
                                            alt="logo"
                                            src={getFileUrl(formData.personalLogo, "controllerData")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Data Processing Details Section */}
                        <div className="rounded-xl border-2 border-purple-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-b-2 border-purple-200">
                                <h3 className="text-base font-bold text-purple-900 uppercase tracking-wide">🔐 Data Processing Details</h3>
                            </div>
                            <div className="card-body p-6 bg-white space-y-4">
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">Kind of Data Subjects</p>
                                        <p className="text-base text-gray-900 font-medium">{numberOfSubjectOptionList.find((item) => item.value == formData.dataSubjects)?.label}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">👥 Number of Employee</p>
                                        <p className="text-base text-gray-900 font-medium">{numberOfEmployeeOptionList.find((item) => item.value == formData.numberOfEmployee)?.label}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-600 uppercase mb-1">💰 Revenue</p>
                                        <p className="text-base text-gray-900 font-medium">{formData.revenue}</p>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                        <p className="text-xs font-bold text-purple-700 uppercase mb-1">CATEGORY OF DATA SUBJECTS</p>
                                        <p className="text-sm text-purple-900 font-medium">
                                            {formData.categorySubject &&
                                                Object.entries(formData.categorySubject)
                                                    .filter(([_, value]) => value)
                                                    .map(([key]) =>
                                                        key
                                                            .replace(/([A-Z])/g, " $1")
                                                            .replace(/^./, (firstChar) => firstChar.toUpperCase())
                                                            .trim()
                                                    )
                                                    .join(", ")}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                        <p className="text-xs font-bold text-purple-700 uppercase mb-1">DESCRIPTION OF PERSONAL DATA</p>
                                        <p className="text-sm text-purple-900 font-medium">
                                            {formData.personalData &&
                                                Object.entries(formData.personalData)
                                                    .filter(([_, value]) => value)
                                                    .map(([key]) =>
                                                        key
                                                            .replace(/([A-Z])/g, " $1")
                                                            .replace(/^./, (firstChar) => firstChar.toUpperCase())
                                                            .trim()
                                                    )
                                                    .join(", ")}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                        <p className="text-xs font-bold text-purple-700 uppercase mb-1">GROUND FOR PROCESSING</p>
                                        <p className="text-sm text-purple-900 font-medium">
                                            {formData.groundData &&
                                                Object.entries(formData.groundData)
                                                    .filter(([_, value]) => value)
                                                    .map(([key]) =>
                                                        key
                                                            .replace(/([A-Z])/g, " $1")
                                                            .replace(/^./, (firstChar) => firstChar.toUpperCase())
                                                            .trim()
                                                    )
                                                    .join(", ")}
                                        </p>
                                    </div>
                                    {formData.entityType && (formData.entityType === "1" || formData.entityType === "3") && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded">
                                            <p className="text-sm font-semibold text-gray-700 mb-3">PROCESSING AUTHORIZATIONS</p>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-gray-300">
                                                            <th className="text-left py-2 px-2">NAME OF THE CONTROLLER</th>
                                                            <th className="text-left py-2 px-2">DPA LICENCE</th>
                                                            <th className="text-left py-2 px-2">COUNTRY</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getArray("dataAuthorizations").map((authorization, index) => (
                                                            <tr key={index} className="border-b border-gray-200">
                                                                <td className="py-2 px-2">{authorization.name}</td>
                                                                <td className="py-2 px-2">{authorization.dpaLicence}</td>
                                                                <td className="py-2 px-2">{authorization.country}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                    {formData.entityType && (formData.entityType === "2" || formData.entityType === "3") && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded">
                                            <p className="text-sm font-semibold text-gray-700 mb-3">DATA PROCESSORS INVOLVEMENT</p>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-gray-300">
                                                            <th className="text-left py-2 px-2">NAME OF THE CONTROLLER</th>
                                                            <th className="text-left py-2 px-2">DPA LICENCE</th>
                                                            <th className="text-left py-2 px-2">COUNTRY</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getArray("dataProcessors").map((processor, index) => (
                                                            <tr key={index} className="border-b border-gray-200">
                                                                <td className="py-2 px-2">{processor.name}</td>
                                                                <td className="py-2 px-2">{processor.dpaLicence}</td>
                                                                <td className="py-2 px-2">{processor.country}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-1">Data Transfer to Other Countries</p>
                                        <p className="text-sm text-gray-900">{formData.dataTransferOutsideCountry ? "Yes" : "No"}</p>
                                    </div>
                                    {formData.dataTransferOutsideCountry === "1" && (
                                        <>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700 mb-1">Country List</p>
                                                <p className="text-sm text-gray-900">
                                                    {formData.dataCountry &&
                                                        Object.entries(formData.dataCountry)
                                                            .map(([key, value]) => value)
                                                            .join(", ")}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700 mb-1">Purpose of Data Processing</p>
                                                <p className="text-sm text-gray-900">{formData.purposeOfDataProcessing}</p>
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-1">Sensitive Personal Data</p>
                                        <p className="text-sm text-gray-900">{formData.sesitivePersonalData === "1" ? "Yes" : "No"}</p>
                                    </div>
                                    {formData.sesitivePersonalData === "1" && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded">
                                            <p className="text-sm font-semibold text-gray-700 mb-3">Sensitive Data</p>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-gray-300">
                                                            <th className="text-left py-2 px-2">Kind of Data Subjects</th>
                                                            <th className="text-left py-2 px-2">Description</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getArray("dataControllers").map((processor, index) => (
                                                            <tr key={index} className="border-b border-gray-200">
                                                                <td className="py-2 px-2">{categorySubjectOptionList.find((item) => item.value === processor.dataSubject)?.label}</td>
                                                                <td className="py-2 px-2">{processor.description}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* DATA PROTECTION OFFICERS Section */}
                    <div className="mb-6">
                        <div className="rounded-xl border-2 border-green-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header p-4 bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
                                <h3 className="text-base font-bold text-green-900 uppercase tracking-wide">👤 Data Protection Officers</h3>
                            </div>
                            <div className="card-body p-6 bg-white">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b-2 border-gray-300">
                                                <th className="text-left py-3 px-3 font-semibold">Organization Name</th>
                                                <th className="text-left py-3 px-3 font-semibold">First Name</th>
                                                <th className="text-left py-3 px-3 font-semibold">Last Name</th>
                                                <th className="text-left py-3 px-3 font-semibold">Official Email</th>
                                                <th className="text-left py-3 px-3 font-semibold">Phone Number</th>
                                                <th className="text-left py-3 px-3 font-semibold">Contact Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {protectionOfficers &&
                                                protectionOfficers.length > 0 &&
                                                protectionOfficers.map((officer, index) => (
                                                    <tr key={index} className="[&_td]:text-start [&_td]:min-w-[120px] [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                                        <td>{officer.organisationName}</td>
                                                        <td>{officer.firstName}</td>
                                                        <td>{officer.lastName}</td>
                                                        <td>{officer.email}</td>
                                                        <td>{officer.contactNumber}</td>
                                                        <td>{officer.address}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Divider className="my-8 border-gray-200" />
                    <div style={{ pageBreakAfter: "always" }}></div>
                    {/* Data Controller / Processor Representatives Section */}
                    <div className="mb-8">
                        <div className="mb-6 rounded-xl border-2 border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b-2 border-indigo-200">
                                <h3 className="text-lg font-bold text-indigo-900 tracking-wide">👥 Data Controller / Processor Representatives</h3>
                            </div>
                            <div className="card-body p-4">
                                <div className="table-responsive overflow-x-auto">
                                    <table className="w-full text-start">
                                        <thead>
                                            <tr className="text-sm [&_th]:text-start [&_th]:min-w-[120px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20">
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Official Email Address</th>
                                                <th>Official Phone Number</th>
                                                <th>Official Contact Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getArray("dataRepresentatives").length > 0 &&
                                                getArray("dataRepresentatives").map((processor, index) => (
                                                    <tr key={index} className="[&_td]:text-start [&_td]:min-w-[120px] [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                                        <td>{processor.firstName}</td>
                                                        <td>{processor.lastName}</td>
                                                        <td>{processor.email}</td>
                                                        <td>{"+252" + processor.phoneNo}</td>
                                                        <td>{processor.address}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Divider className="my-8 border-gray-200" />
                    <div style={{ pageBreakAfter: "always" }}></div>
                    {/* Safety Precautions and Form Information - Side by Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Safety Precautions Section */}
                        <div className="rounded-xl border-2 border-orange-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b-2 border-orange-200">
                                <h3 className="text-lg font-bold text-orange-900 tracking-wide">🛡️ Safety Precautions</h3>
                            </div>
                            <div className="card-body p-4">
                                <div className="table-responsive overflow-x-auto">
                                    <table className="w-full text-start">
                                        <tbody className="text-sm [&_th]:text-start [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                            <tr>
                                                <th>Risk Level of Data Processing</th>
                                                <td>{riskLevelOptionList.find((item) => item.value === formData.riskLevel)?.label}</td>
                                            </tr>
                                            <tr>
                                                <th>PLEASE SELECT THE TYPE OF CATEGORIES OF SENSITIVE PERSONAL DATA</th>
                                                <td>
                                                    {formData.categoriesSensitive &&
                                                        Object.entries(formData.categoriesSensitive)
                                                            .filter(([_, value]) => value)
                                                            .map(([key]) =>
                                                                key
                                                                    .replace(/([A-Z])/g, " $1")
                                                                    .replace(/^./, (firstChar) => firstChar.toUpperCase())
                                                                    .trim()
                                                            )
                                                            .join(", ")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Technical Measures</th>
                                                <td>
                                                    {formData.technicalMeasures &&
                                                        Object.entries(formData.technicalMeasures)
                                                            .filter(([_, value]) => value)
                                                            .map(([key]) =>
                                                                key
                                                                    .replace(/([A-Z])/g, " $1")
                                                                    .replace(/^./, (firstChar) => firstChar.toUpperCase())
                                                                    .trim()
                                                            )
                                                            .join(", ")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Organizational Measures</th>
                                                <td>
                                                    {formData.organizationalMeasures &&
                                                        Object.entries(formData.organizationalMeasures)
                                                            .filter(([_, value]) => value)
                                                            .map(([key]) =>
                                                                key
                                                                    .replace(/([A-Z])/g, " $1")
                                                                    .replace(/^./, (firstChar) => firstChar.toUpperCase())
                                                                    .trim()
                                                            )
                                                            .join(", ")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Employee Involved</th>
                                                <td>{formData.employeeInvolved}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        {/* Form Information Section */}
                        <div className="rounded-xl border-2 border-teal-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header p-4 bg-gradient-to-r from-teal-50 to-teal-100 border-b-2 border-teal-200">
                                <h3 className="text-lg font-bold text-teal-900 tracking-wide">📄 Form Information</h3>
                            </div>
                            <div className="card-body p-4">
                                <div className="table-responsive overflow-x-auto">
                                    <table className="w-full text-start">
                                        <tbody className="text-sm [&_th]:text-start [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                            {id && id !== "" && (
                                                <>
                                                    <tr>
                                                        <th>Status</th>
                                                        <td>{statusOptionList.find((item) => item.value === formData.status)?.label}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Payment Status</th>
                                                        <td>{paymentStatusOptionList.find((item) => item.value === formData.payment_status)?.label}</td>
                                                    </tr>
                                                </>
                                            )}
                                            {formData.status === "5" && (
                                                <tr>
                                                    <th>Reject Reason</th>
                                                    <td>{formData.rejectReason}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Divider className="my-8 border-gray-200" />
                    <div style={{ pageBreakAfter: "always" }}></div>
                    {/* Compliance Section */}
                    {formData?.status === 4 && formData?.payment_status === 2 ? (
                        <div className="mb-8">
                            <div className="mb-6 rounded-xl border-2 border-emerald-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="card-header p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-b-2 border-emerald-200">
                                    <h3 className="text-lg font-bold text-emerald-900 tracking-wide">💳 Compliance Information</h3>
                                </div>
                                <div className="card-body p-4">
                                    <div className="table-responsive overflow-x-auto mb-6">
                                        <table className="w-full text-start">
                                            <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                                {formData.complianceFee && formData.complianceFee !== "" && (
                                                    <tr>
                                                        <th>Compliance Fee</th>
                                                        <td>{"$" + formData.complianceFee}</td>
                                                    </tr>
                                                )}
                                                {formData.complianceFee && formData.complianceFee !== "" && (
                                                    <tr>
                                                        <th>Compliance Fee Payment Status</th>
                                                        <td>
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs ${
                                                                    formData.compliance_payment_status === 1
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : formData.compliance_payment_status === 2
                                                                          ? "bg-green-100 text-green-800"
                                                                          : formData.compliance_payment_status === 3
                                                                            ? "bg-red-100 text-red-800"
                                                                            : "bg-gray-100 text-gray-800"
                                                                }`}>
                                                                {formData.compliancePaymentStatusName}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )}
                                                {formData.complianceFee && formData.complianceFee !== "" && formData.compliance_payment_status === 1 && formData.status === 4 && (
                                                    <tr>
                                                        <th>Pay Compliance Fee</th>
                                                        <td>
                                                            <div className="text-green-600 font-medium mb-4">Please complete the payment form below to pay your compliance fee.</div>
                                                        </td>
                                                    </tr>
                                                )}
                                                {formData.status === "5" && (
                                                    <tr>
                                                        <th>Reject Reason</th>
                                                        <td>{formData.rejectReason}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mb-6">
                                        <div className="flex max-md:flex-col md:items-center gap-4 md:gap-6 lg:gap-10">
                                            {paymentGatewayOptionList &&
                                                paymentGatewayOptionList?.length > 0 &&
                                                paymentGatewayOptionList.map((paymentGateway, index) => {
                                                    return (
                                                        <Controller
                                                            control={control}
                                                            rules={{ required: true }}
                                                            name="payment_method_id"
                                                            render={({ field }) => (
                                                                <div className="flex gap-4">
                                                                    <InputRadio
                                                                        {...field}
                                                                        id={index}
                                                                        value={paymentGateway?.gateway_id}
                                                                        checked={field.value == paymentGateway?.gateway_id}
                                                                        size="sm"
                                                                        labelText={paymentGateway?.name}
                                                                        onChange={(e) => {
                                                                            field.onChange(e.target.value);
                                                                            handleOnChange("payment_method_id", e.target.value);
                                                                        }}
                                                                        errorType={errors?.["payment_method_id"]?.type}
                                                                    />
                                                                </div>
                                                            )}
                                                        />
                                                    );
                                                })}
                                        </div>
                                        {errors?.["payment_method_id"] && <ErrorMessage errorType={errors?.["payment_method_id"]?.type} />}
                                    </div>
                                    <Controller
                                        control={control}
                                        rules={{ required: true, minLength: 9, maxLength: 9, pattern: /^[0-9]+$/ }}
                                        name="account_number"
                                        render={({ field }) => (
                                            <InputIcon
                                                {...field}
                                                placeholder="Enter Mobile Number"
                                                labelText={"Mobile Number"}
                                                id="account_number"
                                                groupClassName="mb-6"
                                                prefixWrap={"+252"}
                                                errorData={{ minLength: "9", maxLength: "9", pattern: "number" }}
                                                errorType={errors?.["account_number"]?.type}
                                            />
                                        )}
                                    />
                                    <div className="">
                                        <PrimaryButton type="button" onClick={() => handleSubmitForm()} isLoading={isFormSumbmit} disabled={isFormSumbmit}>
                                            Pay Now
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <PrimaryButton type="button" onClick={() => navigate("/dc-dp/list")} className="w-full py-4 text-lg font-bold mt-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    ← Back to List
                </PrimaryButton>
            </CustomCard>
        </MainContentPart>
    );
}

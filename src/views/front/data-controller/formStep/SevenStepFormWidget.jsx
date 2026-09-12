import React, { useState, useRef, useEffect } from "react";
import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { SecondaryButton } from "@/components/ui/buttons/secondary-button";
import Divider from "@/components/ui/divider";
import { InputSelect } from "@/components/ui/inputs/input-select";
import { Input } from "@/components/ui/inputs/input";
import { InputTextarea } from "@/components/ui/inputs/input-textarea";
import InputRadio from "@/components/ui/inputs/input-radio";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import ErrorMessage from "@/components/common/ErrorMessage";
import { Label } from "@/components/ui/inputs/label";
import { useSelector, useDispatch } from "react-redux";
import { fileUpload, getFileUrl } from "@/services/CommonService";
import { getDataDpoService, getByIdsDataDpoService } from "@/services/user/DataControllerServices";
import { getSectorClassificationService } from "@/services/user/SectorClassificationServices";
import validationErrors from "@/lib/validationErrors";
import Moment from "moment";
import html2pdf from "html2pdf.js";
import "./print.css";

export default function SevenStepFormWidget({ control, errors, getValues, setValue, editId = "", categoriesOptionList, sizesOptionList, ...props }) {
    const dispatch = useDispatch();
    const targetRef = useRef(null);
    const [protectionOfficers, setProtectionOfficers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPdf, setIsPdf] = useState(false);
    const [sectorOptionList, setSectorOptionList] = useState([]);
    const [fileName, setFileName] = useState(`dp_dc_form_${Moment().unix()}.pdf`);

    useEffect(() => {
        if (getValues("dpoId") && getValues("dpoId").length > 0) {
            getDataByIds(getValues("dpoId"));
        }
    }, []);

    const handleDownload = async () => {
        await setIsPdf(true);
        const element = targetRef.current;

        const opt = {
            margin: 0.5,
            filename: fileName,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        await html2pdf().set(opt).from(element).save();
        await setIsPdf(false);
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
        {
            label: "Sensitive Personal Data",
            value: "1",
        },
        {
            label: "Non-Sensitive Personal Data",
            value: "2",
        },
    ];
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

    useEffect(() => {
        if (getValues("organizationType") && getValues("contact.sectorType")) {
            getSectorList(getValues("organizationType"), getValues("contact.sectorType"));
        }
    }, [getValues("organizationType"), getValues("contact.sectorType")]);

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
                });

                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
            });
    };

    return (
        <CustomCard className="p-6 !border-t-4 !border-t-green">
            <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-primary">Verify Information</h2>
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
                <div ref={targetRef} id="pdf-container">
                    {/* Warning Note */}
                    <p className="text-red-600 mb-6 font-medium bg-red-50 p-4 rounded-lg border border-red-200">
                        Note: Please cross-check your information below before submitting to Somali Data Protection Authority.
                    </p>

                    {/* DATA CONTROLLER / PROCESSOR Section */}
                    <div className="mb-8">
                        <div className="mb-6 rounded-lg border border-light-850/20">
                            <div className="card-header p-4 border-b border-light-850/20">
                                <h3 className="text-lg font-semibold text-dark-950">DATA CONTROLLER / PROCESSOR</h3>
                            </div>
                            <div className="card-body p-4">
                                <div className="table-responsive overflow-x-auto">
                                    <table className="w-full text-start">
                                        <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                            <tr>
                                                <th>Tick as appropriate</th>
                                                <td>{categoriesOptionList && categoriesOptionList.find((data) => data._id == getValues("organizationType"))?.name}</td>
                                            </tr>
                                            {getValues("organizationType") && getValues("organizationType") == "68c52ec14d91214ebb5702b0" ? (
                                                <tr>
                                                    <th></th>
                                                    <td>
                                                        {getValues("companyType") && getValues("companyType") == "1"
                                                            ? "Individual"
                                                            : getValues("companyType") && getValues("companyType") == "2"
                                                              ? "Organization"
                                                              : ""}
                                                    </td>
                                                </tr>
                                            ) : (
                                                <></>
                                            )}
                                            <tr>
                                                <th>Type</th>
                                                <td>{entityOptionList && entityOptionList.find((item) => item.value == getValues("entityType"))?.label}</td>
                                            </tr>
                                            <tr>
                                                <th>License Number</th>
                                                <td>{getValues("rcNumber")}</td>
                                            </tr>
                                            <tr>
                                                <th>Name</th>
                                                <td>{getValues("contact.name")}</td>
                                            </tr>
                                            <tr>
                                                <th>Official Email Address</th>
                                                <td>{getValues("contact.email")}</td>
                                            </tr>
                                            <tr>
                                                <th>Official Phone Number</th>
                                                <td>{"+252" + getValues("contact.number")}</td>
                                            </tr>
                                            <tr>
                                                <th>Official Contact Address</th>
                                                <td>{getValues("contact.address")}</td>
                                            </tr>
                                            <tr>
                                                <th>State</th>
                                                <td>{getValues("contact.state")}</td>
                                            </tr>
                                            <tr>
                                                <th>Sector Type</th>
                                                <td>{sizesOptionList && sizesOptionList.find((data) => data._id == getValues("contact.sectorType"))?.name}</td>
                                            </tr>
                                            <tr>
                                                <th>Sector</th>
                                                <td>{sectorOptionList && sectorOptionList.find((data) => data.value == getValues("contact.sector"))?.label}</td>
                                            </tr>
                                            <tr>
                                                <th>Personal Bio</th>
                                                <td>{getValues("personalBio")}</td>
                                            </tr>
                                            <tr>
                                                <th>Logo File</th>
                                                <td>
                                                    <img className="db-image w-[50px]" alt="slider" src={getFileUrl(getValues("personalLogo"), "controllerData")} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Divider className="my-8 border-gray-200" />
                    <div style={{ pageBreakAfter: "always" }}></div>

                    {/* Data Processing Details Section */}
                    <div className="mb-8">
                        <div className="mb-6 rounded-lg border border-light-850/20">
                            <div className="card-header p-4 border-b border-light-850/20">
                                <h3 className="text-lg font-semibold text-dark-950">Data Processing Details</h3>
                            </div>
                            <div className="card-body p-4">
                                <div className="table-responsive overflow-x-auto">
                                    <table className="w-full text-start">
                                        <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                            <tr>
                                                <th>Kind of Data Subjects</th>
                                                <td>{numberOfSubjectOptionList && numberOfSubjectOptionList.find((item) => item.value == getValues("dataSubjects"))?.label}</td>
                                            </tr>
                                            <tr>
                                                <th>Number of Employee</th>
                                                <td>{numberOfEmployeeOptionList && numberOfEmployeeOptionList.find((item) => item.value == getValues("numberOfEmployee"))?.label}</td>
                                            </tr>
                                            <tr>
                                                <th>Revenue</th>
                                                <td>{getValues("revenue")}</td>
                                            </tr>
                                            <tr>
                                                <th>CATEGORY OF DATA SUBJECTS</th>
                                                <td>
                                                    {getValues("categorySubject") &&
                                                        Object.entries(getValues("categorySubject"))
                                                            .filter(([_, value]) => value) // Optional: Only include truthy values
                                                            .map(([key, _]) =>
                                                                key
                                                                    .replace(/([A-Z])/g, " $1") // Add space before capitals
                                                                    .replace(/^./, (firstChar) => firstChar.toUpperCase()) // Capitalize first letter
                                                                    .trim()
                                                            )
                                                            .join(", ")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>DESCRIPTION OF PERSONAL DATA</th>
                                                <td>
                                                    {getValues("personalData") &&
                                                        Object.entries(getValues("personalData"))
                                                            .filter(([_, value]) => value) // Optional: Only include truthy values
                                                            .map(([key, _]) =>
                                                                key
                                                                    .replace(/([A-Z])/g, " $1") // Add space before capitals
                                                                    .replace(/^./, (firstChar) => firstChar.toUpperCase()) // Capitalize first letter
                                                                    .trim()
                                                            )
                                                            .join(", ")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>GROUND FOR PROCESSING</th>
                                                <td>
                                                    {getValues("groundData") &&
                                                        Object.entries(getValues("groundData"))
                                                            .filter(([_, value]) => value) // Optional: Only include truthy values
                                                            .map(([key, _]) =>
                                                                key
                                                                    .replace(/([A-Z])/g, " $1") // Add space before capitals
                                                                    .replace(/^./, (firstChar) => firstChar.toUpperCase()) // Capitalize first letter
                                                                    .trim()
                                                            )
                                                            .join(", ")}
                                                </td>
                                            </tr>
                                            {getValues("entityType") && (getValues("entityType") == "1" || getValues("entityType") == "3") && (
                                                <tr>
                                                    <td colSpan="2">
                                                        <div className="mb-2 font-medium text-center card-body p-2">
                                                            <Label labelClassName="font-medium mb-2" labelText="PROCESSING AUTHORIZATIONS" />
                                                            <table className="w-full text-start">
                                                                <thead>
                                                                    <tr className="text-sm [&_th]:text-start [&_th]:min-w-[120px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20">
                                                                        <th>NAME OF THE CONTROLLER</th>
                                                                        <th>DPA LICENCE OF CONTROLLER</th>
                                                                        <th>COUNTRY</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {getValues("dataAuthorizations").map((authorization, index) => (
                                                                        <tr
                                                                            className="[&_td]:text-start [&_td]:min-w-[120px] [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20"
                                                                            key={index}>
                                                                            <td>{authorization.name}</td>
                                                                            <td>{authorization.dpaLicence}</td>
                                                                            <td>{authorization.country}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            {getValues("entityType") && (getValues("entityType") == "2" || getValues("entityType") == "3") && (
                                                <tr>
                                                    <td colSpan="2">
                                                        <div className="mb-2 font-medium text-center card-body p-2">
                                                            <Label labelClassName="font-medium mb-2" labelText="DATA PROCESSORS INVOLVEMENT" />
                                                            <table className="w-full text-start">
                                                                <thead>
                                                                    <tr className="text-sm [&_th]:text-start [&_th]:min-w-[120px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20">
                                                                        <th>NAME OF THE CONTROLLER</th>
                                                                        <th>DPA LICENCE OF CONTROLLER</th>
                                                                        <th>COUNTRY</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {getValues("dataProcessors").map((processor, index) => (
                                                                        <tr
                                                                            className="[&_td]:text-start [&_td]:min-w-[120px] [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20"
                                                                            key={index}>
                                                                            <td>{processor.name}</td>
                                                                            <td>{processor.dpaLicence}</td>
                                                                            <td>{processor.country}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            <tr>
                                                <th>Data Transfer to Other Countries</th>
                                                <td>{getValues("dataTransferOutsideCountry") ? "Yes" : "No"}</td>
                                            </tr>
                                            {getValues("dataTransferOutsideCountry") == "1" && (
                                                <>
                                                    <tr>
                                                        <th>Country List</th>
                                                        <td>
                                                            {getValues("dataCountry") &&
                                                                Object.entries(getValues("dataCountry"))
                                                                    .map(([key, value]) => value)
                                                                    .join(", ")}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Purpose of Data Processing</th>
                                                        <td>{getValues("purposeOfDataProcessing")}</td>
                                                    </tr>
                                                </>
                                            )}
                                            <tr>
                                                <th>Sensitive Personal Data</th>
                                                <td>{getValues("sesitivePersonalData") == "1" ? "Yes" : "No"}</td>
                                            </tr>
                                            {getValues("sesitivePersonalData") == "1" && (
                                                <tr>
                                                    <td colSpan="2">
                                                        <div className="mb-2 font-medium text-center card-body p-2">
                                                            <Label labelClassName="font-medium mb-2" labelText="Sesitive Data" />
                                                            <table className="w-full text-start">
                                                                <thead>
                                                                    <tr className="text-sm [&_th]:text-start [&_th]:min-w-[120px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20">
                                                                        <th>Kind of Data Subjects</th>
                                                                        <th>Description</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {getValues("dataControllers").length > 0 &&
                                                                        getValues("dataControllers").map((processor, index) => (
                                                                            <tr
                                                                                className="[&_td]:text-start [&_td]:min-w-[120px] [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20"
                                                                                key={index}>
                                                                                <td>{categorySubjectOptionList.find((item) => item.value == processor.dataSubject)?.label}</td>
                                                                                <td>{processor.description}</td>
                                                                            </tr>
                                                                        ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
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

                    {/* DATA PROTECTION OFFICERS Section */}
                    <div className="mb-8">
                        <div className="mb-6 rounded-lg border border-light-850/20">
                            <div className="card-header p-4 border-b border-light-850/20">
                                <h3 className="text-lg font-semibold text-dark-950">Data Protection Officers</h3>
                            </div>
                            <div className="card-body p-4">
                                <div className="table-responsive overflow-x-auto">
                                    <table className="w-full text-start">
                                        <thead>
                                            <tr className="text-sm [&_th]:text-start [&_th]:min-w-[120px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20">
                                                <th>Organization Name</th>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Official Email Address</th>
                                                <th>Official Phone Number</th>
                                                <th>Official Contact Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {protectionOfficers &&
                                                protectionOfficers.length > 0 &&
                                                protectionOfficers.map((officer, index) => (
                                                    <tr className="[&_td]:text-start [&_td]:min-w-[120px] [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20" key={index}>
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
                        <div className="mb-6 rounded-lg border border-light-850/20">
                            <div className="card-header p-4 border-b border-light-850/20">
                                <h3 className="text-lg font-semibold text-dark-950">Data Controller / Processor Representatives</h3>
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
                                            {getValues("dataRepresentatives").length > 0 &&
                                                getValues("dataRepresentatives").map((processor, index) => (
                                                    <tr className="[&_td]:text-start [&_td]:min-w-[120px] [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20" key={index}>
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

                    {/* Safety Precautions Section */}
                    <div className="mb-8">
                        <div className="mb-6 rounded-lg border border-light-850/20">
                            <div className="card-header p-4 border-b border-light-850/20">
                                <h3 className="text-lg font-semibold text-dark-950">Safety Precautions</h3>
                            </div>
                            <div className="card-body p-4">
                                <div className="table-responsive overflow-x-auto">
                                    <table className="w-full text-start">
                                        <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                            <tr>
                                                <th>Risk Level of Data Processing</th>
                                                <td>{riskLevelOptionList.find((item) => item.value == getValues("riskLevel"))?.label}</td>
                                            </tr>
                                            <tr>
                                                <th>PLEASE SELECT THE TYPE OF CATEGORIES OF SENSITIVE PERSONAL DATA</th>
                                                <td>
                                                    {getValues("categoriesSensitive") &&
                                                        Object.entries(getValues("categoriesSensitive"))
                                                            .filter(([_, value]) => value) // Optional: Only include truthy values
                                                            .map(([key, _]) =>
                                                                key
                                                                    .replace(/([A-Z])/g, " $1") // Add space before capitals
                                                                    .replace(/^./, (firstChar) => firstChar.toUpperCase()) // Capitalize first letter
                                                                    .trim()
                                                            )
                                                            .join(", ")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Technical Measures</th>
                                                <td>
                                                    {getValues("technicalMeasures") &&
                                                        Object.entries(getValues("technicalMeasures"))
                                                            .filter(([_, value]) => value) // Optional: Only include truthy values
                                                            .map(([key, _]) =>
                                                                key
                                                                    .replace(/([A-Z])/g, " $1") // Add space before capitals
                                                                    .replace(/^./, (firstChar) => firstChar.toUpperCase()) // Capitalize first letter
                                                                    .trim()
                                                            )
                                                            .join(", ")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Organizational Measures</th>
                                                <td>
                                                    {getValues("organizationalMeasures") &&
                                                        Object.entries(getValues("organizationalMeasures"))
                                                            .filter(([_, value]) => value) // Optional: Only include truthy values
                                                            .map(([key, _]) =>
                                                                key
                                                                    .replace(/([A-Z])/g, " $1") // Add space before capitals
                                                                    .replace(/^./, (firstChar) => firstChar.toUpperCase()) // Capitalize first letter
                                                                    .trim()
                                                            )
                                                            .join(", ")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Employee Involved</th>
                                                <td>{getValues("employeeInvolved")}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {editId && editId != "" && (
                        <>
                            <Divider className="my-8 border-gray-200" />
                            <div style={{ pageBreakAfter: "always" }}></div>

                            {/* Form Information Section */}
                            <div className="mb-8">
                                <div className="mb-6 rounded-lg border border-light-850/20">
                                    <div className="card-header p-4 border-b border-light-850/20">
                                        <h3 className="text-lg font-semibold text-dark-950">Form Information</h3>
                                    </div>
                                    <div className="card-body p-4">
                                        <div className="table-responsive overflow-x-auto">
                                            <table className="w-full text-start">
                                                <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                                    <tr>
                                                        <th>Status</th>
                                                        <td>{statusOptionList.find((item) => item.value == getValues("status"))?.label}</td>
                                                    </tr>
                                                    {getValues("status") && getValues("status") == "5" && (
                                                        <tr>
                                                            <th>Reject Reason</th>
                                                            <td>{getValues("rejectReason")}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <Divider className="my-8 border-gray-200" />
                </div>
                {/* Submit Button */}
                <div className="flex justify-end">
                    <PrimaryButton type="submit">Save and Continue</PrimaryButton>
                </div>
            </div>
        </CustomCard>
    );
}

import React, { useState, useEffect } from "react";
import MainContentPart from "@/layout/front/MainContentPart";
import CustomCard from "@/components/common/CustomCard";
import Divider from "@/components/ui/divider";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { useDispatch } from "react-redux";
import ToastMe from "@/components/ui/ToastMe";
import Moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import { getFileUrl } from "@/services/CommonService";
import { getByIdDataComplaintService } from "@/services/user/DataComplaintServices";

export default function ComplaintHandleViewPage(props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [viewData, setViewData] = useState(null);

    useEffect(() => {
        if (id && id !== "") {
            getDataById(id);
        }
    }, [id]);

    const getDataById = (id) => {
        setIsLoading(true);
        dispatch(getByIdDataComplaintService(id))
            .then((res) => {
                setViewData(res?.data?.data);
                setIsLoading(false);
            })
            .catch(({ message }) => {
                ToastMe(message || "Error fetching data", "error");
                setIsLoading(false);
                setViewData(null);
            });
    };

    // Helper functions for formatting
    const getOrgType = (val) => {
        switch (val) {
            case 1:
                return "Public";
            case 2:
                return "Private";
            case 3:
                return "NGO";
            case 4:
                return "Other";
            case 5:
                return "Person";
            default:
                return "-";
        }
    };
    const getYesNo = (val) => {
        if (val == "1") return "Yes";
        if (val == "0") return "No";
        return "-";
    };
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
            default:
                return "bg-gray-300 text-black";
        }
    };

    if (isLoading) {
        return (
            <MainContentPart>
                <CustomCard className="p-6 !border-t-4 !border-t-green">
                    <div className="flex flex-col items-center justify-center py-10">
                        <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <div className="text-center text-lg">Loading...</div>
                    </div>
                </CustomCard>
            </MainContentPart>
        );
    }

    if (!viewData) {
        return (
            <MainContentPart>
                <CustomCard className="p-6 !border-t-4 !border-t-green">
                    <div className="text-center py-10 text-lg text-gray-500">No data found for this record.</div>
                    <PrimaryButton type="button" onClick={() => navigate("/complaint-handle/list")} className="w-full py-4 text-2xl mt-6">
                        Back
                    </PrimaryButton>
                </CustomCard>
            </MainContentPart>
        );
    }

    // Complaint Details Checkboxes
    const complaintCheckboxes = [
        { key: "unauthorizedDisclosure", label: "Unauthorized disclosure of your personal data unsolicited direct marketing" },
        { key: "inaccurateData", label: "An organisation/individual holds personal data which is inaccurate" },
        { key: "failedSubjectAccess", label: "An organisation/individual has failed to respond to a Subject Access Request" },
        { key: "lackOfTransparency", label: "An organisation/individual is not transparent about how they process your personal data" },
        { key: "deniedDataPortability", label: "An organisation/individual has not applied your right to data portability" },
        { key: "thirdPartyTransfer", label: "An organisation/individual has transferred personal data to third party" },
    ];

    return (
        <MainContentPart>
            <CustomCard className="p-6 !border-t-4 !border-t-green">
                <div className="flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                    <h2 className="text-xl font-semibold text-primary">Complaint Details</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(viewData?.status)}`}>{getStatus(viewData?.status)}</span>
                </div>
                {/* Section: Personal Information */}
                <div className="mb-8">
                    <div className="mb-6 rounded-lg border border-light-850/20">
                        <div className="card-header p-4 border-b border-light-850/20">
                            <h3 className="text-lg font-semibold text-dark-950">Personal Information</h3>
                        </div>
                        <div className="card-body p-4">
                            <table className="w-full text-start">
                                <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                    <tr>
                                        <th>Are you making complaint as</th>
                                        <td>{getOrgType(viewData?.organizationType)}</td>
                                    </tr>
                                    {viewData?.organizationType === "2" && (
                                        <tr>
                                            <th>Company Type</th>
                                            <td>{viewData?.companyType === "1" ? "Individual" : viewData?.companyType === "2" ? "Organization" : "-"}</td>
                                        </tr>
                                    )}
                                    {viewData?.organizationType === "4" && (
                                        <tr>
                                            <th>Please specify</th>
                                            <td>{viewData?.organizationSpecify || "-"}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Divider className="my-8 border-gray-200" />
                {/* Section: Complainant/Representative */}
                {viewData?.organizationType === "5" ? (
                    <div className="mb-8">
                        <div className="mb-6 rounded-lg border border-light-850/20">
                            <div className="card-header p-4 border-b border-light-850/20">
                                <h3 className="text-lg font-semibold text-dark-950">A. PARTICULARS OF THE COMPLAINANT/REPRESENTATIVE</h3>
                            </div>
                            <div className="card-body p-4">
                                <table className="w-full text-start">
                                    <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                        <tr>
                                            <th>Name</th>
                                            <td>{viewData?.complainantDetails?.name || "-"}</td>
                                        </tr>
                                        <tr>
                                            <th>Email</th>
                                            <td>{viewData?.complainantDetails?.email || "-"}</td>
                                        </tr>
                                        <tr>
                                            <th>Phone number</th>
                                            <td>{viewData?.complainantDetails?.contactNumber || "-"}</td>
                                        </tr>
                                        <tr>
                                            <th>National ID / Passport Number</th>
                                            <td>{viewData?.legalRepresentative?.licenceNumber || "-"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Divider className="my-8 border-gray-200" />
                        <div className="mb-6 rounded-lg border border-light-850/20">
                            <div className="card-header p-4 border-b border-light-850/20">
                                <h3 className="text-lg font-semibold text-dark-950">B. PARTICULARS OF THE RESPONDENT</h3>
                            </div>
                            <div className="card-body p-4">
                                <table className="w-full text-start">
                                    <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                        <tr>
                                            <th>Name(s) of the respondent</th>
                                            <td>{viewData?.declaration?.fullName || "-"}</td>
                                        </tr>
                                        <tr>
                                            <th>Contact details of the respondent</th>
                                            <td>{viewData?.declaration?.title || "-"}</td>
                                        </tr>
                                        <tr>
                                            <th>Date of occurrence of the alleged infringement</th>
                                            <td>{viewData?.declaration?.date ? Moment(viewData?.declaration?.date).format("YYYY-MM-DD") : "-"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Divider className="my-8 border-gray-200" />
                        <div className="mb-6 rounded-lg border border-light-850/20">
                            <div className="card-header p-4 border-b border-light-850/20">
                                <h3 className="text-lg font-semibold text-dark-950">C. PARTICULARS OF THE COMPLAINT</h3>
                            </div>
                            <div className="card-body p-4">
                                <table className="w-full text-start">
                                    <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                        <tr>
                                            <th>Describe your complaint</th>
                                            <td>{viewData?.complaint?.description || "-"}</td>
                                        </tr>
                                        <tr>
                                            <th>Persons for further information</th>
                                            <td>{viewData?.complaint?.personName || "-"}</td>
                                        </tr>
                                        <tr>
                                            <th>Actual or potential harm or urgency</th>
                                            <td>{viewData?.complaint?.note || "-"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Divider className="my-8 border-gray-200" />
                        <div className="mb-6 rounded-lg border border-light-850/20">
                            <div className="card-header p-4 border-b border-light-850/20">
                                <h3 className="text-lg font-semibold text-dark-950">D. REMEDY SOUGHT</h3>
                            </div>
                            <div className="card-body p-4">
                                <table className="w-full text-start">
                                    <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                        <tr>
                                            <th>Redress/relief anticipated</th>
                                            <td>{viewData?.complaint?.anticipating || "-"}</td>
                                        </tr>
                                        <tr>
                                            <th>Steps already taken</th>
                                            <td>{viewData?.complaint?.stepAlredyTaken || "-"}</td>
                                        </tr>
                                        <tr>
                                            <th>Previous attempts to resolve</th>
                                            <td>{viewData?.complaint?.previouslyAttempts || "-"}</td>
                                        </tr>
                                        <tr>
                                            <th>Do you wish to remain anonymous if contacted?</th>
                                            <td>{getYesNo(viewData?.attemptedContact)}</td>
                                        </tr>
                                        <tr>
                                            <th>If so, please explain why?</th>
                                            <td>{viewData?.correspondenceEvidence || "-"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Divider className="my-8 border-gray-200" />
                        <div className="mb-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div>
                                <span className="font-semibold">Supporting Document</span>
                                {viewData?.declaration?.signature ? (
                                    <div className="db-image-wrap w-[160px]">
                                        <img className="db-image" alt="supporting document" src={getFileUrl(viewData?.declaration?.signature, "complaintHandleData")} />
                                    </div>
                                ) : (
                                    <div>-</div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Data Subject Section */}
                        <div className="mb-8">
                            <div className="mb-6 rounded-lg border border-light-850/20">
                                <div className="card-header p-4 border-b border-light-850/20">
                                    <h3 className="text-lg font-semibold text-dark-950">A. Data Subject</h3>
                                </div>
                                <div className="card-body p-4">
                                    <table className="w-full text-start">
                                        <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                            <tr>
                                                <th>Name</th>
                                                <td>{viewData?.complainantDetails?.name || "-"}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td>{viewData?.complainantDetails?.email || "-"}</td>
                                            </tr>
                                            <tr>
                                                <th>Contact Number</th>
                                                <td>{viewData?.complainantDetails?.contactNumber || "-"}</td>
                                            </tr>
                                            <tr>
                                                <th>Address</th>
                                                <td>{viewData?.complainantDetails?.address || "-"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <Divider className="my-8 border-gray-200" />
                        {/* Legal Representative Section */}
                        <div className="mb-8">
                            <div className="mb-6 rounded-lg border border-light-850/20">
                                <div className="card-header p-4 border-b border-light-850/20">
                                    <h3 className="text-lg font-semibold text-dark-950">B. Legal representative on behalf of a data subject</h3>
                                </div>
                                <div className="card-body p-4">
                                    <table className="w-full text-start">
                                        <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                            <tr>
                                                <th>Name</th>
                                                <td>{viewData?.legalRepresentative?.name || "-"}</td>
                                            </tr>
                                            <tr>
                                                <th>Licence</th>
                                                <td>{viewData?.legalRepresentative?.licenceNumber || "-"}</td>
                                            </tr>
                                            <tr>
                                                <th>Attorney</th>
                                                <td>{viewData?.legalRepresentative?.attorneyLetter || "-"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <Divider className="my-8 border-gray-200" />
                        {/* Mandated Person Section */}
                        <div className="mb-8">
                            <div className="mb-6 rounded-lg border border-light-850/20">
                                <div className="card-header p-4 border-b border-light-850/20">
                                    <h3 className="text-lg font-semibold text-dark-950">C. Natural person mandated by the data subject</h3>
                                </div>
                                <div className="card-body p-4">
                                    <table className="w-full text-start">
                                        <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                            <tr>
                                                <th>Name</th>
                                                <td>{viewData?.mandatedPerson?.name || "-"}</td>
                                            </tr>
                                            <tr>
                                                <th>ID Number</th>
                                                <td>{viewData?.mandatedPerson?.idNumber || "-"}</td>
                                            </tr>
                                            <tr>
                                                <th>Relationship to the data subject</th>
                                                <td>{viewData?.mandatedPerson?.relationship || "-"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <Divider className="my-8 border-gray-200" />
                        {/* Consent and Contact Section */}
                        <div className="mb-8">
                            <div className="mb-6 rounded-lg border border-light-850/20">
                                <div className="card-header p-4 border-b border-light-850/20">
                                    <h3 className="text-lg font-semibold text-dark-950">Consent and Contact</h3>
                                </div>
                                <div className="card-body p-4">
                                    <table className="w-full text-start">
                                        <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                            <tr>
                                                <th>Have you granted explicit consent to the data controller/processor for the lawful processing your personal data?</th>
                                                <td>{getYesNo(viewData?.consentGiven)}</td>
                                            </tr>
                                            <tr>
                                                <th>Have you attempted to contact the organisation/individual to resolve the matter?</th>
                                                <td>{getYesNo(viewData?.attemptedContact)}</td>
                                            </tr>
                                            <tr>
                                                <th>Evidence of correspondence</th>
                                                <td>{viewData?.correspondenceEvidence || "-"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <Divider className="my-8 border-gray-200" />
                        {/* Organization Details Section */}
                        <div className="mb-8">
                            <div className="mb-6 rounded-lg border border-light-850/20">
                                <div className="card-header p-4 border-b border-light-850/20">
                                    <h3 className="text-lg font-semibold text-dark-950">Details of the organisation/individual your complaint refers to</h3>
                                </div>
                                <div className="card-body p-4">
                                    <table className="w-full text-start">
                                        <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                            <tr>
                                                <th>Name of the organization/individual</th>
                                                <td>{viewData?.organizationDetails?.name || "-"}</td>
                                            </tr>
                                            <tr>
                                                <th>Address of the organization/individual</th>
                                                <td>{viewData?.organizationDetails?.address || "-"}</td>
                                            </tr>
                                            <tr>
                                                <th>Telephone number of the organization/individual</th>
                                                <td>{viewData?.organizationDetails?.telephone || "-"}</td>
                                            </tr>
                                            <tr>
                                                <th>Email Address of the organization/individual</th>
                                                <td>{viewData?.organizationDetails?.email || "-"}</td>
                                            </tr>
                                            <tr>
                                                <th>Your relationship with the organization/individual (if any)</th>
                                                <td>{viewData?.organizationDetails?.relationship || "-"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <Divider className="my-8 border-gray-200" />
                        {/* Complaint Details Section */}
                        <div className="mb-8">
                            <div className="mb-6 rounded-lg border border-light-850/20">
                                <div className="card-header p-4 border-b border-light-850/20">
                                    <h3 className="text-lg font-semibold text-dark-950">Is your complaint about your own personal data?</h3>
                                </div>
                                <div className="card-body p-4">
                                    <ul className="list-disc ml-6">
                                        {complaintCheckboxes.map((item) => (
                                            <li key={item.key}>
                                                {item.label}: {viewData?.complaintDetails?.[item.key] ? "Yes" : "No"}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <Divider className="my-8 border-gray-200" />
                        {/* Details of your complaint Section */}
                        <div className="mb-8">
                            <div className="mb-6 rounded-lg border border-light-850/20">
                                <div className="card-header p-4 border-b border-light-850/20">
                                    <h3 className="text-lg font-semibold text-dark-950">Details of your complaint</h3>
                                </div>
                                <div className="card-body p-4">
                                    <div>{viewData?.complaintDetails?.details || "-"}</div>
                                </div>
                            </div>
                        </div>
                        <Divider className="my-8 border-gray-200" />
                        {/* Declaration Section */}
                        <div className="mb-8">
                            <div className="mb-6 rounded-lg border border-light-850/20">
                                <div className="card-header p-4 border-b border-light-850/20">
                                    <h3 className="text-lg font-semibold text-dark-950">Declaration</h3>
                                </div>
                                <div className="card-body p-4">
                                    <table className="w-full text-start">
                                        <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                            <tr>
                                                <th>Name</th>
                                                <td>{viewData?.declaration?.fullName || "-"}</td>
                                            </tr>
                                            <tr>
                                                <th>Title</th>
                                                <td>{viewData?.declaration?.title || "-"}</td>
                                            </tr>
                                            <tr>
                                                <th>Date</th>
                                                <td>{viewData?.declaration?.date ? Moment(viewData?.declaration?.date).format("YYYY-MM-DD") : "-"}</td>
                                            </tr>
                                            <tr>
                                                <th>Signature</th>
                                                <td>
                                                    {viewData?.declaration?.signature ? (
                                                        <img className="db-image w-[160px]" alt="signature" src={getFileUrl(viewData?.declaration?.signature, "complaintHandleData")} />
                                                    ) : (
                                                        <span>-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {/* Case Tracking Section */}
                <Divider className="my-8 border-gray-200" />
                <div className="mb-8">
                    <div className="mb-6 rounded-lg border border-light-850/20">
                        <div className="card-header p-4 border-b border-light-850/20">
                            <h3 className="text-lg font-semibold text-dark-950">Case Tracking</h3>
                        </div>
                        <div className="card-body p-4">
                            <table className="w-full text-start">
                                <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                    <tr>
                                        <th>Reference number</th>
                                        <td>{viewData?.caseTracking?.referenceNumber || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Department Involved</th>
                                        <td>{viewData?.caseTracking?.departmentInvolved || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Employee Involved</th>
                                        <td>{viewData?.caseTracking?.employeeInvolved || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Initial response to complaint</th>
                                        <td>{viewData?.caseTracking?.initialResponse || "-"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Signature and Form Date */}
                <div className="mb-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div>
                        <span className="font-semibold">Signature</span>
                        {viewData?.signature ? (
                            <div className="db-image-wrap w-[160px]">
                                <img className="db-image" alt="signature" src={getFileUrl(viewData?.signature, "complaintHandleData")} />
                            </div>
                        ) : (
                            <div>-</div>
                        )}
                    </div>
                    <div>
                        <span className="font-semibold">Form Date</span>
                        <div>{viewData?.formDate ? Moment(viewData?.formDate).format("YYYY-MM-DD") : "-"}</div>
                    </div>
                </div>
                {/* Reject Reason */}
                {viewData?.status === "5" && (
                    <div className="mb-6">
                        <span className="font-semibold">Reject Reason</span>
                        <div>{viewData?.rejectReason || "-"}</div>
                    </div>
                )}
                {/* Audit Trail */}
                {Array.isArray(viewData?.auditTrail) && viewData.auditTrail.length > 0 && (
                    <div className="mb-8">
                        <div className="mb-6 rounded-lg border border-light-850/20">
                            <div className="card-header p-4 border-b border-light-850/20">
                                <h3 className="text-lg font-semibold text-dark-950">Audit Trail</h3>
                            </div>
                            <div className="card-body p-4">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-sm">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 font-semibold">Action</th>
                                                <th className="px-4 py-2 font-semibold">User</th>
                                                <th className="px-4 py-2 font-semibold">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {viewData.auditTrail.map((entry, idx) => (
                                                <tr key={idx} className="border-b">
                                                    <td className="px-4 py-2">{entry.action || "-"}</td>
                                                    <td className="px-4 py-2">{entry.user || "-"}</td>
                                                    <td className="px-4 py-2">{entry.date ? Moment(entry.date).format("YYYY-MM-DD HH:mm") : "-"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <PrimaryButton type="button" onClick={() => navigate("/complaint-handle/list")} className="w-full py-4 text-2xl mt-6">
                    Back
                </PrimaryButton>
            </CustomCard>
        </MainContentPart>
    );
}

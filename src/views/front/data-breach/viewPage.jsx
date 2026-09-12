import React, { useState, useEffect } from "react";
import MainContentPart from "@/layout/front/MainContentPart";
import CustomCard from "@/components/common/CustomCard";
import Divider from "@/components/ui/divider";
import { useDispatch } from "react-redux";
import ToastMe from "@/components/ui/ToastMe";
import Moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import { getFileUrl } from "@/services/CommonService";
import { getByIdDataBreachService } from "@/services/user/DataBreachServices";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";

export default function DataBreachViewPage(props) {
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
        dispatch(getByIdDataBreachService(id))
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
    const getEntityType = (val) => {
        switch (val) {
            case 1:
                return "Public";
            case 2:
                return "Private";
            case 3:
                return "NGO";
            case 4:
                return "Other";
            default:
                return "-";
        }
    };
    const getDpoType = (val) => {
        switch (val) {
            case 1:
                return "Mr";
            case 2:
                return "Mrs";
            case 3:
                return "Miss";
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
    const securityIncidents = [
        { value: 1, label: "Hacking/IT Incident" },
        { value: 2, label: "Malware Attack" },
        { value: 3, label: "Phishing" },
        { value: 4, label: "Lost or Stolen Devices" },
        { value: 5, label: "Insider Threat" },
        { value: 6, label: "Human Error" },
        { value: 7, label: "Improper Disposal of Data" },
        { value: 8, label: "Social Engineering" },
        { value: 9, label: "Vendor/Third-Party Breach" },
        { value: 10, label: "Ransomware Attack" },
        { value: 11, label: "Data Transfer Vulnerabilities" },
        { value: 12, label: "Unpatched Software Vulnerability" },
        { value: 13, label: "Brute Force Attack" },
        { value: 14, label: "SQL Injection" },
        { value: 15, label: "Denial of Service (DoS) Attack" },
        { value: 16, label: "Man-in-the-Middle (MITM) Attack" },
        { value: 17, label: "Zero-Day Exploit" },
        { value: 18, label: "Credential Stuffing" },
        { value: 19, label: "Privilege Escalation" },
        { value: 20, label: "Weak Authentication" },
        { value: 21, label: "Data Scraping" },
        { value: 22, label: "Cross-Site Scripting (XSS)" },
        { value: 23, label: "Cloud Misconfiguration" },
        { value: 24, label: "Unencrypted Data" },
        { value: 25, label: "Insecure APIs" },
        { value: 26, label: "Email Spoofing" },
        { value: 27, label: "Physical Security Lapse" },
        { value: 28, label: "Application Vulnerabilities" },
        { value: 29, label: "Data Leakage" },
        { value: 30, label: "Exploitation of Legacy Systems" },
    ];

    const getIncidentLabel = (val) => securityIncidents.find((i) => i.value === val)?.label || "-";
    const discoveryMethods = [
        { key: "userReports", label: "User Reports" },
        { key: "securityMonitoringSystems", label: "Security Monitoring Systems" },
        { key: "endpointDetectionAndResponse", label: "Endpoint Detection and Response" },
        { key: "incidentResponsePlans", label: "Incident Response Plans" },
        { key: "securityAuditsAndAssessments", label: "Security Audits and Assessments" },
        { key: "thirdPartyAlerts", label: "Third-Party Alerts" },
    ];

    const getEntityList = (val) => {
        if (val == "1") return "Data Protector";
        if (val == "2") return "Data Controller";
        if (val == "3") return "Both";
        return "-";
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
                    <PrimaryButton type="button" onClick={() => navigate("/data-breach/list")} className="w-full py-4 text-2xl mt-6">
                        Back
                    </PrimaryButton>
                </CustomCard>
            </MainContentPart>
        );
    }

    return (
        <MainContentPart>
            <CustomCard className="p-6 !border-t-4 !border-t-green">
                <div className="flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                    <h2 className="text-xl font-semibold text-primary">Data Breach Details</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(viewData?.status)}`}>{getStatus(viewData?.status)}</span>
                </div>
                {/* Section: Operational Details */}
                <div className="mb-8">
                    <div className="mb-6 rounded-lg border border-light-850/20">
                        <div className="card-header p-4 border-b border-light-850/20">
                            <h3 className="text-lg font-semibold text-dark-950">Operational Details</h3>
                        </div>
                        <div className="card-body p-4">
                            <table className="w-full text-start">
                                <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                    <tr>
                                        <th>Entity Type</th>
                                        <td>{getEntityType(viewData?.entityType)}</td>
                                    </tr>
                                    <tr>
                                        <th>Entity Name</th>
                                        <td>{viewData?.entityName || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Entity Sector</th>
                                        <td>{viewData?.entitySector || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>License Number</th>
                                        <td>{viewData?.licenseNumber || "-"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Divider className="my-8 border-gray-200" />
                {/* Section: Organisation Contact */}
                <div className="mb-8">
                    <div className="mb-6 rounded-lg border border-light-850/20">
                        <div className="card-header p-4 border-b border-light-850/20">
                            <h3 className="text-lg font-semibold text-dark-950">Organisation Contact</h3>
                        </div>
                        <div className="card-body p-4">
                            <table className="w-full text-start">
                                <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                    <tr>
                                        <th>Phone</th>
                                        <td>{viewData?.contact?.phone || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{viewData?.contact?.email || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Address</th>
                                        <td>{viewData?.contact?.address || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>State</th>
                                        <td>{viewData?.contact?.state || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>City</th>
                                        <td>{viewData?.contact?.city || "-"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Divider className="my-8 border-gray-200" />
                {/* Section: DPO Contact */}
                <div className="mb-8">
                    <div className="mb-6 rounded-lg border border-light-850/20">
                        <div className="card-header p-4 border-b border-light-850/20">
                            <h3 className="text-lg font-semibold text-dark-950">Data Protection Officer Contact</h3>
                        </div>
                        <div className="card-body p-4">
                            <table className="w-full text-start">
                                <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                    <tr>
                                        <th>Name</th>
                                        <td>
                                            {getDpoType(viewData?.dpo?.type)} {viewData?.dpo?.name || "-"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{viewData?.dpo?.email || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Phone</th>
                                        <td>{viewData?.dpo?.phone || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>First Breach Occurrence?</th>
                                        <td>{getYesNo(viewData?.dpo?.firstOccurrence)}</td>
                                    </tr>
                                    <tr>
                                        <th>Number of data breach victims (Phone)</th>
                                        <td>{viewData?.dpo?.phoneNumber || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Type Of Organization</th>
                                        <td>{getEntityList(viewData?.dpo?.typeOrganization) || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Others, please specify</th>
                                        <td>{viewData?.dpo?.typeOther || "-"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Divider className="my-8 border-gray-200" />
                {/* Section: Breach Info */}
                <div className="mb-8">
                    <div className="mb-6 rounded-lg border border-light-850/20">
                        <div className="card-header p-4 border-b border-light-850/20">
                            <h3 className="text-lg font-semibold text-dark-950">Information involved in the breach</h3>
                        </div>
                        <div className="card-body p-4">
                            <table className="w-full text-start">
                                <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                    <tr>
                                        <th>Kind of the personal information involved in the breach.</th>
                                        <td>{viewData?.breachDetails?.informationType || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Others, please specify</th>
                                        <td>{viewData?.breachDetails?.informationOther || "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Description of the Breach</th>
                                        <td>{getIncidentLabel(viewData?.breachDetails?.breachDescription)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Divider className="my-8 border-gray-200" />
                {/* Section: Discovery Method */}
                <div className="mb-8">
                    <div className="mb-6 rounded-lg border border-light-850/20">
                        <div className="card-header p-4 border-b border-light-850/20">
                            <h3 className="text-lg font-semibold text-dark-950">How did the organisation discover the breach?</h3>
                        </div>
                        <div className="card-body p-4">
                            <ul className="list-disc ml-6">
                                {discoveryMethods.map((method) => (
                                    <li key={method.key}>
                                        {method.label}: {viewData?.discoveryMethod?.[method.key] ? "Yes" : "No"}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <Divider className="my-8 border-gray-200" />
                {/* Section: Breach Details */}
                <div className="mb-8">
                    <div className="mb-6 rounded-lg border border-light-850/20">
                        <div className="card-header p-4 border-b border-light-850/20">
                            <h3 className="text-lg font-semibold text-dark-950">Breach Details</h3>
                        </div>
                        <div className="card-body p-4">
                            <table className="w-full text-start">
                                <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                    <tr>
                                        <th>Was the breach caused by cyber incident?</th>
                                        <td>
                                            {viewData?.breachDetails?.cyberIncident === "2"
                                                ? `Others, please specify: ${viewData?.breachDetails?.cyberIncidentDetails || "-"}`
                                                : getYesNo(viewData?.breachDetails?.cyberIncident)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>When did the breach happened?</th>
                                        <td>{viewData?.breachDetails?.breachDate ? Moment(viewData?.breachDetails?.breachDate).format("YYYY-MM-DD") : "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>When did you discover the breach?</th>
                                        <td>{viewData?.breachDetails?.discoveryDate ? Moment(viewData?.breachDetails?.discoveryDate).format("YYYY-MM-DD") : "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>Is the breach likely to result in a high risk to data subject?</th>
                                        <td>
                                            {viewData?.breachDetails?.highRiskToDataSubject === "2"
                                                ? `Not yet given, Please give details: ${viewData?.breachDetails?.riskDetails || "-"}`
                                                : getYesNo(viewData?.breachDetails?.highRiskToDataSubject)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Have you taken any action to limit the breach?</th>
                                        <td>
                                            <div>{getYesNo(viewData?.breachDetails?.chooseAction) || "-"}</div>
                                            <div>{viewData?.breachDetails?.giveDetails || "-"}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Have you told data subjects about the breach?</th>
                                        <td>
                                            {viewData?.breachDetails?.dataSubjectsInformed === "2"
                                                ? `If No, Please specify: ${viewData?.breachDetails?.reasonForNotInforming || "-"}`
                                                : getYesNo(viewData?.breachDetails?.dataSubjectsInformed)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Describe any further action you have taken/ or purpose to take as a result of the breach</th>
                                        <td>{viewData?.breachDetails?.furtherActions || "-"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Divider className="my-8 border-gray-200" />
                {/* Section: Declaration */}
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
                                        <td>{viewData?.declaration?.name || "-"}</td>
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
                                            {viewData?.declarationSignature ? (
                                                <img className="db-image w-[160px]" alt="signature" src={getFileUrl(viewData?.declarationSignature, "breachData")} />
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Uploaded File</th>
                                        <td>
                                            {viewData?.contractFile ? (
                                                <img className="db-image w-[160px]" alt="uploaded file" src={getFileUrl(viewData?.contractFile, "breachData")} />
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
                {/* Section: Audit Trail */}
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
                <PrimaryButton type="button" onClick={() => navigate("/data-breach/list")} className="w-full py-4 text-2xl mt-6">
                    Back
                </PrimaryButton>
            </CustomCard>
        </MainContentPart>
    );
}

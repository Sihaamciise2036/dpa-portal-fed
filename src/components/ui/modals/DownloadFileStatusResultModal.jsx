import React from "react";
import CommonModal from "./CommonModal";
import { Label } from "../inputs/label";
import { CheckCircle, CircleCheck } from "lucide-react";
import InputCheck from "../inputs/input-check";
import Divider from "../divider";
import PDFFileIcon from "@/components/icons/PDFFileIcon";
import ProgressBar from "@/components/chart/ProgressBar";
import { PrimaryButton } from "../buttons/primary-button";
import { SecondaryButton } from "../buttons/secondary-button";
import SelectListBox from "../inputs/select-list-box";
import Moment from "moment";

export default function DownloadFileStatusResultModal({ expiryYear = 1, expiryDate, fileName, openModel, handleModelClose, downloadCertificate }) {
    const [progress, setProgress] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const expirationDate = Moment(expiryDate).add(expiryYear, "years");
    const currentDate = Moment();

    const diffYears = expirationDate.diff(currentDate, "years");
    const diffMonths = expirationDate.diff(currentDate, "months") % 12;
    const diffDays = expirationDate.diff(currentDate, "days") % 30;

    React.useEffect(() => {
        if (progress && progress == "100") {
            setIsLoading(false);
        }
    }, [progress]);
    return (
        <CommonModal modelTitle={"Download file with Statu result"} titleClassName="text-white" dialogPanelClass="bg-primary max-w-[1040px]" openModel={openModel} handleModelClose={handleModelClose}>
            <div className="modal-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white mb-10">
                    <div className="">
                        <Label labelClassName="2xl:text-base" labelText="Issuer: Data Protection Authority" />
                        <div className="file-preview text-white flex items-center gap-4 justify-start">
                            <div className="flex items-center gap-2  flex-shrink-0">
                                <PDFFileIcon className="size-8 flex-shrink-0" />
                                <p className="text-xs font-normal flex-shrink-0">
                                    <span className="block">{fileName}</span>
                                    {/* <span className="block">1.24 MB</span> */}
                                </p>
                            </div>
                            <ProgressBar defaultValue={0} setPageProgress={setProgress} className="flex-grow w-full h-3" />
                        </div>
                    </div>
                    <div className="">
                        <p>Tests results carried out the same day might show up in the same or several separate files</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                    <div className="">
                        <table className="w-full [&_th]:font-semibold text-start [&_td]:text-start mb-6">
                            <thead>
                                <tr>
                                    <th className="py-3 text-start">Scanned TESTS</th>
                                    <th className="py-3 text-center">STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-2.5">
                                        <h6>Expiration</h6>
                                        <p className="text-secondary-950 text-sm">
                                            {expirationDate.isAfter(currentDate) ? `Remaining time: ${diffYears} years, ${diffMonths} months, and ${diffDays} days Left.` : "Expired"}
                                        </p>
                                    </td>
                                    <td className="text-center py-2.5">
                                        <CheckCircle className="mx-auto" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2.5">
                                        <h6>Issuer Verification </h6>
                                        <p className="text-secondary-950 text-sm">Verified</p>
                                    </td>
                                    <td className="text-center py-2.5">
                                        <CheckCircle className="mx-auto" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2.5">
                                        <h6>Qualification</h6>
                                        <p className="text-secondary-950 text-sm">Bassed</p>
                                    </td>
                                    <td className="text-center py-2.5">
                                        <CheckCircle className="mx-auto" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {/* <h4 className="font-semibold mb-4">LEGEND</h4>
                        <InputCheck
                            size={"sm"}
                            groupClassName={"mb-4"}
                            inputClassName="border-white rounded-sm checkbox:border-secondary checked:bg-secondary"
                            labelClassName={"text-white text-base font-normal"}
                            labelText={"Results not ready"}
                        />
                        <InputCheck
                            size={"sm"}
                            groupClassName={"mb-4"}
                            inputClassName="border-white rounded-sm checkbox:border-secondary checked:bg-secondary"
                            labelClassName={"text-white text-base font-normal"}
                            labelText={"Results not ready"}
                        /> */}
                    </div>
                </div>
                <Divider className="border-secondary-950" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-white">
                        <h4 className="text-xl font-semibold mb-3">Full archive with history of your Certificate now in one place !</h4>
                        <p className="text-sm font-medium">Register account and you will have an easy access to all of your Need and certification.</p>
                    </div>
                    <div className="">
                        <div className="file-preview border border-white rounded-md py-4 px-6 text-white flex gap-2 justify-start">
                            <PDFFileIcon className="size-6" />
                            <p>{fileName}</p> <CircleCheck className="flex-shrink-0 ms-auto" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 justify-center mt-8">
                    <SecondaryButton type="button" className="py-3 px-6 rounded-xl" disabled={isLoading} isLoading={isLoading}>
                        Register and create an account
                    </SecondaryButton>
                    <SecondaryButton type="button" onClick={downloadCertificate} className="py-3 px-6 rounded-xl" disabled={isLoading} isLoading={isLoading}>
                        Download your test results
                    </SecondaryButton>
                </div>
            </div>
        </CommonModal>
    );
}

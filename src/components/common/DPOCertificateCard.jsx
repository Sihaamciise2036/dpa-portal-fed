import Divider from "@/components/ui/divider";
import Moment from "moment";

export default function DPOCertificateCard({ dataSource, targetRef }) {
    return (
        <>
            <div
                ref={targetRef}
                className="w-[1092px] h-[750px] bg-white px-16 pt-32 pb-14 bg-[url('/public/assets/images/certificate/dpo-certificate-background.svg')] bg-cover bg-no-repeat bg-center">
                <div className="certificate-content flex flex-col justify-between h-full">
                    <div className="certificate-header text-center space-y-4">
                        <h2 className="font-Acme text-7xl uppercase text-primary-960">Certificate</h2>
                        <h5 className="text-xl font-medium uppercase font-ibm">OF RECOGNITION</h5>
                        <h3 className="text-3xl capitalize font-ibm">As DPO Officer In Data Protection Authority</h3>
                        <h5 className="text-xl font-medium font-ibm">proudly presented to</h5>
                    </div>
                    <div className="certificate-body text-center flex flex-col items-center gap-6">
                        <h1 className="font-bold font-LobsterTwo inline-block text-primary-960 text-5xl">{dataSource?.organisationName}</h1>
                        <p>
                            For the outstanding contributions and dedication during <br /> The Quarter of <strong>{Moment(dataSource?.createdAt).format("MMMM, YYYY")}</strong> to{" "}
                            <strong>{Moment(dataSource?.createdAt).add(3, "years").format("MMMM, YYYY")}</strong>
                        </p>
                    </div>
                    <div className="certificate-footer mx-auto w-full max-w-[90%]">
                        <div className="flex justify-between items-end gap-10 mb-6">
                            <div className="signature-box flex justify-center flex-col items-center flex-shrink-0">
                                <img src="/assets/images/certificate/signature-mustafa-abdirashid-abdi.png" alt="" />
                                <Divider className="border-b-2 w-full border-primary/50" />
                                <h5 className="text-base text-primary font-medium">Mustafa Abdirashid Abdi</h5>
                            </div>
                            <div className="signature-box flex justify-center flex-col items-center flex-shrink-0">
                                <img src="/assets/images/certificate/signature-mohamed-nur-ali.png" alt="" />
                                <Divider className="border-b-2 w-full border-primary/50" />
                                <h5 className="text-base text-primary font-medium">Mohamed Nur Ali</h5>
                            </div>
                            <div className="signature-box flex justify-center flex-col items-center flex-shrink-0">
                                <img src="/assets/images/certificate/signature-safiya-abdullahi-hussein.png" alt="" />
                                <Divider className="border-b-2 w-full border-primary/50" />
                                <h5 className="text-base text-primary font-medium">Safiya Abdullahi Hussein</h5>
                            </div>
                        </div>
                        <p className="text-center text-lg -mb-10">{dataSource?.officerCertificateNumber}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

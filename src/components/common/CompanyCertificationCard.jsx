import Divider from "@/components/ui/divider";
import QRCode from "react-qr-code";
import Moment from "moment";

export default function CompanyCertificationCard({ dataSource, targetRef }) {
    const publicUrl = import.meta.env.BASE_URL;

    return (
        <div
            ref={targetRef}
            style={{
                width: "794px", // full A4 width
                height: "1123px", // full A4 height
                backgroundColor: "#ffffff",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
            }}>
            {/* --- Centered certificate --- */}
            <div
                style={{
                    width: "720px", // slightly larger to fill A4 nicely
                    height: "1020px",
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                }}>
                {/* ✅ Background Frame Image */}
                <img
                    src={`${publicUrl}assets/images/certificate/company-certification-background.svg`}
                    alt="certificate background"
                    crossOrigin="anonymous"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain", // prevent cropping
                        objectPosition: "center center",
                        zIndex: 0,
                    }}
                />

                {/* ✅ Foreground Content */}
                <div
                    className="absolute inset-0 flex flex-col justify-between px-10 py-11 text-[#9C9483]"
                    style={{
                        zIndex: 1,
                        fontFamily: "Rajdhani",
                    }}>
                    {/* --- Header Logos --- */}
                    <div
                        className="flex justify-between items-center mb-6"
                        style={{
                            width: "100%",
                            zIndex: 5,
                            position: "relative",
                        }}>
                        <img
                            src={`${import.meta.env.BASE_URL}assets/images/certificate/secondary-logo.webp`}
                            alt="Somalia Coat of Arms"
                            crossOrigin="anonymous"
                            style={{
                                height: "100px",
                                width: "auto",
                                objectFit: "contain",
                            }}
                        />

                        <img
                            src={`${import.meta.env.BASE_URL}assets/images/certificate/primary-logo.webp`}
                            alt="Data Protection Authority"
                            crossOrigin="anonymous"
                            style={{
                                height: "100px",
                                width: "auto",
                                objectFit: "contain",
                            }}
                        />
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 justify-center items-center text-center">
                        <h2 className="font-bold text-[22px] uppercase mb-1">CERTIFICATE OF REGISTRATION</h2>
                        <h5 className="text-sm font-medium uppercase mb-3">{dataSource?.dpaLicenceNumber}</h5>

                        <h4 className="text-base font-semibold mb-1">This Certificate Is Awarded To</h4>
                        <h1 className="font-bold text-3xl text-black pb-2.5 capitalize">{dataSource?.contact?.name}</h1>

                        <Divider className="border-b w-full border-primary/50 my-1" />

                        <h5 className="text-base font-bold capitalize mt-2">As A Data Processor</h5>
                        <p className="text-xs font-semibold">
                            For a period of one year from {Moment(dataSource?.createdAt).format("DD-MM-YYYY")} to {Moment(dataSource?.createdAt).add(1, "years").format("DD-MM-YYYY")}, as indicated
                            below.
                        </p>
                    </div>

                    {/* --- Footer Section --- */}
                    <div className="w-full text-center mt-6" style={{ marginTop: "40px" }}>
                        {/* ✅ Center Stamp + QR as one block */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                            }}>
                            {/* Large Red Stamp */}
                            <img
                                src={`${import.meta.env.BASE_URL}assets/images/certificate/dpa-stamp.svg`}
                                alt="DPA Stamp"
                                crossOrigin="anonymous"
                                style={{
                                    width: "160px", // ⬅️ increased size
                                    height: "auto",
                                    marginBottom: "5px",
                                }}
                            />

                            {/* QR Code just below stamp */}
                            <QRCode
                                size={85} // ⬅️ increased size for better visibility
                                value={`${window.location.origin}/certificate/view/${dataSource?._id}`}
                                style={{
                                    border: "2px solid transparent",
                                }}
                            />
                        </div>

                        {/* ✅ Signature + Serial Row Below */}
                        <div className="grid grid-cols-3 items-end gap-4 mt-6 text-center text-[#9C9483]" style={{ marginTop: "25px" }}>
                            {/* Left Signature */}
                            <div>
                                <h5 className="text-sm font-bold">GD OF DPA</h5>
                                <Divider className="border-b border-primary/50 my-1" />
                                <img
                                    src={`${import.meta.env.BASE_URL}assets/images/certificate/signature-gd-of-dpa.png`}
                                    alt="signature"
                                    crossOrigin="anonymous"
                                    style={{ height: "45px", margin: "0 auto" }}
                                />
                            </div>

                            {/* Center blank space to keep balance */}
                            <div></div>

                            {/* Right Serial Number */}
                            <div>
                                <h5 className="text-sm font-bold">Serial Number</h5>
                                <Divider className="border-b border-primary/50 my-1" />
                                <h5 className="text-sm font-bold">{dataSource?.uniqueNumber}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

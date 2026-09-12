import React from "react";
import { ShieldCheck, FileText, UserCheck, Lock, Globe } from "lucide-react";
import CommonModal from "./CommonModal";

export default function TermConditionModal({ openModel, handleModelClose }) {
    const termsData = [
        {
            title: "1. Definitions",
            content: ["“Service” refers to the online platform, applications, and related services provided by [Your Company].", "“User” or “You” means anyone who accesses or uses the Service."],
        },
        {
            title: "2. Use of the Service",
            content: [
                "You agree to use the Service only for lawful purposes and in compliance with all applicable laws and regulations.",
                "You are responsible for safeguarding your account credentials and for all activities that occur under your account.",
            ],
        },
        {
            title: "3. User Content",
            content: [
                "Any content you submit (comments, data, files) remains your property.",
                "By submitting, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display that content solely to provide and improve the Service.",
            ],
        },
        {
            title: "4. Privacy and Data Protection",
            content: [
                "Our Privacy Policy governs the collection, use, and disclosure of your personal information.",
                "By using the Service, you consent to our handling of your data as described in the Privacy Policy.",
            ],
        },
        {
            title: "5. Intellectual Property",
            content: [
                "All rights, title, and interest in the Service (including software, text, graphics, logos) are owned by [Your Company] or our licensors.",
                "You may not copy, modify, distribute, sell, or lease any part of our Service without our prior written consent.",
            ],
        },
        {
            title: "6. Disclaimers & Limitation of Liability",
            content: [
                "The Service is provided “as is” and “as available.” We make no warranties of any kind, whether express or implied.",
                "To the fullest extent permitted by law, [Your Company] will not be liable for any indirect, incidental, special, or consequential damages arising out of your use of the Service.",
            ],
        },
        {
            title: "7. Indemnification",
            content: [
                "You agree to indemnify and hold [Your Company] harmless from any claim or demand, including reasonable attorney’s fees, arising out of your breach of these Terms or your violation of any law.",
            ],
        },
        {
            title: "8. Modification of Terms",
            content: [
                "We may revise these Terms at any time. We will notify you of material changes by posting them on our site or via email.",
                "Continued use of the Service after changes constitutes your acceptance.",
            ],
        },
        {
            title: "9. Governing Law & Dispute Resolution",
            content: ["These Terms are governed by the laws of [Your Jurisdiction].", "Any disputes will be resolved in the courts of [Your Jurisdiction] unless otherwise agreed in writing."],
        },
    ];

    return (
        <CommonModal dialogPanelClass="max-w-3xl" modelHeaderHide={false} openModel={openModel} modelTitle={"📜 Terms & Conditions"} handleModelClose={handleModelClose}>
            <div className="modal-body text-center flex flex-col gap-4 items-center py-1 max-h-[70vh] overflow-y-auto">
                <div className="w-full bg-gradient-to-br from-blue-50 to-purple-100 py-4 px-4">
                    <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-6 border border-white/40">
                        <div className="space-y-8">
                            {termsData.map((term, idx) => (
                                <div key={idx} className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h2 className="text-xl font-semibold text-gray-800">{term.title}</h2>
                                    </div>
                                    <ul className="space-y-2 text-gray-700 leading-relaxed list-disc pl-5 text-[15px] text-left">
                                        {term.content.map((point, pIdx) => (
                                            <li key={pIdx}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </CommonModal>
    );
}

const Section = ({ title, children }) => {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <div className="space-y-2 text-base text-gray-700">{children}</div>
        </div>
    );
};

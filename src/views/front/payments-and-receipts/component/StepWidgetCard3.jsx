import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import Divider from "@/components/ui/divider";
import { Input } from "@/components/ui/inputs/input";
import InputRadio from "@/components/ui/inputs/input-radio";
import { Label } from "@/components/ui/inputs/label";
import { BriefcaseBusinessIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, MapPin, X } from "lucide-react";
import React from "react";

export default function StepWidgetCard3() {
    return (
        <CustomCard className="p-6 !border-t-4 !border-t-green">
            <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-primary capitalize">Verify Information</h2>
                <div className="buttons-wrap flex items-center gap-2">
                    <PrimaryButton>
                        <ChevronLeftIcon />
                    </PrimaryButton>
                    <PrimaryButton>
                        <ChevronRightIcon />
                    </PrimaryButton>
                </div>
            </div>
            <div className="card-body">
                <p className="text-red-600 mb-6">Note: Information captured in this section cannot be edited after payment</p>
                <div className="mb-6">
                    <p className="mb-3">Nin: **********</p>
                    <p className="text-xl font-semibold mb-3">Test</p>
                    <p className="flex items-center gap-2 mb-3">
                        <MapPin /> 123,Lorem ipsum dolor sit amet.
                    </p>
                    <p className="flex items-center gap-2 mb-3">
                        <BriefcaseBusinessIcon /> 123,Lorem ipsum dolor sit amet.
                    </p>
                    <p className="flex items-center gap-2 mb-3">
                        <BriefcaseBusinessIcon /> 123,Lorem ipsum dolor sit amet.
                    </p>
                    <div className="">
                        <Label labelClassName="2xl:text-base mb-2 font-semibold" labelText="Data Processing Category" />
                        <p className="flex items-center gap-2 mb-3">
                            <CheckIcon /> 123,Lorem ipsum dolor sit amet.
                        </p>
                    </div>
                    <div className="">
                        <Label labelClassName="2xl:text-base mb-2 font-semibold" labelText="Payment Status" />
                        <p className="flex items-center gap-2 mb-3 text-red-600">
                            <X /> Unpaid
                        </p>
                    </div>
                </div>
                <div className="mb-6 rounded-lg border border-light-850/20">
                    <div className="card-header p-4 border-b border-light-850/20">
                        <h3 className="text-lg font-semibold text-dark-950">Data Protection Officers</h3>
                    </div>
                    <div className="card-body p-4">
                        <div className="table-responsive overflow-x-auto">
                            <table className="w-full text-start">
                                <thead>
                                    <tr className="text-sm [&_th]:text-start [&_th]:min-w-[120px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20">
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Certification</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(4)].map((item, index) => (
                                        <tr className="[&_td]:text-start [&_td]:min-w-[120px] [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20" key={index}>
                                            <td>Developer</td>
                                            <td>AbcD</td>
                                            <td>admin@admin.com</td>
                                            <td>+91 1234567890</td>
                                            <td>123, Lorem ipsum</td>
                                            <td className="text-red-600">N/A</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="mb-6 rounded-lg border border-light-850/20">
                    <div className="card-header p-4 border-b border-light-850/20">
                        <h3 className="text-lg font-semibold text-dark-950">Data Processing Details</h3>
                    </div>
                    <div className="card-body p-4">
                        <div className="table-responsive overflow-x-auto">
                            <table className="w-full text-start">
                                <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                    <tr>
                                        <th>Number of Data Subjects</th>
                                        <td>1-200</td>
                                    </tr>
                                    <tr>
                                        <th>Categories of Recipients</th>
                                        <td>Business Organization in Nigeria, Government Organization in Nigeria, Non-profit organization in Nigeria, Public Sector Organization in Nigeria</td>
                                    </tr>
                                    <tr>
                                        <th>Intended Data Transfer Country</th>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <th>Purpose of Data Processing</th>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <th>Category</th>
                                        <td>Lorem, ipsum.</td>
                                    </tr>
                                    <tr>
                                        <th>Description</th>
                                        <td>Lorem, ipsum.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="mb-6 rounded-lg border border-light-850/20">
                    <div className="card-header p-4 border-b border-light-850/20">
                        <h3 className="text-lg font-semibold text-dark-950">Data Processor Representatives</h3>
                    </div>
                    <div className="card-body p-4">
                        <div className="table-responsive overflow-x-auto">
                            <table className="w-full text-start">
                                <thead>
                                    <tr className="text-sm [&_th]:text-start [&_th]:min-w-[120px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20">
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(4)].map((item, index) => (
                                        <tr className="[&_td]:text-start [&_td]:min-w-[120px] [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20" key={index}>
                                            <td>Developer</td>
                                            <td>Abcd</td>
                                            <td>admin@admin.com</td>
                                            <td>+91 1234567890</td>
                                            <td>123, Lorem ipsum</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="mb-6 rounded-lg border border-light-850/20">
                    <div className="card-header p-4 border-b border-light-850/20">
                        <h3 className="text-lg font-semibold text-dark-950">Safety Precautions</h3>
                    </div>
                    <div className="card-body p-4">
                        <div className="table-responsive overflow-x-auto">
                            <table className="w-full text-start">
                                <tbody className="text-sm [&_th]:text-start [&_th]:w-[300px] [&_th]:px-4 [&_th]:py-2.5 [&_th]:border-b [&_th]:border-light-850/20 [&_td]:text-start [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-light-850/20">
                                    <tr className="">
                                        <th>Number of Data Subjects</th>
                                        <td>1-200</td>
                                    </tr>
                                    <tr className="">
                                        <th>Categories of Recipients</th>
                                        <td>Business Organization in Nigeria, Government Organization in Nigeria, Non-profit organization in Nigeria, Public Sector Organization in Nigeria</td>
                                    </tr>
                                    <tr className="">
                                        <th>Intended Data Transfer Country</th>
                                        <td>-</td>
                                    </tr>
                                    <tr className="">
                                        <th>Purpose of Data Processing</th>
                                        <td>-</td>
                                    </tr>
                                    <tr className="">
                                        <th>Category</th>
                                        <td>Lorem, ipsum.</td>
                                    </tr>
                                    <tr className="">
                                        <th>Description</th>
                                        <td>Lorem, ipsum.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <PrimaryButton>Print</PrimaryButton>
                    <PrimaryButton>Next</PrimaryButton>
                </div>
            </div>
        </CustomCard>
    );
}

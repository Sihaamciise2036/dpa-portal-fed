import CustomCard from "@/components/common/CustomCard";
import Divider from "@/components/ui/divider";
import MainContentPart from "@/layout/front/MainContentPart";
import { useState } from "react";
import { Link } from "react-router-dom";
import StepWidgetCard1 from "./component/StepWidgetCard1";
import StepWidgetCard2 from "./component/StepWidgetCard2";
import StepWidgetCard3 from "./component/StepWidgetCard3";
import StepWidgetCard4 from "./component/StepWidgetCard4";

export default function PaymentsAndReceiptsPage() {
    const [summarySteps, setSummarySteps] = useState(1);
    return (
        <MainContentPart>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="summary-sidebar">
                    <CustomCard className="p-6 !border-t-4 !border-t-green">
                        <h3>Summary</h3>
                        <Divider className="xl:my-4 my-4" />
                        <ul className="text-base">
                            <li
                                onClick={() => setSummarySteps(1)}
                                className="border-b border-light-850/20 active py-2.5 px-2 [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:border-s-primary hover:text-primary hover:bg-primary/10 border-s-2 border-s-transparent hover:border-s-primary transition-all duration-500 block">
                                <Link to={"#"} className="">
                                    1. Instructions
                                </Link>
                            </li>
                            <li
                                onClick={() => setSummarySteps(2)}
                                className="border-b border-light-850/20 py-2.5 px-2 [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:border-s-primary hover:text-primary hover:bg-primary/10 border-s-2 border-s-transparent hover:border-s-primary transition-all duration-500 block">
                                <Link to={"#"} className="">
                                    2. Data Controller / Processor
                                </Link>
                            </li>
                            <li
                                onClick={() => setSummarySteps(3)}
                                className="border-b border-light-850/20 py-2.5 px-2 [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:border-s-primary hover:text-primary hover:bg-primary/10 border-s-2 border-s-transparent hover:border-s-primary transition-all duration-500 block">
                                <Link to={"#"} className="">
                                    3. Data Processing Details
                                </Link>
                            </li>
                            <li
                                onClick={() => setSummarySteps(4)}
                                className="border-b border-light-850/20 py-2.5 px-2 [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:border-s-primary hover:text-primary hover:bg-primary/10 border-s-2 border-s-transparent hover:border-s-primary transition-all duration-500 block">
                                <Link to={"#"} className="">
                                    4. Data Protection Officers
                                </Link>
                            </li>
                            <li
                                onClick={() => setSummarySteps(5)}
                                className="border-b border-light-850/20 py-2.5 px-2 [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:border-s-primary hover:text-primary hover:bg-primary/10 border-s-2 border-s-transparent hover:border-s-primary transition-all duration-500 block">
                                <Link to={"#"} className="">
                                    5. Data Controller / Processor Representatives
                                </Link>
                            </li>
                            <li
                                onClick={() => setSummarySteps(6)}
                                className="border-b border-light-850/20 py-2.5 px-2 [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:border-s-primary hover:text-primary hover:bg-primary/10 border-s-2 border-s-transparent hover:border-s-primary transition-all duration-500 block">
                                <Link to={"#"} className="">
                                    6. Safety Precautions
                                </Link>
                            </li>
                            <li
                                onClick={() => setSummarySteps(7)}
                                className="border-b border-light-850/20 py-2.5 px-2 [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:border-s-primary hover:text-primary hover:bg-primary/10 border-s-2 border-s-transparent hover:border-s-primary transition-all duration-500 block">
                                <Link to={"#"} className="">
                                    7. Verify Information
                                </Link>
                            </li>
                            <li
                                onClick={() => setSummarySteps(8)}
                                className="border-b border-light-850/20 py-2.5 px-2 [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:border-s-primary hover:text-primary hover:bg-primary/10 border-s-2 border-s-transparent hover:border-s-primary transition-all duration-500 block">
                                <Link to={"#"} className="">
                                    8. Payment
                                </Link>
                            </li>
                            <li
                                onClick={() => setSummarySteps(9)}
                                className="py-2.5 px-2 [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:border-s-primary hover:text-primary hover:bg-primary/10 border-s-2 border-s-transparent hover:border-s-primary transition-all duration-500"
                                block="">
                                <Link to={"#"} className="">
                                    9. Finish
                                </Link>
                            </li>
                        </ul>
                    </CustomCard>
                </div>
                <div className="xl:col-span-3">
                    {summarySteps === 1 ? <StepWidgetCard1 /> : summarySteps === 2 ? <StepWidgetCard2 /> : summarySteps === 3 ? <StepWidgetCard3 /> : summarySteps === 4 ? <StepWidgetCard4 /> : <></>}
                </div>
            </div>
        </MainContentPart>
    );
}

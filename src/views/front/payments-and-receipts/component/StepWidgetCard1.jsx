import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import Divider from "@/components/ui/divider";
import { Input } from "@/components/ui/inputs/input";
import InputRadio from "@/components/ui/inputs/input-radio";
import InputCheck from "@/components/ui/inputs/input-check";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// Import the default styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Create new plugin instance

export default function StepWidgetCard1() {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    return (
        <CustomCard className="p-6 !border-t-4 !border-t-green">
            <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-primary">Instructions</h2>
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
                <p className="text-red-600 mb-6">
                    I declare this registration pertains to the Data Controller/Processor with the following level of major importance, as specified in the quidelines above:
                </p>
                <div className="h-[650px] mb-10">
                    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                        <Viewer fileUrl="/assets/pdf/eregstrationGovSomalia.pdf" plugins={[defaultLayoutPluginInstance]} />
                    </Worker>
                </div>
                <InputCheck
                    size="sm"
                    groupClassName="items-start mb-6"
                    labelText="I hereby certify that I have read and understood the above statements and agree to all terms specified for this registration"
                />
                <p className="text-base text-light-850 mb-6">
                    I declare this registration pertains to the Data Controller/Processor with the following level of major importance, as specified in the quidelines above:
                </p>
                <div className="radio-group flex gap-4 flex-col mb-6">
                    <InputRadio size="sm" groupClassName="gap-2" name="Individual" labelText={"Ultra High Level"} />
                    <InputRadio size="sm" groupClassName="gap-2" name="Individual" labelText={"Extra High Level"} />
                    <InputRadio size="sm" groupClassName="gap-2" name="Individual" labelText={"Ordinary High Level"} />
                </div>
                <p className="text-red-600 mb-6">Nice This option cannot be changed after payment</p>

                <div className="flex items-center gap-2 flex-wrap">
                    <PrimaryButton>Proceed</PrimaryButton>
                </div>
            </div>
        </CustomCard>
    );
}

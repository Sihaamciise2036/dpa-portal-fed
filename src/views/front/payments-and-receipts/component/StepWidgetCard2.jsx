import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import Divider from "@/components/ui/divider";
import { Input } from "@/components/ui/inputs/input";
import InputRadio from "@/components/ui/inputs/input-radio";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";

export default function StepWidgetCard2() {
    return (
        <CustomCard className="p-6 !border-t-4 !border-t-green">
            <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-primary">DATA CONTROLLER / PROCESSOR</h2>
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
                <div className="radio-group flex items-center gap-4 flex-wrap mb-6">
                    <InputRadio size="sm" groupClassName="gap-2" name="Individual" labelText={"Individual"} />
                    <InputRadio size="sm" groupClassName="gap-2" name="Individual" labelText={"Organization"} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input size="md" labelText="Type" />
                    <Input size="md" labelText="Min" />
                    <PrimaryButton>Validate id number</PrimaryButton>
                </div>
                <Divider className="my-6" />
                <div className="">
                    <h4 className="text-xl font-semibold mb-2">Alternatively</h4>
                    <p className="text-base text-light-850 mb-4">You can monmaally type details by clicking the button below</p>
                    <PrimaryButton>Fill yourself</PrimaryButton>
                </div>
            </div>
        </CustomCard>
    );
}

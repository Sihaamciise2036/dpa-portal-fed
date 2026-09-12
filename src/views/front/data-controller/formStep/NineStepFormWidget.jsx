import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { SecondaryButton } from "@/components/ui/buttons/secondary-button";
import Divider from "@/components/ui/divider";
import { Input } from "@/components/ui/inputs/input";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function NineStepFormWidget({ control, errors, isFormSumbmit, isLoading }) {
    return (
        <CustomCard className="p-6 !border-t-4 !border-t-green">
            <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-primary">FINISH </h2>
                <div className="buttons-wrap flex items-center gap-2">
                    {/* <PrimaryButton>
                        <ChevronLeftIcon />
                    </PrimaryButton>
                    <PrimaryButton>
                        <ChevronRightIcon />
                    </PrimaryButton> */}
                </div>
            </div>
            <div className="card-body">
                <h4 className="text-lg font-semibold mb-4">You must complete all sections in the registration form before you can submit.</h4>

                <h4 className="text-lg font-semibold mb-4">Application Status</h4>

                <Divider className="my-6" />
                <div className="">
                    <PrimaryButton type="submit">Save and Continue</PrimaryButton>
                </div>
            </div>
        </CustomCard>
    );
}

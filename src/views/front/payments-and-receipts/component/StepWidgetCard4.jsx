import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { SecondaryButton } from "@/components/ui/buttons/secondary-button";
import Divider from "@/components/ui/divider";
import { Input } from "@/components/ui/inputs/input";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function StepWidgetCard4() {
    return (
        <CustomCard className="p-6 !border-t-4 !border-t-green">
            <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-primary">Payment</h2>
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
                <p className="text-red-600 mb-6">Before you make payment</p>
                <h4 className="text-lg font-semibold mb-4">Payment Information 1: Dc / Dp Registration</h4>
                <div className="grid grid-cols-1 gap-6">
                    <Input size="md" labelText="Name of MDA" />
                    <Input size="md" labelText="Amount To Pay (N)" />
                    <Input size="md" labelText="Service" />
                </div>
                <Divider className="my-6" />
                <h4 className="text-lg font-semibold mb-4">How Do You Wish To Make Payment</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="">
                        <p className="text-sm text-light-850 mb-4">The system will automatically help you initiate payment</p>
                        <PrimaryButton>INSTANT PAYMENT</PrimaryButton>
                    </div>
                    <div className="">
                        <p className="text-sm text-light-850 mb-4">Utilize the button below if Instant payment is not automatically reconciled</p>
                        <SecondaryButton>THIRD PARTY PAYMENT</SecondaryButton>
                    </div>
                </div>
            </div>
        </CustomCard>
    );
}

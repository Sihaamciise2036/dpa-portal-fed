import React from "react";
import CommonModal from "./CommonModal";
import { PrimaryButton } from "../buttons/primary-button";
import { SecondaryButton } from "../buttons/secondary-button";
import InputCheck from "../inputs/input-check";

export default function PermissionModal() {
    return (
        <CommonModal dialogPanelClass="max-w-3xl" openModel={""} modelTitle={"Permission"}>
            <div className="modal-body">
                <InputCheck size={"sm"} groupClassName={"mb-6"} labelClassName={"text-base"} labelText={"Select All"} />
                <div className="grid grid-cols-3 gap-4">
                    <InputCheck size={"sm"} labelClassName={"text-base"} labelText={"Forms"} />
                    <InputCheck size={"sm"} labelClassName={"text-base"} labelText={"Registration "} />
                    <InputCheck size={"sm"} labelClassName={"text-base"} labelText={"Delete"} />
                    <InputCheck size={"sm"} labelClassName={"text-base"} labelText={"Reports"} />
                    <InputCheck size={"sm"} labelClassName={"text-base"} labelText={"USA-FloExpiryrida"} />
                    <InputCheck size={"sm"} labelClassName={"text-base"} labelText={"Update"} />
                    <InputCheck size={"sm"} labelClassName={"text-base"} labelText={"DPO"} />
                    <InputCheck size={"sm"} labelClassName={"text-base"} labelText={"Entities"} />
                    <InputCheck size={"sm"} labelClassName={"text-base"} labelText={"Download Reports"} />
                    <InputCheck size={"sm"} labelClassName={"text-base"} labelText={"Certificates"} />
                    <InputCheck size={"sm"} labelClassName={"text-base"} labelText={"Dashboard"} />
                    <InputCheck size={"sm"} labelClassName={"text-base"} labelText={"Renew"} />
                </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-10">
                <PrimaryButton className="min-w-[120px] sm:min-w-[200px] py-2.5 md:py-3">Save & Continue</PrimaryButton>
                <SecondaryButton className="min-w-[120px] sm:min-w-[200px] py-2.5 md:py-3">Reset</SecondaryButton>
            </div>
        </CommonModal>
    );
}

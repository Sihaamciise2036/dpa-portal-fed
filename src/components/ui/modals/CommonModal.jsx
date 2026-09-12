import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import Divider from "../divider";

const CommonModal = ({ modelTitle, openModel, handleModelClose, dialogPanelClass, titleClassName, addonsClass = "", modelHeaderHide = false, children }) => {
    return (
        <>
            <Dialog open={openModel ? true : false} as="div" className="relative focus:outline-none" onClose={() => handleModelClose()}>
                <DialogBackdrop className="fixed inset-0 z-[100] bg-primary/80" />
                <div className="fixed inset-0 flex z-[100] items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className={cn(
                            "w-full max-w-xl rounded-xl bg-white border border-light-850/20 p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 max-h-[90%] no-scrollbar overflow-y-auto",
                            dialogPanelClass
                        )}>
                        {!modelHeaderHide && (
                            <>
                                <div className="modal-header flex justify-between gap-4">
                                    <h3 className={cn("modal-title text-xl font-semibold text-primary", titleClassName)}>{modelTitle}</h3>
                                    <button className="modal-close flex-shrink-0" onClick={() => handleModelClose()}>
                                        <X className="size-6" />
                                    </button>
                                </div>
                                <Divider />
                            </>
                        )}
                        {children}
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};

export default CommonModal;

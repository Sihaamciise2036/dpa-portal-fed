import React, { useState, useRef, useEffect } from "react";
import CustomCard from "@/components/common/CustomCard";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import Divider from "@/components/ui/divider";
import { InputSelect } from "@/components/ui/inputs/input-select";
import { Input } from "@/components/ui/inputs/input";
import { InputTextarea } from "@/components/ui/inputs/input-textarea";
import InputRadio from "@/components/ui/inputs/input-radio";
import InputCheck from "@/components/ui/inputs/input-check";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import ErrorMessage from "@/components/common/ErrorMessage";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// Import the default styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function FirstStepFormWidget({ control, errors, getValues, setValue, ...props }) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <CustomCard className="p-6 !border-t-4 !border-t-green">
            <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-primary">Instructions</h2>
                {/* <div className="buttons-wrap flex items-center gap-2">
                    <PrimaryButton>
                        <ChevronLeftIcon />
                    </PrimaryButton>
                    <PrimaryButton>
                        <ChevronRightIcon />
                    </PrimaryButton>
                </div> */}
            </div>
            <div className="card-body">
                <p className="text-red-600 mb-6 font-medium bg-red-50 p-4 rounded-lg border border-red-200">
                    Note: I declare this registration pertains to the Data Controller/Processor with the following level of major importance, as specified in the quidelines above:
                </p>
                <div className="h-[650px] mb-10">
                    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                        <Viewer fileUrl="/assets/pdf/eregstrationGovSomalia.pdf" plugins={[defaultLayoutPluginInstance]} />
                    </Worker>
                </div>
                <Controller
                    control={control}
                    rules={{ required: true }}
                    name={"termsConditionRead"}
                    render={({ field }) => (
                        <InputCheck
                            {...field}
                            size="sm"
                            groupClassName="items-start mb-6"
                            labelText="I confirm that I have read, understood, and agree to all terms outlined in this registration."
                            checked={getValues("termsConditionRead")}
                            errorType={errors?.termsConditionRead?.type}
                        />
                    )}
                />
                <p className="text-base text-light-850 mb-6">
                    I hereby declare that this registration pertains to the Data Controller/Processor with the following level of major importance, as outlined in the guidelines above:
                </p>
                <div className="mb-6">
                    <div className="radio-group flex gap-4 flex-col">
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name="levelType"
                            value={getValues("levelType")}
                            render={({ field }) => (
                                <div className="radio-group flex gap-4 flex-col">
                                    <InputRadio
                                        {...field}
                                        value="1"
                                        checked={field.value == "1"}
                                        size="sm"
                                        groupClassName="gap-2"
                                        labelText={"Major Data Processing - Ultra High Level (MDP-UHL)"}
                                        errorType={errors?.levelType?.type}
                                    />
                                    <InputRadio
                                        {...field}
                                        value="2"
                                        checked={field.value == "2"}
                                        size="sm"
                                        groupClassName="gap-2"
                                        labelText={"Major Data Processing - Extra High Level (MDP-EHL)"}
                                        errorType={errors?.levelType?.type}
                                    />
                                    <InputRadio
                                        {...field}
                                        value="3"
                                        checked={field.value == "3"}
                                        size="sm"
                                        groupClassName="gap-2"
                                        labelText={"Major Data Processing - Ordinary High Level (MDP-OHL)"}
                                        errorType={errors?.levelType?.type}
                                    />
                                </div>
                            )}
                        />
                    </div>
                    {errors?.levelType && <ErrorMessage errorType={errors?.levelType?.type} />}
                </div>

                <p className="text-red-600 mb-6">Nice This option cannot be changed after payment</p>

                <Divider className="my-6" />
                <div className="">
                    <PrimaryButton type="submit">Save and Continue</PrimaryButton>
                </div>
            </div>
        </CustomCard>
    );
}

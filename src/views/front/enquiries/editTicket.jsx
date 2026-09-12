import React, { useState, useRef, useEffect } from "react";
import CustomCard from "@/components/common/CustomCard";
import { fileUpload, getFileUrl } from "@/services/CommonService";
import { addSupportTicketService, getByIdSupportTicketService, getSupportTicketChatService, addSupportTicketChatService } from "@/services/user/SupportTicketServices"; // Replace with your API call
import { SecondaryButton } from "@/components/ui/buttons/secondary-button";
import MainContentPart from "../../../layout/front/MainContentPart";
import { Input } from "@/components/ui/inputs/input";
import { Plus, Send } from "lucide-react";
import { InputTextarea } from "@/components/ui/inputs/input-textarea";
import InputUpload from "@/components/ui/inputs/input-upload";
import { useForm, Controller } from "react-hook-form";
import validationErrors from "@/lib/validationErrors";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import ToastMe from "@/components/ui/ToastMe";

const EnquiriesEditPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const lastMessageRef = useRef(null);
    const {
        register,
        setValue,
        getValues,
        formState: { errors },
        handleSubmit,
        control,
        reset,
        watch,
    } = useForm();
    const [isFormSumbmit, setIsFormSumbmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dataSource, setDataSource] = useState({});
    const [messages, setMessages] = useState([]);
    const uploadFile = watch("uploadFile");

    useEffect(() => {
        // Scroll to the last message when messages update
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleFileUpload = (event, fieldName) => {
        const file_preview = event.target.files[0];
        if (file_preview === "") {
            ToastMe("File is not valid", "error");
            return true;
        }
        if (event.target.files.length === 0 || (event.target.files.length > 0 && event.target.files[0].type.includes("image/") !== true)) {
            ToastMe("Please upload only image files", "error");
            return true;
        }
        dispatch(fileUpload({ file: file_preview }, "supportTicket"))
            .then((res) => {
                var formData = res?.data;
                if (formData) {
                    setValue(fieldName, formData?.fileName);
                }
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
            });
    };

    useEffect(() => {
        formReset();
        if (id && id !== "") {
            getDataById(id);
            getChatDatas(id);
        }
    }, [id]);

    useEffect(() => {
        getChatDatas(id); // initial load

        const interval = setInterval(() => {
        getChatDatas(id); // refresh every 1 minute
        }, 60000); // 60000 ms = 1 min

        return () => clearInterval(interval); // cleanup on unmount
    }, []);

    const formReset = async () => {
        try {
            var formData = getValues();
            for (const key in formData) {
                await setValue(key, "");
            }
            await reset();
            // await setValue("status", "1");
            // await setItemStatus(1);
        } catch (error) {
            console.error("Error in onReset:", error);
        }
    };

    const getDataById = (editId) => {
        setIsLoading(true);
        dispatch(getByIdSupportTicketService(editId))
            .then((res) => {
                setDataSource(res?.data?.data);
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
                navigate("/enquiries");
            });
    };

    const getChatDatas = (editId) => {
        setIsLoading(true);
        dispatch(getSupportTicketChatService(editId))
            .then((res) => {
                setMessages(res?.data?.data);
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
            });
    };

    const onSubmit = (data) => {
        data.senderType = 1;
        data.receiverType = 2;
        data.supportTicketId = id;
        setIsFormSumbmit(true);
        dispatch(addSupportTicketChatService(data))
            .then((res) => {
                setValue("message", "");
                getChatDatas(id);
                setIsFormSumbmit(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsFormSumbmit(false);
            });
    };

    return (
        <MainContentPart>
            <CustomCard className="!border-t-4 !border-t-green p-6">
                <h2 className="text-xl font-semibold text-primary mb-4">Create New Enquiry</h2>
                <div className="mb-6">
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        name={"title"}
                        disabled={true}
                        render={({ field }) => <Input {...field} value={dataSource?.title} labelText="Title" placeholder="Enter Title" errorType={errors?.title?.type} />}
                    />
                </div>
                <div className="mb-6">
                    <Controller
                        control={control}
                        rules={{ required: true, minLength: 5 }}
                        name={"description"}
                        disabled={true}
                        render={({ field }) => (
                            <InputTextarea
                                row="3"
                                {...field}
                                value={dataSource?.description}
                                labelText="Description"
                                placeholder="Enter Description"
                                errorData={{ minLength: "5" }}
                                errorType={errors?.description?.type}
                            />
                        )}
                    />
                </div>
                {dataSource?.uploadFile && dataSource?.uploadFile !== "" ? (
                    <div className="db-image-wrap w-[160px] mb-6">
                        {dataSource?.uploadFile != "" && (dataSource?.uploadFile.includes(".pdf") || dataSource?.uploadFile.includes(".doc") || dataSource?.uploadFile.includes(".docx")) ? 
                            <a href={getFileUrl(dataSource?.uploadFile, "supportTicket")} target="_blank" rel="noopener noreferrer">View File</a> 
                        : 
                            <img className="db-image" alt="slider" src={getFileUrl(dataSource?.uploadFile, "supportTicket")} />
                        }                        
                    </div>
                ) : (
                    <></>
                )}

                <main className="flex flex-col flex-1 h-full max-h-[calc(100vh-200px)]">
                    <header className="bg-blue-600 text-white p-4 shadow-md flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Chat with Support</h1>
                    </header>
                    {/* Messages */}
                    <div id="chatBox" className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[200px]">
                        {messages &&
                            messages.length > 0 &&
                            messages.map((msg, index) => (
                                <div className={`${msg.senderType === 2 ? "flex items-start" : "flex justify-end"}`} key={msg._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
                                    <p className={`${msg.senderType === 2 ? "bg-white shadow px-4 py-2 rounded-lg max-w-md" : "bg-blue-500 text-white px-4 py-2 rounded-lg max-w-md"}`}>
                                        {msg.message}
                                    </p>
                                </div>
                            ))}
                    </div>
                    {/* Input */}
                    <form className="flex items-center gap-2 border-t p-4 bg-white" onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name={"message"}
                            render={({ field }) => (
                                <input {...field} type="text" placeholder="Type a message..." className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            )}
                        />
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                            Send
                        </button>
                    </form>
                </main>
            </CustomCard>
        </MainContentPart>
    );
};

export default EnquiriesEditPage;

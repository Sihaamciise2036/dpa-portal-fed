import CustomCard from "@/components/common/CustomCard";
import { SecondaryButton } from "@/components/ui/buttons/secondary-button";
import { InputIcon } from "@/components/ui/inputs/input-icon";
import { InputPassWord } from "@/components/ui/inputs/input-password";
import InputUpload from "@/components/ui/inputs/input-upload";
import ToastMe from "@/components/ui/ToastMe";
import MainContentPart from "@/layout/front/MainContentPart";
import validationErrors from "@/lib/validationErrors";
import { fileUpload, getFileUrl } from "@/services/CommonService";
import { getByIdUserService, updateUserService } from "@/services/user/UserServices";
import { Mail, Phone, ShieldCheck, User2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authLogout, setUserData } from "@/store/actions";

export default function UserProfilePage(props) {
    const { isAuthenticated, userData } = useSelector((state) => state?.Auth);
    const selectRef = useRef(null);
    const navigate = useNavigate();
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
    const dispatch = useDispatch();
    const [rolesOptionList, setRolesOptionList] = useState([]);
    const [itemStatus, setItemStatus] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isFormSumbmit, setIsFormSumbmit] = useState(false);
    const signaturefileValue = watch("profile_image");

    useEffect(() => {
        formReset();
        if (userData?._id && userData?._id !== "") {
            getDataById(userData?._id);
        }
    }, [userData?._id]);

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

    const handleChangeStatus = (event) => {
        setValue("status", event.target.value);
        setItemStatus(event.target.value);
    };

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
        dispatch(fileUpload({ file: file_preview }, "users"))
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

    const getDataById = (editId) => {
        setIsLoading(true);
        dispatch(getByIdUserService(editId))
            .then((res) => {
                var formData = res?.data?.data;
                for (const key in formData) {
                    if (formData.hasOwnProperty(key) && formData[key] !== "") {
                        setValue(key, formData[key]);
                    } else {
                        setValue(key, "");
                    }
                }
                // if (formData) {
                //     setValue("status", formData.status);
                //     setItemStatus(formData.status);
                // }
                setValue("password", "");
                setValue("confirm_password", "");
                setValue("current_password", "");
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
            });
    };

    const onSubmit = (data) => {
        if (data.confirm_password !== data.password) {
            ToastMe("Password and confirm password not same", "error");
            return true;
        }
        const changingPassword = !!data.password;
        if (changingPassword && !data.current_password) {
            ToastMe("Enter your current password to change your password", "error");
            return true;
        }
        // Empty strings would be sent as real values. Drop the password trio
        // entirely when the user is only editing their details.
        const payload = { ...data };
        if (!changingPassword) {
            delete payload.password;
            delete payload.confirm_password;
            delete payload.current_password;
        }
        setIsFormSumbmit(true);
        dispatch(updateUserService(userData?._id, payload))
            .then((res) => {
                formReset();
                setIsFormSumbmit(false);
                // Changing the password revokes every existing session server
                // side, so the token in the store is already dead. Sign out
                // rather than leaving the portal to 401 on its next request.
                if (changingPassword) {
                    dispatch(authLogout());
                    navigate("/sign-in");
                    return;
                }
                dispatch(setUserData(res?.data));
                navigate("/home");
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsFormSumbmit(false);
            });
    };

    return (
        <MainContentPart>
            <CustomCard className="p-6 !border-t-4 !border-t-green">
                <div className="card-header flex items-center justify-between gap-4 border-b border-light-850/20 pb-4 mb-4">
                    <h2 className="text-xl font-semibold text-primary">Edit User Profile</h2>
                    <p>Lets Us Help You With Accurate Answers</p>
                </div>
                <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="md:col-span-2 md:col-start-2">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Controller
                                    control={control}
                                    rules={{ required: true, minLength: 2, maxLength: 20 }}
                                    name={"name"}
                                    render={({ field }) => (
                                        <InputIcon
                                            {...field}
                                            className="bg-white"
                                            groupClassName="mb-4"
                                            prefixIcon={<User2Icon />}
                                            placeholder="Full Name"
                                            errorData={{ minLength: "2", maxLength: "20" }}
                                            errorType={errors?.name?.type}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ }}
                                    name={"email"}
                                    render={({ field }) => (
                                        <InputIcon {...field} className="bg-white" groupClassName="mb-4" prefixIcon={<Mail />} placeholder="Email" errorType={errors?.email?.type} />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/, minLength: 10, maxLength: 12 }}
                                    name={"phone_no"}
                                    render={({ field }) => (
                                        <InputIcon
                                            {...field}
                                            className="bg-white"
                                            groupClassName="mb-4"
                                            prefixIcon={<Phone />}
                                            placeholder="Number"
                                            errorData={{ minLength: "10", maxLength: "12" }}
                                            errorType={errors?.phone_no?.type}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ minLength: 6, maxLength: 20 }}
                                    name={"password"}
                                    render={({ field }) => (
                                        <InputPassWord
                                            {...field}
                                            className="bg-white"
                                            groupClassName="mb-4"
                                            prefixIcon={<ShieldCheck />}
                                            placeholder="New Password (leave blank to keep current)"
                                            errorData={{ minLength: "6", maxLength: "20" }}
                                            errorType={errors?.password?.type}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ minLength: 6, maxLength: 20 }}
                                    name={"confirm_password"}
                                    render={({ field }) => (
                                        <InputPassWord
                                            {...field}
                                            className="bg-white"
                                            groupClassName="mb-4"
                                            prefixIcon={<ShieldCheck />}
                                            placeholder="Confirm Password"
                                            errorData={{ minLength: "6", maxLength: "20" }}
                                            errorType={errors?.confirm_password?.type}
                                        />
                                    )}
                                />
                                {/* The API re-authenticates before it will change a
                                    password, so this has to be collected here. */}
                                <Controller
                                    control={control}
                                    rules={{ required: !!watch("password"), maxLength: 128 }}
                                    name={"current_password"}
                                    render={({ field }) => (
                                        <InputPassWord
                                            {...field}
                                            className="bg-white"
                                            groupClassName="mb-4"
                                            prefixIcon={<ShieldCheck />}
                                            placeholder="Current Password (required to change password)"
                                            errorData={{ maxLength: "128" }}
                                            errorType={errors?.current_password?.type}
                                        />
                                    )}
                                />
                                <div className={"grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 mt-8"}>
                                    <Controller
                                        control={control}
                                        name={"profile_image_temp"}
                                        render={({ field }) => (
                                            <div className="relative w-[160px] h-[160px] border border-dashed border-gray-300 rounded flex items-center justify-center bg-white shadow-md p-2">
                                                {getValues("profile_image") && getValues("profile_image") !== "" ? (
                                                    <>
                                                        <img className="db-image object-contain max-w-full max-h-full" alt="slider" src={getFileUrl(getValues("profile_image"), "users")} />
                                                        <button
                                                            type="button"
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs"
                                                            onClick={() => setValue("profile_image", "")}>
                                                            Remove
                                                        </button>
                                                    </>
                                                ) : (
                                                    <InputUpload
                                                        {...field}
                                                        id="profile_image"
                                                        labelText="Upload Profile Picture"
                                                        onChange={(e) => handleFileUpload(e, "profile_image")}
                                                        accept="image/png, image/jpeg, image/jpg"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>
                                <SecondaryButton type="submit" disabled={isFormSumbmit || isLoading ? true : false} className="text-base xl:text-xl py-3.5 px-6 w-full mb-6 mt-6">
                                    Update
                                    {isFormSumbmit ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <></>
                                    )}
                                </SecondaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </CustomCard>
        </MainContentPart>
    );
}

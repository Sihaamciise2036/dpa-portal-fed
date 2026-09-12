import React, { useState, useEffect, useRef } from "react";
import MainLogo from "../../components/icons/mainLogo";
import Divider from "@/components/ui/divider";
import InputCheck from "@/components/ui/inputs/input-check";
import { Input } from "@/components/ui/inputs/input";
import { InputPassWord } from "@/components/ui/inputs/input-password";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import validationErrors from "@/lib/validationErrors";
import { registerAuthService, getGeneralSettingStoreAfterLoginService } from "@/services/user/UserAuthServices";
import { authLogin } from "@/store/actions";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { GeneralSettingList } from "@/constants/GeneralSettingConstant";
import Moment from "moment";
import ToastMe from "@/components/ui/ToastMe";
import TermConditionModal from "@/components/ui/modals/TermConditionModal";

export default function RegisterPage(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [temrmsModalOpen, setTemrmsModalOpen] = useState(false);
    const { isAuthenticated, userData } = useSelector((state) => state?.Auth);
    const { todayDateUpdate, deviceToken, generalSetting } = useSelector((state) => state?.GeneralSetting);
    const {
        register,
        setValue,
        getValues,
        formState: { errors },
        handleSubmit,
        control,
        reset,
    } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [isActiveCheck, setIsActiveCheck] = useState(false);
    const [isActiveKey, setIsActiveKey] = useState("");

    useEffect(() => {
        if (isAuthenticated && isAuthenticated === true && userData && userData?.id) {
            navigate(`/home`);
        }
        setValue("email", "");
        if (todayDateUpdate && todayDateUpdate != "" && todayDateUpdate == Moment.utc().format("DD/MM/YYYY")) {
        } else {
            dispatch(getGeneralSettingStoreAfterLoginService({ key_list: GeneralSettingList }))
                .then((res) => {})
                .catch(() => {});
        }
    }, []);

    const handleTermsConditon = (e) => {
        if (e.target.checked) {
            setTemrmsModalOpen(true);
        } else {
            setTemrmsModalOpen(false);
        }
    };

    const onSubmit = async (data) => {
        if (data.confirm_password !== data.password) {
            ToastMe("Password and confirm password not same", "error");
            return true;
        }
        data.device_token = deviceToken ?? "";
        data.status = 4;
        setIsLoading(true);
        dispatch(registerAuthService(data))
            .then((res) => {
                reset();
                navigate(`/verify-otp`);
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
            });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-3">
            <div className="lg:col-span-3 xl:col-span-2 right-part">
                <div
                    className="bg-center bg-no-repeat h-full px-4 sm:px-6 py-10 lg:p-10 lg:flex flex-col lg:items-start lg:justify-between bg-primary max-lg:bg-contain min-h-[350px]"
                    style={{ backgroundImage: "url('/assets/images/auth/auth-bg.png')" }}>
                    <Link href={"/home"} className="hidden">
                        <div className="logo-part flex items-center justify-between gap-4 mb-6">
                            <img className="w-auto h-[78px] flex-shrink-0" src={"/assets/images/logo/primary-logo.webp"} alt="logo" />
                            <img className="w-auto h-[78px] flex-shrink-0" src={"/assets/images/logo/secondary-logo.webp"} alt="logo" />
                        </div>
                    </Link>
                    <h2 className={"text-white text-2xl font-semibold !leading-normal mt-auto max-lg:hidden"}>
                        Set your Partener <br />
                        Recruitment on Auto Pilot
                    </h2>
                </div>
            </div>
            <div className="lg:col-span-2 xl:col-span-1 left-part lg:max-h-screen lg:min-h-screen max-lg:max-w-[600px] max-lg:mx-auto">
                <div className="flex flex-col h-full">
                    <div className="logo-part px-6 pt-6 xl:px-10 2xl:px-16 2xl:pt-10 ">
                        <Link href={"/home"} className="">
                            <div className="logo-part flex items-center justify-between gap-4  mb-6">
                                <img className="w-auto h-[78px] flex-shrink-0" src={"/assets/images/logo/primary-logo.webp"} alt="logo" />
                                <img className="w-auto h-[78px] flex-shrink-0" src={"/assets/images/logo/secondary-logo.webp"} alt="logo" />
                            </div>
                        </Link>
                    </div>
                    <div className="lg:pt-10 px-6 2xl:pt-16 2xl:px-16 py-10 xl:px-10 lg:overflow-y-auto">
                        <div className="">
                            <h1 className={"mb-5 text-primary text-3xl xl:text-4xl font-bold"}>Sign Up</h1>
                            <h3 className={"mb-3 text-lg lg:text-xl font-semibold"}>Create your account</h3>
                            <p className="text-light-850">Thank you for getting back to Data Protection Authority, Lets access our the best recommendation contact for you.</p>
                            <Divider />
                            <div className="">
                                <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
                                    <Controller
                                        control={control}
                                        rules={{ required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ }}
                                        name="email"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                groupClassName="mb-4"
                                                type="email"
                                                labelText={"Email"}
                                                labelClassName="2xl:text-base"
                                                placeholder="Enter your Email"
                                                errorType={errors?.email?.type}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true, minLength: 6, maxLength: 20 }}
                                        name="password"
                                        render={({ field }) => (
                                            <InputPassWord
                                                {...field}
                                                type="password"
                                                labelClassName="2xl:text-base"
                                                groupClassName="mb-4"
                                                labelText={"Password"}
                                                placeholder="Enter your Password"
                                                autoComplete="off"
                                                errorData={{ minLength: "6", maxLength: "20" }}
                                                errorType={errors?.password?.type}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true, minLength: 6, maxLength: 20 }}
                                        name={"confirm_password"}
                                        render={({ field }) => (
                                            <InputPassWord
                                                {...field}
                                                type="password"
                                                labelClassName="2xl:text-base"
                                                groupClassName="mb-6"
                                                labelText={"Confirm Password"}
                                                placeholder="Enter your Confirm Password"
                                                autoComplete="off"
                                                errorData={{ minLength: "6", maxLength: "20" }}
                                                errorType={errors?.confirm_password?.type}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        name={"terms_condition"}
                                        render={({ field }) => (
                                            <InputCheck
                                                {...field}
                                                size={"sm"}
                                                groupClassName="mb-6"
                                                onClick={(e) => handleTermsConditon(e)}
                                                labelText={<div className="text-blue-600 hover:underline cursor-pointer">I accept Terms & Conditions</div>}
                                                errorType={errors?.terms_condition?.type}
                                            />
                                        )}
                                    />
                                    <PrimaryButton className="w-full py-3.5 mb-6 xl:text-xl uppercase" type="submit" isLoading={isLoading} disabled={isLoading}>
                                        Sign Up
                                    </PrimaryButton>
                                </form>
                                <p className="text-light-850 text-center">
                                    Alredy account?{" "}
                                    <Link to={"/sign-in"} className="text-primary font-semibold">
                                        Sing In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <TermConditionModal openModel={temrmsModalOpen} handleModelClose={setTemrmsModalOpen} />
        </div>
    );
}

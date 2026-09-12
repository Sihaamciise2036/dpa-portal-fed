import React, { useEffect, useState } from "react";
import Divider from "@/components/ui/divider";
import { Input } from "@/components/ui/inputs/input";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { verifyTokenAuthService } from "@/services/user/UserAuthServices";
import validationErrors from "@/lib/validationErrors";

const VerifyEmailPage = () => {
    const {
        register,
        setValue,
        getValues,
        formState: { errors },
        handleSubmit,
        control,
        reset,
    } = useForm();
    const { isAuthenticated, userData, pageName } = useSelector((state) => state?.Auth);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        if (!userData || !pageName || (pageName && pageName != "FORGOT_PASSWORD")) {
            navigate(`/sign-in`);
        }
    }, []);

    const onSubmit = (data) => {
        setIsLoading(true);
        data.email = userData?.email;
        dispatch(verifyTokenAuthService(data))
            .then(() => {
                reset();
                navigate(`/reset-password`);
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
                    className="bg-center bg-no-repeat h-full px-4 sm:px-6 py-10 lg:p-10 lg:flex flex-col lg:items-start lg:justify-between bg-primary"
                    style={{ backgroundImage: "url('/assets/images/auth/auth-bg.png')" }}>
                    <Link href={"/home"} className="lg:hidden">
                        <div className="logo-part flex items-center justify-between gap-4 mb-6">
                            <img className="w-auto h-[78px] flex-shrink-0" src={"/assets/images/logo/primary-logo.webp"} alt="logo" />
                            <img className="w-auto h-[78px] flex-shrink-0" src={"/assets/images/logo/secondary-logo.webp"} alt="logo" />
                        </div>
                    </Link>
                    <h2 className={"text-white !leading-normal mt-auto"}>
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
                            <h1 className={"mb-5 text-primary text-3xl xl:text-4xl font-bold"}>Verify Email</h1>
                            <p className="text-light-850">Thank you for getting back to Data Protection Authority, Lets access our the best recommendation contact for you.</p>
                            <Divider />
                            <div className="">
                                <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
                                    <Controller
                                        control={control}
                                        rules={{ required: true, pattern: /^[0-9]+$/, minLength: 6, maxLength: 6 }}
                                        name="token"
                                        render={({ field }) => (
                                            <Input {...field} groupClassName="mb-4" type="text" labelText={"OTP Code"} errorData={{ minLength: "6", maxLength: "6" }} errorType={errors?.token?.type} />
                                        )}
                                    />
                                    <PrimaryButton size="auto" variant="asLink" className="mb-6 mt-2">
                                        Resend code
                                    </PrimaryButton>
                                    <PrimaryButton className="w-full py-3.5 xl:text-xl uppercase" type="submit" isLoading={isLoading} disabled={isLoading}>
                                        Continue
                                    </PrimaryButton>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;

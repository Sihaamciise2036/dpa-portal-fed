import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import validationErrors from "@/lib/validationErrors";
import ecitizenReturnUrl from "@/lib/ecitizenReturn";
import { logoutAuthService } from "@/services/user/UserAuthServices";
import { ArrowLeftIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";

const MainHeader = ({ title, isTabBarShow, selectFormType, handleFormTypeChange, selectListing, handleTypeChange, setAdminSideDrawer, adminSideDrawer, ...props }) => {
    const dispatch = useDispatch();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Empty for anyone who signed in with this portal's own form — they have no
    // eCitizen session behind them, so no eCitizen control is drawn for them.
    // Read from this portal's own signed token, never from the URL.
    const backToEcitizen = useMemo(() => ecitizenReturnUrl(), []);

    const logoutUser = () => {
        setIsLoggingOut(true);
        dispatch(logoutAuthService())
            .then(() => {
                setIsLoggingOut(false);
            })
            .catch(({ message, errorData }) => {
                validationErrors(errorData, message);
                setIsLoggingOut(false);
            });
    };

    return (
        <>
            <header className="header-main front-glass-header mt-4 mx-4 sm:mx-6 py-4 px-6 sm:px-10">
                <div className="flex items-center gap-4">
                    <div className="header-title flex items-center gap-4 flex-grow font-poppins">
                        <PrimaryButton variant="asLink" className="text-primary flex-shrink-0 p-0" onClick={() => setAdminSideDrawer(!adminSideDrawer)}>
                            <MenuIcon className="size-6" />
                        </PrimaryButton>
                        <div className="">
                            <h2 className="text-xl lg:text-2xl font-medium text-primary uppercase">Welcome Client!</h2>
                            <p className="text-base text-light-850 font-normal">Begin your registration by simply selecting the form that aligns with your goals.</p>
                        </div>
                    </div>
                    {/*
                        Back to eCitizen — shown only for a session that began
                        there, and deliberately NOT a logout: it navigates away
                        and leaves both sessions standing, so a citizen who comes
                        back is still signed in on either side.

                        A button that navigates, not the router's `to`: the
                        destination is another application on another origin and
                        the SPA router cannot reach it. `outline` keeps Log Out
                        the only filled control here, which is the smallest
                        change that fits the existing design.
                    */}
                    {backToEcitizen && (
                        <PrimaryButton
                            type="button"
                            variant="outline"
                            /* `normal-case` undoes the button base's `capitalize`,
                               which renders the brand as "ECitizen". */
                            className="flex-shrink-0 gap-2 rounded-full px-5 normal-case"
                            title="Return to eCitizen"
                            onClick={() => {
                                window.location.assign(backToEcitizen);
                            }}>
                            <ArrowLeftIcon className="size-5" />
                            <span className="max-sm:hidden">Back to eCitizen</span>
                        </PrimaryButton>
                    )}
                    <PrimaryButton
                        type="button"
                        onClick={logoutUser}
                        disabled={isLoggingOut}
                        isLoading={isLoggingOut}
                        className="flex-shrink-0 gap-2 rounded-full px-5"
                        title="Log Out">
                        <LogOutIcon className="size-5" />
                        <span className="max-sm:hidden">Log Out</span>
                    </PrimaryButton>
                </div>
            </header>
        </>
    );
};

export default MainHeader;

import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLogo from "../../components/icons/mainLogo";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { ecitizenExchangeService } from "@/services/user/EcitizenSsoServices";

/**
 * Where a citizen lands when eCitizen sends them here.
 *
 * The URL carries a one-time code and nothing else — no eCitizen token, no
 * identity, no attributes a browser could edit. This screen trades it for an
 * ordinary DPA session and then gets out of the way: what it navigates to is the
 * service the citizen actually chose, and from that point the portal behaves
 * exactly as it does for someone who signed in with the form.
 *
 * `redirectTo` comes from the server, which read it from the code's own record,
 * so a citizen cannot be steered somewhere else by editing the address bar.
 * Nothing here reads a path from the query string.
 */
export default function EcitizenCallbackPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [error, setError] = useState("");

    // The code works once. An effect that ran twice — a double-invoked effect,
    // a re-render, a fast refresh — would burn it on the first call and fail on
    // the second, which would look to the citizen like a broken link.
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        const code = params.get("code");

        if (!code) {
            setError("This sign-in link is incomplete. Start again from eCitizen.");
            return;
        }

        dispatch(ecitizenExchangeService({ code }))
            .then((res) => {
                navigate(res?.data?.redirectTo || "/home", { replace: true });
            })
            .catch(({ message }) => {
                setError(message || "This sign-in link could not be used. Start again from eCitizen.");
            });
    }, [dispatch, navigate, params]);

    return (
        <main className="auth-liquid-shell">
            <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
                <MainLogo className="h-10 w-auto text-primary" />

                {error ? (
                    <>
                        <h1 className="text-lg font-semibold text-primary">Sign-in could not be completed</h1>
                        {/* The server's own sentence. A sign-in link expires after a
                            minute and can be used once, so "expired or already used"
                            is usually the true answer and the citizen can act on it. */}
                        <p className="text-sm text-gray-600">{error}</p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <PrimaryButton to="/sign-in">Sign in to the DPA portal</PrimaryButton>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-lg font-semibold text-primary">Signing you in</h1>
                        <p className="text-sm text-gray-600">
                            The Somalia Data Protection Authority is confirming your eCitizen identity.
                        </p>
                        <svg
                            className="h-6 w-6 animate-spin text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            role="img"
                            aria-label="Signing in"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </>
                )}
            </div>
        </main>
    );
}

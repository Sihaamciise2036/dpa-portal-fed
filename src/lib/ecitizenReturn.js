import { jwtDecode } from "jwt-decode";

/**
 * Whether this DPA session began at eCitizen, and where "Back to eCitizen"
 * should send the citizen.
 *
 * ## Why the token decides, and not the URL
 *
 * The answer is read from `idp` on **this portal's own JWT** — a claim this
 * server put there when it issued the session, on a token it signed. A query
 * parameter (`?from=ecitizen`, `?returnUrl=...`) is written by whoever composed
 * the link, so anyone could make the portal offer a "return" to an address of
 * their choosing. That is the open-redirect this file exists to avoid.
 *
 * The destination is configuration too, never anything the browser supplied:
 * one `REACT_APP_ECITIZEN_RETURN_URL`, read here and nowhere else, so no
 * component carries a hard-coded host. Unset it and the action simply does not
 * appear — the portal shows no control it cannot honour.
 *
 * This is **not** a logout. It navigates away; the DPA session stays exactly as
 * it was, and so does the citizen's eCitizen session. Leaving a building is not
 * handing back your keys, and a citizen who returns to DPA should still be
 * signed in.
 */

const RETURN_URL = (import.meta.env.REACT_APP_ECITIZEN_RETURN_URL || "").trim();

/**
 * The configured destination, but only if it is an absolute http(s) address.
 *
 * Checked even though it is our own configuration: a typo that produced a
 * relative or `javascript:` value would otherwise become a link on an
 * authenticated page.
 */
function safeReturnUrl() {
    if (!RETURN_URL) return "";

    try {
        const url = new URL(RETURN_URL);
        return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch {
        return "";
    }
}

/**
 * `""` unless this session came from eCitizen *and* a destination is configured.
 *
 * A citizen who signed in with the DPA form gets no eCitizen control anywhere in
 * this portal — there is no eCitizen session behind them to return to.
 */
export function ecitizenReturnUrl() {
    const token = localStorage.getItem("jwt_token");
    if (!token) return "";

    try {
        return jwtDecode(token)?.idp === "ecitizen" ? safeReturnUrl() : "";
    } catch {
        // An unreadable token is not an eCitizen session. The portal's own auth
        // provider deals with the token being invalid; this only declines to
        // offer the action.
        return "";
    }
}

export default ecitizenReturnUrl;

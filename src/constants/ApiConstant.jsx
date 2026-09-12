// Vite exposes env vars on import.meta.env (process is not defined in the
// browser). vite.config.js widens envPrefix to include REACT_APP_, so the
// existing .env names carry over from create-react-app unchanged; the VITE_
// fallbacks let new deployments use the conventional prefix.
// Falling back to "/api" rather than "" matters in production. A built bundle
// does not load .env.development, so with an empty base every request went to
// the site's own origin without the /api prefix — "/user/auth/login" — which
// the static host answered with 405 instead of ever reaching Express.
//
// "/api" is same-origin and matches where the API is actually served: the
// Vercel function in api/index.js, which mounts the identical Express app
// whose routes all live under /api. Set REACT_APP_API_BASE_URL to an absolute
// URL to point the portal at an API on a different host instead.
const configured = import.meta.env.REACT_APP_API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = configured && configured.trim() !== "" ? configured.replace(/\/+$/, "") : "/api";
export const APP_ENVIRONMENT = import.meta.env.REACT_APP_APP_ENV ?? import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE;

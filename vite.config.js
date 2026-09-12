import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
    return {
        plugins: [react()],

        resolve: {
            // Mirrors the "@/*" -> "src/*" mapping that config-overrides.js
            // used to inject into the CRA webpack config, and jsconfig.json.
            alias: {
                "@": path.resolve(__dirname, "src"),
            },
        },

        // Expose the create-react-app variable names on import.meta.env
        // alongside Vite's own, so the existing .env files keep working
        // without being renamed. (Vite only exposes prefixed vars, and only
        // via import.meta.env — process.env does not exist in the browser,
        // and a `define` for it is not applied by the dev server.)
        envPrefix: ["VITE_", "REACT_APP_"],

        optimizeDeps: {
            // The dependency scanner globs the project for entry points. Left
            // to itself it also walks node_modules.repair-backup/ — a stray
            // copy of a dependency tree sitting next to node_modules — which
            // added ~40s to the first page load and reported phantom missing
            // dependencies (e.g. "lighthouse") from packages this app never
            // imports. Pointing it at the real entries avoids all of that.
            entries: ["index.html", "src/**/*.{js,jsx}"],
        },

        server: {
            // 3200, not CRA's 3000.
            //
            // eCitizen's own web dev server also defaults to 3000, and when both
            // ran the second one to start lost — or worse, won, and eCitizen
            // answered the DPA callback URL, so a citizen handed over from
            // eCitizen landed back on eCitizen's login page and never saw this
            // portal at all.
            //
            // The two must therefore differ, and it is this one that moves:
            // eCitizen is the platform citizens arrive at. Three settings name
            // this port and have to agree — `server.port` here, CLIENT_ORIGINS
            // and PORTAL_BASE_URL in server/.env, and DPA_PORTAL_BASE_URL on the
            // eCitizen API.
            port: 3200,
            // Fail loudly rather than silently taking the next free port: a
            // portal quietly on 3201 would break the callback in a way that
            // looks like a broken sign-in.
            strictPort: true,
            open: false,
            watch: {
                // Same stray tree — do not burn file watchers on it.
                ignored: ["**/node_modules.*/**", "**/dist/**", "**/build/**"],
            },
        },

        preview: {
            port: 3200,
            strictPort: true,
        },

        build: {
            // "dist" is Vite's default and what Vercel looks for with no
            // configuration at all. This was "build" — CRA's folder, kept when
            // the app moved to Vite — which meant every deploy depended on
            // vercel.json's outputDirectory being read and on no dashboard
            // setting contradicting it. Nothing else consumes this folder: the
            // Express app serves only /api and there are no other deploy
            // steps, so the CRA name bought nothing and cost a failed build.
            outDir: "dist",
            sourcemap: mode !== "production",
            rollupOptions: {
                output: {
                    // Everything otherwise lands in one ~4.8 MB chunk. Split the
                    // heavy, rarely-changing vendors out so an app change does
                    // not force the whole bundle to be re-downloaded.
                    //
                    // Matched on module id rather than package name: several of
                    // these (firebase especially) are only imported by subpath
                    // and expose no root "." entry for rollup to resolve.
                    manualChunks(id) {
                        if (!id.includes("node_modules")) return;
                        // Windows ids use backslash separators; normalise them
                        // without embedding a literal escape in this config.
                        const BACKSLASH = String.fromCharCode(92);
                        const tail = id.split("node_modules").pop().split(BACKSLASH).join("/");
                        const seg = tail.split("/").filter(Boolean);
                        if (!seg.length) return;
                        const pkg = seg[0].startsWith("@") ? seg[0] + "/" + (seg[1] || "") : seg[0];
                        if (["react", "react-dom", "react-router", "react-router-dom", "scheduler"].includes(pkg)) return "react";
                        if (pkg === "redux" || pkg === "react-redux" || pkg === "redux-persist" || pkg === "redux-logger" || pkg.startsWith("@reduxjs/")) return "redux";
                        if (pkg === "apexcharts" || pkg === "react-apexcharts") return "charts";
                        if (pkg === "pdfjs-dist" || pkg === "html2pdf.js" || pkg === "html2canvas" || pkg === "jspdf" || pkg.startsWith("@react-pdf-viewer/")) return "pdf";
                        if (pkg === "firebase" || pkg.startsWith("@firebase/")) return "firebase";
                        // No catch-all "vendor" group: the remaining packages
                        // depend both ways on the ones above, which rollup
                        // reports as a circular chunk. Leave them in the entry.
                        return;
                    },
                },
            },
        },

        test: {
            // react-scripts test is gone; vitest reads this block.
            environment: "jsdom",
            globals: true,
            setupFiles: "./src/setupTests.js",
            css: true,
            // node_modules.repair-backup/ is a stray copy of a dependency tree.
            // It does not match the default "**/node_modules/**" exclude, so
            // without this vitest walks the whole thing during file discovery
            // and appears to hang before running a single test.
            exclude: ["**/node_modules/**", "**/node_modules.*/**", "**/dist/**", "**/build/**", "**/.git/**", "**/server/**"],
        },
    };
});

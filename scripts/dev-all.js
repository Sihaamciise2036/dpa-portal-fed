// Starts the API and the Vite dev server together, so `npm run dev:all` is a
// single command on Windows and POSIX alike. Deliberately dependency-free:
// adding concurrently/npm-run-all for two child processes is not worth it.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

// --local runs the API against a throwaway in-memory database instead of Atlas.
const local = process.argv.includes("--local");
const targets = [
    { name: "api", cwd: resolve(root, "server"), args: ["run", local ? "dev:local" : "dev"] },
    { name: "web", cwd: root, args: ["run", "dev"] },
];

const children = targets.map(({ name, cwd, args }) => {
    const child = spawn(npm, args, { cwd, stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32" });
    for (const stream of [child.stdout, child.stderr]) {
        stream.setEncoding("utf8");
        let buffer = "";
        stream.on("data", (chunk) => {
            buffer += chunk;
            const lines = buffer.split("\n");
            buffer = lines.pop();
            for (const line of lines) console.log(`[${name}] ${line}`);
        });
    }
    child.on("exit", (code) => {
        console.log(`[${name}] exited with code ${code}`);
        stopAll();
    });
    return child;
});

let stopping = false;
function stopAll() {
    if (stopping) return;
    stopping = true;
    for (const child of children) if (!child.killed) child.kill();
    setTimeout(() => process.exit(1), 3000).unref();
}
process.on("SIGINT", stopAll);
process.on("SIGTERM", stopAll);

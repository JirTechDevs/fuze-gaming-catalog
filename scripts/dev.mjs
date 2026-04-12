import { spawn } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const nextCachePath = resolve(projectRoot, ".next");

if (existsSync(nextCachePath)) {
  rmSync(nextCachePath, { recursive: true, force: true });
}

const nextBinPath = resolve(projectRoot, "node_modules", "next", "dist", "bin", "next");
const child = spawn(
  process.execPath,
  [nextBinPath, "dev", "--turbopack", ...process.argv.slice(2)],
  {
  stdio: "inherit",
  cwd: projectRoot,
  env: process.env,
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

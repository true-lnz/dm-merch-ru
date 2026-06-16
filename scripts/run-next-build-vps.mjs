import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const shouldIgnoreBuildErrors = process.argv.includes("--ignore-build-errors");
const baseEnv = {
  ...process.env,
  PAYLOAD_SKIP_SQLITE_ENSURE: "true",
  ...(shouldIgnoreBuildErrors ? { NEXT_IGNORE_BUILD_ERRORS: "true" } : {}),
};

function runBuildPhase(mode) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["--max-old-space-size=1536", nextBin, "build", "--webpack", "--experimental-build-mode", mode], {
      env: baseEnv,
      stdio: "inherit",
    });

    child.on("exit", (code, signal) => {
      if (signal) {
        process.kill(process.pid, signal);
        return;
      }

      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`next build phase "${mode}" failed with exit code ${code ?? 1}`));
    });
  });
}

await runBuildPhase("compile");
await runBuildPhase("generate");

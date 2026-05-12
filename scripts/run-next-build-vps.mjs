import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const shouldIgnoreBuildErrors = process.argv.includes("--ignore-build-errors");

const child = spawn(process.execPath, ["--max-old-space-size=1536", nextBin, "build"], {
  env: {
    ...process.env,
    PAYLOAD_SKIP_SQLITE_ENSURE: "true",
    ...(shouldIgnoreBuildErrors ? { NEXT_IGNORE_BUILD_ERRORS: "true" } : {}),
  },
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

import { getPayload } from "payload";

const projectRoot = process.cwd();
const dbPath = path.join(projectRoot, "dm-merch.db");
const backupsDir = path.join(projectRoot, "backups", "db");

function runStep(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env: process.env,
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`Команда завершилась с ошибкой: ${command} ${args.join(" ")}`);
  }
}

function formatTimestamp(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    "-",
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function backupDatabase(): string | null {
  if (!fs.existsSync(dbPath)) {
    return null;
  }

  fs.mkdirSync(backupsDir, { recursive: true });

  const backupPath = path.join(backupsDir, `dm-merch.${formatTimestamp(new Date())}.db`);
  fs.copyFileSync(dbPath, backupPath);

  return backupPath;
}

function resolveRestoreSourcePath(latestBackupPath: string | null): string | null {
  const overridePath = process.env.PAYLOAD_RESTORE_BACKUP_PATH?.trim();

  if (overridePath) {
    return path.resolve(projectRoot, overridePath);
  }

  return latestBackupPath;
}

async function initializeSchema() {
  process.env.PAYLOAD_PUSH_SCHEMA = "true";

  const { default: config } = await import("../src/payload.config.ts");
  const payload = await getPayload({ config });

  await payload.destroy();
}

async function main() {
  const backupPath = backupDatabase();
  const restoreSourcePath = resolveRestoreSourcePath(backupPath);

  if (fs.existsSync(dbPath)) {
    fs.rmSync(dbPath, { force: true });
  }

  await initializeSchema();

  if (restoreSourcePath) {
    runStep("node", ["--experimental-strip-types", "scripts/restore-users-and-media.ts", restoreSourcePath]);
  }

  runStep("node", ["--experimental-strip-types", "scripts/import-site-info-to-payload.ts"]);
  runStep("node", ["--experimental-strip-types", "scripts/import-cases-to-payload.ts"]);
  runStep("node", ["--experimental-strip-types", "scripts/sync-merged-catalog-taxonomy.ts"]);
  runStep("node", ["--experimental-strip-types", "scripts/import-pages-and-posts-to-payload.ts"]);

  if (backupPath) {
    console.log(`Backup created: ${backupPath}`);
  } else {
    console.log("Backup skipped: source database not found");
  }

  if (restoreSourcePath && restoreSourcePath !== backupPath) {
    console.log(`Restore source: ${restoreSourcePath}`);
  }

  console.log(`Database rebuilt: ${dbPath}`);
}

await main();

import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const API_KEY = process.env.PORTOBELLO_API_KEY?.trim() || "tg3hvtbQDRDqWxTRe5NRvrmj1oGZfQiOUxuwAXcE";
const OUTPUT_DIR = join(process.cwd(), "public", "_temp", "portobello");
const BUILD_MERGED_CATALOG = process.env.BUILD_MERGED_CATALOG ?? "0";

const FILES = [
  ["catalog.json", "https://php-backend.portobello.ru/api/catalog-json/"],
  ["prices.json", "https://php-backend.portobello.ru/api/catalog-prices-json/"],
  ["stocks.json", "https://php-backend.portobello.ru/api/catalog-stocks-json/"],
];

if (!API_KEY) {
  throw new Error("PORTOBELLO_API_KEY is required.");
}

function buildUrl(baseUrl) {
  const url = new URL(baseUrl);
  url.searchParams.set("apiKey", API_KEY);
  return url;
}

async function downloadJson(fileName, baseUrl) {
  const url = buildUrl(baseUrl);
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download ${fileName}: HTTP ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to parse ${fileName} as JSON: ${error instanceof Error ? error.message : String(error)}`);
  }

  const outputFile = join(OUTPUT_DIR, fileName);
  const tmpFile = `${outputFile}.download`;
  const contents = `${JSON.stringify(parsed, null, 2)}\n`;

  mkdirSync(dirname(outputFile), { recursive: true });
  writeFileSync(tmpFile, contents, "utf8");
  renameSync(tmpFile, outputFile);

  return {
    fileName: basename(outputFile),
    bytes: Buffer.byteLength(contents),
  };
}

async function rebuildMergedCatalog() {
  if (BUILD_MERGED_CATALOG !== "1") {
    return null;
  }

  const { spawn } = await import("node:child_process");

  return await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["scripts/build-merged-catalog.mjs"], {
      cwd: process.cwd(),
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve(true);
        return;
      }

      reject(new Error(`Merged catalog build failed with exit code ${code}.`));
    });
  });
}

const startedAt = Date.now();
const results = [];

for (const [fileName, baseUrl] of FILES) {
  process.stdout.write(`Downloading ${fileName}... `);
  const result = await downloadJson(fileName, baseUrl);
  results.push(result);
  console.log(`${result.bytes} bytes`);
}

await rebuildMergedCatalog();

console.log(
  JSON.stringify(
    {
      outputDir: OUTPUT_DIR,
      files: results,
      elapsedMs: Date.now() - startedAt,
    },
    null,
    2,
  ),
);

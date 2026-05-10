import fs from "node:fs";
import path from "node:path";

const targetPath = path.resolve(process.cwd(), "node_modules", "@nouance", "payload-better-fields-plugin", "dist", "fields", "Slug", "formatSlug.js");

const patchedSource = `const CYRILLIC_TO_LATIN_MAP = {
    '\\u0430': 'a',
    '\\u0431': 'b',
    '\\u0432': 'v',
    '\\u0433': 'g',
    '\\u0434': 'd',
    '\\u0435': 'e',
    '\\u0451': 'e',
    '\\u0436': 'zh',
    '\\u0437': 'z',
    '\\u0438': 'i',
    '\\u0439': 'y',
    '\\u043a': 'k',
    '\\u043b': 'l',
    '\\u043c': 'm',
    '\\u043d': 'n',
    '\\u043e': 'o',
    '\\u043f': 'p',
    '\\u0440': 'r',
    '\\u0441': 's',
    '\\u0442': 't',
    '\\u0443': 'u',
    '\\u0444': 'f',
    '\\u0445': 'h',
    '\\u0446': 'ts',
    '\\u0447': 'ch',
    '\\u0448': 'sh',
    '\\u0449': 'sch',
    '\\u044a': '',
    '\\u044b': 'y',
    '\\u044c': '',
    '\\u044d': 'e',
    '\\u044e': 'yu',
    '\\u044f': 'ya'
};
export const formatSlug = (val)=>val.toLowerCase().replace(/[\\u0430-\\u044f\\u0451]/g, (char)=>CYRILLIC_TO_LATIN_MAP[char] ?? '').replace(/&/g, ' and ').replace(/\\+/g, ' plus ').replace(/[\\n\\r]+/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');
export const formatSlugHook = (fallback)=>({ data, operation, value })=>{
        if (typeof value === 'string') {
            return formatSlug(value);
        }
        if (operation === 'create' || !data?.slug) {
            const fallbackData = data?.[fallback] || data?.[fallback];
            if (fallbackData && typeof fallbackData === 'string') {
                return formatSlug(fallbackData);
            }
        }
        return value;
    };

//# sourceMappingURL=formatSlug.js.map
`;

function main() {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`File not found: ${targetPath}`);
  }

  const current = fs.readFileSync(targetPath, "utf8");

  if (current === patchedSource) {
    console.log("Slug formatter already patched");
    return;
  }

  fs.writeFileSync(targetPath, patchedSource, "utf8");
  console.log("Patched better-fields slug formatter for Cyrillic transliteration");
}

main();

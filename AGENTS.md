## Encoding Safety (mandatory)

- Files containing Cyrillic text dont be unicode symbols.
- Do not rewrite such files with `Set-Content` / `Out-File` unless `-Encoding UTF8` is explicitly provided.
- If shell rewriting is unavoidable, always use explicit UTF-8 output encoding.
- After editing Cyrillic strings, verify there is no mojibake in touched files (examples: `Р`, `С`, `Ð`, `Ñ` inside Russian text).
- Do not run broad repo-wide encoding rewrites unless the user explicitly asks.
- Always read text files with explicit UTF-8 (`Get-Content -Encoding UTF8` or equivalent); never rely on shell default encoding.
- Always write edited text files with explicit UTF-8 (`Set-Content -Encoding UTF8` or UTF8 no BOM via .NET API).
- Before writing, prefer patch-style edits that change only required lines; avoid full-file rewrite when not necessary.
- Never run bulk search/replace over files that may contain Cyrillic unless the user explicitly requests it.
- Do not convert line endings or add/remove BOM unless explicitly requested.

## Payload / SQLite Schema Safety (mandatory)

- This project uses `Payload + SQLite + Drizzle`, so changing `collections` or `globals` changes application expectations immediately, but does not guarantee that `dm-merch.db` schema is already updated.
- When adding or changing fields in Payload configs, assume schema drift is possible between TypeScript config and the real SQLite tables.
- A common failure mode is: code starts selecting a new column before that column exists in SQLite. This causes errors like `no such column`, `not-found`, missing-table errors, or Drizzle/Payload query failures.
- Another common failure mode is SQLite locking: `database is locked` / `SQLITE_BUSY` when the dev server, admin UI, and scripts hit the same `dm-merch.db` file concurrently.

- For any change in `src/collections/**` or `src/globals/**`, treat it as a schema change unless you verified otherwise.
- Do not make hot schema changes and then assume the existing local `dm-merch.db` will keep working without an explicit sync step.
- Before changing code that reads new Payload fields, make sure the database shape can support those fields.
- Prefer backward-compatible schema changes first, then UI/code usage second.

- If adding a new required field to a Payload collection/global, always provide a safe `defaultValue` when possible.
- Avoid introducing new `required` / `NOT NULL` fields without a default on an existing table that already has rows.
- For existing data, plan how old rows/globals will be backfilled before the app starts reading the new field.
- If a field is optional at the database transition stage, prefer making it tolerant in reads until data is populated.

- For local SQLite recovery or setup scripts, prefer adding narrow compatibility guards that ensure missing columns exist before Payload tries to read them.
- If the repo already has import/bootstrap scripts for Payload globals or collections, update those scripts together with the schema change.
- Do not assume `PAYLOAD_PUSH_SCHEMA` alone will be safe on a populated SQLite DB; it may prompt, fail, or break if the app already expects missing columns.
- If schema sync requires touching SQLite directly, do the minimum targeted change and preserve existing data.

- Recommended order for Payload schema changes:
- 1. Update Payload config.
- 2. Add `defaultValue` for new required fields.
- 3. Update fallback mapping/types/read paths so old data does not crash the app.
- 4. Update bootstrap/import/schema-sync scripts if they exist.
- 5. Sync or repair the local SQLite schema.
- 6. Only then verify admin pages and frontend pages that read the changed entity.

- After schema-related changes, verify both:
- 1. Build passes.
- 2. The affected admin route opens successfully, especially for changed globals/collections.

- If an admin/global page starts failing after a schema edit, inspect SQLite schema first before assuming the React/UI code is wrong.
- When errors mention Drizzle, missing columns, missing tables, or `not-found` right after a schema change, first suspect DB/schema mismatch.

# Other

- Payload LLMS in llms.txt

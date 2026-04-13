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

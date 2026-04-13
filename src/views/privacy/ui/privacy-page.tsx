import { PageHeading } from "@/shared/ui/page-heading";
import { promises as fs } from "node:fs";
import path from "node:path";

type PrivacyBlock =
  | { type: "paragraph"; text: string }
  | { type: "table"; rows: string[][] };

type PrivacySection = {
  heading: string;
  blocks: PrivacyBlock[];
};

function normalizeMarkdownText(value: string) {
  return value.replaceAll("\\.", ".").replaceAll("\\-", "-").trim();
}

function parseTableRow(line: string): string[] {
  return line
    .split("|")
    .map((column) => column.trim())
    .filter(Boolean);
}

function isMarkdownTableDivider(columns: string[]) {
  return columns.length > 0 && columns.every((column) => /^:?-+:?$/.test(column));
}

function normalizeSecondColumnCell(value: string) {
  const normalized = normalizeMarkdownText(value);
  if (normalized.startsWith("Федеральный закон")) {
    return normalized;
  }
  return normalized.toLocaleLowerCase("ru-RU");
}

function parsePrivacyMarkdown(content: string) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let title = "Политика конфиденциальности";
  const sections: PrivacySection[] = [];
  let currentSection: PrivacySection | null = null;
  let tableBuffer: string[][] = [];

  const flushTable = () => {
    if (!currentSection || tableBuffer.length === 0) {
      return;
    }

    const filteredRows = tableBuffer.filter((row) => !isMarkdownTableDivider(row));
    if (filteredRows.length > 0) {
      currentSection.blocks.push({
        type: "table",
        rows: filteredRows.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            if (cellIndex === 1 && rowIndex > 0) {
              return normalizeSecondColumnCell(cell);
            }
            return normalizeMarkdownText(cell);
          }),
        ),
      });
    }
    tableBuffer = [];
  };

  const pushSection = () => {
    if (!currentSection) {
      return;
    }

    flushTable();
    sections.push({
      heading: currentSection.heading,
      blocks: currentSection.blocks,
    });
    currentSection = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    if (line.startsWith("#### ")) {
      title = normalizeMarkdownText(line.slice(5));
      continue;
    }

    if (line.startsWith("##### ")) {
      pushSection();
      currentSection = {
        heading: normalizeMarkdownText(line.slice(6)),
        blocks: [],
      };
      continue;
    }

    if (!currentSection) {
      currentSection = {
        heading: "Общие положения",
        blocks: [],
      };
    }

    if (line.startsWith("|")) {
      const row = parseTableRow(line);
      if (row.length > 0) {
        tableBuffer.push(row);
      }
      continue;
    }

    flushTable();
    currentSection.blocks.push({
      type: "paragraph",
      text: normalizeMarkdownText(line),
    });
  }

  pushSection();
  return { title, sections };
}

async function getPrivacyContent() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "policy.md",
  );
  const markdown = await fs.readFile(filePath, "utf8");
  return parsePrivacyMarkdown(markdown);
}

export async function PrivacyPage() {
  const { title, sections } = await getPrivacyContent();

  return (
    <>
      <PageHeading
        title={title}
        breadcrumb={{
          labelFrom: "Главная",
          labelTo: "Политика конфиденциальности",
          href: "/",
        }}
      />

      <section className="my-[32px] md:my-[40px] xl:my-[56px]">
        <div className="max-w-[980px] space-y-8 pb-12 text-sm leading-relaxed text-[var(--text)] md:text-base">
          {sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="font-heading text-xl uppercase leading-tight text-[var(--heading)] md:text-2xl">
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.blocks.map((block, index) =>
                  block.type === "paragraph" ? (
                    <p key={`${section.heading}-p-${index}`} className="m-0">
                      {block.text}
                    </p>
                  ) : (
                    <div key={`${section.heading}-t-${index}`} className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-sm md:text-base">
                        <thead>
                          <tr>
                            {block.rows[0]?.map((cell, cellIndex) => (
                              <th
                                key={`${section.heading}-th-${cellIndex}`}
                                className="border border-[var(--border)] px-3 py-2 font-normal text-[var(--heading)]"
                              >
                                {cell}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.rows.slice(1).map((row, rowIndex) => (
                            <tr key={`${section.heading}-tr-${rowIndex}`}>
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={`${section.heading}-td-${rowIndex}-${cellIndex}`}
                                  className="border border-[var(--border)] px-3 py-2 align-top"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}

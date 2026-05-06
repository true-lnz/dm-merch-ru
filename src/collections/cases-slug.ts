const CYRILLIC_TO_LATIN_MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

export function slugify(value: string) {
  const transliterated = value
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => CYRILLIC_TO_LATIN_MAP[char] ?? "")
    .replace(/&/g, " and ")
    .replace(/\+/g, " plus ")
    .replace(/[\n\r]+/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return transliterated || "item";
}

export function buildCaseCardSlug(item: { company?: unknown; teaser?: unknown }) {
  const company = typeof item.company === "string" ? item.company : "";
  const teaser = typeof item.teaser === "string" ? item.teaser : "";

  return slugify(`${company} ${teaser}`);
}

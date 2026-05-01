const ROOT_CATEGORY_ICON_BY_ID: Record<string, string> = {
  "1104129": "cloth",
  "1104130": "home",
  "1104131": "compas",
  "1104132": "cup",
  "1104133": "pen",
  "1104134": "bag",
  "1104136": "umbrella",
  "1104139": "electronics",
  "1104141": "promo",
  "1104144": "note",
  "1105759": "awards",
  "1105845": "tree",
  "1105888": "unikum",
  "1105899": "holiday",
  "1105994": "box",
  "1107210": "set",
  "1109719": "cloth",
  "1110903": "eat",
  "1111935": "sport",
  "1113918": "label",
  "1120523": "bag",
};

export function getCatalogRootIconId(rootId: string) {
  return ROOT_CATEGORY_ICON_BY_ID[rootId] ?? "set";
}

import type { HomeDigestCardId } from "./home-digest.data";

export type DigestGridLayoutItem = {
  area: string;
  cardId: HomeDigestCardId;
};

type DigestGridConfig = {
  tabletGridTemplateColumns: string;
  tabletGridTemplateAreas: string;
  desktopGridTemplateColumns: string;
  desktopGridTemplateAreas: string;
  items: DigestGridLayoutItem[];
};

export const DIGEST_MOBILE_ORDER: HomeDigestCardId[] = [
  "team",
  "souvenirs",
  "partners",
  "events",
  "uniform",
  "workwear",
];

const DIGEST_GRID_ITEMS: DigestGridLayoutItem[] = [
  { area: "a", cardId: "partners" },
  { area: "b", cardId: "events" },
  { area: "c", cardId: "team" },
  { area: "d", cardId: "souvenirs" },
  { area: "e", cardId: "uniform" },
  { area: "f", cardId: "workwear" },
];

export const DIGEST_GRID_LAYOUT: DigestGridConfig = {
  tabletGridTemplateColumns: "repeat(6, minmax(0, 1fr))",
  tabletGridTemplateAreas: `
    "a a a b b b"
    "c c c c c c"
    "d d d d d d"
    "e e e f f f"
  `,
  desktopGridTemplateColumns: "repeat(12, minmax(0, 1fr))",
  desktopGridTemplateAreas: `
    "a a a b b b c c c c c c"
    "d d d d d d e e e f f f"
  `,
  items: DIGEST_GRID_ITEMS,
};

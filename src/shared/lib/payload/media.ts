type MediaLike =
  | {
      id?: number | string;
      url?: null | string;
      alt?: null | string;
      width?: null | number;
      height?: null | number;
    }
  | number
  | string
  | null
  | undefined;

export type MappedCmsImage = {
  alt: string;
  height: number;
  url: string;
  width: number;
};

export function isPopulatedMedia(value: unknown): value is NonNullable<Exclude<MediaLike, number | string>> {
  return typeof value === "object" && value !== null;
}

export function mapCmsImage(value: unknown, fallbackAlt: string): MappedCmsImage | null {
  if (!isPopulatedMedia(value) || !value.url || !value.width || !value.height) {
    return null;
  }

  return {
    url: value.url,
    alt: value.alt || fallbackAlt,
    width: value.width,
    height: value.height,
  };
}

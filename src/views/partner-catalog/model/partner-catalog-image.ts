const PROJECT111_PREVIEW_IMAGE_SEGMENT = "_1000x1000";
const PROJECT111_PREVIEW_IMAGE_REPLACEMENT = "_200x200";

export function getPartnerCatalogPreviewImageUrl(value: string) {
  if (!value.startsWith("/images/") && !value.startsWith("/gifts_export/")) {
    return value;
  }

  return value.includes(PROJECT111_PREVIEW_IMAGE_SEGMENT)
    ? value.replace(PROJECT111_PREVIEW_IMAGE_SEGMENT, PROJECT111_PREVIEW_IMAGE_REPLACEMENT)
    : value;
}

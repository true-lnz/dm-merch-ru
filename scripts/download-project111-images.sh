#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./project111-export-common.sh
source "$SCRIPT_DIR/project111-export-common.sh"

PRODUCT_XML_PATH="$PROJECT111_CATALOG_DIR/product.xml"

project111_require_downloader
mkdir -p "$PROJECT111_IMAGE_DIR"

project111_print_header "Скачивание изображений Project 111"

if [ ! -f "$PRODUCT_XML_PATH" ]; then
  echo "Не найден $PRODUCT_XML_PATH, сначала скачиваю product.xml..."
  BUILD_MERGED_CATALOG=0 "$SCRIPT_DIR/download-project111-catalog.sh" "product.xml"
fi

echo "Извлекаю пути к изображениям из product.xml..."

node - "$PRODUCT_XML_PATH" <<'NODE' | while IFS= read -r asset_path; do
const fs = require("node:fs");

const xmlPath = process.argv[2];
const xml = fs.readFileSync(xmlPath, "utf8");
const assetPaths = new Set();

for (const match of xml.matchAll(/<(small_image|big_image|super_big_image)[^>]*\ssrc="([^"]+)"/g)) {
  const assetPath = match[2]?.trim();
  if (assetPath) {
    assetPaths.add(assetPath);
  }
}

for (const match of xml.matchAll(/<image>([^<]+)<\/image>/g)) {
  const assetPath = match[1]?.trim();
  if (assetPath) {
    assetPaths.add(assetPath);
  }
}

for (const match of xml.matchAll(/<product_attachment>([\s\S]*?)<\/product_attachment>/g)) {
  const block = match[1];
  const meaning = block.match(/<meaning>([^<]+)<\/meaning>/)?.[1]?.trim();
  const imagePath = block.match(/<image>([^<]+)<\/image>/)?.[1]?.trim();

  if (meaning === "1" && imagePath) {
    assetPaths.add(imagePath);
  }
}

const sortedAssetPaths = [...assetPaths].filter(Boolean).sort((left, right) => left.localeCompare(right));
process.stdout.write(sortedAssetPaths.join("\n"));
NODE
  if [ -z "$asset_path" ]; then
    continue
  fi

  if [[ "$asset_path" =~ \.(mp4|avi|mov|mkv|webm|flv|mp3|wav)$ ]]; then
    echo "Пропускаю видео/аудио: $asset_path"
    continue
  fi

  local_file="${asset_path#/}"
  target_path="$PROJECT111_IMAGE_DIR/$local_file"

  project111_download_relative_path "$asset_path" "$target_path" "skip-existing"
done

echo ""
project111_print_header "Готово! Изображения сохранены в $PROJECT111_IMAGE_DIR"

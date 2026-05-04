#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./project111-export-common.sh
source "$SCRIPT_DIR/project111-export-common.sh"

BUILD_MERGED_CATALOG="${BUILD_MERGED_CATALOG:-1}"

project111_require_downloader
mkdir -p "$PROJECT111_CATALOG_DIR"

if [ "$#" -gt 0 ]; then
  XML_FILES=("$@")
else
  XML_FILES=(
    "product.xml"
    "catalogue.xml"
    "stock.xml"
    "tree.xml"
    "treeWithoutProducts.xml"
    "filters.xml"
    "complects.xml"
  )
fi

project111_print_header "Скачивание XML-каталога Project 111"

for file_name in "${XML_FILES[@]}"; do
  project111_download_relative_path "$file_name" "$PROJECT111_CATALOG_DIR/$file_name" "overwrite"
done

if [ "$BUILD_MERGED_CATALOG" = "1" ]; then
  echo ""
  if command -v pnpm >/dev/null 2>&1; then
    echo "Пересобираю merged-catalog..."
    (
      cd "$PROJECT111_REPO_ROOT"
      pnpm build:merged-catalog
    )
  else
    echo "pnpm не найден, пересборку merged-catalog пропускаю."
  fi
fi

echo ""
project111_print_header "Готово! XML сохранены в $PROJECT111_CATALOG_DIR"

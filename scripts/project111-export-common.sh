#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT111_REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

PROJECT111_LOGIN="${PROJECT111_LOGIN:-90742_xmlexport}"
PROJECT111_PASSWORD="${PROJECT111_PASSWORD:-AlmazUralDM}"
PROJECT111_BASE_URL="${PROJECT111_BASE_URL:-https://api2.gifts.ru/export/v2/catalogue}"
PROJECT111_WAIT_SECONDS="${PROJECT111_WAIT_SECONDS:-0.5}"
PROJECT111_CATALOG_DIR="${PROJECT111_CATALOG_DIR:-$PROJECT111_REPO_ROOT/public/_temp/project111}"
PROJECT111_IMAGE_DIR="${PROJECT111_IMAGE_DIR:-$PROJECT111_REPO_ROOT/public/images}"

project111_print_header() {
  local title="$1"

  echo "========================================="
  echo "$title"
  echo "========================================="
}

project111_require_downloader() {
  if command -v wget >/dev/null 2>&1; then
    PROJECT111_DOWNLOADER="wget"
    return 0
  fi

  if command -v curl >/dev/null 2>&1; then
    PROJECT111_DOWNLOADER="curl"
    return 0
  fi

  echo "Не найден ни wget, ни curl. Установите один из них." >&2
  return 1
}

project111_download_relative_path() {
  local relative_path="$1"
  local target_path="$2"
  local mode="${3:-overwrite}"
  local normalized_relative_path="${relative_path#/}"
  local url="${PROJECT111_BASE_URL}/${normalized_relative_path}"
  local target_dir
  local temp_path

  if [ -z "$normalized_relative_path" ]; then
    echo "Пустой относительный путь, пропускаю." >&2
    return 1
  fi

  if [ "$mode" = "skip-existing" ] && [ -f "$target_path" ]; then
    echo "Файл уже есть: $target_path"
    return 0
  fi

  target_dir="$(dirname "$target_path")"
  mkdir -p "$target_dir"

  temp_path="${target_path}.tmp"

  echo "Скачиваю: $normalized_relative_path"

  if [ "$PROJECT111_DOWNLOADER" = "wget" ]; then
    if ! wget \
      --user="$PROJECT111_LOGIN" \
      --password="$PROJECT111_PASSWORD" \
      --wait="$PROJECT111_WAIT_SECONDS" \
      --no-check-certificate \
      --quiet \
      -O "$temp_path" \
      "$url"; then
      echo "Ошибка загрузки: $url" >&2
      rm -f "$temp_path"
      return 1
    fi
  else
    if ! curl \
      --fail \
      --silent \
      --show-error \
      --location \
      --user "$PROJECT111_LOGIN:$PROJECT111_PASSWORD" \
      --output "$temp_path" \
      "$url"; then
      echo "Ошибка загрузки: $url" >&2
      rm -f "$temp_path"
      return 1
    fi
  fi

  mv "$temp_path" "$target_path"
  sleep "$PROJECT111_WAIT_SECONDS"
}

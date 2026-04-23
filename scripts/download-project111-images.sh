#!/bin/bash

LOGIN="90742_xmlexport"
PASS="AlmazUralDM"
BASE="https://api2.gifts.ru/export/v2/catalogue"
WAIT="0.5"
OUTPUT_DIR="/var/www/gifts_export"

set -u

mkdir -p "$OUTPUT_DIR"
cd "$OUTPUT_DIR" || exit 1

echo "========================================="
echo "Скачивание картинок Project 111"
echo "========================================="

download_image() {
    local url="$1"
    local output="$2"

    if [[ "$output" =~ \.(mp4|avi|mov|mkv|webm|flv|mp3|wav)$ ]]; then
        echo "Пропускаю видео/аудио: $output"
        return 0
    fi

    if [ -f "$output" ]; then
        echo "Файл уже есть: $output"
        return 0
    fi

    echo "Скачиваю: $output"
    wget --wait="$WAIT" \
         --user="$LOGIN" \
         --password="$PASS" \
         "$url" \
         -O "$output" \
         --no-check-certificate \
         --quiet

    if [ $? -ne 0 ]; then
        echo "Ошибка загрузки: $url"
        rm -f "$output"
    fi

    sleep "$WAIT"
}

if [ ! -f "product.xml" ]; then
    echo "Сначала скачиваю product.xml..."
    wget --wait="$WAIT" \
         --user="$LOGIN" \
         --password="$PASS" \
         "$BASE/product.xml" \
         -O "product.xml" \
         --no-check-certificate
    sleep "$WAIT"
fi

echo "Извлекаю пути к изображениям из product.xml..."

{
    grep -oE '<(small_image|big_image|super_big_image)[^>]*src="[^"]+"' product.xml \
        | grep -oE 'src="[^"]+"' \
        | cut -d'"' -f2

    grep -oE '<image>[^<]+</image>' product.xml \
        | sed -E 's#<image>([^<]+)</image>#\1#'
} | sort -u | while read -r img_path; do

    if [ -z "$img_path" ]; then
        continue
    fi

    if [[ "$img_path" =~ \.(mp4|avi|mov|mkv|webm|flv|mp3|wav)$ ]]; then
        echo "Пропускаю видео/аудио: $img_path"
        continue
    fi

    url="$BASE/$img_path"
    local_file="${img_path#/}"

    local_dir=$(dirname "$local_file")
    if [ "$local_dir" != "." ] && [ "$local_dir" != "/" ]; then
        mkdir -p "$local_dir"
    fi

    download_image "$url" "$local_file"
done

echo ""
echo "========================================="
echo "Готово! Картинки сохранены в: $OUTPUT_DIR"
echo "========================================="

#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/root/dm-merch-ru}"
PM2_APP_NAME="${PM2_APP_NAME:-dm-merch-7-search}"
LOCK_FILE="${LOCK_FILE:-/tmp/dm-merch-catalog-update.lock}"

export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # cron does not load interactive shell profiles, so nvm-based Node installs need this.
  # shellcheck source=/dev/null
  . "$HOME/.nvm/nvm.sh"
fi

if [ -f "$PROJECT_DIR/.nvmrc" ] && command -v nvm >/dev/null 2>&1; then
  nvm use --silent >/dev/null
fi

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$*"
}

if ! command -v flock >/dev/null 2>&1; then
  log "flock is required but not found."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  log "npm is required but not found."
  exit 1
fi

if ! command -v pm2 >/dev/null 2>&1; then
  log "pm2 is required but not found."
  exit 1
fi

(
  flock -n 9 || {
    log "Another catalog update is already running, skipping."
    exit 0
  }

  cd "$PROJECT_DIR"

  log "Updating Portobello catalog..."
  npm run download:portobello

  log "Updating Project111 XML catalog..."
  BUILD_MERGED_CATALOG=0 npm run download:project111:catalog

  log "Building merged catalog and syncing taxonomy..."
  npm run build:merged-catalog

  log "Reloading PM2 app: $PM2_APP_NAME"
  pm2 reload "$PM2_APP_NAME"

  log "Catalog update completed."
) 9>"$LOCK_FILE"

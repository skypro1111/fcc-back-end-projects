#!/usr/bin/env bash
# Installs the freeCodeCamp Back End Development and APIs certification project
# solutions into a checkout of freeCodeCamp/back-end-development-and-apis.
# Run from the repository ROOT:  bash install.sh
# Re-running is safe: files are overwritten with the same content.
set -euo pipefail

BASE_URL="${BASE_URL:-https://raw.githubusercontent.com/skypro1111/fcc-back-end-projects/main}"

if [[ ! -f freecodecamp.conf.json || ! -d curriculum ]]; then
  echo "error: run this from the root of the back-end-development-and-apis repo" >&2
  exit 1
fi

FILES=(
  "build-a-chat-app/server.js"
  "build-a-family-movie-watchlist-api/.env"
  "build-a-family-movie-watchlist-api/index.js"
  "build-a-family-movie-watchlist-api/middleware/authenticate.js"
  "build-a-family-movie-watchlist-api/middleware/authorize.js"
  "build-a-family-movie-watchlist-api/routes/auth.js"
  "build-a-family-movie-watchlist-api/routes/watchlist.js"
  "build-a-personal-profile-app/package.json"
  "build-a-personal-profile-app/server.js"
  "build-a-prime-number-checker-module/index.js"
  "build-a-prime-number-checker-module/package.json"
  "build-a-timestamp-microservice/server.js"
)

PROJECTS=(
  build-a-prime-number-checker-module
  build-a-personal-profile-app
  build-a-timestamp-microservice
  build-a-chat-app
  build-a-family-movie-watchlist-api
)

echo "Downloading solution files from $BASE_URL"
for f in "${FILES[@]}"; do
  mkdir -p "$(dirname "$f")"
  tmp="$(mktemp)"
  if curl -fsSL "$BASE_URL/$f" -o "$tmp"; then
    mv "$tmp" "$f"
    echo "  wrote $f"
  else
    rm -f "$tmp"
    echo "error: failed to download $BASE_URL/$f" >&2
    exit 1
  fi
done

echo "Installing dependencies"
for p in "${PROJECTS[@]}"; do
  if [[ -f "$p/package.json" ]] && grep -q '"dependencies"' "$p/package.json"; then
    echo "  npm install in $p"
    (cd "$p" && npm install --no-audit --no-fund)
  else
    echo "  $p has no dependencies, skipping npm install"
  fi
done

cat <<'MSG'

Done. Tests that need a running server (start ONE at a time, then click Run Tests):
  build-a-personal-profile-app        cd build-a-personal-profile-app && npm start        (port 3000)
  build-a-timestamp-microservice      cd build-a-timestamp-microservice && npm start      (port 8000)
  build-a-chat-app                    cd build-a-chat-app && npm start                    (port 3001)
  build-a-family-movie-watchlist-api  cd build-a-family-movie-watchlist-api && npm start  (port 3000)
build-a-prime-number-checker-module needs no server.
Profile app and movie API both use port 3000: stop one before starting the other.
MSG

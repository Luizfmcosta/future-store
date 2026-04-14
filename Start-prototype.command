#!/bin/zsh
# Double-click this file in Finder to run the storefront on http://localhost:3000
set -e
cd "$(dirname "$0")"

echo "Future Store — local dev server"
echo "Folder: $(pwd)"
echo ""

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Install Node.js from https://nodejs.org and try again."
  read "?Press Enter to close"
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies (first run only)…"
  npm install
  echo ""
fi

echo "Starting http://localhost:3000 — press Ctrl+C to stop."
echo ""
npm run dev

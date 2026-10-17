#!/bin/bash
# Install npm dependencies so `npm run build` / `npm run dev` work in
# Claude Code cloud sessions. No-op on local machines.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# npm install (not ci) so the cached container's node_modules is reused
npm install --no-audit --no-fund

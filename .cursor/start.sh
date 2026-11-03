#!/usr/bin/env bash
set -euo pipefail
export PATH="/usr/local/bin:${PATH}"

if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:3000/; then
  echo "dev server already listening on port 3000"
  exit 0
fi

exec pnpm exec vp dev --host 0.0.0.0 --port 3000

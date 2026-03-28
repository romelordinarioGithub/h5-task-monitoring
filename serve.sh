#!/bin/zsh

set -euo pipefail

PORT="${1:-8000}"

echo "Serving AdWeave Monitoring Dashboard at http://localhost:${PORT}"
python3 -m http.server "${PORT}"

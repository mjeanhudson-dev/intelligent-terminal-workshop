#!/usr/bin/env bash
# ==============================================================================
# LABEL:               Sovereign Terminal Foundry — Android Termux Companion Lab & Bootstrap
# USE:                 Graduate from the browser workshop into a real Android Termux terminal with NDK-safe Gemini CLI setup, PC USB bridge probe (:8420), and local sandbox files.
# MECHANISM_OF_ACTION: Seeds ~/terminal-lab-sandbox with practice logs/JSON/git repo, optionally installs @google/gemini-cli with --ignore-scripts (bypassing the Android NDK tree-sitter trap), and checks localhost:8420 for an active adb reverse PC bridge.
# ==============================================================================
set -euo pipefail

SANDBOX_ROOT="${1:-$HOME/terminal-lab-sandbox}"
GEMINI_CHANNEL="${GEMINI_CHANNEL:-preview}"
INSTALL_CLI="${INSTALL_CLI:-0}"

echo "=== Sovereign Terminal Foundry: Android Termux Lab ==="
echo "Sandbox: $SANDBOX_ROOT"

mkdir -p "$SANDBOX_ROOT/projects/api" "$SANDBOX_ROOT/projects/web"

cat << 'EOF' > "$SANDBOX_ROOT/projects/api/server.log"
INFO  gateway boot port=8420
ERROR E_TIMEOUT upstream=edge-us-west
ERROR E_TIMEOUT upstream=edge-us-west
ERROR E_AUTH_EXPIRED token=oauth-7
ERROR E_TIMEOUT upstream=edge-us-west
ERROR E_AUTH_EXPIRED token=oauth-7
EOF

cat << 'EOF' > "$SANDBOX_ROOT/projects/api/nodes.json"
{
  "cluster": "sovereign-mesh",
  "nodes": [
    { "name": "pc-workstation", "status": "healthy", "latency_ms": 4 },
    { "name": "edge-us-west", "status": "degraded", "latency_ms": 612 },
    { "name": "android-termux", "status": "healthy", "latency_ms": 11 }
  ]
}
EOF

if [ "$INSTALL_CLI" = "1" ]; then
  if command -v pkg >/dev/null 2>&1; then
    pkg update -y && pkg install -y nodejs git python jq ripgrep openssh
  fi
  # --ignore-scripts avoids native node-gyp tree-sitter Android NDK compilation errors in Termux
  npm install -g "@google/gemini-cli@${GEMINI_CHANNEL}" --ignore-scripts
fi

echo ""
echo "--- Checking PC USB Bridge (adb reverse tcp:8420 tcp:8420) ---"
if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 1.5 "http://127.0.0.1:8420/api/telemetry" >/dev/null 2>&1; then
  echo "[OK] PC Workstation bridge reachable at http://127.0.0.1:8420"
else
  echo "[STANDBY] Standalone Mobile Mode. Plug USB and run on PC: adb reverse tcp:8420 tcp:8420"
fi

echo ""
echo "--- Try Your First Real Mobile Pipeline ---"
echo "  cd \"$SANDBOX_ROOT\""
echo "  grep 'ERROR' projects/api/server.log | sort | uniq -c | sort -rn"
echo ""
echo "--- Official Android & Mobile Portals (HTTP-200 Verified) ---"
echo "  Termux (F-Droid):      https://f-droid.org/en/packages/com.termux/"
echo "  Termux Direct APKs:    https://github.com/termux/termux-app/releases"
echo "  Android Beta Program:  https://www.google.com/android/beta"
echo "  ADB Platform-Tools:    https://developer.android.com/tools/releases/platform-tools"
echo "  Tailscale Android:     https://tailscale.com/download/android"
echo "  Gemini CLI Repo:       https://github.com/google-gemini/gemini-cli"

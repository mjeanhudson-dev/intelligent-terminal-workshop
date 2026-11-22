# Sovereign Terminal Foundry

Interactive, zero-dependency terminal workflow workshop and companion real-shell practice pack for **PC (Windows/macOS/Linux)** and **Android (Termux)**.

Authored by **Eloquent** (`@mjeanhudson-dev`).

## What Is Included

1. **`index.html`** — Self-contained offline interactive browser workshop featuring:
   - **7 escalating chapters**, each **starting** with a concrete end-user superpower ("What the terminal unlocks") and **ending** with a 3-second real-shell payoff.
   - **Real in-browser shell engine** with virtual filesystem, pipes (`|`), redirection (`>`, `>>`), `&&` chaining, `rg`, `find`, `grep`, `sort`, `uniq`, `curl`, `jq`, `sed`, a stateful `git` engine, custom `alias` / `export`, `Tab` autocomplete, `↑/↓` history, and `Ctrl+R` reverse search.
   - **Chapter-specific Live Visual Labs**: GUI-vs-CLI Speed Race, Live Pipe Stream Inspector, Cluster JSON State Board, Live SVG Git Commit Graph (DAG), Keyboard Shortcut Reflex Arena, Dual-Node PC↔Android Bridge Topology, and the **Sovereign Launchpad**.
   - **Chapter 7 Sovereign Launchpad**: 18 HTTP-200 verified official PC & Android download, preview/nightly release channel, Termux sovereign mobile, and Google Developer Program / GDE recognition portals, plus a live script generator and agent handoff prompt exporter.
2. **`scripts/Start-TerminalLab.ps1`** — Real Windows PowerShell graduation script that scaffolds `~/terminal-lab-sandbox` with real logs, JSON manifests, and an initialized local Git repo with a live unstaged diff.
3. **`scripts/start-termux-lab.sh`** — Real Android Termux companion script incorporating F-Droid tooling, the `--ignore-scripts` Android NDK fix for `@google/gemini-cli`, and the `adb reverse tcp:8420 tcp:8420` USB bridge check.

## Quick Start

- **Interactive Workshop (PC or Android browser):** open `index.html` directly in any browser.
- **Real PC Practice Sandbox (PowerShell):**
  ```powershell
  pwsh ./scripts/Start-TerminalLab.ps1 -GeminiChannel preview
  ```
- **Real Android Termux Practice Sandbox:**
  ```bash
  INSTALL_CLI=1 GEMINI_CHANNEL=preview bash ./scripts/start-termux-lab.sh
  ```

## Transparent Portal Policy

All links inside Chapter 7 point exclusively to verified, official public portals, open-source repositories, official Preview/Canary/Nightly release channels, and official Google Developer recognition tracks. No fabricated or non-public invite links are included.

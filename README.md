# Sovereign Terminal & Agentic CLI Workshop

Authored by **Eloquent (`@mjeanhudson-dev`)**

An interactive, dual-surface workshop (self-hosted local web cockpit + native PowerShell drill runner inside Microsoft Intelligent Terminal) built to ingratiate you into the terminal-first agentic workflow—starting and ending with the concrete superpowers the terminal affords, and culminating in a verified directory of PC & Android preview/early-access portals plus a Dev Recognition Advocacy Kit.

## Architecture

- [`server.mjs`](./server.mjs) — Zero-dependency Node.js server bound to `127.0.0.1` (`4747`) with per-session CSRF token authentication and read-only allowlisted `/api/probe` diagnostics (`overview`, `hooks`, `models`, `prompts`, `auth`). Never executes arbitrary shell input from HTTP.
- [`index.html`](./index.html), [`styles.css`](./styles.css), [`app.js`](./app.js) — Six-chapter interactive workshop with:
  - **Chapter 0:** Opening Payoff & Built-In Terminal Micro-Lab
  - **Chapter 1:** Microsoft Intelligent Terminal (`wtai.exe` / `wta.exe`) Keybinding Dojo & Live Host Inspector
  - **Chapter 2:** The Terminal Way of Doing (Pipes, Stage-0 Deterministic Filters, SHA-256 Deduplication & 4 Verified Interactive Drills)
  - **Chapter 3:** Agentic CLI Mastery & Unsandboxed Launch Forge (`agy`, `claude`, `codex`, `gemini`)
  - **Chapter 4:** Multi-Pane Orchestration, `git worktree` Parallelism & Hardware Macro Dispatch
  - **Chapter 5:** Closing Payoff, Verified PC & Android Portals Vault, and Dev Recognition Dossier Generator
- [`Start-Workshop.ps1`](./Start-Workshop.ps1) — Native PowerShell companion for launching the server, verifying host health, or running live drills inside an Intelligent Terminal tab.
- [`tests/verify-workshop.mjs`](./tests/verify-workshop.mjs) — Automated verification suite checking CSRF isolation, probe endpoints, URL integrity, and zero OS username leakage.

## Usage

```powershell
# ==============================================================================
# LABEL:               Launch Sovereign Terminal Workshop
# USE:                 Start the local workshop server and open the interactive guide or run native terminal drills.
# MECHANISM_OF_ACTION: Runs Start-Workshop.ps1 in PowerShell to verify prerequisites, serve 127.0.0.1:4747, or step through interactive terminal exercises.
# ==============================================================================
cd "$env:USERPROFILE\.gemini\antigravity\scratch\intelligent-terminal-workshop"
.\Start-Workshop.ps1 -Mode Launch
```

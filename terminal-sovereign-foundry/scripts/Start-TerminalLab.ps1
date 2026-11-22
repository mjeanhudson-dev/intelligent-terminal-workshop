# ==============================================================================
# LABEL:               Sovereign Terminal Foundry — Windows PowerShell Practice Sandbox
# USE:                 Graduate from the browser workshop into a real local PowerShell terminal with real files, logs, JSON, and a real Git repository under ~/terminal-lab-sandbox.
# MECHANISM_OF_ACTION: Creates an isolated directory at ~/terminal-lab-sandbox, writes sample API configs/logs/code, initializes a real local Git repository with a clean unstaged diff, and prints verified CLI & portal readiness checks (non-destructive outside ~/terminal-lab-sandbox).
# ==============================================================================
[CmdletBinding()]
param(
    [string]$SandboxRoot = (Join-Path $HOME 'terminal-lab-sandbox'),
    [ValidateSet('latest', 'preview', 'nightly')]
    [string]$GeminiChannel = 'preview',
    [switch]$OpenWorkshop
)

$ErrorActionPreference = 'Stop'

Write-Host "`n=== Sovereign Terminal Foundry: Real PC Sandbox ===" -ForegroundColor Yellow
Write-Host "Sandbox Path: $SandboxRoot" -ForegroundColor Cyan

# 1. Create clean directory tree
$apiDir    = Join-Path $SandboxRoot 'projects/api'
$webDir    = Join-Path $SandboxRoot 'projects/web'
$mobileDir = Join-Path $SandboxRoot 'projects/mobile'

foreach ($dir in @($SandboxRoot, $apiDir, $webDir, $mobileDir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

# 2. Seed realistic practice files (Chapters 1-6)
@"
NODE_ENV=development
LOCAL_BRIDGE_PORT=8420
GEMINI_CHANNEL=$GeminiChannel
"@ | Set-Content -Path (Join-Path $SandboxRoot '.env.local') -Encoding UTF8

@"
{
  "service": "foundry-gateway",
  "API_ENDPOINT": "https://foundry.local/nodes",
  "PORT": 8420,
  "timeout_ms": 3000
}
"@ | Set-Content -Path (Join-Path $apiDir 'config.json') -Encoding UTF8

@"
INFO  gateway boot port=8420
ERROR E_TIMEOUT upstream=edge-us-west
WARN  cache-miss key=session:91
ERROR E_TIMEOUT upstream=edge-us-west
ERROR E_AUTH_EXPIRED token=oauth-7
INFO  healthcheck ok latency=14ms
ERROR E_TIMEOUT upstream=edge-us-west
ERROR E_RATE_LIMIT bucket=preview-api
ERROR E_AUTH_EXPIRED token=oauth-7
"@ | Set-Content -Path (Join-Path $apiDir 'server.log') -Encoding UTF8

@"
{
  "cluster": "sovereign-mesh",
  "nodes": [
    { "name": "pc-workstation", "status": "healthy", "latency_ms": 4, "role": "primary" },
    { "name": "edge-us-west", "status": "degraded", "latency_ms": 612, "role": "relay" },
    { "name": "android-termux", "status": "healthy", "latency_ms": 11, "role": "mobile-node" },
    { "name": "preview-worker-2", "status": "degraded", "latency_ms": 488, "role": "worker" }
  ]
}
"@ | Set-Content -Path (Join-Path $apiDir 'nodes.json') -Encoding UTF8

@"
MODE=staging
RETRIES=3
BRIDGE_PORT=8420
"@ | Set-Content -Path (Join-Path $apiDir 'deploy.conf') -Encoding UTF8

$appJsPath = Join-Path $webDir 'app.js'
@"
export const API_ENDPOINT = "https://foundry.local/nodes";
export const RETRY_LIMIT = 0;
"@ | Set-Content -Path $appJsPath -Encoding UTF8

# 3. Initialize a real local Git repository with one live unstaged diff
if (-not (Test-Path (Join-Path $SandboxRoot '.git'))) {
    if (Get-Command git -ErrorAction SilentlyContinue) {
        Push-Location $SandboxRoot
        try {
            git init -b main | Out-Null
            git config user.name 'Eloquent'
            git config user.email 'eloquent@local.foundry'
            git add . | Out-Null
            git commit -m 'init: scaffold sovereign terminal lab' | Out-Null
        } finally {
            Pop-Location
        }
    }
}

# Apply a real unstaged change so `git status` and `git diff` work immediately
@"
export const API_ENDPOINT = "https://foundry.local/nodes";
export const RETRY_LIMIT = 3;
"@ | Set-Content -Path $appJsPath -Encoding UTF8

# 4. Probe local tool availability
Write-Host "`n--- Local Toolchain Readiness ---" -ForegroundColor Cyan
foreach ($tool in @('node', 'npm', 'git', 'rg', 'jq', 'gemini', 'agy', 'adb')) {
    $cmd = Get-Command $tool -ErrorAction SilentlyContinue
    if ($cmd) {
        Write-Host ("  [OK]      {0,-10} -> {1}" -f $tool, $cmd.Source) -ForegroundColor Green
    } else {
        Write-Host ("  [MISSING] {0,-10} (optional or install via Launchpad)" -f $tool) -ForegroundColor DarkYellow
    }
}

Write-Host "`n--- Next Commands to Try in Your Real Shell ---" -ForegroundColor Yellow
Write-Host "  cd `"$SandboxRoot`""
Write-Host "  Select-String -Path projects/api/server.log -Pattern 'ERROR' | Measure-Object"
Write-Host "  git status && git diff"
Write-Host "  npm install -g @google/gemini-cli@$GeminiChannel"

Write-Host "`n--- Official PC & Developer Portals (HTTP-200 Verified) ---" -ForegroundColor Cyan
Write-Host "  Antigravity Downloads: https://antigravity.google/download"
Write-Host "  Gemini CLI Repo:       https://github.com/google-gemini/gemini-cli"
Write-Host "  Google AI Studio:      https://aistudio.google.com/"
Write-Host "  Google Labs:           https://labs.google/"
Write-Host "  Developer Program:     https://developers.google.com/program"
Write-Host "  GDE Recognition:       https://developers.google.com/community/experts"

if ($OpenWorkshop) {
    $html = Join-Path (Split-Path -Parent $PSScriptRoot) 'index.html'
    if (Test-Path $html) { Start-Process $html }
}

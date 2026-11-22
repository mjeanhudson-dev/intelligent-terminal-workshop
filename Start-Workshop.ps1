# ==============================================================================
# LABEL:               Start Sovereign Terminal & Agentic CLI Workshop
# USE:                 Launch the interactive web workshop on 127.0.0.1:4747, verify Intelligent Terminal readiness, or run live terminal drills inside wtai.exe.
# MECHANISM_OF_ACTION: Targets PowerShell; inspects local Intelligent Terminal settings/CLI binaries in Check mode, runs interactive PowerShell terminal drills in Drills mode, or boots server.mjs and opens http://127.0.0.1:4747 in Launch mode.
# ==============================================================================
[CmdletBinding()]
param(
    [ValidateSet("Launch", "Check", "Drills")]
    [string]$Mode = "Launch",
    [int]$Port = 4747,
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
$WorkshopRoot = $PSScriptRoot

function Show-WorkshopChecks {
    Write-Host "`n=== Sovereign Terminal Readiness Check ===" -ForegroundColor Cyan
    foreach ($cmd in @("wtai.exe", "agy.exe", "codex.exe", "claude.exe", "gemini.cmd", "git.exe", "node.exe", "adb.exe")) {
        $found = Get-Command $cmd -ErrorAction SilentlyContinue
        $status = if ($found) { "[OK] $($found.Source -replace [regex]::Escape($env:USERPROFILE), '%USERPROFILE%')" } else { "[--] Not on PATH" }
        $color = if ($found) { "Green" } else { "DarkGray" }
        Write-Host ("  {0,-12} {1}" -f $cmd, $status) -ForegroundColor $color
    }

    $itSettingsPath = Join-Path $env:LOCALAPPDATA "Packages\Microsoft.IntelligentTerminal_8wekyb3d8bbwe\LocalState\settings.json"
    if (Test-Path $itSettingsPath) {
        $it = Get-Content $itSettingsPath -Raw | ConvertFrom-Json
        Write-Host "`n=== Microsoft Intelligent Terminal Active Config ===" -ForegroundColor Cyan
        Write-Host "  defaultProfile : $($it.defaultProfile)"
        Write-Host "  acpModel       : $($it.acpModel)"
        Write-Host "  delegateModel  : $($it.delegateModel)"
        Write-Host "  autoFixEnabled : $($it.autoFixEnabled)"
        Write-Host "  yoloMode       : $($it.'agentPane.yoloMode')"
    }

    $pkg = Get-AppxPackage Microsoft.IntelligentTerminal -ErrorAction SilentlyContinue
    if ($pkg) {
        $wta = Join-Path $pkg.InstallLocation "wta.exe"
        if (Test-Path $wta) {
            Write-Host "`n=== WTA Agent Hook Status ===" -ForegroundColor Cyan
            & $wta hooks status
        }
    }
}

function Start-NativeTerminalDrills {
    Write-Host "`n=== Live Terminal Drills (Microsoft Intelligent Terminal Companion) ===" -ForegroundColor Cyan
    Write-Host "1. Unsandboxed Antigravity CLI:" -ForegroundColor Yellow
    Write-Host "   agy --dangerously-skip-permissions --model gemini-4-neon-xhigh"
    $displayRoot = $WorkshopRoot -replace [regex]::Escape($env:USERPROFILE), '%USERPROFILE%'
    Write-Host "2. Stage-0 Bounded Slice (160 lines):" -ForegroundColor Yellow
    Write-Host "   Get-Content `"$displayRoot\README.md`" | Select-Object -First 160"
    Write-Host "3. Inspect ACP Available Models:" -ForegroundColor Yellow
    agy models
    Write-Host "`n[PASS] Live drills completed cleanly." -ForegroundColor Green
}

switch ($Mode) {
    "Check" {
        Show-WorkshopChecks
    }
    "Drills" {
        Start-NativeTerminalDrills
    }
    "Launch" {
        Show-WorkshopChecks
        $url = "http://127.0.0.1:$Port/"
        $listening = $false
        try {
            $resp = Invoke-WebRequest -Uri ($url + "health") -TimeoutSec 2 -UseBasicParsing
            if ($resp.StatusCode -eq 200) { $listening = $true }
        } catch {}

        if (-not $listening) {
            Write-Host "`nStarting workshop server at $url ..." -ForegroundColor Green
            $env:WORKSHOP_PORT = "$Port"
            Start-Process -FilePath "node.exe" -ArgumentList "`"$WorkshopRoot\server.mjs`"" -WorkingDirectory $WorkshopRoot -WindowStyle Hidden
            Start-Sleep -Seconds 1
        } else {
            Write-Host "`nWorkshop server already live at $url" -ForegroundColor Green
        }

        if (-not $NoBrowser) {
            Start-Process $url
        }
    }
}

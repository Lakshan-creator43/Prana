<#
.SYNOPSIS
    Safe GitHub upload script for the Prana project.

.DESCRIPTION
    Stages, commits, and pushes project changes to origin/main with
    safety checks for secrets, correct remote, and branch alignment.
    Never force-pushes or discards user changes.

.PARAMETER Message
    Optional commit message. If omitted, a timestamped default is used.

.EXAMPLE
    .\upload.ps1
    .\upload.ps1 -Message "Add symptom search feature"
#>

param(
    [string]$Message
)

$ErrorActionPreference = "Stop"

# ── Colors ──────────────────────────────────────────────────────────
function Write-Step  { param([string]$text) Write-Host "  ► $text" -ForegroundColor Cyan }
function Write-Ok    { param([string]$text) Write-Host "  ✓ $text" -ForegroundColor Green }
function Write-Warn  { param([string]$text) Write-Host "  ⚠ $text" -ForegroundColor Yellow }
function Write-Err   { param([string]$text) Write-Host "  ✗ $text" -ForegroundColor Red }

Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  PRANA — GitHub Upload Script" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

# ── 1. Verify Git is installed ──────────────────────────────────────
Write-Step "Checking Git installation..."
try {
    $gitVer = git --version 2>&1
    Write-Ok "Git found: $gitVer"
} catch {
    Write-Err "Git is not installed or not in PATH."
    Write-Host "    Install from https://git-scm.com/download/win" -ForegroundColor Gray
    exit 1
}

# ── 2. Verify we're inside a Git repository ─────────────────────────
Write-Step "Verifying Git repository..."
$repoRoot = git rev-parse --show-toplevel 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Err "This folder is not a Git repository."
    exit 1
}
Write-Ok "Repository root: $repoRoot"

# ── 3. Verify the remote points to the Prana repo ───────────────────
Write-Step "Checking remote URL..."
$remoteUrl = git remote get-url origin 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Err "No 'origin' remote configured."
    exit 1
}

$expectedUrl = "https://github.com/Lakshan-creator43/Prana.git"
if ($remoteUrl -ne $expectedUrl) {
    Write-Err "Remote URL mismatch!"
    Write-Host "    Expected: $expectedUrl" -ForegroundColor Gray
    Write-Host "    Found:    $remoteUrl" -ForegroundColor Gray
    exit 1
}
Write-Ok "Remote: $remoteUrl"

# ── 4. Verify the current branch ────────────────────────────────────
Write-Step "Checking current branch..."
$branch = git branch --show-current 2>&1
if ($branch -ne "main") {
    Write-Warn "Current branch is '$branch', not 'main'."
    $answer = Read-Host "    Continue pushing to '$branch'? (y/N)"
    if ($answer -notin @("y", "Y", "yes", "Yes")) {
        Write-Host "    Aborted." -ForegroundColor Gray
        exit 0
    }
}
Write-Ok "Branch: $branch"

# ── 5. Check for sensitive files in working tree ─────────────────────
Write-Step "Scanning for sensitive files..."
$sensitivePatterns = @(
    "\.env$",
    "\.env\.local$",
    "\.env\.production$",
    "\.env\..*\.local$",
    "id_rsa",
    "id_ed25519",
    "\.pem$",
    "\.key$"
)
$trackedSecrets = @()
foreach ($pattern in $sensitivePatterns) {
    $matches = git ls-files | Select-String -Pattern $pattern
    if ($matches) {
        $trackedSecrets += $matches
    }
}
if ($trackedSecrets.Count -gt 0) {
    Write-Err "Sensitive files are being tracked by Git!"
    foreach ($f in $trackedSecrets) {
        Write-Host "    - $f" -ForegroundColor Red
    }
    Write-Host "    Remove them with: git rm --cached <file>" -ForegroundColor Gray
    exit 1
}
Write-Ok "No sensitive files tracked."

# ── 6. Check working tree status ────────────────────────────────────
Write-Step "Inspecting working tree..."
$status = git status --porcelain
if (-not $status) {
    Write-Ok "Working tree is clean — nothing to upload."
    Write-Host ""
    Write-Host "  Repository is already up to date." -ForegroundColor Green
    Write-Host ""
    exit 0
}

Write-Host ""
Write-Host "  Changed files:" -ForegroundColor White
$status | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
Write-Host ""

# ── 7. Stage changes ────────────────────────────────────────────────
Write-Step "Staging changes..."
git add -A
if ($LASTEXITCODE -ne 0) {
    Write-Err "Failed to stage changes."
    exit 1
}

# ── 8. Re-check for secrets in staged content ───────────────────────
Write-Step "Scanning staged content for secrets..."
$stagedDiff = git diff --cached --name-only
$secretHits = $stagedDiff | Where-Object {
    $_ -match "\.env$" -or
    $_ -match "\.env\.local" -or
    $_ -match "\.env\.production" -or
    $_ -match "\.pem$" -or
    $_ -match "\.key$" -or
    $_ -match "id_rsa" -or
    $_ -match "id_ed25519"
}
if ($secretHits) {
    Write-Err "Potentially sensitive files are staged!"
    foreach ($f in $secretHits) {
        Write-Host "    - $f" -ForegroundColor Red
    }
    Write-Host "    Unstaging and aborting." -ForegroundColor Gray
    git reset HEAD -- @($secretHits)
    exit 1
}
Write-Ok "No secrets in staged files."

# ── 9. Show staged diff summary ─────────────────────────────────────
Write-Step "Staged changes summary:"
git diff --cached --stat
Write-Host ""

# ── 10. Commit ───────────────────────────────────────────────────────
if (-not $Message) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $Message = "Update project files — $timestamp"
}

Write-Step "Committing: `"$Message`""
git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Err "Commit failed."
    exit 1
}
Write-Ok "Commit created."

# ── 11. Push ─────────────────────────────────────────────────────────
Write-Step "Pushing to origin/$branch..."
git push origin $branch 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Err "Push failed. Check authentication and network."
    Write-Host "    If the remote has new commits, run:" -ForegroundColor Gray
    Write-Host "      git pull --rebase origin $branch" -ForegroundColor Gray
    Write-Host "    Then retry this script." -ForegroundColor Gray
    exit 1
}
Write-Ok "Push succeeded!"

# ── 12. Verify ───────────────────────────────────────────────────────
Write-Step "Verifying remote..."
$localHash  = git rev-parse HEAD
$remoteHash = git rev-parse "origin/$branch"
if ($localHash -eq $remoteHash) {
    Write-Ok "Local and remote are in sync."
} else {
    Write-Warn "Hashes differ — the push may not have fully propagated."
}

Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  ✓ Upload complete!" -ForegroundColor Green
Write-Host "  https://github.com/Lakshan-creator43/Prana" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

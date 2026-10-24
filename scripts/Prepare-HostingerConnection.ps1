#requires -Version 7.4
[CmdletBinding()]
param([Parameter(Mandatory)][string]$ConfigPath,
    [Parameter(Mandatory)][ValidateSet('Staging','Production')][string]$Environment,
    [Parameter(Mandatory)][string]$KnownHostsPath)
$ErrorActionPreference='Stop'
$all=Get-Content -Raw -LiteralPath $ConfigPath | ConvertFrom-Json -AsHashtable
if (!$all.Contains($Environment)) { throw 'Environment is not configured.' }
$cfg=$all[$Environment]
if ($cfg.sshHost -notmatch '^[a-zA-Z0-9][a-zA-Z0-9.-]+$' -or [int]$cfg.sshPort -lt 1 -or [int]$cfg.sshPort -gt 65535) { throw 'Invalid SSH endpoint.' }
if ($cfg.sshHostFingerprint -notmatch '^SHA256:[A-Za-z0-9+/]{43}$') { throw 'An ED25519 fingerprint verified in Hostinger hPanel is required.' }
$scan=@(& ssh-keyscan -T 15 -p $cfg.sshPort -t ed25519 $cfg.sshHost 2>$null)
if ($LASTEXITCODE -ne 0 -or $scan.Count -ne 1) { throw 'Hostinger SSH is unreachable or returned an unexpected host key. Check SSH status and network access.' }
$candidate="$KnownHostsPath.candidate"
try {
    $scan | Set-Content -LiteralPath $candidate -Encoding ascii
    $fingerprint=& ssh-keygen -lf $candidate -E sha256
    if ($LASTEXITCODE -ne 0 -or ($fingerprint -split '\s+')[1] -cne $cfg.sshHostFingerprint) { throw 'Hostinger fingerprint mismatch. Stop and verify in hPanel; never disable host checking.' }
    Move-Item -LiteralPath $candidate -Destination $KnownHostsPath -Force
    Write-Host 'Hostinger ED25519 fingerprint verified.'
} finally { if (Test-Path -LiteralPath $candidate) { Remove-Item -LiteralPath $candidate } }

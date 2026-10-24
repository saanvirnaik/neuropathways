#requires -Version 7.4
$ErrorActionPreference='Stop'
$repo=Split-Path $PSScriptRoot -Parent
Get-ChildItem $PSScriptRoot -Filter '*.ps1' | ForEach-Object {
    $tokens=$null; $errors=$null
    [void][Management.Automation.Language.Parser]::ParseFile($_.FullName,[ref]$tokens,[ref]$errors)
    if ($errors) { throw ($errors | Out-String) }
}
$config=Get-Content (Join-Path $repo 'deploy/environments.example.json') -Raw | ConvertFrom-Json -AsHashtable
$config.Staging=@{frontendUrl='https://staging.example.com';backendUrl='https://api.example.com';renderServiceId='srv-test';sshHost='ssh.example.com';sshPort=65002;sshUser='u123';documentRoot='/home/u123/domains/staging.example.com/public_html'}
$temp=Join-Path ([IO.Path]::GetTempPath()) "np-deploy-test-$([guid]::NewGuid()).json"
try {
    $config | ConvertTo-Json -Depth 5 | Set-Content $temp
    $plan=& "$PSScriptRoot/Deploy-NeuroPathways.ps1" -Environment Staging -ConfigPath $temp -Plan | ConvertFrom-Json
    if ($plan.commit -notmatch '^[a-f0-9]{40}$' -or $plan.environment -ne 'Staging') { throw 'Plan output invalid.' }
    $config.Staging.documentRoot='/home/u123/domains/../../public_html'
    $config | ConvertTo-Json -Depth 5 | Set-Content $temp
    $rejected=$false
    try { & "$PSScriptRoot/Deploy-NeuroPathways.ps1" -Environment Staging -ConfigPath $temp -Plan } catch { $rejected=$true }
    if (!$rejected) { throw 'Unsafe path was accepted.' }
    Write-Host 'Deployment syntax, offline plan, and unsafe-path rejection passed.'
} finally { Remove-Item -LiteralPath $temp -Force }

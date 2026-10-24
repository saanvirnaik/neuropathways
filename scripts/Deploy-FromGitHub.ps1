#requires -Version 7.4
[CmdletBinding()]
param(
    [ValidateSet('Staging','Production')][string]$Environment='Staging',
    [ValidateSet('Deploy','CheckConnection','Initialize','AdoptStaging','Rollback')][string]$Operation='Deploy',
    [string]$Ref='main',
    [ValidatePattern('^$|^[a-f0-9]{40}$')][string]$Commit='',
    [ValidatePattern('^$|^[a-f0-9]{40}-[a-f0-9]{12}$')][string]$Rollback='',
    [switch]$NoWait
)
$ErrorActionPreference='Stop'
Set-StrictMode -Version Latest
$repository='saanvirnaik/neuropathways'
function Gh([string[]]$Arguments) {
    $result=& gh @Arguments
    if ($LASTEXITCODE -ne 0) { throw 'GitHub CLI failed. Check gh auth status and repository permissions.' }
    return $result
}
if (!(Get-Command gh -ErrorAction SilentlyContinue)) { throw 'Install GitHub CLI from https://cli.github.com and run gh auth login first.' }
if ($Operation -eq 'AdoptStaging' -and $Environment -ne 'Staging') { throw 'Adoption is only supported for staging.' }
if (($Operation -eq 'Rollback') -ne [bool]$Rollback) { throw 'Use -Operation Rollback together with -Rollback <release-id>.' }
$null=Gh @('auth','status')
$request=[guid]::NewGuid().ToString('N')
$title="NeuroPathways $Environment $Operation $request"
$arguments=@('workflow','run','deploy.yml','--repo',$repository,'--ref',$Ref,
    '-f',"environment=$Environment",'-f',"operation=$Operation",'-f',"request_id=$request")
if ($Commit) { $arguments+=@('-f',"commit=$Commit") }
if ($Rollback) { $arguments+=@('-f',"rollback=$Rollback") }
$null=Gh $arguments
Write-Host "Queued $title"
$deadline=(Get-Date).AddMinutes(2)
$run=$null
do {
    $runs=Gh @('run','list','--repo',$repository,'--workflow','deploy.yml','--event','workflow_dispatch',
        '--limit','100','--json','databaseId,displayTitle,url') | ConvertFrom-Json
    $run=$runs | Where-Object displayTitle -EQ $title | Select-Object -First 1
    if ($run) { break }
    Start-Sleep -Seconds 3
} while ((Get-Date) -lt $deadline)
if (!$run) { throw "Dispatch accepted but run not found. Locate request $request in GitHub Actions before retrying." }
Write-Host $run.url
if (!$NoWait) { $null=Gh @('run','watch',[string]$run.databaseId,'--repo',$repository,'--exit-status') }

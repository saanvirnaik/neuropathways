#requires -Version 7.4
[CmdletBinding(DefaultParameterSetName='Deploy')]
param(
    [Parameter(Mandatory)][ValidateSet('Staging','Production')][string]$Environment,
    [Parameter(ParameterSetName='Deploy')][string]$Commit = 'HEAD',
    [Parameter(Mandatory,ParameterSetName='Rollback')][ValidatePattern('^[a-f0-9]{40}-[a-f0-9]{12}$')][string]$Rollback,
    [Parameter(Mandatory,ParameterSetName='Initialize')][switch]$Initialize,
    [Parameter(Mandatory,ParameterSetName='Adopt')][switch]$AdoptInitialStaging,
    [Parameter(Mandatory,ParameterSetName='Check')][switch]$CheckConnection,
    [string]$ConfigPath = '',
    [switch]$Plan,
    [ValidateRange(1,60)][int]$TimeoutMinutes = 20
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$repo = Split-Path $PSScriptRoot -Parent
function Run([string]$Program, [string[]]$Arguments) {
    & $Program @Arguments
    if ($LASTEXITCODE -ne 0) { throw "$Program failed (exit $LASTEXITCODE)." }
}
function Read-Config([object]$Config) {
    foreach ($field in @('frontendUrl','backendUrl','renderServiceId','sshHost','sshPort','sshUser','documentRoot')) {
        if (!$Config.Contains($field) -or [string]::IsNullOrWhiteSpace([string]$Config[$field])) { throw "Missing configuration: $field" }
        if ([string]$Config[$field] -match 'REPLACE') { throw "Configure $field in $ConfigPath before deploying." }
    }
    foreach ($field in @('frontendUrl','backendUrl')) {
        $uri = [uri]$Config[$field]
        if (!$uri.IsAbsoluteUri -or $uri.Scheme -ne 'https' -or $uri.UserInfo -or $uri.Query -or $uri.Fragment -or $uri.AbsolutePath -ne '/') {
            throw "$field must be an HTTPS origin without a path, query, or credentials."
        }
        $Config[$field] = $Config[$field].TrimEnd('/')
    }
    if ($Config.renderServiceId -notmatch '^srv-[a-zA-Z0-9]+$') { throw 'Invalid Render service ID.' }
    if ($Config.sshHost -notmatch '^[a-zA-Z0-9][a-zA-Z0-9.-]+$' -or $Config.sshUser -notmatch '^[a-zA-Z0-9_-]+$') { throw 'Invalid SSH target.' }
    if ([int]$Config.sshPort -lt 1 -or [int]$Config.sshPort -gt 65535) { throw 'Invalid SSH port.' }
    if ($Config.documentRoot -notmatch '^/home/[a-zA-Z0-9_-]+/domains/[a-zA-Z0-9.-]+/public_html$' -or $Config.documentRoot.Contains('..')) { throw 'Unsafe document root.' }
}
function Render([string]$Method, [string]$Path, [object]$Body=$null) {
    $parameters = @{Uri="https://api.render.com/v1/services/$($cfg.renderServiceId)$Path"; Method=$Method;
        Headers=@{Authorization="Bearer $env:RENDER_API_KEY"}; TimeoutSec=60 }
    if ($null -ne $Body) { $parameters.Body=ConvertTo-Json $Body -Compress; $parameters.ContentType='application/json' }
    # Do not print request headers, response bodies, or provider errors containing secrets.
    try { Invoke-RestMethod @parameters } catch { throw "Render $Method $Path failed; inspect the Render dashboard." }
}
function Remote([string]$Action, [string]$Release='') {
    $command = "bash -s -- $Action $($cfg.documentRoot) $owner $Release"
    Get-Content -LiteralPath (Join-Path $repo 'deploy/hostinger-release.sh') -Raw |
        & ssh @sshArgs "$($cfg.sshUser)@$($cfg.sshHost)" $command
    if ($LASTEXITCODE -ne 0) { throw "Hostinger $Action failed (exit $LASTEXITCODE)." }
}
function Upload([string]$Local, [string]$RemotePath) {
    Run scp ($scpArgs + @($Local, "$($cfg.sshUser)@$($cfg.sshHost):$RemotePath"))
}
function Read-JsonUrl([string]$Url) {
    Invoke-RestMethod -Uri $Url -TimeoutSec 30 -MaximumRedirection 0 -Headers @{'Cache-Control'='no-cache'}
}
function Check-Backend([string]$ExpectedCommit) {
    $deadline = (Get-Date).AddMinutes(6)
    do {
        try {
            $health=Read-JsonUrl "$($cfg.backendUrl)/actuator/health"
            $version=Read-JsonUrl "$($cfg.backendUrl)/api/version"
            if ($health.status -eq 'UP' -and $version.commit -eq $ExpectedCommit) { return }
        } catch { }
        Start-Sleep -Seconds 5
    } while ((Get-Date) -lt $deadline)
    throw 'Backend health or commit identity did not match the release.'
}
function Check-Frontend([string]$ExpectedRelease) {
    $version=Read-JsonUrl "$($cfg.frontendUrl)/version.json?check=$owner"
    if ($version.release -ne $ExpectedRelease) { throw 'Frontend release identity mismatch; check CDN caching.' }
    foreach ($path in @('/','/dashboard', '/assessment/session/1/results')) {
        $response=Invoke-WebRequest -Uri "$($cfg.frontendUrl)$path" -TimeoutSec 30 -MaximumRedirection 0
        if ($response.StatusCode -ne 200 -or $response.Content -notmatch [regex]::Escape("/releases/$ExpectedRelease/")) {
            throw "Frontend route check failed: $path"
        }
    }
    $protected=Invoke-WebRequest -Uri "$($cfg.backendUrl)/api/assessment-sessions/status" -SkipHttpErrorCheck -TimeoutSec 30 -MaximumRedirection 0
    if ($protected.StatusCode -notin @(401,403)) { throw 'Protected API did not reject an unauthenticated request.' }
    $cors=Invoke-WebRequest -Uri "$($cfg.backendUrl)/api/assessment-sessions/status" -Method Options -Headers @{
        Origin=$cfg.frontendUrl; 'Access-Control-Request-Method'='GET'; 'Access-Control-Request-Headers'='authorization'
    } -TimeoutSec 30 -MaximumRedirection 0
    if ([string]$cors.Headers['Access-Control-Allow-Origin'] -ne $cfg.frontendUrl) { throw 'CORS origin check failed.' }
}
function Verify-Staging {
    Run pwsh @('-NoProfile','-File',(Join-Path $PSScriptRoot 'Test-Deployment.ps1'),'-ConfigPath',$ConfigPath,'-CreateSyntheticRecords')
    $receipt=Join-Path $working 'verification.json'
    @{commit=$sha;release=$release} | ConvertTo-Json | Set-Content -LiteralPath $receipt -Encoding utf8NoBOM
    Upload $receipt "$incoming/verification.json"
    Remote verify $release
}
if (!$ConfigPath) { $ConfigPath=Join-Path $repo 'deploy/environments.local.json' }
if (!(Test-Path -LiteralPath $ConfigPath)) {
    throw 'Copy deploy/environments.example.json to deploy/environments.local.json and enter the provisioned destinations. No changes made.'
}
$allConfig=Get-Content -LiteralPath $ConfigPath -Raw | ConvertFrom-Json -AsHashtable
if (!$allConfig.Contains($Environment)) { throw "Missing $Environment configuration." }
$cfg=$allConfig[$Environment]
Read-Config $cfg
if ($AdoptInitialStaging -and ($Environment -ne 'Staging' -or $cfg.frontendUrl -ne 'https://indigo-jackal-371617.hostingersite.com')) {
    throw 'Initial adoption is restricted to the verified Hostinger staging site.'
}
$sha = if ($Rollback) { $Rollback.Substring(0,40) } else {
    $resolved = Run git @('-C',$repo,'rev-parse','--verify',"$Commit^{commit}")
    ([string]$resolved).Trim()
}
if ($sha -notmatch '^[a-f0-9]{40}$') { throw 'Expected a full Git commit SHA.' }
$configJson = $cfg | ConvertTo-Json -Compress
$configHash=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($configJson))).ToLowerInvariant().Substring(0,12)
$release = if ($Rollback) { $Rollback } else { "$sha-$configHash" }
if ($Plan) {
    [ordered]@{environment=$Environment; commit=$sha; release=$release; initialize=[bool]$Initialize;
        rollback=[bool]$Rollback; frontend=$cfg.frontendUrl; backend=$cfg.backendUrl; documentRoot=$cfg.documentRoot;
        steps=@('Validate configuration and tests','Acquire deployment lock','Deploy exact backend commit and verify','Activate versioned frontend','Verify routes, CORS and API');
        note='Plan only: no network requests, builds, uploads or provider changes.'} | ConvertTo-Json -Depth 4
    return
}
foreach ($tool in @('git','ssh','scp','tar')) { if (!(Get-Command $tool -ErrorAction SilentlyContinue)) { throw "$tool is required." } }
foreach ($name in @('NP_SSH_KEY','NP_KNOWN_HOSTS')) {
    $value=[Environment]::GetEnvironmentVariable($name)
    if (!$value -or !(Test-Path -LiteralPath $value -PathType Leaf)) { throw "$name must point to a local file. Pin the verified SSH host key." }
}
$sshArgs=@('-i',$env:NP_SSH_KEY,'-o','IdentitiesOnly=yes','-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o',"UserKnownHostsFile=$env:NP_KNOWN_HOSTS",'-o','ConnectTimeout=15','-p',[string]$cfg.sshPort)
$scpArgs=@('-i',$env:NP_SSH_KEY,'-o','IdentitiesOnly=yes','-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o',"UserKnownHostsFile=$env:NP_KNOWN_HOSTS",'-o','ConnectTimeout=15','-P',[string]$cfg.sshPort)
$owner=[guid]::NewGuid().ToString('N')
if ($CheckConnection) { Remote inspect; return }
if ($AdoptInitialStaging) { Remote adopt-initial; return }
if ($Initialize) { Remote initialize; return }
if (!$env:RENDER_API_KEY) { throw 'RENDER_API_KEY is required.' }
$service=Render GET ''
if ($service.autoDeploy -ne 'no') { throw 'Disable Render automatic deployments so releases cannot race this script.' }
if (($service.repo -replace '\.git$','') -ne 'https://github.com/saanvirnaik/neuropathways') { throw 'Render service repository does not match NeuroPathways.' }
if ($Environment -eq 'Production' -and !$Rollback) {
    if (!$allConfig.Contains('Staging')) { throw 'Staging configuration is required for promotion.' }
    $staging=$allConfig.Staging
    Read-Config $staging
    $stagedFront=Read-JsonUrl "$($staging.frontendUrl)/version.json"
    $stagedBack=Read-JsonUrl "$($staging.backendUrl)/api/version"
    $stagedCheck=Read-JsonUrl "$($staging.frontendUrl)/verification.json"
    if ($stagedFront.commit -ne $sha -or $stagedBack.commit -ne $sha -or $stagedCheck.commit -ne $sha -or $stagedCheck.release -ne $stagedFront.release) {
        throw 'Deploy and pass the staging learner-flow checks for this commit before production.'
    }
}
$output=Join-Path $repo '.deploy-output'
New-Item -ItemType Directory -Force $output | Out-Null
$working=Join-Path $output $owner
New-Item -ItemType Directory -Force $working | Out-Null
$journal=[ordered]@{environment=$Environment; release=$release; commit=$sha; startedAt=(Get-Date).ToUniversalTime().ToString('o'); status='preparing'; renderDeployId=$null}
$journalPath=Join-Path $output "$Environment-$owner.json"
$locked=$false; $pendingBackend=$false
try {
    Remote acquire
    $locked=$true
    $current=Remote current | ConvertFrom-Json -AsHashtable
    $incoming=[string](Remote prepare)
    if ($incoming -ne "$(Split-Path $cfg.documentRoot -Parent)/.neuropathways-deploy/incoming-$owner".Replace('\','/')) { throw 'Unexpected remote upload path.' }
    if (!$Rollback -and $current.Contains('release') -and $current.release -eq $release) {
        Check-Backend $sha
        Check-Frontend $release
        if ($Environment -eq 'Staging') {
            $receipt=$null
            try { $receipt=Read-JsonUrl "$($cfg.frontendUrl)/verification.json" } catch { }
            if (!$receipt -or $receipt.release -ne $release) { Verify-Staging }
        }
        $journal.status='already-deployed'
        Write-Host "Release $release is already deployed and healthy."
        return
    }
    if ($Rollback) {
        $previous=Remote manifest $Rollback | ConvertFrom-Json -AsHashtable
        if ($previous.environment -ne $Environment -or $previous.release -ne $Rollback -or $previous.commit -ne $sha) { throw 'Invalid rollback manifest.' }
        $pendingBackend=$true
        $deployment=Render POST '/rollback' @{deployId=$previous.renderDeployId}
    } else {
        if (!$env:TEST_POSTGRES_URL -or !$env:TEST_POSTGRES_USER -or !$env:TEST_POSTGRES_PASSWORD) {
            throw 'A disposable PostgreSQL test database is required (TEST_POSTGRES_URL, TEST_POSTGRES_USER, TEST_POSTGRES_PASSWORD). CI provides one.'
        }
        $archive=Join-Path $working 'source.zip'
        # Export only application folders; never export tracked H2 data or local secrets.
        Run git @('-C',$repo,'archive','--format=zip',"--output=$archive",$sha,'neuropathways-frontend','neuropathways-backend')
        Expand-Archive -LiteralPath $archive -DestinationPath $working
        $backend=Join-Path $working 'neuropathways-backend'
        $frontend=Join-Path $working 'neuropathways-frontend'
        Push-Location $backend
        try {
            if ($IsWindows) { Run '.\gradlew.bat' @('--no-daemon','test','bootJar') }
            else { Run bash @('./gradlew','--no-daemon','test','bootJar') }
        } finally { Pop-Location }
        $oldApi=$env:VITE_API_BASE_URL
        $env:VITE_API_BASE_URL="$($cfg.backendUrl)/api"
        Push-Location $frontend
        try {
            $npm=if ($IsWindows) {'npm.cmd'} else {'npm'}
            Run $npm @('ci')
            Run $npm @('run','build','--',"--base=/releases/$release/")
        } finally { Pop-Location; $env:VITE_API_BASE_URL=$oldApi }
        @{commit=$sha;release=$release} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $frontend 'dist/version.json') -Encoding utf8NoBOM
        $bundle=Join-Path $working 'frontend.tar.gz'
        Run tar @('-czf',$bundle,'-C',(Join-Path $frontend 'dist'),'.')
        Upload $bundle "$incoming/frontend.tar.gz"
        Remote stage $release
        $pendingBackend=$true
        $deployment=Render POST '/deploys' @{commitId=$sha;clearCache='do_not_clear'}
    }
    $journal.renderDeployId=$deployment.id
    $journal.status='backend-deploying'
    $journal | ConvertTo-Json | Set-Content $journalPath
    $deadline=(Get-Date).AddMinutes($TimeoutMinutes)
    do {
        $deployment=Render GET "/deploys/$($journal.renderDeployId)"
        Write-Host "Render deployment: $($deployment.status)"
        if ($deployment.status -eq 'live') { $pendingBackend=$false; break }
        if ($deployment.status -in @('build_failed','update_failed','pre_deploy_failed','canceled','deactivated')) {
            $pendingBackend=$false; throw "Backend deployment ended with $($deployment.status)."
        }
        if ((Get-Date) -ge $deadline) { throw 'Render deployment timed out; inspect its status before releasing the lock.' }
        Start-Sleep -Seconds 10
    } while ($true)
    Check-Backend $sha
    $journal.status='activating-frontend'
    $manifest=Join-Path $working 'release.json'
    $journal | ConvertTo-Json | Set-Content -LiteralPath $manifest -Encoding utf8NoBOM
    Upload $manifest "$incoming/release.json"
    Remote activate $release
    Check-Frontend $release
    if ($Environment -eq 'Staging' -and !$Rollback) {
        Verify-Staging
    }
    $journal.status='verified'
    Write-Host "Deployed $release to $Environment. Full browser and learner-flow verification is still required before public launch."
} catch {
    $journal.status='failed'
    Write-Warning 'Release incomplete. Consult the deployment report and Render dashboard. No database rollback was attempted.'
    throw
} finally {
    $journal['finishedAt']=(Get-Date).ToUniversalTime().ToString('o')
    $journal | ConvertTo-Json | Set-Content -LiteralPath $journalPath -Encoding utf8NoBOM
    if ($locked -and !$pendingBackend) { Remote release-lock }
    elseif ($locked) { Write-Warning "Deployment lock retained while backend outcome is uncertain. Owner: $owner" }
    Write-Host "Deployment report: $journalPath"
}

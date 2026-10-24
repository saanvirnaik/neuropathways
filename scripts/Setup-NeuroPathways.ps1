# NeuroPathways one-run Windows setup. PowerShell 5.1+.
# The private GitHub repository requires a one-time browser sign-in by an authorized user.
[CmdletBinding()]
param([string]$ProjectPath = '', [switch]$SkipBuild)
$ErrorActionPreference = 'Stop'
$repoUrl = 'https://github.com/saanvirnaik/neuropathways.git'
$gradleVersion = '9.2.1'

function Say([string]$s) { Write-Host "`n== $s ==" -ForegroundColor Cyan }
function Has([string]$name) { return [bool](Get-Command $name -ErrorAction SilentlyContinue) }
function Quote([string]$s) { return "'" + $s.Replace("'", "''") + "'" }
function Refresh-Environment {
    $env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User') + ';' + $env:Path
    foreach ($dir in @('C:\Program Files\nodejs','C:\Program Files\Git\cmd','C:\Program Files\Git\mingw64\bin')) {
        if (Test-Path $dir) { $env:Path = "$dir;$env:Path" }
    }
    $jdks = @(Get-ChildItem 'C:\Program Files\Eclipse Adoptium' -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like 'jdk-21*' } | Sort-Object Name -Descending)
    if ($jdks.Count -gt 0) { $env:JAVA_HOME = $jdks[0].FullName; $env:Path = "$env:JAVA_HOME\bin;$env:Path" }
}
function Install-Package([string]$id, [string]$label) {
    if (-not (Has 'winget')) { throw "winget is required to install $label. Install Microsoft App Installer and rerun." }
    Say "Installing $label (Windows may request permission)"
    & winget install --id $id --exact --source winget --accept-package-agreements --accept-source-agreements --disable-interactivity
    if ($LASTEXITCODE -ne 0) { throw "Installation of $label failed (exit code $LASTEXITCODE)." }
    Refresh-Environment
}
function Java-Line {
    if (-not (Has 'java')) { return '' }
    # java -version emits stderr; cmd.exe prevents Windows PowerShell 5.1 NativeCommandError.
    $lines = @(cmd.exe /d /c 'java -version 2>&1')
    if ($lines.Count) { return [string]$lines[0] }
    return ''
}
function Is-Java21 { return ((Java-Line) -match '(version |openjdk )"?21([.\+" ]|$)') }
function Is-NodeCompatible {
    if (-not (Has 'node')) { return $false }
    $v = (& node --version).TrimStart('v').Split('.')
    if ($LASTEXITCODE -ne 0 -or $v.Count -lt 2) { return $false }
    $major=[int]$v[0]; $minor=[int]$v[1]
    return (($major -eq 20 -and $minor -ge 19) -or ($major -eq 22 -and $minor -ge 12) -or ($major -ge 24))
}
function Is-Repo([string]$dir) {
    return ((Test-Path (Join-Path $dir 'neuropathways-frontend\package.json')) -and (Test-Path (Join-Path $dir 'neuropathways-backend\build.gradle')))
}
function Find-Checkout {
    if ($ProjectPath) { return [IO.Path]::GetFullPath($ProjectPath) }
    $here=(Get-Location).Path
    $scriptFolder=$PSScriptRoot
    $candidates=@($here,$scriptFolder,(Split-Path -Parent $scriptFolder),(Join-Path $HOME 'Documents\neuropathways'))
    foreach ($candidate in $candidates) { if ($candidate -and (Is-Repo $candidate)) { return $candidate } }
    # Keep the setup script directory separate from the source checkout.
    if ((Split-Path $here -Leaf) -eq 'neuropathways') { return (Join-Path (Split-Path $here -Parent) 'neuropathways-source') }
    return (Join-Path $here 'neuropathways-source')
}
function Configure-GitCredentials {
    Say 'Configuring secure GitHub browser authentication'
    # Git Credential Manager ships with modern Git for Windows; never save tokens in script.
    $gcm = (& git credential-manager --version 2>$null)
    if ($LASTEXITCODE -ne 0) {
        $gcm = (& git credential-manager-core --version 2>$null)
        if ($LASTEXITCODE -ne 0) { throw 'Git Credential Manager is missing. Reinstall Git for Windows with Git Credential Manager enabled.' }
        & git config --global credential.helper manager-core
    } else { & git config --global credential.helper manager }
    & git config --global credential.interactive always
    if ($LASTEXITCODE -ne 0) { throw 'Could not configure Git credentials.' }
    Write-Host 'GitHub may open a browser. Sign in to an account with access to saanvirnaik/neuropathways.' -ForegroundColor Yellow
}

try {
    Say 'NeuroPathways automated local setup'
    Refresh-Environment
    if (-not (Has 'git')) { Install-Package 'Git.Git' 'Git for Windows' }
    if (-not (Has 'git')) { throw 'Git was installed but is not visible in this shell. Restart PowerShell and rerun.' }
    if (-not (Is-Java21)) { Install-Package 'EclipseAdoptium.Temurin.21.JDK' 'Java 21 JDK' }
    if (-not (Is-Java21)) { throw 'Java 21 is not active. Restart PowerShell and rerun.' }
    if (-not (Is-NodeCompatible)) { Install-Package 'OpenJS.NodeJS.LTS' 'Node.js LTS and npm' }
    if (-not (Is-NodeCompatible) -or -not (Has 'npm.cmd')) { throw 'Compatible Node.js/npm is not active. Restart PowerShell and rerun.' }
    Write-Host "Java: $(Java-Line)"
    Write-Host "Node: $(& node --version) | npm: $(& npm.cmd --version) | Git: $(& git --version)"

    $installDir=Find-Checkout
    Say "Project directory: $installDir"
    if (Is-Repo $installDir) {
        Write-Host 'Existing project found. No clone or git pull will run; local changes are preserved.' -ForegroundColor Green
    } else {
        if (Test-Path $installDir) {
            $items=@(Get-ChildItem -LiteralPath $installDir -Force -ErrorAction SilentlyContinue)
            if ($items.Count -gt 0) { throw "Target directory exists but is not a NeuroPathways checkout: $installDir. Nothing was overwritten. Specify -ProjectPath or move the directory." }
        }
        Configure-GitCredentials
        New-Item -ItemType Directory -Force -Path (Split-Path $installDir -Parent) | Out-Null
        Say 'Cloning private GitHub repository'
        & git -c credential.interactive=always clone $repoUrl $installDir
        if ($LASTEXITCODE -ne 0) { throw 'Git clone failed. The signed-in GitHub account must have access to the private repository. If a wrong account was cached, remove its github.com entry from Windows Credential Manager and rerun.' }
    }
    if (-not (Is-Repo $installDir)) { throw 'Repository checkout is missing the frontend or backend.' }
    $frontend=Join-Path $installDir 'neuropathways-frontend'
    $backend=Join-Path $installDir 'neuropathways-backend'
    $wrapper=Join-Path $backend 'gradlew.bat'
    if (Test-Path $wrapper) { $gradleExe=$wrapper }
    elseif (Has 'gradle.bat') { $gradleExe=(Get-Command gradle.bat).Source }
    elseif (Has 'gradle') { $gradleExe=(Get-Command gradle).Source }
    else {
        $toolsDir=Join-Path (Split-Path $installDir -Parent) '.neuropathways-tools'
        $gradleExe=Join-Path $toolsDir "gradle-$gradleVersion\bin\gradle.bat"
        if (-not (Test-Path $gradleExe)) {
            Say "Downloading Gradle $gradleVersion"
            New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
            $zip=Join-Path $toolsDir "gradle-$gradleVersion-bin.zip"
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            Invoke-WebRequest -Uri "https://services.gradle.org/distributions/gradle-$gradleVersion-bin.zip" -OutFile $zip -UseBasicParsing
            Expand-Archive -LiteralPath $zip -DestinationPath $toolsDir -Force
            Remove-Item -LiteralPath $zip -Force
        }
    }
    if (-not (Test-Path $gradleExe) -and -not (Has $gradleExe)) { throw 'Gradle is not available.' }
    Say 'Installing frontend packages'
    Push-Location $frontend
    try {
        if (Test-Path 'package-lock.json') { & npm.cmd ci } else { & npm.cmd install }
        if ($LASTEXITCODE -ne 0) { throw 'npm package installation failed.' }
        if (-not $SkipBuild) {
            Say 'Checking frontend build'
            & npm.cmd run build
            if ($LASTEXITCODE -ne 0) { Write-Warning 'Frontend build failed. Servers will still launch for troubleshooting.' }
        }
    } finally { Pop-Location }
    Say 'Starting backend and frontend'
    $backendCmd='Set-Location -LiteralPath ' + (Quote $backend) + '; & ' + (Quote $gradleExe) + ' bootRun; Write-Host "Backend process ended. Review errors above."'
    $frontendCmd='Set-Location -LiteralPath ' + (Quote $frontend) + '; & npm.cmd run dev; Write-Host "Frontend process ended. Review errors above."'
    Start-Process powershell.exe -WindowStyle Hidden -ArgumentList @('-Command',$backendCmd)
    Start-Sleep -Seconds 4
    Start-Process powershell.exe -WindowStyle Hidden -ArgumentList @('-Command',$frontendCmd)
    Write-Host "`nSetup complete. Open http://localhost:5173 once Vite reports ready." -ForegroundColor Green
    Write-Host 'Servers run in hidden PowerShell processes. Backend: http://localhost:8080.'
} catch {
    Write-Host "`nSetup stopped: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host 'Fix the reported issue and rerun this same script. Existing project files are preserved.' -ForegroundColor Yellow
    exit 1
}

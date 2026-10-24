# NeuroPathways local API smoke / functional test.
# Runs ONLY against localhost by default. Creates one test user and assessment records.
param(
    [string]$FrontendUrl = 'http://localhost:5173',
    [string]$BackendUrl = 'http://localhost:8080',
    [string]$ReportDirectory = '',
    [int]$MaxQuestions = 100
)
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
if ([string]::IsNullOrWhiteSpace($ReportDirectory)) { $ReportDirectory = Join-Path $PSScriptRoot 'smoke-test-reports' }
New-Item -ItemType Directory -Force -Path $ReportDirectory | Out-Null
$api = $BackendUrl.TrimEnd('/') + '/api'
$checks = [System.Collections.Generic.List[object]]::new()
$notes = [System.Collections.Generic.List[string]]::new()
$sessionId = $null
$token = $null
$answersSubmitted = 0
$questionCount = 0
$assessmentResult = $null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
function Add-Check([string]$Name,[string]$Status,[string]$Details) {
    $checks.Add([pscustomobject]@{ Test=$Name; Status=$Status; Details=$Details })
    Write-Host ('[{0}] {1} - {2}' -f $Status,$Name,$Details) -ForegroundColor $(if($Status -eq 'PASS'){'Green'}elseif($Status -eq 'FAIL'){'Red'}else{'Yellow'})
}
function Call-Api([string]$Method,[string]$Path,$Body=$null,[bool]$Authenticated=$false) {
    $headers = @{}
    if($Authenticated -and $token){ $headers.Authorization = 'Bearer ' + $token }
    $args = @{ Uri=($api + $Path); Method=$Method; Headers=$headers; TimeoutSec=20; ErrorAction='Stop' }
    if($null -ne $Body){ $args.ContentType='application/json'; $args.Body=($Body | ConvertTo-Json -Depth 12 -Compress) }
    return Invoke-RestMethod @args
}
function Check-Http([string]$Name,[string]$Url) {
    try {
        $r=Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 15
        if([int]$r.StatusCode -eq 200){ Add-Check $Name 'PASS' 'HTTP 200' }
        else { Add-Check $Name 'FAIL' ('HTTP '+$r.StatusCode) }
    } catch { Add-Check $Name 'FAIL' $_.Exception.Message }
}
function Get-HttpStatus([hashtable]$Request) {
    try { return [int](Invoke-WebRequest @Request -UseBasicParsing -TimeoutSec 15).StatusCode }
    catch {
        if ($_.Exception.Response) { return [int]$_.Exception.Response.StatusCode }
        throw
    }
}
Write-Host '=== NeuroPathways Detailed Local Functional Test ===' -ForegroundColor Cyan
Write-Host "Frontend: $FrontendUrl | Backend: $BackendUrl"
if($BackendUrl -notmatch '^http://(localhost|127\.0\.0\.1)(:\d+)?/?$') {
    throw 'Safety guard: this script creates records and only allows localhost backend URLs.'
}
Check-Http 'Frontend homepage' ($FrontendUrl.TrimEnd('/')+'/')
try {
    $r=Get-HttpStatus @{Uri=($api+'/assessment-sessions/status')}
    if($r -in @(401,403)){ Add-Check 'Protected API requires authentication' 'PASS' ('HTTP '+$r) }
    else { Add-Check 'Protected API requires authentication' 'FAIL' ('Expected 401 or 403, got '+$r) }
} catch { Add-Check 'Protected API requires authentication' 'FAIL' $_.Exception.Message }
try {
    $r=Get-HttpStatus @{Uri=($api+'/auth/login'); Method='POST'; ContentType='application/json'; Body='{"email":"nobody@example.invalid","password":"wrongpassword"}'}
    if($r -in @(401,403)){ Add-Check 'Invalid login rejected' 'PASS' ('HTTP '+$r) }
    elseif($r -eq 200) { Add-Check 'Invalid login rejected' 'FAIL' 'Invalid credentials accepted' }
    else { Add-Check 'Invalid login rejected' 'WARN' ('Expected 401 or 403, got '+$r) }
} catch { Add-Check 'Invalid login rejected' 'FAIL' $_.Exception.Message }
$unique=[guid]::NewGuid().ToString('N').Substring(0,12)
$email='np-smoketest-'+$unique+'@example.invalid'
$pw='NpTest!'+[guid]::NewGuid().ToString('N')+'A1'
try {
    $registered=Call-Api 'POST' '/auth/register' @{firstName='Smoke';lastName='Test';email=$email;password=$pw}
    if($registered.id){ Add-Check 'Register test user' 'PASS' ('User ID '+$registered.id) }
    else { Add-Check 'Register test user' 'WARN' 'Request succeeded, but user ID missing' }
} catch { Add-Check 'Register test user' 'FAIL' $_.Exception.Message }
try {
    $login=Call-Api 'POST' '/auth/login' @{email=$email;password=$pw}
    $token=$login.token
    if($token){ Add-Check 'Login / JWT' 'PASS' 'JWT received (not saved in report)' }
    else { Add-Check 'Login / JWT' 'FAIL' 'No token returned' }
} catch { Add-Check 'Login / JWT' 'FAIL' $_.Exception.Message }
if($token) {
    try {
        $me=Call-Api 'GET' '/users/me' $null $true
        if($me.email -eq $email){ Add-Check 'Authenticated user profile' 'PASS' 'Correct test account returned' }
        else { Add-Check 'Authenticated user profile' 'FAIL' 'Unexpected user profile' }
    } catch { Add-Check 'Authenticated user profile' 'FAIL' $_.Exception.Message }
    try {
        $prefs=Call-Api 'GET' '/preferences/me' $null $true
        Add-Check 'Reading preferences GET' 'PASS' 'Preferences returned'
    } catch { Add-Check 'Reading preferences GET' 'FAIL' $_.Exception.Message }
    try {
        $dashboard=Call-Api 'GET' '/dashboard/me' $null $true
        Add-Check 'Dashboard before assessment' 'PASS' 'Dashboard returned'
    } catch { Add-Check 'Dashboard before assessment' 'FAIL' $_.Exception.Message }
    try {
        $status=Call-Api 'GET' '/assessment-sessions/status' $null $true
        Add-Check 'Initial assessment status' 'PASS' ([string]$status.status)
    } catch { Add-Check 'Initial assessment status' 'FAIL' $_.Exception.Message }
    try {
        $session=Call-Api 'POST' '/assessment-sessions' $null $true
        $sessionId=$session.sessionId
        $questionCount=[int]$session.totalQuestions
        if($sessionId -and $questionCount -gt 0 -and $questionCount -le $MaxQuestions) {
            Add-Check 'Start reading assessment' 'PASS' ("Session $sessionId; $questionCount questions")
        } elseif($questionCount -gt $MaxQuestions) {
            Add-Check 'Start reading assessment' 'WARN' ("$questionCount questions exceeds MaxQuestions $MaxQuestions; skipping answers")
            $sessionId=$null
        } else {
            Add-Check 'Start reading assessment' 'FAIL' 'Missing session ID or valid question count'
            $sessionId=$null
        }
    } catch { Add-Check 'Start reading assessment' 'FAIL' $_.Exception.Message }
    if($sessionId) {
        # Choose the first nonempty option as a synthetic answer. This is NOT an accuracy test.
        $lastStatus=''
        for($i=1;$i -le $questionCount;$i++) {
            try {
                $q=Call-Api 'GET' ("/assessment-sessions/$sessionId/current-question") $null $true
                if(!$q.questionId -or !$q.question -or !$q.options){ throw 'Incomplete question payload' }
                $choice=@('A','B','C','D') | Where-Object { $null -ne $q.options.$_ -and [string]$q.options.$_ -ne '' } | Select-Object -First 1
                if(!$choice){ throw 'No valid answer option in question payload' }
                $body=@{questionId=$q.questionId;selectedOption=$choice;responseTimeMs=1000;usedReadAloud=$false}
                $next=Call-Api 'POST' ("/assessment-sessions/$sessionId/answers") $body $true
                $answersSubmitted++
                $lastStatus=[string]$next.status
                Write-Host ("  Answered question $i/$questionCount (skill: $($q.skill); synthetic option: $choice)")
                if($lastStatus -eq 'COMPLETED'){break}
            } catch {
                Add-Check 'Reading assessment questions / answers' 'FAIL' ("Question $i : "+$_.Exception.Message)
                break
            }
        }
        if($answersSubmitted -eq $questionCount -and $lastStatus -eq 'COMPLETED') {
            Add-Check 'Reading assessment questions / answers' 'PASS' ("$answersSubmitted answers accepted")
            Add-Check 'Assessment completion' 'PASS' 'Status COMPLETED'
        } else { Add-Check 'Assessment completion' 'FAIL' ("Answered $answersSubmitted/$questionCount; status $lastStatus") }
        if($lastStatus -eq 'COMPLETED') {
            try {
                $assessmentResult=Call-Api 'GET' ("/assessment-sessions/$sessionId/results") $null $true
                if($null -ne $assessmentResult.overallScore -and $null -ne $assessmentResult.calculatedLevel) {
                    Add-Check 'Assessment scoring / results API' 'PASS' ("Score $($assessmentResult.overallScore)%; level $($assessmentResult.calculatedLevel); skill categories $(@($assessmentResult.skills).Count)")
                } else { Add-Check 'Assessment scoring / results API' 'FAIL' 'Missing score or level' }
            } catch { Add-Check 'Assessment scoring / results API' 'FAIL' $_.Exception.Message }
            try {
                $after=Call-Api 'GET' '/assessment-sessions/status' $null $true
                if($after.status -eq 'COMPLETED'){ Add-Check 'Persisted assessment status' 'PASS' 'COMPLETED' }
                else { Add-Check 'Persisted assessment status' 'FAIL' ([string]$after.status) }
            } catch { Add-Check 'Persisted assessment status' 'FAIL' $_.Exception.Message }
            try {
                $afterDashboard=Call-Api 'GET' '/dashboard/me' $null $true
                Add-Check 'Dashboard after assessment' 'PASS' 'Dashboard returned after completion'
            } catch { Add-Check 'Dashboard after assessment' 'FAIL' $_.Exception.Message }
        }
    }
}
# No browser automation is performed.
Add-Check 'Browser UI / results-page rendering' 'NOT RUN' 'API-only script; inspect UI manually at localhost:5173'
$counts=@{}
foreach($status in @('PASS','FAIL','WARN','NOT RUN')){$counts[$status]=@($checks | Where-Object Status -eq $status).Count}
$report=[ordered]@{
    generatedAt=(Get-Date).ToString('o');frontendUrl=$FrontendUrl;backendUrl=$BackendUrl
    testAccount=$email;assessmentSessionId=$sessionId;questionCount=$questionCount;answersSubmitted=$answersSubmitted
    score=if($assessmentResult){$assessmentResult.overallScore}else{$null}
    level=if($assessmentResult){$assessmentResult.calculatedLevel}else{$null}
    skills=if($assessmentResult){$assessmentResult.skills}else{@()}
    counts=$counts;checks=$checks.ToArray()
    caveats=@('Creates a test account and assessment records in local H2.','Synthetic answers select the first available option; scores do not reflect learner ability.','Does not test browser rendering, accessibility, or frontend navigation.','Does not test cross-user authorization or production security.')
}
$jsonPath=Join-Path $ReportDirectory ("NeuroPathways-Smoke-$stamp.json")
$txtPath=Join-Path $ReportDirectory ("NeuroPathways-Smoke-$stamp.txt")
$report | ConvertTo-Json -Depth 15 | Set-Content -Path $jsonPath -Encoding UTF8
$lines=@('NeuroPathways Detailed Smoke Test',('Generated: '+$report.generatedAt),('Frontend: '+$FrontendUrl),('Backend: '+$BackendUrl),'',('PASS: '+$counts['PASS']+' | FAIL: '+$counts['FAIL']+' | WARN: '+$counts['WARN']+' | NOT RUN: '+$counts['NOT RUN']),'')
$lines+=@($checks | ForEach-Object { "[$($_.Status)] $($_.Test) - $($_.Details)" })
$lines+=@('','Assessment summary:',("Questions answered: $answersSubmitted / $questionCount"),('Score (synthetic): '+$report.score),('Level (synthetic): '+$report.level),'','Important: synthetic answer scores are not learner performance.','Browser UI and results page were not automatically tested.')
$lines | Set-Content -Path $txtPath -Encoding UTF8
Write-Host "`n=== Results: $($counts['PASS']) passed | $($counts['FAIL']) failed | $($counts['WARN']) warnings | $($counts['NOT RUN']) not run ===" -ForegroundColor Cyan
Write-Host "Text report: $txtPath"
Write-Host "JSON report: $jsonPath"
if($counts['FAIL'] -gt 0){exit 1}
exit 0

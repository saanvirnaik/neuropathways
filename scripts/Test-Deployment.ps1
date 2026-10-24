#requires -Version 7.4
[CmdletBinding()]
param([Parameter(Mandatory)][string]$ConfigPath, [switch]$CreateSyntheticRecords)
$ErrorActionPreference='Stop'
$config=Get-Content -LiteralPath $ConfigPath -Raw | ConvertFrom-Json
$api=$config.Staging.backendUrl.TrimEnd('/') + '/api'
if ([uri]$api -notmatch '^https://') { throw 'Staging must use HTTPS.' }
if ($config.Staging.backendUrl -eq $config.Production.backendUrl) { throw 'Staging and production must use separate backend services.' }
$token=$null
function Call([string]$Method,[string]$Path,$Body=$null) {
    $p=@{Uri="$api$Path";Method=$Method;TimeoutSec=30;MaximumRedirection=0}
    if ($token) { $p.Headers=@{Authorization="Bearer $token"} }
    if ($null -ne $Body) { $p.Body=ConvertTo-Json $Body -Compress; $p.ContentType='application/json' }
    try { Invoke-RestMethod @p } catch { throw "Staging API check failed: $Method $Path" }
}
if (!$CreateSyntheticRecords) { Call GET '/version'; return }
Write-Host 'Creating a synthetic account and assessment in staging.'
$email="deployment-$([guid]::NewGuid().ToString('N'))@example.invalid"
$password="NpTest!$([guid]::NewGuid().ToString('N'))A1"
$user=Call POST '/auth/register' @{firstName='Deployment';lastName='Test';email=$email;password=$password}
$login=Call POST '/auth/login' @{email=$email;password=$password}
$token=$login.token
if (!$token) { throw 'Login returned no token.' }
$me=Call GET '/users/me'
if ($me.email -ne $email) { throw 'Profile does not match synthetic account.' }
$null=Call GET '/preferences/me'
$null=Call GET '/dashboard/me'
$session=Call POST '/assessment-sessions'
if (!$session.sessionId -or $session.totalQuestions -lt 1 -or $session.totalQuestions -gt 100) { throw 'Invalid assessment question count.' }
for ($i=0;$i -lt $session.totalQuestions;$i++) {
    $q=Call GET "/assessment-sessions/$($session.sessionId)/current-question"
    $choice=@('A','B','C','D') | Where-Object { $q.options.$_ } | Select-Object -First 1
    if (!$choice) { throw 'No answer options returned.' }
    $next=Call POST "/assessment-sessions/$($session.sessionId)/answers" @{
        questionId=$q.questionId;selectedOption=$choice;responseTimeMs=1000;usedReadAloud=$false
    }
}
if ($next.status -ne 'COMPLETED') { throw 'Assessment did not complete.' }
$result=Call GET "/assessment-sessions/$($session.sessionId)/results"
if ($null -eq $result.overallScore -or $null -eq $result.calculatedLevel -or !$result.skills) { throw 'Results missing score, level or skills.' }
$status=Call GET '/assessment-sessions/status'
if ($status.status -ne 'COMPLETED') { throw 'Assessment status was not retained.' }
Write-Host "Staging learner flow passed: $($session.totalQuestions) answers, completion and results. Synthetic records remain in staging."

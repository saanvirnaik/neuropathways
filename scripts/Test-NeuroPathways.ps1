# NeuroPathways local smoke test - PowerShell 5.1+
# Default: read-only checks. -TestAuth creates one clearly named local test account.
[CmdletBinding()]
param(
    [string]$FrontendUrl = 'http://localhost:5173',
    [string]$BackendUrl = 'http://localhost:8080',
    [switch]$TestAuth,
    [int]$TimeoutSec = 8
)
$ErrorActionPreference = 'Stop'
$passed = 0; $failed = 0; $warned = 0
function Report([string]$name,[string]$status,[string]$detail='') {
    $color = if ($status -eq 'PASS') {'Green'} elseif ($status -eq 'FAIL') {'Red'} else {'Yellow'}
    Write-Host ('[{0}] {1}{2}' -f $status,$name,$(if($detail){' - '+$detail}else{''})) -ForegroundColor $color
    if($status -eq 'PASS'){$script:passed++}elseif($status -eq 'FAIL'){$script:failed++}else{$script:warned++}
}
function Request([string]$url,[string]$method='GET',[object]$body=$null,[hashtable]$headers=@{}) {
    $args = @{ Uri=$url; Method=$method; TimeoutSec=$TimeoutSec; UseBasicParsing=$true; Headers=$headers }
    if($null -ne $body){$args.Body=($body|ConvertTo-Json -Compress -Depth 8);$args.ContentType='application/json'}
    try {
        $r=Invoke-WebRequest @args
        return @{ Code=[int]$r.StatusCode; Content=[string]$r.Content; Error='' }
    } catch {
        $code=0
        if($_.Exception.Response){try{$code=[int]$_.Exception.Response.StatusCode}catch{}}
        return @{ Code=$code; Content=''; Error=$_.Exception.Message }
    }
}
function CheckPort([int]$port,[string]$label){
    try {
        $c=New-Object Net.Sockets.TcpClient
        $async=$c.BeginConnect('127.0.0.1',$port,$null,$null)
        $ok=$async.AsyncWaitHandle.WaitOne(2000)
        if($ok){$c.EndConnect($async);Report $label 'PASS' "Port $port listening"}else{Report $label 'FAIL' "Port $port not reachable"}
        $c.Close()
    }catch{Report $label 'FAIL' $_.Exception.Message}
}
Write-Host "`n=== NeuroPathways Local Smoke Test ===" -ForegroundColor Cyan
Write-Host "Frontend: $FrontendUrl`nBackend:  $BackendUrl`n"
try { $fu=[uri]$FrontendUrl; $bu=[uri]$BackendUrl } catch { throw 'FrontendUrl and BackendUrl must be valid URLs.' }
if($fu.Host -notin @('localhost','127.0.0.1') -or $bu.Host -notin @('localhost','127.0.0.1')){
    throw 'This smoke test is intended for localhost only. No requests were sent.'
}
CheckPort $fu.Port 'Frontend TCP'
CheckPort $bu.Port 'Backend TCP'
$front=Request $FrontendUrl
if($front.Code -eq 200 -and $front.Content -match '<(html|div|script)') {Report 'Frontend HTTP /' 'PASS' 'Page HTML returned'}
else{Report 'Frontend HTTP /' 'FAIL' "HTTP $($front.Code); $($front.Error)"}
$status=Request "$BackendUrl/api/assessment-sessions/status"
if($status.Code -eq 401 -or $status.Code -eq 403){Report 'Backend protected API' 'PASS' "Unauthenticated request rejected (HTTP $($status.Code))"}
elseif($status.Code -eq 200){Report 'Backend protected API' 'WARN' 'Returned 200 without authentication; review security configuration'}
else{Report 'Backend protected API' 'FAIL' "HTTP $($status.Code); $($status.Error)"}
$badLogin=Request "$BackendUrl/api/auth/login" 'POST' @{email='smoke-test-invalid@example.invalid';password='not-a-real-password'}
if($badLogin.Code -in @(400,401,403)){Report 'Invalid login rejected' 'PASS' "HTTP $($badLogin.Code)"}
elseif($badLogin.Code -eq 200){Report 'Invalid login rejected' 'FAIL' 'Invalid credentials unexpectedly accepted'}
else{Report 'Invalid login rejected' 'WARN' "HTTP $($badLogin.Code); $($badLogin.Error)"}
if($TestAuth){
    Write-Host "`nRunning optional authentication flow. This CREATES a local H2 test user." -ForegroundColor Yellow
    $id=[guid]::NewGuid().ToString('N').Substring(0,12)
    $email="smoke-$id@example.invalid"
    $pw='NpSmoke!'+[guid]::NewGuid().ToString('N')
    $register=Request "$BackendUrl/api/auth/register" 'POST' @{firstName='Smoke';lastName='Test';email=$email;password=$pw}
    if($register.Code -eq 201){
        Report 'Register test account' 'PASS' 'Created disposable local account'
        $login=Request "$BackendUrl/api/auth/login" 'POST' @{email=$email;password=$pw}
        if($login.Code -eq 200){
            try{$data=$login.Content|ConvertFrom-Json}catch{$data=$null}
            if($data -and $data.token){
                Report 'Login test account' 'PASS' 'JWT returned'
                $me=Request "$BackendUrl/api/users/me" 'GET' $null @{Authorization="Bearer $($data.token)"}
                if($me.Code -eq 200){Report 'Authenticated profile' 'PASS'}else{Report 'Authenticated profile' 'FAIL' "HTTP $($me.Code)"}
                $assessment=Request "$BackendUrl/api/assessment-sessions/status" 'GET' $null @{Authorization="Bearer $($data.token)"}
                if($assessment.Code -eq 200){Report 'Authenticated assessment status' 'PASS'}else{Report 'Authenticated assessment status' 'FAIL' "HTTP $($assessment.Code)"}
            }else{Report 'Login test account' 'FAIL' 'No JWT in response'}
        }else{Report 'Login test account' 'FAIL' "HTTP $($login.Code)"}
    }else{Report 'Register test account' 'FAIL' "HTTP $($register.Code); $($register.Error)"}
}
Write-Host "`n=== Results: $passed passed | $failed failed | $warned warnings ===" -ForegroundColor Cyan
Write-Host 'Note: This checks HTTP/API behavior, not browser rendering or completion of an assessment.'
if($failed -gt 0){exit 1}else{exit 0}

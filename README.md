# NeuroPathways

Deployment setup, releases and rollback: [deployment guide](deploy/README.md).

## Windows local setup and smoke tests

Run from the repository root in Windows PowerShell 5.1 or PowerShell 7:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Setup-NeuroPathways.ps1 -ProjectPath "$PWD"
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Test-NeuroPathways.ps1
# Optional: creates a synthetic local account
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Test-NeuroPathways.ps1 -TestAuth
# Creates a synthetic account and assessment records
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Test-NeuroPathways-Detailed.ps1
```

Setup reuses an existing checkout without pulling, installs missing Git/Java 21/compatible Node.js through winget, installs frontend dependencies, and uses the Gradle wrapper, installed Gradle, or a downloaded Gradle distribution. Cloning the private repository requires an authorized GitHub browser sign-in. `-ProjectPath` selects the checkout; otherwise setup searches the current directory, script directory, repository parent, and Documents. `-SkipBuild` skips the frontend build check only. Setup launches hidden backend/frontend PowerShell processes; avoid rerunning it while servers already occupy ports 8080/5173. Stop the corresponding processes when finished.

Wait for the frontend at http://localhost:5173 and backend at http://localhost:8080 before testing. Both test scripts accept `-FrontendUrl` and `-BackendUrl`; use localhost endpoints. The basic test also accepts `-TimeoutSec` (default 8), checks TCP/HTML, protected API rejection and invalid login rejection. `-TestAuth` adds registration, login, profile and assessment-status checks.

The detailed test covers registration/login, profile, reading preferences retrieval, dashboard retrieval, assessment creation, questions and synthetic answers, completion, result fields and subsequent status retrieval. `-MaxQuestions` (default 100) caps the answered assessment size. Text and JSON reports go to `scripts/smoke-test-reports/`, or `-ReportDirectory` when supplied. Custom report destinations should remain outside Git. Test accounts and assessment records remain in the local database; credentials/JWTs are not written to reports. Synthetic scores are not learner results or a scoring-accuracy test. Browser rendering, read-aloud, cross-user authorization and persistence across server restarts are not verified. A nonzero exit code indicates failures; review warnings and skipped checks too.

The repository already tracks `data/neuropathways.mv.db`. This task leaves it intact; ignore rules prevent new H2 runtime files from being added but do not untrack existing files. Do not commit real learner data or credentials.

# Deploy NeuroPathways

Deploy the React frontend to a dedicated Hostinger PHP/HTML website, the Java backend to Render, and the production schema to Neon PostgreSQL. Keep the existing AI Builder website at `neuropathways.neurohearts.org` until staging is verified and a domain cutover is deliberately performed. This script never changes DNS or provisions paid services.

## One-time setup

1. Create separate staging and production PostgreSQL databases in Neon. Use fresh empty databases, not the tracked local H2 database. Keep their credentials separate. Select a region close to Render. Set up and verify the recovery/backup option included in the chosen Neon plan before storing real learner records.
2. Connect Render to the private `saanvirnaik/neuropathways` repository. Create a Docker web service per environment with root directory `neuropathways-backend`, Dockerfile `Dockerfile`, health path `/actuator/health`, and **automatic deploys disabled**. Select plan and region explicitly. Store the following in each service's environment:

   | Variable | Value |
   | --- | --- |
   | `SPRING_PROFILES_ACTIVE` | `prod` for staging and production |
   | `JDBC_DATABASE_URL` | `jdbc:postgresql://HOST/DATABASE?sslmode=require` from Neon; use its direct endpoint initially |
   | `DB_USERNAME`, `DB_PASSWORD` | The matching Neon role credentials |
   | `JWT_SECRET` | Independently generated random secret, at least 32 bytes; never the local fallback |
   | `CORS_ALLOWED_ORIGINS` | Exact frontend HTTPS origin, no trailing slash; comma separated if necessary |

   Render supplies `PORT` and `RENDER_GIT_COMMIT`. `/api/version` exposes only the commit identity. Flyway runs before Hibernate validation. Do not set `ddl-auto=update`, enable H2, or enable SQL debug logging in hosted environments. Initial migrations create tables and the 15 original questions; subsequent startups do not reseed them.
3. Create a **new** Hostinger PHP/HTML site on a temporary domain. Verify capacity and SSH availability in hPanel. Do not upload into the existing AI Builder site. The deployment destination must be an empty, dedicated real `public_html` directory. Back up/review any default files before removing them through a separate explicit action.
4. Enable SSH and add a dedicated deployment public key to Hostinger. Set `NP_SSH_KEY` to the private-key file path. Set `NP_KNOWN_HOSTS` to a file containing the host key verified against Hostinger's trusted fingerprint. Do not disable host-key checking or trust an unverified `ssh-keyscan` result.
5. Copy `deploy/environments.example.json` to `deploy/environments.local.json` and replace the destination placeholders with actual values. Both environment entries are required for staging learner tests and production promotion; never use the same backend/database for both. Set `RENDER_API_KEY` in the shell's environment or secret store. Do not paste keys into chat or commit them.
6. With PowerShell 7.4+, run `./scripts/Deploy-NeuroPathways.ps1 -Environment Staging -Initialize`. This only adopts an empty dedicated directory and creates a deployment marker outside the web root. It refuses a nonempty site.

## Release from Windows or CI

Prerequisites: PowerShell 7.4+, Java 21, Node 24/npm, Git, OpenSSH, tar, and a **disposable PostgreSQL** test database. Set `TEST_POSTGRES_URL`, `TEST_POSTGRES_USER`, and `TEST_POSTGRES_PASSWORD` for that disposable database; never use the production database for these tests. The GitHub workflow creates PostgreSQL 17 automatically.

```powershell
# No builds, network requests or remote writes
./scripts/Deploy-NeuroPathways.ps1 -Environment Staging -Commit <full-sha> -Plan

# Deploy the commit already pushed to the connected repository
./scripts/Deploy-NeuroPathways.ps1 -Environment Staging -Commit <full-sha>

# After staging and browser acceptance checks
./scripts/Deploy-NeuroPathways.ps1 -Environment Production -Commit <same-sha>

# Use a retained release ID from a successful deployment report
./scripts/Deploy-NeuroPathways.ps1 -Environment Production -Rollback <release-id>
```

Source exports are isolated from working-tree edits. The script builds both apps, requires the PostgreSQL integration tests, stages frontend files, deploys the exact backend commit through Render's API, waits for a terminal state and checks health/version, then activates the frontend. It verifies deep routes, CORS, unauthenticated rejection and release identity. Staging also creates a synthetic account and completes an assessment. These synthetic records remain in staging. Browser rendering, read-aloud, cross-user authorization and persistence across restart still require acceptance checks before public launch.

Assets live under `/releases/<commit>-<config-hash>/`. The root entry page is replaced by a same-directory rename after upload; old assets remain available for open browser tabs. CDN rules must respect `Cache-Control: no-store` on `index.html` and `version.json`. Keep the root `.htaccess` under this script's control; it enables React route fallback and disables directory listing. Release manifests and locks are stored in `.neuropathways-deploy` beside `public_html`, not inside it. Local JSON reports are under `.deploy-output/` and are ignored by Git.

The same healthy commit/configuration is verified and skipped on a repeat run. A remote lock serializes local and CI releases. If a backend request times out or its outcome is unknown, the lock is retained: inspect the specific Render deploy and the lock's `owner` file before manually clearing it. Never clear an active deployment lock. An interrupted frontend upload may leave an incomplete release directory; inspect and remove only that incomplete directory before retrying. Do not prune old releases until their retention period and rollback needs are understood.

## Rollback and database compatibility

Rollback asks Render to restore the recorded backend deploy, checks its commit, and activates the retained frontend. Render must still retain that deployment artifact. If it is unavailable, rollback fails without activating the old frontend. Configuration changes to secrets or runtime variables are not rolled back. Use additive, backward-compatible database migrations so the previous application can run against the current database. The script never reverses migrations, deletes learner data or restores an old database automatically.

Deployment is not a distributed transaction. A healthy new backend can remain live if frontend upload/verification fails. The JSON report records the backend deploy ID; inspect and invoke explicit rollback when appropriate. Initial releases have no previous artifact to roll back to. Test rollback in staging before the first production release.

## GitHub Actions

`Validate application` builds the frontend and tests the backend against disposable PostgreSQL on pushes and pull requests. `Deploy NeuroPathways` is manually dispatched and accepts an environment, optional full SHA, or a rollback release ID. Create GitHub environments named `Staging` and `Production`; configure production reviewers/restrictions as appropriate for the repository plan. Set each environment's variable `DEPLOY_CONFIG_JSON` to the complete non-secret configuration JSON. Set secrets `HOSTINGER_SSH_KEY`, `HOSTINGER_KNOWN_HOSTS`, and `RENDER_API_KEY`. Database/JWT production secrets stay in Render.

A deployment workflow must be on the default branch before GitHub exposes manual dispatch. Test the branch first and merge it through the repository's normal review process. Workflows do not create a recurring schedule or enable automatic production deploys. For later periodic releases, agree on a cadence and permitted branch, then invoke this same script; unchanged healthy releases are skipped. Periodic health monitoring should be independent of deployment.

## Public cutover

After staging acceptance, preserve the existing AI Builder site under a temporary address or export it as supported by Hostinger. Prepare a dedicated production PHP/HTML site, provision its Render/Neon configuration, and deploy the tested commit. Verify HTTPS before switching the existing subdomain to the new site. Keep the old destination and DNS records available for a controlled rollback. The script deliberately does not perform this one-time cutover.

References: [Hostinger SSH and transfer support](https://www.hostinger.com/support/which-file-transfer-and-server-access-options-are-supported-at-hostinger/), [Render deployment API](https://api-docs.render.com/reference/create-deploy), [Render rollback API](https://api-docs.render.com/reference/rollback-deploy), [Spring Boot migrations](https://docs.spring.io/spring-boot/how-to/data-initialization.html).

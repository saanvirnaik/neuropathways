#!/usr/bin/env bash
set -euo pipefail
# Run on Linux CI, with no Hostinger connection and no external side effects.
repo=$(cd "$(dirname "$0")/.." && pwd)
site="np-release-test-$RANDOM-$RANDOM"
parent="/home/$(id -un)/domains/$site"
root="$parent/public_html"
owner=11111111111111111111111111111111
other=22222222222222222222222222222222
release=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-bbbbbbbbbbbb
[[ ! -e "$parent" ]]
mkdir -p "$root"
trap '[[ "$parent" == /home/"$(id -un)"/domains/np-release-test-* ]] && rm -rf -- "$parent"' EXIT
remote() { bash "$repo/deploy/hostinger-release.sh" "$1" "$root" "$owner" "${2:-}"; }
printf 'existing site' > "$root/index.html"
if remote initialize; then echo 'Accepted nonempty website'; exit 1; fi
[[ "$(cat "$root/index.html")" == 'existing site' ]]
rm "$root/index.html"
remote initialize
remote acquire
if bash "$repo/deploy/hostinger-release.sh" acquire "$root" "$other"; then echo 'Accepted simultaneous deploy'; exit 1; fi
incoming=$(remote prepare)
mkdir "$parent/bundle"
printf '<html><script src="/releases/%s/assets/app.js"></script></html>' "$release" > "$parent/bundle/index.html"
printf '{"release":"%s"}' "$release" > "$parent/bundle/version.json"
tar -czf "$incoming/frontend.tar.gz" -C "$parent/bundle" .
remote stage "$release"
printf '{"release":"%s"}' "$release" > "$incoming/release.json"
remote activate "$release"
cmp "$parent/bundle/index.html" "$root/index.html"
[[ -f "$root/.htaccess" && ! -f "$root/current.json" ]]
remote current | grep -q "$release"
remote release-lock
remote acquire
remote stage "$release"
remote release-lock
echo 'Hostinger empty-site protection, lock, stage, activation, manifest and identical retry passed.'

#!/usr/bin/env bash
# Invoked over SSH by Deploy-NeuroPathways.ps1. Arguments are validated on both ends.
set -euo pipefail
action=${1:?}; root=${2:?}; owner=${3:?}; release=${4:-}
[[ "$root" =~ ^/home/[a-zA-Z0-9_-]+/domains/[a-zA-Z0-9.-]+/public_html$ ]] || exit 64
[[ "$owner" =~ ^[a-f0-9]{32}$ ]] || exit 64
[[ -z "$release" || "$release" =~ ^[a-f0-9]{40}-[a-f0-9]{12}$ ]] || exit 64
[[ -d "$root" && ! -L "$root" ]] || { echo 'Expected an existing real document root' >&2; exit 65; }
[[ "$(realpath "$root")" == "$root" ]] || { echo 'Refusing a symlinked path' >&2; exit 65; }
state="$(dirname "$root")/.neuropathways-deploy"
[[ ! -L "$state" && ! -L "$root/releases" ]] || exit 65
if [[ "$action" == initialize ]]; then
    if [[ -f "$state/managed" ]]; then echo 'Already initialized'; exit 0; fi
    [[ -z "$(find "$root" -mindepth 1 -maxdepth 1 -print -quit)" ]] || {
        echo 'Refusing to initialize a nonempty website. Use a new empty staging website.' >&2; exit 65;
    }
    mkdir -p "$state" "$root/releases"
    printf '%s\n' "$root" > "$state/managed"
    exit 0
fi
[[ -f "$state/managed" && "$(cat "$state/managed")" == "$root" ]] || {
    echo 'Website has not been initialized for NeuroPathways deployment' >&2; exit 65;
}
case "$action" in
    acquire)
        mkdir "$state/lock" || { echo 'Another deployment owns the lock; inspect before clearing it' >&2; exit 75; }
        printf '%s' "$owner" > "$state/lock/owner"
        ;;
    current)
        if [[ -f "$state/current.json" ]]; then cat "$state/current.json"; else printf '{}'; fi
        ;;
    *)
        [[ -f "$state/lock/owner" && "$(cat "$state/lock/owner")" == "$owner" ]] || exit 75
        case "$action" in
            release-lock) rm -- "$state/lock/owner"; rmdir "$state/lock" ;;
            prepare) mkdir -p "$state/incoming-$owner"; printf '%s' "$state/incoming-$owner" ;;
            stage)
                incoming="$state/incoming-$owner"
                mkdir "$incoming/unpacked"
                tar -xzf "$incoming/frontend.tar.gz" -C "$incoming/unpacked"
                checksum=$(cd "$incoming/unpacked"; find . -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1)
                if [[ -e "$root/releases/$release" ]]; then
                    [[ -f "$state/$release.sha256" && "$(cat "$state/$release.sha256")" == "$checksum" ]] || {
                        echo 'Existing release differs or is incomplete; inspect it before retrying' >&2; exit 65;
                    }
                    exit 0
                fi
                mv "$incoming/unpacked" "$root/releases/$release"
                [[ -s "$root/releases/$release/index.html" && -s "$root/releases/$release/version.json" ]]
                printf '%s' "$checksum" > "$state/$release.sha256"
                ;;
            manifest) cat "$state/$release.json" ;;
            verify)
                [[ -s "$state/incoming-$owner/verification.json" ]]
                cp "$state/incoming-$owner/verification.json" "$root/.verification-$owner"
                mv -f "$root/.verification-$owner" "$root/verification.json"
                ;;
            activate)
                [[ -s "$root/releases/$release/index.html" && -s "$state/incoming-$owner/release.json" ]]
                # Static assets are uploaded first. Retain older release directories for open browser tabs.
                cp "$root/releases/$release/index.html" "$root/.index-$owner"
                cp "$root/releases/$release/version.json" "$root/.version-$owner"
                cp "$state/incoming-$owner/release.json" "$state/$release.json"
                cat > "$root/.htaccess" <<'HTACCESS'
Options -Indexes
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^releases/ - [R=404,L]
RewriteRule ^ index.html [L]
<IfModule mod_headers.c>
  <FilesMatch "^(index\.html|version\.json|verification\.json)$">
    Header set Cache-Control "no-store"
  </FilesMatch>
</IfModule>
HTACCESS
                mv -f "$root/.index-$owner" "$root/index.html"
                mv -f "$root/.version-$owner" "$root/version.json"
                cp "$state/$release.json" "$state/current.next"
                mv -f "$state/current.next" "$state/current.json"
                ;;
            *) echo 'Unknown action' >&2; exit 64 ;;
        esac
        ;;
esac

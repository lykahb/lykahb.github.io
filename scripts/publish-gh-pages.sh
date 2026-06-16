#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

source_branch="master"
publish_branch="gh-pages"
publish_dir="$repo_root/public"

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "$source_branch" ]]; then
  echo "Publish must be run from $source_branch; current branch is $current_branch." >&2
  exit 1
fi

if [[ "${PUBLISH_ALLOW_DIRTY:-0}" != "1" ]]; then
  if [[ -n "$(git status --porcelain --untracked-files=all)" ]]; then
    echo "Working tree must be clean before publishing." >&2
    echo "Commit or stash source changes, then run this script again." >&2
    exit 1
  fi
fi

if ! command -v zola >/dev/null 2>&1; then
  echo "zola is required but was not found on PATH." >&2
  exit 1
fi

zola build --force

if [[ ! -f "$publish_dir/index.html" ]]; then
  echo "Expected $publish_dir/index.html after build, but it was not found." >&2
  exit 1
fi

touch "$publish_dir/.nojekyll"

tmp_index="$(mktemp "${TMPDIR:-/tmp}/gh-pages-index.XXXXXX")"
trap 'rm -f "$tmp_index"' EXIT

GIT_INDEX_FILE="$tmp_index" git read-tree --empty
GIT_INDEX_FILE="$tmp_index" git --git-dir="$repo_root/.git" --work-tree="$publish_dir" add -A .

tree="$(GIT_INDEX_FILE="$tmp_index" git write-tree)"
source_rev="$(git rev-parse --short HEAD)"
commit_message="Publish site from $source_branch@$source_rev"
commit="$(printf '%s\n' "$commit_message" | GIT_INDEX_FILE="$tmp_index" git commit-tree "$tree")"

git update-ref "refs/heads/$publish_branch" "$commit"

echo "Updated local $publish_branch to $commit"
echo
echo "Review if desired:"
echo "  git show --stat $publish_branch"
echo
echo "Push manually:"
echo "  git push --force-with-lease origin $publish_branch"

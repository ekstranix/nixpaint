#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

# --- Pre-flight checks ---
echo "Running pre-flight checks..."

echo "  Checking for clean working tree..."
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: Working tree is not clean. Commit or stash changes first."
  exit 1
fi

echo "  Running lint..."
pnpm lint || { echo "Error: Lint failed."; exit 1; }

echo "  Running typecheck..."
pnpm typecheck || { echo "Error: Typecheck failed."; exit 1; }

echo "  Running tests..."
pnpm test || { echo "Error: Tests failed."; exit 1; }

echo "  Building..."
pnpm build || { echo "Error: Build failed."; exit 1; }

echo "All checks passed."
echo ""

# --- Read current version ---
CURRENT_VERSION=$(node -p "require('./package.json').version")
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

echo "Current version: $CURRENT_VERSION"
echo ""
echo "Select bump type:"
echo "  1) patch  ($MAJOR.$MINOR.$((PATCH + 1)))"
echo "  2) minor  ($MAJOR.$((MINOR + 1)).0)"
echo "  3) major  ($((MAJOR + 1)).0.0)"
echo ""
read -rp "Choice [1/2/3]: " CHOICE

case "$CHOICE" in
  1|patch)  NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))" ;;
  2|minor)  NEW_VERSION="$MAJOR.$((MINOR + 1)).0" ;;
  3|major)  NEW_VERSION="$((MAJOR + 1)).0.0" ;;
  *)        echo "Invalid choice"; exit 1 ;;
esac

echo ""
echo "Bumping $CURRENT_VERSION → $NEW_VERSION"

# --- Extract Unreleased section ---
# Get everything between ## [Unreleased] and the next ## [ heading (or EOF)
CHANGELOG_SECTION=$(awk '
  /^## \[Unreleased\]/ { found=1; next }
  found && /^## \[/ { exit }
  found { print }
' CHANGELOG.md)

# Trim leading/trailing blank lines
CHANGELOG_SECTION=$(echo "$CHANGELOG_SECTION" | sed '/./,$!d' | sed -e :a -e '/^\n*$/{$d;N;ba}')

if [ -z "$CHANGELOG_SECTION" ]; then
  echo "Error: No entries in [Unreleased] section. Add changelog entries before releasing."
  exit 1
fi

echo ""
echo "Changelog entries:"
echo "$CHANGELOG_SECTION"
echo ""
read -rp "Proceed? [y/N]: " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "Aborted."
  exit 0
fi

TODAY=$(date +%Y-%m-%d)

# --- Update CHANGELOG.md ---
# Replace "## [Unreleased]" with "## [Unreleased]\n\n## [X.Y.Z] - DATE"
sed -i "s/^## \[Unreleased\]/## [Unreleased]\n\n## [$NEW_VERSION] - $TODAY/" CHANGELOG.md

# --- Update package.json version ---
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  pkg.version = '$NEW_VERSION';
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# --- Git commit, tag, push ---
git add CHANGELOG.md package.json
git commit -m "release: v$NEW_VERSION"
git tag "v$NEW_VERSION"
git push
git push --tags

# --- Create GitHub release ---
gh release create "v$NEW_VERSION" \
  --title "v$NEW_VERSION" \
  --notes "$CHANGELOG_SECTION"

echo ""
echo "Released v$NEW_VERSION"

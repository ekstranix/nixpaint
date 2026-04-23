## Context

Currently version is hardcoded as `0.1.0` in package.json and not shown anywhere in the app. Deploys happen on every push to main. There is no changelog or release process.

## Goals / Non-Goals

**Goals:**
- `package.json` version as single source of truth
- Vite injects version at build time, About dialog reads it
- Keep a Changelog format with Unreleased section
- Bash release script handles the full release flow
- Deploy only on version tag push

**Non-Goals:**
- Automated changelog generation from commits
- Pre-release / beta versions
- npm publishing

## Decisions

### `package.json` version as SST, injected via Vite `define`
**Rationale:** `package.json` already has a version field. Vite can read it and expose it as `__APP_VERSION__` at build time. No generated file needed, no extra build step.

```ts
// vite.config.ts
import pkg from "./package.json";
define: { __APP_VERSION__: JSON.stringify(pkg.version) }
```

A global type declaration (`src/env.d.ts` or similar) declares `const __APP_VERSION__: string` for TypeScript.

**Alternative considered:** A generated `src/version.ts` file — adds a file to manage and potentially get out of sync.

### Release script: `scripts/release.sh`
**Rationale:** A simple bash script is sufficient. No need for a release framework. The script:
1. Asks for bump type (major/minor/patch)
2. Computes new version from current `package.json` version
3. Extracts `[Unreleased]` section from CHANGELOG.md
4. Replaces `## [Unreleased]` with `## [X.Y.Z] - YYYY-MM-DD` and adds a fresh `## [Unreleased]` above
5. Updates `package.json` version
6. Commits all changes with message `release: vX.Y.Z`
7. Tags `vX.Y.Z`
8. Pushes commit + tag
9. Creates GitHub release via `gh release create` with the extracted changelog as notes

### Deploy on tag only, CI on both
**Rationale:** Split the trigger — CI (check + e2e) runs on push to main and PRs as before. The deploy job's `if` condition changes from `github.event_name == 'push'` to `startsWith(github.ref, 'refs/tags/v')`. Tag pushes also trigger the full workflow (they match `push`), so CI gates the deploy.

```yaml
on:
  push:
    branches: [main]
    tags: ['v*']
  pull_request:
    branches: [main]

jobs:
  deploy:
    needs: [check, e2e]
    if: startsWith(github.ref, 'refs/tags/v')
```

### Changelog link points to GitHub releases
**Rationale:** GitHub releases page is more user-friendly than a raw markdown file. The release script creates releases with notes, so the page is always up to date.

## Risks / Trade-offs

- **[Manual changelog entries]** → Developers must add entries under `[Unreleased]` as they work. If forgotten, the release will have an empty changelog section. The release script should abort if the Unreleased section is empty.
- **[Bash-only script]** → Won't work natively on Windows. Acceptable since this is a NixOS project.

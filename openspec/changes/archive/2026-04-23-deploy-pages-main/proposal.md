## Why

The app needs to be deployed to `nixpaint.extranix.com`. Cloudflare Pages will serve the site by watching a dedicated `pages-main` branch containing pre-built static files. GitHub Actions should handle the build so Cloudflare only needs to serve, not build.

## What Changes

- Add a `deploy` job to the CI workflow that builds the Vite app and force-pushes `dist/` contents to a `pages-main` branch
- The deploy job runs only after `check` and `e2e` jobs pass
- Only triggers on pushes to `main` (not PRs)

## Capabilities

### New Capabilities
- `ci-deploy`: GitHub Actions workflow job that builds and publishes static assets to `pages-main` branch for Cloudflare Pages consumption

### Modified Capabilities

_None — no existing spec-level behavior changes._

## Impact

- `.github/workflows/ci.yml`: New `deploy` job added
- Requires `pages-main` branch to exist (created automatically by the workflow)
- Workflow needs write permissions to push to `pages-main`

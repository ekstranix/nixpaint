## Context

The nixpaint app is a Vite+React SPA. CI already runs `check` (lint, typecheck, test) and `e2e` jobs on push to `main`. The built static files need to land on a `pages-main` branch so Cloudflare Pages can serve them at `nixpaint.extranix.com` without running its own build.

## Goals / Non-Goals

**Goals:**
- Automatically build and publish static assets to `pages-main` on every push to `main`
- Only deploy after CI passes (both `check` and `e2e`)
- Keep the workflow self-contained in `ci.yml`

**Non-Goals:**
- Cloudflare Pages configuration (done separately in Cloudflare dashboard)
- Preview deployments for PRs
- Custom domain DNS setup

## Decisions

### Use `peaceiris/actions-gh-pages` for branch deployment
**Rationale:** Well-maintained action that handles orphan branch creation, force-push, and cleanup. Avoids manual git scripting in the workflow. Uses `GITHUB_TOKEN` — no deploy keys needed.

**Alternative considered:** Manual `git checkout --orphan && git push --force` — more fragile, more YAML, same result.

### Single workflow file with `deploy` job
**Rationale:** Keep all CI/CD in one file. The `deploy` job uses `needs: [check, e2e]` and an `if` condition to only run on push (not PRs).

### No Vite `base` path
**Rationale:** Site is served at root of `nixpaint.extranix.com`, not a subpath. Default `base: '/'` is correct.

## Risks / Trade-offs

- **[Force-push to `pages-main`]** → Expected behavior; this branch is build output only, never edited manually.
- **[`GITHUB_TOKEN` permissions]** → Workflow needs `contents: write`. This is scoped to the deploy job only.

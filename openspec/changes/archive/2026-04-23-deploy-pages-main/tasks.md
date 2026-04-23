## 1. Add deploy job to CI workflow

- [x] 1.1 Add `deploy` job to `.github/workflows/ci.yml` with `needs: [check, e2e]`
- [x] 1.2 Add `if: github.event_name == 'push'` condition so deploy skips PR events
- [x] 1.3 Add `permissions: contents: write` scoped to the deploy job
- [x] 1.4 Add checkout, pnpm, node setup steps (matching existing jobs)
- [x] 1.5 Add `pnpm install --frozen-lockfile` and `pnpm build` steps
- [x] 1.6 Add `peaceiris/actions-gh-pages` step to push `dist/` to `pages-main` branch

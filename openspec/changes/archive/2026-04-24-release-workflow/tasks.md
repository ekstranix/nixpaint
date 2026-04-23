## 1. Version injection

- [x] 1.1 Add Vite `define` for `__APP_VERSION__` from `package.json` in `vite.config.ts`
- [x] 1.2 Add TypeScript global declaration for `__APP_VERSION__: string`

## 2. About dialog updates

- [x] 2.1 Display `__APP_VERSION__` in the About dialog
- [x] 2.2 Add changelog link to GitHub releases page in the About dialog

## 3. CHANGELOG.md

- [x] 3.1 Create `CHANGELOG.md` with initial `[Unreleased]` section and retroactive entries for existing features

## 4. Release script

- [x] 4.1 Create `scripts/release.sh` that prompts for major/minor/patch
- [x] 4.2 Compute new version from current `package.json` version
- [x] 4.3 Extract Unreleased section from CHANGELOG.md; abort if empty
- [x] 4.4 Replace `[Unreleased]` heading with new version + date, add fresh Unreleased placeholder
- [x] 4.5 Update `package.json` version
- [x] 4.6 Commit, tag, push, and create GitHub release with changelog notes

## 5. Deploy workflow

- [x] 5.1 Add `tags: ['v*']` to the push trigger in `ci.yml`
- [x] 5.2 Change deploy job `if` condition from `github.event_name == 'push'` to `startsWith(github.ref, 'refs/tags/v')`

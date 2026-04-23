## MODIFIED Requirements

### Requirement: Build and publish to pages-main on tag push
The CI workflow SHALL build the Vite app and force-push the contents of `dist/` to the `pages-main` branch whenever a version tag (`v*`) is pushed.

#### Scenario: Successful deploy after CI passes on tag
- **WHEN** a version tag is pushed and both `check` and `e2e` jobs pass
- **THEN** the `deploy` job SHALL run `pnpm build` and push the built output to `pages-main`

#### Scenario: CI failure prevents deploy
- **WHEN** a version tag is pushed and either `check` or `e2e` fails
- **THEN** the `deploy` job SHALL NOT run

#### Scenario: Push to main does not deploy
- **WHEN** a regular push to `main` occurs (no tag)
- **THEN** the `deploy` job SHALL NOT run

### Requirement: Deploy only on tag push, not on pull requests or branch push
The `deploy` job SHALL only execute on version tag pushes (`v*`), not on branch pushes or pull request events.

#### Scenario: PR does not trigger deploy
- **WHEN** a pull request is opened or updated targeting `main`
- **THEN** the `deploy` job SHALL NOT run

### Requirement: Workflow has write permissions scoped to deploy job
The workflow SHALL grant `contents: write` permission only to the `deploy` job, not globally.

#### Scenario: Deploy job can push to pages-main
- **WHEN** the `deploy` job runs
- **THEN** it SHALL have sufficient permissions to force-push to the `pages-main` branch

## ADDED Requirements

### Requirement: Nix development environment
The project SHALL include a `flake.nix` providing a devShell with Node.js, pnpm, and all tools needed to develop and build the project.

#### Scenario: Enter dev environment
- **WHEN** developer runs `nix develop`
- **THEN** a shell is available with node, pnpm, and all project tooling on PATH

### Requirement: Nix build output
The `flake.nix` SHALL include a package that builds the static site output.

#### Scenario: Build with Nix
- **WHEN** developer runs `nix build`
- **THEN** the `result/` directory contains the static site files ready for deployment

### Requirement: Biome for linting and formatting
The project SHALL use Biome as the single tool for both linting and code formatting.

#### Scenario: Check formatting and lint
- **WHEN** developer runs `pnpm lint`
- **THEN** Biome checks all source files for lint errors and formatting issues

### Requirement: TypeScript strict mode
The project SHALL use TypeScript with `strict: true` enabled.

#### Scenario: Type errors caught at build time
- **WHEN** developer introduces a type error
- **THEN** `pnpm typecheck` fails with a descriptive error

### Requirement: Vitest for unit tests
The project SHALL use Vitest as the unit test runner.

#### Scenario: Run unit tests
- **WHEN** developer runs `pnpm test`
- **THEN** Vitest executes all `*.test.ts` files and reports results

### Requirement: Playwright for E2E tests
The project SHALL use Playwright for end-to-end browser tests.

#### Scenario: Run E2E tests
- **WHEN** developer runs `pnpm test:e2e`
- **THEN** Playwright launches a browser and runs all `*.spec.ts` test files

### Requirement: CI pipeline
The project SHALL include a GitHub Actions workflow that runs lint, typecheck, unit tests, and E2E tests on every push and pull request.

#### Scenario: CI runs on push
- **WHEN** code is pushed to any branch
- **THEN** the CI pipeline runs all checks and reports pass/fail status

### Requirement: README
The project SHALL include a README.md documenting: what Drawnix is, how to set up the development environment, how to build, and how to run tests.

#### Scenario: Developer reads README
- **WHEN** a new developer opens the repository
- **THEN** the README provides enough information to get started with `nix develop` and `pnpm dev`

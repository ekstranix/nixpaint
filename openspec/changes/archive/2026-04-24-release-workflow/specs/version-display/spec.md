## ADDED Requirements

### Requirement: Version injected at build time
The application version from `package.json` SHALL be injected at build time via Vite's `define` as `__APP_VERSION__`.

#### Scenario: Version available in app code
- **WHEN** the application is built
- **THEN** `__APP_VERSION__` SHALL resolve to the version string from `package.json`

### Requirement: TypeScript type declaration for version global
A type declaration SHALL exist so that `__APP_VERSION__` is typed as `string` in TypeScript.

#### Scenario: No TypeScript error
- **WHEN** code references `__APP_VERSION__`
- **THEN** TypeScript SHALL not report a type error

# Nixpaint




An online paint application where you paint with Nix lambda shapes. Lambdas are stamped along your brush strokes onto a hex grid, auto-rotated to tile seamlessly — just like the NixOS snowflake logo.

## Color Palettes

- **Nix Blue** — the classic two-tone blue (`#7EBAE4`, `#5277C3`)
- **NixOS Rainbow** — six colors from the NixOS pride logo

## Development

### Prerequisites

- [Nix](https://nixos.org/download/) with flakes enabled

### Setup

```bash
nix develop
pnpm install
```

### Commands

```bash
pnpm dev          # Start dev server with HMR
pnpm build        # Build for production
pnpm lint         # Check lint and formatting (Biome)
pnpm format       # Auto-fix lint and formatting
pnpm typecheck    # TypeScript type checking
pnpm test         # Run unit tests (Vitest)
pnpm test:e2e     # Run E2E tests (Playwright)
```

### Build with Nix

```bash
nix build
# Static site output in ./result/
```

## Tech Stack

- React + TypeScript
- Vite (build)
- Zustand (state)
- Biome (lint + format)
- Vitest (unit tests)
- Playwright (E2E tests)
- Nix flake (dev environment + build)

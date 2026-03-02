# pi-utils-ui

Public package with shared TUI primitives and render helpers for Pi extensions.

## Scope

- Shared UI primitives and panels (`primitives/`)
- Reusable widgets (`widgets/`)
- Tool rendering utilities (`tools/`)

## Rules

- Keep APIs stable and additive where possible.
- Keep renderer output deterministic and easy to test.
- Minimize coupling to any single extension.

## Quality gates

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Versioning

Uses changesets.

- `patch`: bug fixes, visual correctness fixes, docs
- `minor`: new helpers/components, non-breaking additions
- `major`: breaking API changes

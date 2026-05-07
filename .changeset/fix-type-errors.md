---
"@aliou/pi-utils-ui": patch
---

fix strict type errors across all modules

Fixed TS errors from `noUncheckedIndexedAccess`, `noUnusedLocals`, and `noUnusedParameters` across showcase, data-table, steps, columns, stack, breadcrumbs, and tabs.
Disabled `noNonNullAssertion` lint rule in biome.json to align with strict checking.

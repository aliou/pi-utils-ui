---
"@aliou/pi-utils-ui": patch
---

Fix `TabsTheme` typing so a real pi `Theme` satisfies it: `fg()` no longer accepts `"selectedBg"` (pi treats it as a background token) and `bg()` now takes `"selectedBg"` only. Widen optional peer dependencies `@earendil-works/pi-coding-agent` and `@earendil-works/pi-tui` to `>=0.74.0 <2` so Pi 1.0.0 is supported.

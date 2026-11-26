---
"@aliou/pi-utils-ui": patch
---

Type `DataTable.render()` and `ToolCallHeader.render()` as returning `readonly string[]` so the package typechecks against pi-tui 1.6, whose components return read-only cached arrays.

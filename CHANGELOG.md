# @aliou/pi-utils-ui

## 0.2.0

### Minor Changes

- e0ad809: Refactor `Frame` to extend `Container` from `pi-tui`, inheriting `addChild`, `removeChild`, and `clear`. `borderColor` is now required. Children are no longer accepted via constructor options — use `addChild` instead.

## 0.1.5

### Patch Changes

- 72da619: Add a reusable `Frame` widget that wraps child components in a rounded border and allows configuring the border color.

## 0.1.4

### Patch Changes

- b14fb96: Relax Pi peer dependency ranges for pi-coding-agent and pi-tui to support current and future Pi versions without strict pinning.

## 0.1.3

### Patch Changes

- 76e7ef2: update Pi deps to 0.61.0

## 0.1.1

### Patch Changes

- 2f5ec32: mark pi SDK peer deps as optional to prevent koffi OOM in Gondolin VMs

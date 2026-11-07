![banner](https://assets.aliou.me/github/aliou/pi-utils-ui/banner.png)

# @aliou/pi-utils-ui

Internal shared TUI abstractions for Pi extensions.

## Modules

- `tools`: reusable tool call/result UI components.
- `widgets`: reusable interactive panels and viewers.
- `primitives`: ANSI-safe layout and rendering helpers.

## Usage

```ts
import {
  ToolHeader,
  ToolBody,
  ToolLlmTelemetryFooter,
  ToolCallListField,
  MarkdownResponseField,
  createRenderCache,
} from "@aliou/pi-utils-ui";
```

## Truncation

The root export `truncateToWidth` truncates text to display cells without injecting resets, so caller-applied styling survives. Prefer it over `@earendil-works/pi-tui`'s version, which closes styles early and mis-parses non-SGR sequences.
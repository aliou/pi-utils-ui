import type {
  Theme,
  ToolRenderResultOptions,
} from "@mariozechner/pi-coding-agent";
import type { Component } from "@mariozechner/pi-tui";
import { Text } from "@mariozechner/pi-tui";

export type ToolBodyField =
  | { label: string; value: string; showCollapsed?: boolean }
  | (Component & { showCollapsed?: boolean });

export interface ToolBodyConfig {
  fields: ToolBodyField[];
  footer?: Component;
  includeSpacerBeforeFooter?: boolean;
}

export class ToolBody implements Component {
  constructor(
    private config: ToolBodyConfig,
    private options: ToolRenderResultOptions,
    private theme: Theme,
  ) {}

  handleInput(_data: string): boolean {
    return false;
  }

  invalidate(): void {}

  update(config: ToolBodyConfig, options: ToolRenderResultOptions): void {
    this.config = config;
    this.options = options;
  }

  render(width: number): string[] {
    const lines: string[] = [];
    const th = this.theme;

    const fieldsToRender = this.options.expanded
      ? this.config.fields
      : this.config.fields.filter(
          (field) => "showCollapsed" in field && field.showCollapsed,
        );

    for (const field of fieldsToRender) {
      if (isComponent(field)) {
        lines.push(...field.render(width));
      } else {
        const text = new Text(
          `${th.fg("muted", `${field.label}: `)}${field.value}`,
          0,
          0,
        );
        lines.push(...text.render(width));
      }
    }

    if (this.config.footer) {
      if (this.config.includeSpacerBeforeFooter ?? true) {
        lines.push("");
      }
      lines.push(...this.config.footer.render(width));
    }

    return lines;
  }
}

function isComponent(field: ToolBodyField): field is Component {
  return "render" in field && typeof (field as Component).render === "function";
}

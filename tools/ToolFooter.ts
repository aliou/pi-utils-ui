import type { Theme } from "@mariozechner/pi-coding-agent";
import type { Component } from "@mariozechner/pi-tui";
import { truncateToWidth } from "@mariozechner/pi-tui";

export interface ToolFooterItem {
  label?: string;
  value: string;
  tone?: "muted" | "accent" | "success" | "warning" | "error";
}

export interface ToolFooterConfig {
  items: ToolFooterItem[];
  separator?: " - " | " | ";
  truncate?: boolean;
}

export class ToolFooter implements Component {
  constructor(
    private theme: Theme,
    private config: ToolFooterConfig,
  ) {}

  handleInput(_data: string): boolean {
    return false;
  }

  invalidate(): void {}

  update(config: ToolFooterConfig): void {
    this.config = config;
  }

  render(width: number): string[] {
    const th = this.theme;
    const parts = this.config.items
      .filter((item) => Boolean(item.value))
      .map((item) => {
        const tone = item.tone ?? "muted";
        const raw = item.label ? `${item.label}: ${item.value}` : item.value;
        return th.fg(tone, raw);
      });

    const line = parts.join(this.config.separator ?? " - ");

    if (this.config.truncate ?? true) {
      return [truncateToWidth(line, width)];
    }

    return [line];
  }
}

import type { Theme } from "@mariozechner/pi-coding-agent";
import { getMarkdownTheme } from "@mariozechner/pi-coding-agent";
import type { Component } from "@mariozechner/pi-tui";
import { Markdown, Text } from "@mariozechner/pi-tui";

export class MarkdownField implements Component {
  constructor(
    private label: string,
    private content: string,
    private theme: Theme,
  ) {}

  handleInput(_data: string): boolean {
    return false;
  }

  invalidate(): void {}

  render(width: number): string[] {
    if (!this.content) return [];

    const lines: string[] = [];
    lines.push(this.theme.fg("muted", `${this.label}:`));

    try {
      const markdownTheme = getMarkdownTheme();
      const markdown = new Markdown(this.content, 2, 0, markdownTheme);
      lines.push(...markdown.render(width));
    } catch {
      const text = new Text(this.content, 0, 0);
      lines.push(...text.render(width));
    }

    return lines;
  }
}

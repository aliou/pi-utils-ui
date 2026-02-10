import type { Theme } from "@mariozechner/pi-coding-agent";
import { DynamicBorder, getMarkdownTheme } from "@mariozechner/pi-coding-agent";
import type { Component, MarkdownTheme } from "@mariozechner/pi-tui";
import { Markdown, Text } from "@mariozechner/pi-tui";

export class MarkdownResponseField implements Component {
  private border: DynamicBorder;
  private markdown: Markdown | null = null;
  private markdownTheme: MarkdownTheme | null = null;

  constructor(
    private content: string,
    theme: Theme,
  ) {
    this.border = new DynamicBorder((segment) => theme.fg("muted", segment));
  }

  handleInput(_data: string): boolean {
    return false;
  }

  setContent(content: string): void {
    this.content = content;
    this.markdown?.setText(content);
  }

  invalidate(): void {
    this.markdown?.invalidate();
  }

  render(width: number): string[] {
    if (!this.content) return [];

    const lines: string[] = [];
    lines.push(...this.border.render(width));
    lines.push("");

    try {
      if (!this.markdownTheme) {
        this.markdownTheme = getMarkdownTheme();
      }

      if (!this.markdown) {
        this.markdown = new Markdown(this.content, 0, 0, this.markdownTheme);
      }

      lines.push(...this.markdown.render(width));
    } catch {
      const text = new Text(this.content, 0, 0);
      lines.push(...text.render(width));
    }

    lines.push("");
    return lines;
  }
}

import type { Theme } from "@mariozechner/pi-coding-agent";
import { DynamicBorder } from "@mariozechner/pi-coding-agent";
import type { Component, TUI } from "@mariozechner/pi-tui";
import { matchesKey, truncateToWidth } from "@mariozechner/pi-tui";

export interface ScrollablePanelOptions {
  title: string;
  maxVisible?: number;
  keymap?: "default" | "vim";
  buildContent: (width: number, theme: Theme) => string[];
  onClose: () => void;
}

export class ScrollablePanel implements Component {
  private scrollOffset = 0;
  private pendingG = false;
  private cachedLines: string[] | null = null;
  private cachedWidth = 0;
  private border: DynamicBorder;

  constructor(
    private options: ScrollablePanelOptions,
    private tui: TUI,
    private theme: Theme,
  ) {
    this.border = new DynamicBorder((segment) => theme.fg("border", segment));
  }

  handleInput(data: string): boolean {
    if (matchesKey(data, "escape") || data === "q") {
      this.options.onClose();
      return true;
    }

    const maxVisible = this.options.maxVisible ?? 20;
    const totalLines = this.cachedLines?.length ?? 0;
    const maxScroll = Math.max(0, totalLines - maxVisible);

    if (data === "j" || matchesKey(data, "down")) {
      if (this.scrollOffset < maxScroll) {
        this.scrollOffset++;
        this.tui.requestRender();
      }
      return true;
    }

    if (data === "k" || matchesKey(data, "up")) {
      if (this.scrollOffset > 0) {
        this.scrollOffset--;
        this.tui.requestRender();
      }
      return true;
    }

    if (data === " " || matchesKey(data, "pageDown")) {
      this.scrollOffset = Math.min(this.scrollOffset + maxVisible, maxScroll);
      this.tui.requestRender();
      return true;
    }

    if (matchesKey(data, "pageUp")) {
      this.scrollOffset = Math.max(0, this.scrollOffset - maxVisible);
      this.tui.requestRender();
      return true;
    }

    if (this.options.keymap === "vim") {
      if (data === "g") {
        if (this.pendingG) {
          this.pendingG = false;
          this.scrollOffset = 0;
          this.tui.requestRender();
          return true;
        }
        this.pendingG = true;
        setTimeout(() => {
          this.pendingG = false;
        }, 500);
        return true;
      }

      if (data === "G") {
        this.pendingG = false;
        this.scrollOffset = maxScroll;
        this.tui.requestRender();
        return true;
      }
    }

    this.pendingG = false;

    if (matchesKey(data, "home")) {
      this.scrollOffset = 0;
      this.tui.requestRender();
      return true;
    }

    if (matchesKey(data, "end")) {
      this.scrollOffset = maxScroll;
      this.tui.requestRender();
      return true;
    }

    return false;
  }

  invalidate(): void {
    this.cachedLines = null;
    this.cachedWidth = 0;
  }

  render(width: number): string[] {
    const contentWidth = Math.max(1, width - 2);
    if (!this.cachedLines || this.cachedWidth !== width) {
      this.cachedLines = this.options.buildContent(contentWidth, this.theme);
      this.cachedWidth = width;
    }

    const maxVisible = this.options.maxVisible ?? 20;
    const totalLines = this.cachedLines.length;
    const lines: string[] = [];

    lines.push(...this.border.render(width));
    lines.push(
      truncateToWidth(
        ` ${this.theme.fg("accent", this.theme.bold(this.options.title))}`,
        width,
      ),
    );
    lines.push("");

    if (this.scrollOffset > 0) {
      lines.push(
        truncateToWidth(
          this.theme.fg("dim", `  ↑ ${this.scrollOffset} lines above`),
          width,
        ),
      );
    } else {
      lines.push("");
    }

    const end = Math.min(this.scrollOffset + maxVisible, totalLines);
    for (let i = this.scrollOffset; i < end; i++) {
      lines.push(truncateToWidth(`  ${this.cachedLines[i] ?? ""}`, width));
    }

    const shown = end - this.scrollOffset;
    for (let i = shown; i < maxVisible; i++) {
      lines.push("");
    }

    const remaining = totalLines - this.scrollOffset - maxVisible;
    if (remaining > 0) {
      lines.push(
        truncateToWidth(
          this.theme.fg("dim", `  ↓ ${remaining} lines below`),
          width,
        ),
      );
    } else {
      lines.push("");
    }

    lines.push("");
    lines.push(
      truncateToWidth(
        this.theme.fg(
          "dim",
          this.options.keymap === "vim"
            ? "  j/k scroll  PgUp/PgDn page  gg/G top/bottom  q/Esc close"
            : "  j/k scroll  PgUp/PgDn page  Home/End  q/Esc close",
        ),
        width,
      ),
    );
    lines.push(...this.border.render(width));

    return lines;
  }
}

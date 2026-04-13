import type { Component } from "@mariozechner/pi-tui";
import { truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";

export interface FrameOptions {
  children: Component[];
  borderColor?: (text: string) => string;
}

export class Frame implements Component {
  constructor(private options: FrameOptions) {}

  update(options: Partial<FrameOptions>): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  setBorderColor(borderColor?: (text: string) => string): void {
    this.options.borderColor = borderColor;
  }

  handleInput(data: string): boolean {
    for (const child of this.options.children) {
      const handled = (
        child.handleInput as ((data: string) => unknown) | undefined
      )?.(data);
      if (handled === true) {
        return true;
      }
    }

    return false;
  }

  invalidate(): void {
    for (const child of this.options.children) {
      child.invalidate();
    }
  }

  render(width: number): string[] {
    const contentWidth = Math.max(1, width - 4);
    const innerWidth = Math.max(1, width - 2);
    const lines = this.options.children.flatMap((child) =>
      child.render(contentWidth),
    );
    const content = (lines.length > 0 ? lines : [""]).map((line) => {
      const truncated = truncateToWidth(line, contentWidth);
      const fill = Math.max(0, contentWidth - visibleWidth(truncated));
      return ` ${truncated}${" ".repeat(fill)} `;
    });

    const borderColor = this.options.borderColor ?? ((text: string) => text);
    const top = borderColor(`╭${"─".repeat(innerWidth)}╮`);
    const bottom = borderColor(`╰${"─".repeat(innerWidth)}╯`);
    const left = borderColor("│");
    const right = borderColor("│");

    return [
      top,
      ...content.map((line) => {
        const fill = Math.max(0, innerWidth - visibleWidth(line));
        return `${left}${line}${" ".repeat(fill)}${right}`;
      }),
      bottom,
    ];
  }
}

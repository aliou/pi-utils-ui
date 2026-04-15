import { Container, truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";

export interface FrameOptions {
  borderColor: (text: string) => string;
}

export class Frame extends Container {
  private _borderColor: (text: string) => string;

  constructor(options: FrameOptions) {
    super();
    this._borderColor = options.borderColor;
  }

  update(options: Partial<FrameOptions>): void {
    if (options.borderColor !== undefined) {
      this._borderColor = options.borderColor;
    }
  }

  setBorderColor(borderColor: (text: string) => string): void {
    this._borderColor = borderColor;
  }

  handleInput(data: string): boolean {
    for (const child of this.children) {
      const handled = (
        child.handleInput as ((data: string) => unknown) | undefined
      )?.(data);
      if (handled === true) {
        return true;
      }
    }

    return false;
  }

  override render(width: number): string[] {
    const contentWidth = Math.max(1, width - 4);
    const innerWidth = Math.max(1, width - 2);
    const lines = this.children.flatMap((child) => child.render(contentWidth));
    const content = (lines.length > 0 ? lines : [""]).map((line) => {
      const truncated = truncateToWidth(line, contentWidth);
      const fill = Math.max(0, contentWidth - visibleWidth(truncated));
      return ` ${truncated}${" ".repeat(fill)} `;
    });

    const borderColor = this._borderColor;
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

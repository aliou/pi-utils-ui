import type { Theme } from "@mariozechner/pi-coding-agent";
import { visibleWidth } from "@mariozechner/pi-tui";

export function renderPanelRule(width: number, theme: Theme): string {
  return theme.fg("dim", "─".repeat(Math.max(0, width)));
}

export function renderPanelTitleLine(
  title: string,
  width: number,
  theme: Theme,
): string {
  const accent = (value: string) => theme.fg("accent", value);
  const dim = (value: string) => theme.fg("dim", value);
  const bold = (value: string) => theme.bold(value);

  const titleText = ` ${title} `;
  const plainLen = visibleWidth(titleText);
  const borderLen = Math.max(0, width - plainLen);
  const leftBorder = Math.floor(borderLen / 2);
  const rightBorder = borderLen - leftBorder;

  return (
    dim("─".repeat(leftBorder)) +
    accent(bold(titleText)) +
    dim("─".repeat(rightBorder))
  );
}

export function createPanelPadder(width: number): (content: string) => string {
  const innerWidth = Math.max(0, width - 2);
  return (content: string) => {
    const len = visibleWidth(content);
    return ` ${content}${" ".repeat(Math.max(0, innerWidth - len))} `;
  };
}

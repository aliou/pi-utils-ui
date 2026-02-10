import {
  truncateToWidth,
  visibleWidth,
  wrapTextWithAnsi,
} from "@mariozechner/pi-tui";

export function truncateAnsi(text: string, width: number): string {
  return truncateToWidth(text, width);
}

export function widthAnsi(text: string): number {
  return visibleWidth(text);
}

export function wrapAnsi(text: string, width: number): string[] {
  return wrapTextWithAnsi(text, width);
}

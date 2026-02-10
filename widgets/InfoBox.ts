import type { Theme } from "@mariozechner/pi-coding-agent";
import {
  truncateToWidth,
  visibleWidth,
  wrapTextWithAnsi,
} from "@mariozechner/pi-tui";

export function renderInfoBox(
  title: string,
  body: string,
  width: number,
  theme: Theme,
): string[] {
  if (width < 10) {
    return [truncateToWidth(title, width)];
  }

  const innerWidth = width - 4;
  const maxNameLen = Math.max(0, width - 6);
  const displayName = truncateToWidth(title, maxNameLen);
  const nameVisible = visibleWidth(displayName);
  const topFill = Math.max(0, width - nameVisible - 5);

  const top =
    theme.fg("borderMuted", "┌─") +
    theme.fg("accent", theme.bold(` ${displayName} `)) +
    theme.fg("borderMuted", `${"─".repeat(topFill)}┐`);

  const bodyLines = body.length > 0 ? wrapTextWithAnsi(body, innerWidth) : [""];
  const rows = bodyLines.map((line) => {
    const padLen = Math.max(0, innerWidth - visibleWidth(line));
    return (
      theme.fg("borderMuted", "│") +
      ` ${line}${" ".repeat(padLen)} ` +
      theme.fg("borderMuted", "│")
    );
  });

  const bottom = theme.fg(
    "borderMuted",
    `└${"─".repeat(Math.max(0, width - 2))}┘`,
  );

  return [top, ...rows, bottom];
}

export function renderInfoBoxLines(
  title: string,
  lines: string[],
  width: number,
  theme: Theme,
): string[] {
  if (width < 10) {
    return [truncateToWidth(title, width)];
  }

  const innerWidth = width - 4;
  const maxNameLen = Math.max(0, width - 6);
  const displayName = truncateToWidth(title, maxNameLen);
  const nameVisible = visibleWidth(displayName);
  const topFill = Math.max(0, width - nameVisible - 5);

  const top =
    theme.fg("borderMuted", "┌─") +
    theme.fg("accent", theme.bold(` ${displayName} `)) +
    theme.fg("borderMuted", `${"─".repeat(topFill)}┐`);

  const rows = (lines.length > 0 ? lines : [""]).map((line) => {
    const padLen = Math.max(0, innerWidth - visibleWidth(line));
    return (
      theme.fg("borderMuted", "│") +
      ` ${line}${" ".repeat(padLen)} ` +
      theme.fg("borderMuted", "│")
    );
  });

  const bottom = theme.fg(
    "borderMuted",
    `└${"─".repeat(Math.max(0, width - 2))}┘`,
  );

  return [top, ...rows, bottom];
}

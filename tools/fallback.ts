import type { AgentToolResult, Theme } from "@mariozechner/pi-coding-agent";
import { getMarkdownTheme } from "@mariozechner/pi-coding-agent";
import type { Component } from "@mariozechner/pi-tui";
import { Markdown, Text } from "@mariozechner/pi-tui";

export function renderToolTextFallback(
  result: AgentToolResult<unknown>,
  _theme: Theme,
): Component {
  const text = result.content[0];
  const content = text?.type === "text" ? text.text : "";
  if (!content) return new Text("", 0, 0);

  try {
    const markdownTheme = getMarkdownTheme();
    return new Markdown(content, 0, 0, markdownTheme);
  } catch {
    return new Text(content, 0, 0);
  }
}

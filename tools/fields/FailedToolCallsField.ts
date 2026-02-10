import type { Theme } from "@mariozechner/pi-coding-agent";
import type { Component } from "@mariozechner/pi-tui";
import { TruncatedText } from "@mariozechner/pi-tui";
import type { ToolCallFormatter } from "./ToolCallListField";

export class FailedToolCallsField<
  TCall extends { status: "running" | "done" | "error"; error?: string },
> implements Component
{
  constructor(
    private toolCalls: TCall[],
    private formatter: ToolCallFormatter<TCall>,
    private theme: Theme,
  ) {}

  handleInput(_data: string): boolean {
    return false;
  }

  invalidate(): void {}

  render(width: number): string[] {
    const failed = this.toolCalls.filter(
      (toolCall) => toolCall.status === "error",
    );
    if (failed.length === 0) return [];

    const th = this.theme;
    const lines: string[] = [];

    for (const toolCall of failed) {
      const { label, detail } = this.formatter(toolCall);
      const text = detail ? `${th.bold(label)} ${detail}` : th.bold(label);
      const line = new TruncatedText(`${th.fg("error", "✗")} ${text}`);
      lines.push(...line.render(width));

      if (toolCall.error) {
        let errorText = toolCall.error;

        try {
          const parsed = JSON.parse(toolCall.error);
          if (parsed.content?.[0]?.text) {
            errorText = parsed.content[0].text;
            const apiErrorMatch = errorText.match(/API error \(\d+\): ({.+})$/);
            if (apiErrorMatch?.[1]) {
              try {
                const apiError = JSON.parse(apiErrorMatch[1]);
                if (apiError.error) {
                  errorText = apiError.error;
                }
              } catch {
                // keep original error text
              }
            }
          }
        } catch {
          // keep original error text
        }

        if (errorText.length > 150) {
          errorText = `${errorText.slice(0, 147)}...`;
        }

        const errorLine = new TruncatedText(`  ${th.fg("dim", errorText)}`);
        lines.push(...errorLine.render(width));
      }
    }

    return lines;
  }
}

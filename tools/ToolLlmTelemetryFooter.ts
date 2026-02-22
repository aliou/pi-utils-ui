import type { Theme } from "@mariozechner/pi-coding-agent";
import type { Component } from "@mariozechner/pi-tui";
import { truncateToWidth } from "@mariozechner/pi-tui";

export interface LlmTelemetryData {
  resolvedModel?: { provider: string; id: string };
  usage?: {
    outputTokens?: number;
    llmCost?: number;
    toolCostUsd?: number;
    toolCostEur?: number;
    totalCostUsd?: number;
  };
  toolCalls?: Array<{
    status: "running" | "done" | "error";
    result?:
      | {
          details?: {
            cost?: number;
            costCurrency?: "USD" | "EUR";
            [key: string]: unknown;
          };
          [key: string]: unknown;
        }
      | string
      | number
      | boolean
      | null
      | Array<unknown>;
  }>;
  totalDurationMs?: number;
}

export class ToolLlmTelemetryFooter implements Component {
  constructor(
    private theme: Theme,
    private data: LlmTelemetryData,
  ) {}

  handleInput(_data: string): boolean {
    return false;
  }

  invalidate(): void {}

  updateData(data: LlmTelemetryData): void {
    this.data = data;
  }

  render(width: number): string[] {
    const th = this.theme;
    const { resolvedModel, usage, toolCalls, totalDurationMs } = this.data;
    const parts: string[] = [];

    if (resolvedModel) {
      parts.push(`${resolvedModel.provider}/${resolvedModel.id}`);
    }

    if (usage?.outputTokens !== undefined) {
      parts.push(`${formatTokenCount(usage.outputTokens)} tokens`);
    }

    const costs = getCostSummary(usage, toolCalls);
    if (costs.usd > 0 || costs.eur > 0) {
      const costParts: string[] = [];
      if (costs.usd > 0) costParts.push(formatUsdCost(costs.usd));
      if (costs.eur > 0) costParts.push(formatEurCost(costs.eur));
      parts.push(costParts.join(" + "));
    }

    if (totalDurationMs !== undefined) {
      parts.push(formatDuration(totalDurationMs));
    }

    const totalCalls = toolCalls?.length ?? 0;
    const failedCalls =
      toolCalls?.filter((toolCall) => toolCall.status === "error").length ?? 0;

    parts.push(
      failedCalls > 0
        ? `${totalCalls} calls (${failedCalls} failed)`
        : `${totalCalls} calls`,
    );

    return [truncateToWidth(th.fg("muted", parts.join(" - ")), width)];
  }
}

function formatTokenCount(tokens: number): string {
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k`;
  return `${tokens}`;
}

function getCostSummary(
  usage: LlmTelemetryData["usage"],
  toolCalls: LlmTelemetryData["toolCalls"],
): { usd: number; eur: number } {
  const hasCurrencyBuckets =
    usage?.toolCostUsd !== undefined || usage?.toolCostEur !== undefined;

  if (hasCurrencyBuckets) {
    const usd =
      usage?.totalCostUsd ?? (usage?.llmCost ?? 0) + (usage?.toolCostUsd ?? 0);
    const eur = usage?.toolCostEur ?? 0;
    return { usd, eur };
  }

  let usd = usage?.llmCost ?? 0;
  let eur = 0;

  for (const toolCall of toolCalls ?? []) {
    const result = toolCall.result;
    if (!result || typeof result !== "object" || Array.isArray(result)) {
      continue;
    }

    const details = (
      result as { details?: { cost?: number; costCurrency?: "USD" | "EUR" } }
    ).details;
    if (typeof details?.cost !== "number") continue;
    if (details.costCurrency === "EUR") eur += details.cost;
    else usd += details.cost;
  }

  return { usd, eur };
}

function formatUsdCost(cost: number): string {
  return `${formatAmount(cost)} USD`;
}

function formatEurCost(cost: number): string {
  return `${formatAmount(cost)} EUR`;
}

function formatAmount(cost: number): string {
  if (cost < 1) return cost.toFixed(4);
  return cost.toFixed(2);
}

function formatDuration(durationMs: number): string {
  if (durationMs < 1000) return `${durationMs}ms`;
  if (durationMs < 60_000) return `${(durationMs / 1000).toFixed(2)}s`;
  const minutes = Math.floor(durationMs / 60_000);
  const seconds = ((durationMs % 60_000) / 1000).toFixed(1);
  return `${minutes}m ${seconds}s`;
}

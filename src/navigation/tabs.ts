import type { Component } from "@earendil-works/pi-tui";
import {
  getKeybindings,
  truncateToWidth,
  visibleWidth,
} from "@earendil-works/pi-tui";

export type TabStatus = "incomplete" | "complete" | "error";
export type TabsVariant = "pill" | "text";
export type TabsThemeColor =
  | "accent"
  | "dim"
  | "error"
  | "selectedBg"
  | "success"
  | "warning";

export interface TabsTheme {
  fg(color: TabsThemeColor, text: string): string;
  bg(color: TabsThemeColor, text: string): string;
}

export type TabItem = {
  id: string;
  label: string;
  badge?: string;
  status?: TabStatus;
  content: Component;
};

export type TabsOptions = {
  items: TabItem[];
  activeId: string;
  /** Visual treatment for the tab bar. Use "text" for the legacy separator style. */
  variant?: TabsVariant;
  /** Show a small status/current-position indicator before each tab. */
  showIndicator?: boolean;
  /** Spaces between tabs in the pill variant. */
  gap?: number;
  /** Fixed visible width for each tab label. Longer labels are truncated. */
  tabWidth?: number;
  /** Pi theme-compatible object. Makes tabs match settings/wizard selectedBg styling. */
  theme?: TabsTheme;
  activeStyle?: (text: string) => string;
  inactiveStyle?: (text: string) => string;
  badgeStyle?: (text: string) => string;
  separatorStyle?: (text: string) => string;
  indicatorActiveStyle?: (text: string) => string;
  indicatorCompleteStyle?: (text: string) => string;
  indicatorIncompleteStyle?: (text: string) => string;
  indicatorErrorStyle?: (text: string) => string;
  overflowStyle?: (text: string) => string;
  leftOverflowMarker?: string;
  rightOverflowMarker?: string;
  onChange?: (id: string) => void;
};

export class Tabs implements Component {
  private items: TabItem[];
  private activeId: string;
  private variant: TabsVariant;
  private showIndicator: boolean;
  private gap: number;
  private tabWidth?: number;
  private activeStyle: (text: string) => string;
  private inactiveStyle: (text: string) => string;
  private badgeStyle: (text: string) => string;
  private separatorStyle: (text: string) => string;
  private indicatorActiveStyle: (text: string) => string;
  private indicatorCompleteStyle: (text: string) => string;
  private indicatorIncompleteStyle: (text: string) => string;
  private indicatorErrorStyle: (text: string) => string;
  private overflowStyle: (text: string) => string;
  private leftOverflowMarker: string;
  private rightOverflowMarker: string;
  private onChange?: (id: string) => void;

  constructor(options: TabsOptions) {
    this.items = options.items;
    this.activeId = options.activeId;
    this.variant = options.variant ?? "pill";
    this.showIndicator = options.showIndicator ?? false;
    this.gap = Math.max(0, options.gap ?? 1);
    this.tabWidth =
      options.tabWidth === undefined
        ? undefined
        : Math.max(1, options.tabWidth);
    this.activeStyle =
      options.activeStyle ??
      (options.theme
        ? (t: string) =>
            options.theme!.bg("selectedBg", options.theme!.fg("accent", t))
        : (t: string) => `\x1b[7m${t}\x1b[0m`);
    this.inactiveStyle =
      options.inactiveStyle ??
      (options.theme
        ? (t: string) => options.theme!.fg("dim", t)
        : (t: string) => `\x1b[2m${t}\x1b[0m`);
    this.badgeStyle =
      options.badgeStyle ??
      (options.theme
        ? (t: string) => options.theme!.fg("warning", t)
        : (t: string) => `\x1b[33m${t}\x1b[0m`);
    this.separatorStyle =
      options.separatorStyle ??
      (options.theme
        ? (t: string) => options.theme!.fg("dim", t)
        : (t: string) => `\x1b[2m${t}\x1b[0m`);
    this.indicatorActiveStyle =
      options.indicatorActiveStyle ??
      (options.theme
        ? (t: string) => options.theme!.fg("accent", t)
        : (t: string) => `\x1b[36m${t}\x1b[0m`);
    this.indicatorCompleteStyle =
      options.indicatorCompleteStyle ??
      (options.theme
        ? (t: string) => options.theme!.fg("success", t)
        : (t: string) => `\x1b[32m${t}\x1b[0m`);
    this.indicatorIncompleteStyle =
      options.indicatorIncompleteStyle ??
      (options.theme
        ? (t: string) => options.theme!.fg("dim", t)
        : (t: string) => `\x1b[2m${t}\x1b[0m`);
    this.indicatorErrorStyle =
      options.indicatorErrorStyle ??
      (options.theme
        ? (t: string) => options.theme!.fg("error", t)
        : (t: string) => `\x1b[31m${t}\x1b[0m`);
    this.overflowStyle =
      options.overflowStyle ??
      (options.theme
        ? (t: string) => options.theme!.fg("dim", t)
        : (t: string) => `\x1b[2m${t}\x1b[0m`);
    this.leftOverflowMarker = options.leftOverflowMarker ?? "… ";
    this.rightOverflowMarker = options.rightOverflowMarker ?? " …";
    this.onChange = options.onChange;
  }

  setActiveId(id: string): void {
    this.activeId = id;
  }

  render(width: number): string[] {
    const lines: string[] = [];

    // Tab bar
    const tabBar = this.renderTabBar(width);
    lines.push(tabBar);

    // Active tab content
    const activeTab = this.items.find((t) => t.id === this.activeId);
    if (activeTab) {
      lines.push(...activeTab.content.render(width));
    }

    return lines;
  }

  handleInput(data: string): void {
    const kb = getKeybindings();
    const activeIdx = this.items.findIndex((t) => t.id === this.activeId);

    if (kb.matches(data, "tui.editor.cursorLeft") || data === "h") {
      const prevIdx = (activeIdx - 1 + this.items.length) % this.items.length;
      this.activeId = this.items[prevIdx]!.id;
      this.onChange?.(this.activeId);
    } else if (kb.matches(data, "tui.editor.cursorRight") || data === "l") {
      const nextIdx = (activeIdx + 1) % this.items.length;
      this.activeId = this.items[nextIdx]!.id;
      this.onChange?.(this.activeId);
    }
  }

  invalidate(): void {
    for (const item of this.items) {
      item.content.invalidate();
    }
  }

  private renderTabBar(width: number): string {
    const separator =
      this.variant === "text" ? this.separatorStyle("|") : " ".repeat(this.gap);
    const parts = this.items.map((tab) => this.renderTab(tab));
    const bar = parts.join(separator);

    if (visibleWidth(bar) <= width) {
      return `${bar}\x1b[0m`;
    }

    const activeIndex = Math.max(
      0,
      this.items.findIndex((tab) => tab.id === this.activeId),
    );
    let start = activeIndex;
    let end = activeIndex;

    while (true) {
      const canGrowLeft = start > 0;
      const canGrowRight = end < parts.length - 1;
      if (!canGrowLeft && !canGrowRight) break;

      const leftFits =
        canGrowLeft &&
        this.renderWindow(parts, separator, start - 1, end, width);
      const rightFits =
        canGrowRight &&
        this.renderWindow(parts, separator, start, end + 1, width);

      if (!leftFits && !rightFits) break;

      if (leftFits && rightFits) {
        if (activeIndex - start <= end - activeIndex) {
          start--;
        } else {
          end++;
        }
      } else if (leftFits) {
        start--;
      } else {
        end++;
      }
    }

    const rendered = this.renderWindow(parts, separator, start, end, width);
    if (rendered) return `${rendered}\x1b[0m`;

    return `${truncateToWidth(parts[activeIndex] ?? bar, width, "", true)}\x1b[0m`;
  }

  private renderWindow(
    parts: string[],
    separator: string,
    start: number,
    end: number,
    width: number,
  ): string | null {
    const leftOverflow =
      start > 0 ? this.overflowStyle(this.leftOverflowMarker) : "";
    const rightOverflow =
      end < parts.length - 1
        ? this.overflowStyle(this.rightOverflowMarker)
        : "";
    const visible = parts.slice(start, end + 1).join(separator);
    const rendered = `${leftOverflow}${visible}${rightOverflow}`;

    return visibleWidth(rendered) <= width ? rendered : null;
  }

  private renderTab(tab: TabItem): string {
    const isActive = tab.id === this.activeId;
    const styleFn = isActive ? this.activeStyle : this.inactiveStyle;

    const label = this.renderTabLabel(tab);
    const rendered = styleFn(label);
    if (!this.showIndicator) return rendered;

    return `${this.renderIndicator(tab, isActive)} ${rendered}`;
  }

  private renderTabLabel(tab: TabItem): string {
    if (this.tabWidth !== undefined) {
      const label = `${tab.label}${tab.badge ? ` [${tab.badge}]` : ""}`;
      const labelWidth = visibleWidth(label);

      if (labelWidth <= this.tabWidth) {
        const leftPadding = Math.floor((this.tabWidth - labelWidth) / 2);
        const rightPadding = this.tabWidth - labelWidth - leftPadding;
        return `${" ".repeat(leftPadding)}${label}${" ".repeat(rightPadding)}`;
      }

      if (this.tabWidth === 1) {
        return truncateToWidth(label, 1, "", true);
      }

      const truncated = truncateToWidth(label, this.tabWidth - 1, "", true);
      return ` ${truncated}${" ".repeat(Math.max(0, this.tabWidth - 1 - visibleWidth(truncated)))}`;
    }

    let label = ` ${tab.label}`;
    if (tab.badge) {
      label += ` ${this.badgeStyle(`[${tab.badge}]`)}`;
    }
    label += " ";
    return label;
  }

  private renderIndicator(tab: TabItem, isActive: boolean): string {
    if (tab.status === "complete") {
      return this.indicatorCompleteStyle("●");
    }
    if (tab.status === "error") {
      return this.indicatorErrorStyle("●");
    }
    if (isActive) {
      return this.indicatorActiveStyle("●");
    }
    return this.indicatorIncompleteStyle("○");
  }
}

import type { Component } from "@earendil-works/pi-tui";
import { Box, type SelectItem, SelectList, Text } from "@earendil-works/pi-tui";
import { Panel } from "../../src/containers/panel";
import { Stack } from "../../src/layout/stack";
import { StatusLine } from "../../src/navigation/status-line";
import { demos } from "./registry";

type FocusMode = "menu" | "demo";

const bold = (t: string) => `\x1b[1m${t}\x1b[0m`;
const dim = (t: string) => `\x1b[2m${t}\x1b[0m`;
const accent = (t: string) => `\x1b[36m${t}\x1b[0m`;

const selectTheme = {
  selectedPrefix: (t: string) => accent(bold(t)),
  selectedText: (t: string) => bold(t),
  description: (t: string) => dim(t),
  scrollInfo: (t: string) => dim(t),
  noMatch: (t: string) => dim(t),
};

export class ShowcaseApp {
  private focusMode: FocusMode = "menu";
  private activeDemoIndex = -1;
  private currentVariantIndex = 0;
  private activeComponent: Component | null = null;
  private cachedDemoIndex = -2;
  private cachedVariantIndex = -1;

  private menuList: SelectList;

  onQuit?: () => void;

  constructor() {
    const items: SelectItem[] = demos.map((d, i) => ({
      value: String(i),
      label: d.title,
      description: d.summary,
    }));

    this.menuList = new SelectList(items, 16, selectTheme);

    this.menuList.onSelect = (item) => {
      this.activeDemoIndex = Number.parseInt(item.value, 10);
      this.currentVariantIndex = 0;
      this.focusMode = "demo";
    };
  }

  private ensureComponent() {
    if (this.activeDemoIndex < 0) return null;
    const demo = demos[this.activeDemoIndex];
    if (!demo) return null;

    if (
      this.cachedDemoIndex !== this.activeDemoIndex ||
      this.cachedVariantIndex !== this.currentVariantIndex
    ) {
      this.activeComponent = demo.variants[this.currentVariantIndex].render();
      this.cachedDemoIndex = this.activeDemoIndex;
      this.cachedVariantIndex = this.currentVariantIndex;
    }
    return this.activeComponent;
  }

  private goToDemo(index: number) {
    this.activeDemoIndex = index;
    this.currentVariantIndex = 0;
    this.cachedDemoIndex = -2;
    this.focusMode = "demo";
  }

  render(width: number): string[] {
    if (this.focusMode === "menu") {
      return this.renderMenu(width);
    }
    return this.renderDemo(width);
  }

  private renderMenu(width: number): string[] {
    const root = new Stack({ gap: 0 });

    root.addChild(new Text("", 0, 0));
    root.addChild(new Text(bold("  pi-utils-ui showcase"), 0, 0));
    root.addChild(new Text(dim("  Select a component to view"), 0, 0));
    root.addChild(new Text("", 0, 0));
    root.addChild(this.menuList);
    root.addChild(new Text("", 0, 0));
    root.addChild(new Text(dim("─".repeat(width)), 0, 0));
    root.addChild(
      new StatusLine({
        left: [dim("up/down navigate  enter select  q quit")],
        style: dim,
      }),
    );

    return root.render(width);
  }

  private renderDemo(width: number): string[] {
    const demo = demos[this.activeDemoIndex];
    if (!demo) return [];

    const variant = demo.variants[this.currentVariantIndex];
    const component = this.ensureComponent();

    const root = new Stack({ gap: 0 });

    // Header bar
    const pos = `${this.activeDemoIndex + 1}/${demos.length}`;
    const vCount = demo.variants.length;
    const vInfo =
      vCount > 1
        ? `  ${variant.title} (${this.currentVariantIndex + 1}/${vCount})`
        : `  ${variant.title}`;

    root.addChild(new Text("", 0, 0));
    root.addChild(new Text(bold(`  ${demo.title}`) + dim(`  ${pos}`), 0, 0));
    if (variant.description) {
      root.addChild(new Text(dim(`  ${variant.description}`), 0, 0));
    }
    root.addChild(new Text("", 0, 0));

    // Component inside a panel to visually separate it
    const body = new Box(1, 1);
    if (component) {
      body.addChild(component);
    }
    root.addChild(
      new Panel({
        title: vInfo,
        body,
        border: "round",
        borderStyle: dim,
        titleStyle: accent,
        padding: 0,
      }),
    );

    root.addChild(new Text("", 0, 0));

    // Status bar
    root.addChild(new Text(dim("─".repeat(width)), 0, 0));
    const hints = ["Esc back", "[ ] prev/next"];
    if (vCount > 1) hints.push("v variant");
    hints.push("q quit");

    root.addChild(
      new StatusLine({
        left: [dim(hints.join("  "))],
        style: dim,
      }),
    );

    return root.render(width);
  }

  handleInput(data: string): void {
    if (data === "q") {
      this.onQuit?.();
      return;
    }

    if (this.focusMode === "menu") {
      this.menuList.handleInput(data);
      return;
    }

    // -- demo mode --

    if (data === "\x1b") {
      this.focusMode = "menu";
      if (this.activeDemoIndex >= 0) {
        this.menuList.setSelectedIndex(this.activeDemoIndex);
      }
      return;
    }

    if (data === "[") {
      const prev =
        this.activeDemoIndex <= 0 ? demos.length - 1 : this.activeDemoIndex - 1;
      this.goToDemo(prev);
      return;
    }

    if (data === "]") {
      const next =
        this.activeDemoIndex >= demos.length - 1 ? 0 : this.activeDemoIndex + 1;
      this.goToDemo(next);
      return;
    }

    if (data === "v" && this.activeDemoIndex >= 0) {
      const demo = demos[this.activeDemoIndex];
      this.currentVariantIndex =
        (this.currentVariantIndex + 1) % demo.variants.length;
      return;
    }

    if (this.activeComponent?.handleInput) {
      this.activeComponent.handleInput(data);
    }
  }

  invalidate(): void {}
}

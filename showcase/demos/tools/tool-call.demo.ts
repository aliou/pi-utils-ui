import type { Component } from "@earendil-works/pi-tui";
import { Box, matchesKey, Spacer, Text } from "@earendil-works/pi-tui";
import { Tree, type TreeNode } from "../../../src/data/tree-view";
import type { ToolRenderOptions, ToolTheme } from "../../../src/tools/theme";
import type { ToolBodyField } from "../../../src/tools/tool-body";
import { ToolBody } from "../../../src/tools/tool-body";
import { ToolCallHeader } from "../../../src/tools/tool-call-header";
import { ToolFooter } from "../../../src/tools/tool-footer";
import type { ShowcaseDemo } from "../../app/types";

// Subtle bg tints (256-color) to simulate theme backgrounds
const successBg = (t: string) => `\x1b[48;5;236m${t}\x1b[0m`;
const pendingBg = (t: string) => `\x1b[48;5;235m${t}\x1b[0m`;
const errorBg = (t: string) => `\x1b[48;5;52m${t}\x1b[0m`;

const red = (t: string) => `\x1b[31m${t}\x1b[0m`;
const green = (t: string) => `\x1b[32m${t}\x1b[0m`;
const yellow = (t: string) => `\x1b[33m${t}\x1b[0m`;
const cyan = (t: string) => `\x1b[36m${t}\x1b[0m`;
const dim = (t: string) => `\x1b[2m${t}\x1b[0m`;
const bold = (t: string) => `\x1b[1m${t}\x1b[0m`;
const white = (t: string) => `\x1b[37m${t}\x1b[0m`;

/** Fake theme that maps ToolThemeColor to ANSI escapes */
const fakeTheme: ToolTheme = {
  fg(color, text) {
    switch (color) {
      case "accent":
        return cyan(text);
      case "dim":
      case "muted":
        return dim(text);
      case "error":
        return red(text);
      case "success":
        return green(text);
      case "warning":
        return yellow(text);
      case "toolTitle":
        return white(text);
      case "toolOutput":
        return text;
      default:
        return text;
    }
  },
  bold(text) {
    return bold(text);
  },
};

/**
 * Simulates ToolExecutionComponent from pi-coding-agent:
 * a colored Box wrapping header (call) + body (result), with Ctrl+O toggle.
 */
class ToolExecutionDemo implements Component {
  private expanded = true;
  private bgFn: (t: string) => string;
  private callComponent: Component;
  private makeResult: (options: ToolRenderOptions) => Component;
  private resultComponent: Component;

  constructor(
    bgFn: (t: string) => string,
    callComponent: Component,
    makeResult: (options: ToolRenderOptions) => Component,
  ) {
    this.bgFn = bgFn;
    this.callComponent = callComponent;
    this.makeResult = makeResult;
    this.resultComponent = makeResult({ expanded: true, isPartial: false });
  }

  handleInput(data: string): void {
    if (matchesKey(data, "ctrl+o")) {
      this.expanded = !this.expanded;
      this.resultComponent = this.makeResult({
        expanded: this.expanded,
        isPartial: false,
      });
    }
  }

  invalidate(): void {}

  render(width: number): string[] {
    const box = new Box(1, 1, this.bgFn);
    box.addChild(this.callComponent);
    box.addChild(this.resultComponent);
    return box.render(width);
  }
}

// -- Tree data for find demo --
const findTree: TreeNode[] = [
  {
    label: "src",
    children: [
      { label: "index.ts" },
      {
        label: "tools",
        children: [
          { label: "theme.ts" },
          { label: "tool-body.ts" },
          { label: "tool-call-header.ts" },
          { label: "tool-footer.ts" },
          { label: "tool-header.ts" },
          { label: "states.ts" },
          { label: "render-cache.ts" },
        ],
      },
      {
        label: "layout",
        children: [{ label: "stack.ts" }, { label: "columns.ts" }],
      },
      {
        label: "containers",
        children: [{ label: "panel.ts" }, { label: "section.ts" }],
      },
    ],
  },
  { label: "package.json" },
  { label: "README.md" },
];

const findTreeExpanded: TreeNode[] = [
  ...findTree,
  { label: "tsconfig.json" },
  { label: "biome.json" },
  { label: "CHANGELOG.md" },
];

// -- Tree data for grep demo --
const grepTree: TreeNode[] = [
  {
    label: "src/tools/theme.ts",
    children: [
      { label: "8: export type ToolThemeColor =" },
      { label: "24: export interface ToolTheme {" },
    ],
  },
  {
    label: "src/tools/tool-body.ts",
    children: [{ label: '3: import type { ToolTheme } from "./theme"' }],
  },
];

const grepTreeExpanded: TreeNode[] = [
  ...grepTree,
  {
    label: "src/tools/tool-call-header.ts",
    children: [{ label: '3: import type { ToolTheme } from "./theme"' }],
  },
  {
    label: "src/tools/tool-footer.ts",
    children: [{ label: '3: import type { ToolTheme } from "./theme"' }],
  },
  {
    label: "src/tools/tool-header.ts",
    children: [{ label: '3: import type { ToolTheme } from "./theme"' }],
  },
];

export const toolCallDemo: ShowcaseDemo = {
  id: "tool-call",
  title: "Tool Call",
  category: "tools",
  summary: "ToolCallHeader + ToolBody + ToolFooter composition",
  variants: [
    {
      id: "find",
      title: "Find tool",
      description: "Simulated find result with tree. Ctrl+O to toggle.",
      render: () => {
        const header = new ToolCallHeader(
          {
            toolName: "Find",
            action: "search",
            mainArg: "*.ts",
            optionArgs: [
              { label: "path", value: "src/", tone: "accent" },
              { label: "limit", value: "100", tone: "dim" },
            ],
          },
          fakeTheme,
        );

        const makeResult = (options: ToolRenderOptions) => {
          const spacer = new Spacer(1) as Component & {
            showCollapsed?: boolean;
          };
          spacer.showCollapsed = true;

          const tree = options.expanded ? findTreeExpanded : findTree;
          const treeComponent = new Tree({
            nodes: tree,
            dirSuffix: "/",
          }) as Component & { showCollapsed?: boolean };
          treeComponent.showCollapsed = true;

          const footer = new ToolFooter(fakeTheme, {
            items: [
              { label: "results", value: "16", tone: "success" },
              { value: "0.08s", tone: "muted" },
            ],
          });

          return new ToolBody(
            {
              fields: [spacer as ToolBodyField, treeComponent as ToolBodyField],
              footer,
            },
            options,
            fakeTheme,
          );
        };

        return new ToolExecutionDemo(successBg, header, makeResult);
      },
    },
    {
      id: "grep",
      title: "Grep tool",
      description: "Simulated grep result with tree. Ctrl+O to toggle.",
      render: () => {
        const header = new ToolCallHeader(
          {
            toolName: "Grep",
            mainArg: "/ToolTheme/",
            optionArgs: [{ label: "in", value: "src/", tone: "accent" }],
          },
          fakeTheme,
        );

        const makeResult = (options: ToolRenderOptions) => {
          const spacer = new Spacer(1) as Component & {
            showCollapsed?: boolean;
          };
          spacer.showCollapsed = true;

          const tree = options.expanded ? grepTreeExpanded : grepTree;
          const treeComponent = new Tree({
            nodes: tree,
            dirSuffix: ":",
          }) as Component & { showCollapsed?: boolean };
          treeComponent.showCollapsed = true;

          const footer = new ToolFooter(fakeTheme, {
            items: [
              { label: "matches", value: String(tree.length), tone: "success" },
              { value: "0.04s", tone: "muted" },
            ],
          });

          return new ToolBody(
            {
              fields: [spacer as ToolBodyField, treeComponent as ToolBodyField],
              footer,
            },
            options,
            fakeTheme,
          );
        };

        return new ToolExecutionDemo(successBg, header, makeResult);
      },
    },
    {
      id: "error",
      title: "Error result",
      description: "Tool call that failed, with error background",
      render: () => {
        const header = new ToolCallHeader(
          {
            toolName: "Bash",
            action: "execute",
            mainArg: "npm test",
          },
          fakeTheme,
        );

        const result = new Text(
          fakeTheme.fg("error", "Command failed with exit code 1"),
          0,
          0,
        );

        const box = new Box(1, 1, errorBg);
        box.addChild(header);
        box.addChild(new Spacer(1));
        box.addChild(result);
        return box;
      },
    },
    {
      id: "pending",
      title: "Pending",
      description: "Tool call still running",
      render: () => {
        const header = new ToolCallHeader(
          {
            toolName: "Read",
            mainArg: "src/index.ts",
            optionArgs: [{ label: "lines", value: "1-50", tone: "dim" }],
          },
          fakeTheme,
        );

        const box = new Box(1, 1, pendingBg);
        box.addChild(header);
        return box;
      },
    },
  ],
};

import { Box, Text } from "@earendil-works/pi-tui";
import { Columns } from "../../../src/layout/columns";
import type { ShowcaseDemo } from "../../app/types";

/** Box with a background style so column boundaries are visible. */
const colBox = (label: string, bgFn: (text: string) => string) => {
  const box = new Box(1, 0, bgFn);
  box.addChild(new Text(label, 0, 0));
  return box;
};

export const columnsDemo: ShowcaseDemo = {
  id: "columns",
  title: "Columns",
  category: "layout",
  summary:
    "Horizontal layout with fixed-width or equal-split columns, responsive collapse",
  variants: [
    {
      id: "equal-split",
      title: "Equal split",
      description: "Three columns splitting available width equally",
      render: () => {
        return new Columns(
          [
            { child: colBox("Left", (t) => `\x1b[44m${t}\x1b[0m`) },
            { child: colBox("Middle", (t) => `\x1b[42m${t}\x1b[0m`) },
            { child: colBox("Right", (t) => `\x1b[43m${t}\x1b[0m`) },
          ],
          { gap: 2 },
        );
      },
    },
    {
      id: "fixed-width",
      title: "Fixed width",
      description: "Left column fixed at 20, right column takes the rest",
      render: () => {
        return new Columns(
          [
            {
              child: colBox("Fixed 20", (t) => `\x1b[44m${t}\x1b[0m`),
              width: 20,
            },
            {
              child: colBox(
                "Flexible remaining space",
                (t) => `\x1b[42m${t}\x1b[0m`,
              ),
            },
          ],
          { gap: 2 },
        );
      },
    },
    {
      id: "mixed",
      title: "Mixed fixed + flexible",
      description: "Two fixed columns with one flexible in the middle",
      render: () => {
        return new Columns(
          [
            {
              child: colBox("Fixed 15", (t) => `\x1b[44m${t}\x1b[0m`),
              width: 15,
            },
            {
              child: colBox("Flexible middle", (t) => `\x1b[42m${t}\x1b[0m`),
            },
            {
              child: colBox("Fix 20", (t) => `\x1b[43m${t}\x1b[0m`),
              width: 20,
            },
          ],
          { gap: 1 },
        );
      },
    },
    {
      id: "collapse",
      title: "Collapse to stack",
      description: "Collapses to vertical when width < minWidth",
      render: () => {
        return new Columns(
          [
            {
              child: colBox("Column A", (t) => `\x1b[44m${t}\x1b[0m`),
              minWidth: 30,
            },
            {
              child: colBox("Column B", (t) => `\x1b[42m${t}\x1b[0m`),
              minWidth: 30,
            },
            {
              child: colBox("Column C", (t) => `\x1b[43m${t}\x1b[0m`),
              minWidth: 30,
            },
          ],
          { gap: 1 },
        );
      },
    },
    {
      id: "box-children",
      title: "With Box children",
      description: "Columns containing Box components with padding",
      render: () => {
        const left = new Box(1, 0);
        left.addChild(new Text("Padded left content", 0, 0));
        const right = new Box(1, 0);
        right.addChild(new Text("Padded right content", 0, 0));
        return new Columns([{ child: left, width: 30 }, { child: right }], {
          gap: 2,
        });
      },
    },
  ],
};

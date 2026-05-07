import type { Component } from "@earendil-works/pi-tui";
import { Box, Text } from "@earendil-works/pi-tui";
import { Stack } from "../../../src/layout/stack";
import type { ShowcaseDemo } from "../../app/types";

const hr: () => Component = () => new Text("─".repeat(40), 0, 0);

const blue = (t: string) => `\x1b[44m${t}\x1b[0m`;
const green = (t: string) => `\x1b[42m${t}\x1b[0m`;
const yellow = (t: string) => `\x1b[43m${t}\x1b[0m`;

const colored = (label: string, bgFn: (t: string) => string) => {
  const box = new Box(1, 0, bgFn);
  box.addChild(new Text(label, 0, 0));
  return box;
};

export const stackDemo: ShowcaseDemo = {
  id: "stack",
  title: "Stack",
  category: "layout",
  summary: "Vertical layout with controlled spacing and optional separators",
  variants: [
    {
      id: "no-gap",
      title: "No gap (default)",
      description: "Children with zero spacing between them",
      render: () => {
        const stack = new Stack();
        stack.addChild(colored("First child", blue));
        stack.addChild(colored("Second child", green));
        stack.addChild(colored("Third child", yellow));
        return stack;
      },
    },
    {
      id: "with-gap",
      title: "With gap",
      description: "Children separated by 1 blank line",
      render: () => {
        const stack = new Stack({ gap: 1 });
        stack.addChild(colored("First child", blue));
        stack.addChild(colored("Second child", green));
        stack.addChild(colored("Third child", yellow));
        return stack;
      },
    },
    {
      id: "with-separator",
      title: "With separator",
      description: "Horizontal rule between children instead of blank lines",
      render: () => {
        const stack = new Stack({ separator: hr() });
        stack.addChild(colored("Section A", blue));
        stack.addChild(colored("Section B", green));
        stack.addChild(colored("Section C", yellow));
        return stack;
      },
    },
    {
      id: "large-gap",
      title: "Large gap",
      description: "Gap of 2 blank lines between children",
      render: () => {
        const stack = new Stack({ gap: 2 });
        stack.addChild(colored("Spaced out", blue));
        stack.addChild(colored("Far apart", green));
        stack.addChild(colored("Even further", yellow));
        return stack;
      },
    },
  ],
};

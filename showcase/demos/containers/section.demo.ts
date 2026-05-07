import { Text } from "@earendil-works/pi-tui";
import { Section } from "../../../src/containers/section";
import { Badge } from "../../../src/feedback/badge";
import { Stack } from "../../../src/layout/stack";
import type { ShowcaseDemo } from "../../app/types";

const bold = (t: string) => `\x1b[1m${t}\x1b[0m`;
const dim = (t: string) => `\x1b[2m${t}\x1b[0m`;
const green = (t: string) => `\x1b[32m${t}\x1b[0m`;

export const sectionDemo: ShowcaseDemo = {
  id: "section",
  title: "Section",
  category: "containers",
  summary: "Lightweight heading + body grouping with optional description",
  variants: [
    {
      id: "basic",
      title: "Basic section",
      description: "Title and body",
      render: () => {
        const body = new Stack({ gap: 1 });
        body.addChild(new Text("First item", 0, 0));
        body.addChild(new Text("Second item", 0, 0));
        return new Section({ title: "Section Title", body });
      },
    },
    {
      id: "with-description",
      title: "With description",
      description: "Title, description, and body",
      render: () => {
        const body = new Stack({ gap: 1 });
        body.addChild(new Badge("active", green));
        body.addChild(new Text("Some detail here", 0, 0));
        return new Section({
          title: "Settings",
          description: "Configure your preferences",
          body,
        });
      },
    },
    {
      id: "styled",
      title: "Styled",
      description: "Custom title and description styles",
      render: () => {
        const body = new Text("Body content with styled header", 0, 0);
        return new Section({
          title: "Bold Title",
          description: "Dim description text",
          body,
          titleStyle: bold,
          descriptionStyle: dim,
        });
      },
    },
  ],
};

import { Text } from "@earendil-works/pi-tui";
import { Panel } from "../../../src/containers/panel";
import { Badge } from "../../../src/feedback/badge";
import { Stack } from "../../../src/layout/stack";
import type { ShowcaseDemo } from "../../app/types";

const dim = (t: string) => `\x1b[2m${t}\x1b[0m`;
const bold = (t: string) => `\x1b[1m${t}\x1b[0m`;
const green = (t: string) => `\x1b[32m${t}\x1b[0m`;

export const panelDemo: ShowcaseDemo = {
  id: "panel",
  title: "Panel",
  category: "containers",
  summary: "Titled container with optional header, footer, and border",
  variants: [
    {
      id: "with-title",
      title: "With title",
      description: "Panel with a title in the top border",
      render: () => {
        const body = new Stack({ gap: 1 });
        body.addChild(new Text("This is the panel body.", 0, 0));
        body.addChild(new Text("It can contain any component.", 0, 0));
        return new Panel({ title: "My Panel", body });
      },
    },
    {
      id: "no-title",
      title: "No title",
      description: "Plain bordered panel without a title",
      render: () => {
        const body = new Stack({ gap: 1 });
        body.addChild(new Text("Just a bordered container.", 0, 0));
        body.addChild(new Text("No title, just content.", 0, 0));
        return new Panel({ body });
      },
    },
    {
      id: "with-footer",
      title: "With footer",
      description: "Panel with title and footer separator",
      render: () => {
        const body = new Stack({ gap: 1 });
        body.addChild(new Text("Main content area."));
        const footer = new Text("Footer info here", 0, 0);
        return new Panel({ title: "Panel + Footer", body, footer });
      },
    },
    {
      id: "styled",
      title: "Styled borders",
      description: "Panel with custom border and title styles",
      render: () => {
        const body = new Stack({ gap: 1 });
        body.addChild(new Text("Custom styled panel.", 0, 0));
        body.addChild(new Badge("fancy", green));
        return new Panel({
          title: "Styled",
          body,
          borderStyle: dim,
          titleStyle: bold,
        });
      },
    },
    {
      id: "round",
      title: "Round border",
      description: "Panel with rounded corners",
      render: () => {
        const body = new Stack({ gap: 1 });
        body.addChild(new Text("Rounded corners with border: round.", 0, 0));
        body.addChild(
          new Text("Uses \u2570\u256D\u2570\u256E characters.", 0, 0),
        );
        return new Panel({ title: "Round Panel", body, border: "round" });
      },
    },
  ],
};

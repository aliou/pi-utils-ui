import { Text } from "@earendil-works/pi-tui";
import { Tabs } from "../../../src/navigation/tabs";
import type { ShowcaseDemo } from "../../app/types";

export const tabsDemo: ShowcaseDemo = {
  id: "tabs",
  title: "Tabs",
  category: "navigation",
  summary: "Segmented navigation, switch with left/right keys",
  variants: [
    {
      id: "basic",
      title: "Basic",
      description: "Three tabs with text content",
      render: () => {
        return new Tabs({
          items: [
            {
              id: "overview",
              label: "Overview",
              content: new Text("This is the overview tab content.", 0, 0),
            },
            {
              id: "details",
              label: "Details",
              content: new Text("Detailed information goes here.", 0, 0),
            },
            {
              id: "settings",
              label: "Settings",
              content: new Text("Configure your preferences.", 0, 0),
            },
          ],
          activeId: "overview",
        });
      },
    },
    {
      id: "with-badges",
      title: "With badges",
      description: "Tabs with badge indicators",
      render: () => {
        return new Tabs({
          items: [
            {
              id: "inbox",
              label: "Inbox",
              badge: "3",
              content: new Text("You have 3 unread messages.", 0, 0),
            },
            {
              id: "sent",
              label: "Sent",
              content: new Text("No sent messages.", 0, 0),
            },
            {
              id: "drafts",
              label: "Drafts",
              badge: "1",
              content: new Text("1 draft in progress.", 0, 0),
            },
          ],
          activeId: "inbox",
        });
      },
    },
  ],
};

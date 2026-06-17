import { Text } from "@earendil-works/pi-tui";
import { Tabs, type TabsTheme } from "../../../src/navigation/tabs";
import type { ShowcaseDemo } from "../../app/types";

const settingsTheme: TabsTheme = {
  fg(color, text) {
    switch (color) {
      case "accent":
        return `\x1b[36m${text}\x1b[0m`;
      case "success":
        return `\x1b[32m${text}\x1b[0m`;
      case "warning":
        return `\x1b[33m${text}\x1b[0m`;
      case "error":
        return `\x1b[31m${text}\x1b[0m`;
      case "dim":
      case "selectedBg":
        return `\x1b[2m${text}\x1b[0m`;
    }
  },
  bg(color, text) {
    if (color === "selectedBg") {
      return `\x1b[48;5;236m${text}\x1b[0m`;
    }
    return text;
  },
};

const overflowTabNames = [
  "Project Overview",
  "Environment Setup",
  "API Credentials",
  "Workspace Settings",
  "Feature Flags",
  "Notification Rules",
  "Deployment Targets",
  "Build Pipelines",
  "Integration Tests",
  "Release Channels",
  "Access Policies",
  "Audit Logging",
  "Billing Details",
  "Usage Analytics",
  "Theme Preferences",
  "Editor Bindings",
  "Cache Controls",
  "Backup Schedule",
  "Import Sources",
  "Final Review",
];

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
              status: "complete",
              content: new Text("Detailed information goes here.", 0, 0),
            },
            {
              id: "settings",
              label: "Settings",
              content: new Text("Configure your preferences.", 0, 0),
            },
          ],
          activeId: "overview",
          theme: settingsTheme,
          showIndicator: true,
        });
      },
    },
    {
      id: "without-indicators",
      title: "Without indicators",
      description: "Pill tabs without dot indicators",
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
          theme: settingsTheme,
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
              status: "error",
              content: new Text("1 draft in progress.", 0, 0),
            },
          ],
          activeId: "inbox",
          theme: settingsTheme,
          showIndicator: true,
        });
      },
    },
    {
      id: "overflow",
      title: "Overflow",
      description:
        "Twenty fixed-width tabs keep the viewport stable on narrow windows",
      render: () => {
        return new Tabs({
          items: overflowTabNames.map((label, index) => ({
            id: `tab-${index + 1}`,
            label,
            content: new Text(`Content for ${label}.`, 0, 0),
          })),
          activeId: "tab-8",
          theme: settingsTheme,
          tabWidth: 18,
        });
      },
    },
    {
      id: "overflow-arrows",
      title: "Overflow arrows",
      description: "Fixed-width overflow with configurable arrow markers",
      render: () => {
        return new Tabs({
          items: overflowTabNames.map((label, index) => ({
            id: `tab-${index + 1}`,
            label,
            content: new Text(`Content for ${label}.`, 0, 0),
          })),
          activeId: "tab-8",
          theme: settingsTheme,
          tabWidth: 18,
          leftOverflowMarker: "‹ ",
          rightOverflowMarker: " ›",
        });
      },
    },
  ],
};

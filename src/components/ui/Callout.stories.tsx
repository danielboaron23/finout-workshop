import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Callout } from "./Callout";
import { Button } from "./Button";

const meta = {
  title: "Atoms/Callout",
  component: Callout,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A tinted panel that states a **consequence**. Introduced for Settings, where a row has to say what a change will do before it is made. Nothing in `ui/` covered it: `StatusBadge` is a label, `KpiCard tone=\"danger\"` is a whole card, and the `InfoBanner` inside `ThresholdsDrawer` is the right language but private and hardcoded. Three tones, all built from existing tokens; meaning is never carried by colour alone — each ships the info icon and the sentence itself says what happens.",
      },
    },
  },
  argTypes: { tone: { control: "inline-radio", options: ["info", "warning", "danger"] } },
  args: { tone: "info", title: "Everything is at its default", children: "Spend is measured as invoiced and charged to whoever the provider billed." },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

/** Used on Cost model, above settings that rewrite reported figures. */
export const Warning: Story = {
  args: {
    tone: "warning",
    title: "These settings change figures that have already been reported",
    children: "A change here re-cuts every dashboard, report and budget in Finout. Nothing applies until you publish it.",
  },
};

export const Danger: Story = {
  args: {
    tone: "danger",
    title: "4 teams cross the budget line",
    children: "Platform moves back inside budget · Data moves over budget · Growth moves over budget · Core Product moves over budget.",
  },
};

/** Optional trailing slot. */
export const WithAction: Story = {
  args: {
    tone: "info",
    title: "Configured where the work happens",
    children: "Tagging rules are edited on the Virtual Tags screen, not here.",
    action: <Button variant="secondary">Open Virtual Tags</Button>,
  },
};

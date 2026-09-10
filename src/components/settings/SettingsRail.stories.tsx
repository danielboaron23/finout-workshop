import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SettingsRail } from "./SettingsRail";

const meta = {
  title: "Settings/SettingsRail",
  component: SettingsRail,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The navigation spine of the Settings screen: vertical, two scope headings (Organisation / Personal), and a dot on the sections whose settings rewrite figures across the product. `Tabs` could not do this — it is a horizontal 68px bar with a bottom-border indicator, has no group headings, and `TabItem` carries no href, which is why `CostGuardHubScreen` hand-maintains a parallel slug array. Every row here is a real anchor, so a section is deep-linkable and keyboard-reachable with no key handling of our own.",
      },
    },
  },
  args: { active: "cost-model" },
} satisfies Meta<typeof SettingsRail>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Cost model — one of the two sections marked as affecting every number. */
export const CostModel: Story = {};

export const Overview: Story = { args: { active: "overview" } };

/** A personal section — the scope heading above it changes what the row promises. */
export const PersonalScope: Story = { args: { active: "notifications" } };

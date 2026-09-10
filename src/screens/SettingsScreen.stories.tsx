import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SettingsScreen } from "./SettingsScreen";

const meta = {
  title: "Screens/Settings",
  component: SettingsScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "**Settings — the FinOps control room.** `Settings` had been a live sidebar row with no `href` since the prototype began: it kept the hover choreography and swallowed the click. This is that promise kept.\n\nThe organising decision is that this page owns the settings that **change the numbers**, and indexes the ones that live on the screen where the work happens. Real Finout has this inverted — Cost and Usage Type, EDP adjustments and Fiscal Year each rewrite every figure for every user behind a bare toggle and a Save, while a Virtual Tag, which moves a subset of spend, gets a preview, a draft state and a change note.\n\nThe hero flow is on **Cost model**: change the shared-cost allocation method and a per-team before/after table is recomputed from real `cost_events` dollars, showing who wins, who loses and which teams cross their budget — then Publish or Discard. Reaching into a closed reporting period requires an explicit restatement.\n\nSections are addressed by hash (`#cost-model`), so each one is deep-linkable and Back steps through them.",
      },
    },
  },
} satisfies Meta<typeof SettingsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

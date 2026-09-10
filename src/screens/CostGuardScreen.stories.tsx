import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CostGuardScreen } from "./CostGuardScreen";

/*
 * CostGuard — the recommendation ledger.
 * The screen the product promised in four places and never delivered:
 * the sidebar item, Home's "Go to CostGuard" CTA, Home's "Cost Waste
 * Percentage" KPI, and the recommendations card's "Go to scan".
 */
const meta = {
  title: "Screens/CostGuard",
  component: CostGuardScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Tracks committed optimisation work rather than listing findings. Flat list with counts in the tabs (not collapsible groups) so a regressed item can never be hidden; projected and realized share one composite cell so it can render \"Not verifiable\", which is a verdict rather than a number. Brief: docs/prd/costguard-follow-through.md — research: docs/research/costguard-follow-through/study.md",
      },
    },
  },
} satisfies Meta<typeof CostGuardScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default view — "Needs attention", with the regressed Snowflake saving pinned above the list. */
export const NeedsAttention: Story = {};

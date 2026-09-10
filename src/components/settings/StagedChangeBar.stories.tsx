import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StagedChangeBar } from "./StagedChangeBar";

const meta = {
  title: "Settings/StagedChangeBar",
  component: StagedChangeBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Nothing a user changes on Settings reaches the rest of the product until Publish. The effective-date control sits in the bar rather than on each row, because one publish applies one effective date to everything staged.\n\nReaching into a **closed** period — a month already reported to finance — is deliberately harder than not: the primary action renames itself to name the damage and asks a second time. That confirmation is a dropdown rather than a modal, matching how the app already confirms destructive actions.",
      },
    },
  },
  args: {
    count: 1,
    effectiveFrom: "open",
    onEffectiveChange: () => {},
    onPublish: () => {},
    onDiscard: () => {},
  },
} satisfies Meta<typeof StagedChangeBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — applies only to the month still being reconciled. */
export const OpenPeriodOnly: Story = {};

export const Several: Story = { args: { count: 3 } };

/** History is left exactly as reported. */
export const ForwardOnly: Story = { args: { effectiveFrom: "forward" } };

/** Reaching back into closed months. The primary action changes to name the cost. */
export const RestatingClosedPeriods: Story = { args: { effectiveFrom: "all" } };

/** Nothing staged — the bar is not rendered. */
export const Hidden: Story = { args: { count: 0 } };

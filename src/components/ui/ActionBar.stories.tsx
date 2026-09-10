import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActionBar } from "./ActionBar";
import { Button } from "./Button";

const meta = {
  title: "Molecules/ActionBar",
  component: ActionBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The dark bar that appears on a condition, leads with what is at stake and carries its actions on the right. Lifted out of `costguard/BulkActionBar`, which had exactly this shape but was welded to CostGuard's owners and dismiss reasons. Now the chrome lives in `ui/` and each caller supplies its own `label` and `actions`; `BulkActionBar` keeps its original API and renders through this.",
      },
    },
  },
  args: {
    label: "3 selected",
    actions: <Button variant="tertiary">Assign owner</Button>,
  },
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** CostGuard's ledger selection. */
export const Selection: Story = {
  args: {
    label: (
      <span className="whitespace-nowrap">
        3 selected<span className="font-normal opacity-70"> · $12,340/mo at stake</span>
      </span>
    ),
    actions: (
      <>
        <Button variant="tertiary">Assign owner</Button>
        <Button variant="tertiary">Dismiss</Button>
      </>
    ),
  },
};

/** Settings' staged change. */
export const StagedChange: Story = {
  args: {
    label: (
      <span>
        1 change staged<span className="font-normal opacity-70"> · nothing has been applied yet</span>
      </span>
    ),
    actions: (
      <>
        <Button variant="tertiary">Effective: August</Button>
        <Button>Publish</Button>
      </>
    ),
  },
};

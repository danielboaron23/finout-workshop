import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MegaBillTopBar } from "./MegaBillTopBar";
import { MegaBillToolbar } from "./MegaBillToolbar";

const meta = {
  title: "Organisms/MegaBill Bars",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The two control bars that top the MegaBill screen — Figma nodes 1:13878 (\"Top nav\", 1463x68) and 1:13879 (toolbar row, 1439x70). MegaBillTopBar holds the Views select (saved views dropdown) plus Save/Clear link buttons that sit at 30% opacity until the view state is dirty; MegaBillToolbar carries the Filters / aggregation (Daily) / date-range chips, the Cost|Usage switcher, and the Display / X-Axis / Amortized Cost selects — every chip is a real Dropdown. Both bars are controllable via props (driven by MegaBillPageClient on the screen) and fall back to internal state when rendered standalone, as here.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const TopBar: Story = {
  render: () => <MegaBillTopBar />,
};

export const Toolbar: Story = {
  render: () => (
    <div className="p-[16px]">
      <MegaBillToolbar />
    </div>
  ),
};

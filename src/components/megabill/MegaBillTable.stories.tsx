import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MegaBillActionsRow, MegaBillTable } from "./MegaBillTable";

const meta = {
  title: "MegaBill/Table",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="bg-[#f9fafb] p-[24px]">
      <div className="bg-white">
        <MegaBillActionsRow />
        <MegaBillTable />
      </div>
    </div>
  ),
};

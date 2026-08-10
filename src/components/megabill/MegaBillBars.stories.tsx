import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MegaBillTopBar } from "./MegaBillTopBar";
import { MegaBillToolbar } from "./MegaBillToolbar";

const meta = {
  title: "MegaBill/Bars",
  parameters: { layout: "fullscreen" },
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

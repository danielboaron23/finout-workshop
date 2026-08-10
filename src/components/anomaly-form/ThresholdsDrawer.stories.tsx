import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThresholdsDrawer } from "./ThresholdsDrawer";

const meta = {
  title: "Anomaly Form/Thresholds",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="bg-[#f9fafb] p-[24px]">
      <ThresholdsDrawer />
    </div>
  ),
};

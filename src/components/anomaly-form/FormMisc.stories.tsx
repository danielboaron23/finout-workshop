import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertNameDrawer } from "./AlertNameDrawer";
import { TimeIntervalDrawer } from "./TimeIntervalDrawer";
import { FormFooter } from "./FormFooter";

const meta = {
  title: "Anomaly Form/Misc",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const AlertName: Story = {
  render: () => <AlertNameDrawer />,
};

export const TimeInterval: Story = {
  render: () => <TimeIntervalDrawer className="max-w-[698px]" />,
};

export const Footer: Story = {
  parameters: { layout: "fullscreen" },
  render: () => <FormFooter />,
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertValuesDrawer } from "./AlertValuesDrawer";
import { UsageTypeDrawer } from "./UsageTypeDrawer";

const meta = {
  title: "Molecules/Form Sections",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const AlertValues: Story = {
  render: () => <AlertValuesDrawer />,
};

export const UsageType: Story = {
  render: () => <UsageTypeDrawer />,
};

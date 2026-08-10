import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CostUsageSwitcher } from "./CostUsageSwitcher";
import { AlertValuesDrawer } from "./AlertValuesDrawer";
import { UsageTypeDrawer } from "./UsageTypeDrawer";

const meta = {
  title: "Anomaly Form/Sections",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function SwitcherDemo() {
  const [value, setValue] = useState<"cost" | "usage">("usage");
  return <CostUsageSwitcher value={value} onChange={setValue} />;
}

export const Switcher: Story = {
  render: () => <SwitcherDemo />,
};

export const AlertValues: Story = {
  render: () => <AlertValuesDrawer />,
};

export const UsageType: Story = {
  render: () => <UsageTypeDrawer />,
};

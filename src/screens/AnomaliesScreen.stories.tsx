import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnomaliesScreen } from "./AnomaliesScreen";
import { AnomalyCard } from "@/components/anomalies/AnomalyCard";

const meta = {
  title: "Screens/Anomalies",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Full: Story = {
  render: () => (
    <div style={{ height: "960px", display: "flex" }}>
      <AnomaliesScreen />
    </div>
  ),
};

export const Card: Story = {
  parameters: { layout: "padded" },
  render: () => <AnomalyCard />,
};

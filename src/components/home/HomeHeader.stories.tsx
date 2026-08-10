import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HomeTopBar } from "./HomeTopBar";
import { GreetingHeader } from "./GreetingHeader";
import { KpiCardsRow } from "./KpiCard";

const meta = {
  title: "Home/Header",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const TopBar: Story = {
  render: () => <HomeTopBar />,
};

export const Greeting: Story = {
  render: () => (
    <div className="bg-white p-[24px]">
      <GreetingHeader />
    </div>
  ),
};

export const KpiCards: Story = {
  render: () => (
    <div className="bg-white p-[24px]">
      <KpiCardsRow />
    </div>
  ),
};

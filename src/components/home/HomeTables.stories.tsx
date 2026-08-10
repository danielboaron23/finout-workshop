import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CostCentersCard } from "./CostCentersCard";
import { RecommendationsCard } from "./RecommendationsCard";
import { TopSpendCard } from "./TopSpendCard";
import { RecentActivityCard } from "./RecentActivityCard";

const meta = {
  title: "Home/Tables",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const CostCenters: Story = {
  render: () => (
    <div className="bg-[#f9fafb] p-[24px]">
      <CostCentersCard />
    </div>
  ),
};

export const Recommendations: Story = {
  render: () => (
    <div className="bg-[#f9fafb] p-[24px] max-w-[858px]">
      <RecommendationsCard />
    </div>
  ),
};

export const TopSpend: Story = {
  render: () => (
    <div className="bg-[#f9fafb] p-[24px] max-w-[443px]">
      <TopSpendCard />
    </div>
  ),
};

export const RecentActivity: Story = {
  render: () => (
    <div className="bg-[#f9fafb] p-[24px] max-w-[443px]">
      <RecentActivityCard />
    </div>
  ),
};

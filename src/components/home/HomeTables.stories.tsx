import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CostCentersCard } from "./CostCentersCard";
import { RecommendationsCard } from "./RecommendationsCard";
import { TopSpendCard } from "./TopSpendCard";
import { RecentActivityCard } from "./RecentActivityCard";

const meta = {
  title: "Organisms/Home Tables",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Table and list widgets of the Home dashboard — Figma \"Home page\" → `.local_homepage_content`. These use the home-local table primitives (header 44px #eaecf0 / cells 54px / rounded-12 shell), deliberately distinct from the list-screen table in `src/components/table`. CostCenters' \"Total Cost\" header is sortable — clicking it cycles the sort and flips the arrow — and its per-row \"Explore\" action buttons navigate to /megabill via the Next router. Recommendations, TopSpend and RecentActivity are narrower widgets sized to their Figma card widths (858 / 443 / 443).",
      },
    },
  },
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

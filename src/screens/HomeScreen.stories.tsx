import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HomeScreen } from "./HomeScreen";

const meta = {
  title: "Screens/Overview",
  component: HomeScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full Home / Overview dashboard — a 1:1 rebuild of Figma node 1:13833. Sections are persona-driven: the PersonaSwitcher in the greeting header (FinOps / Engineer / Finance / Executive, demo-store key `home-persona`) decides which of the KPI row, cost centers, product cards, projections, monthly cost chart, recommendations, top spend and recent activity sections render. Every section is interactive — KPI \"Investigate in MegaBill\" CTAs, chart hovers and card menus all work against live demo data. Composes Sidebar + HomeTopBar + HomeDashboard, which in turn assembles the Home organisms (KpiCard, CostCentersCard, MonthlyCostChart, RecommendationsCard, TopSpendCard, RecentActivityCard).",
      },
    },
  },
} satisfies Meta<typeof HomeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ height: "960px", display: "flex" }}>
      <HomeScreen />
    </div>
  ),
};

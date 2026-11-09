import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MonthlyCostChart } from "./MonthlyCostChart";

const meta = {
  title: "Organisms/Monthly Cost Chart",
  component: MonthlyCostChart,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "\"Monthly cost changes (year to date)\" chart card from the Home dashboard — Figma \"Home page\" → `.local_homepage_content` → \"Daily cost change current month\" (1652x312). Nine monthly clusters of stacked provider bars straddle the $0 baseline, rebuilt as plain divs with the exact pixel segment heights read from the Figma rects. The legend is interactive: clicking a series dot toggles that provider in and out of every stack, and the $/% switch flips between absolute heights and each bar normalized to a 100% stack.",
      },
    },
  },
} satisfies Meta<typeof MonthlyCostChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="bg-[#f9fafb] p-[24px]">
      <MonthlyCostChart />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductCardsRow } from "./ProductCard";
import { ProjectionCardsRow } from "./ProjectionCard";
import { MonthlyCostChart as MonthlyCostChartComponent } from "./MonthlyCostChart";

const meta = {
  title: "Home/Cards",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ProductCards: Story = {
  render: () => (
    <div className="bg-[#f9fafb] p-[24px]">
      <ProductCardsRow />
    </div>
  ),
};

export const ProjectionCards: Story = {
  render: () => (
    <div className="bg-[#f9fafb] p-[24px]">
      <ProjectionCardsRow />
    </div>
  ),
};

export const MonthlyCostChart: Story = {
  render: () => (
    <div className="bg-[#f9fafb] p-[24px]">
      <MonthlyCostChartComponent />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MegaBillChartSection } from "./MegaBillChart";

const meta = {
  title: "MegaBill/Chart",
  component: MegaBillChartSection,
  parameters: { layout: "padded" },
} satisfies Meta<typeof MegaBillChartSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

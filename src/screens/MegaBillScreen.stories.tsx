import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MegaBillScreen } from "./MegaBillScreen";

const meta = {
  title: "Screens/MegaBill",
  component: MegaBillScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "MegaBill cost-analysis dashboard — a 1:1 rebuild of Figma node 1:13876, the most interactive screen in the set. MegaBillPageClient owns the whole view state: Cost/Usage mode and saved views persist in the demo store, while slice, aggregation, filters, group-by, x-axis pivot, amortized factor, chart type, legend visibility and table funnels/sort live locally and flow through the pure computeChartView/computeTableRows pipeline. The toolbar menus, KPI strip, stacked daily cost chart with legend toggles, actions row (copy / CSV export) and breakdown table all react to the same state. Composes Sidebar with the MegaBill organisms (MegaBillTopBar, MegaBillToolbar, MegaBillChartSection, MegaBillActionsRow, MegaBillTable).",
      },
    },
  },
} satisfies Meta<typeof MegaBillScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ height: "960px", display: "flex" }}>
      <MegaBillScreen />
    </div>
  ),
};

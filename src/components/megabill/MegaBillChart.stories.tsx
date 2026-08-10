import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MegaBillChartSection } from "./MegaBillChart";

const meta = {
  title: "Organisms/MegaBill Chart",
  component: MegaBillChartSection,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "MegaBill's upper \"Content\" section — Figma 1:13920 (1439x477): KPI strip (Total / Share of Total / Average Daily Cost), controls row, stacked daily bar chart (28 bars, Sep 17 → Oct 14) and the series legend. The legend is fully interactive — clicking a series hides it and the stacks re-compute, with an \"Unselect all\"/\"Select all\" link — and the controls row offers the Group By pivot select plus a line/bar chart toggle; the aggregation (Daily/Weekly) and date-range pivots live in the toolbar (see Organisms/MegaBill Bars) and reach the chart via props. Bars reproduce the exact Figma render: layered bottom-aligned divs with 6px rounded top caps so the color underneath peeks out at the shoulders. Uncontrolled here, the section falls back to internal state and the default dataset; on the screen MegaBillPageClient drives it.",
      },
    },
  },
} satisfies Meta<typeof MegaBillChartSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

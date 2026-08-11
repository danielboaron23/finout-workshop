import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  KpiCard,
  KpiTileDollar,
  KpiTileChartLine,
  KpiTileWavyCheck,
  KpiTileAnomaly,
  InfoIcon16,
} from "./KpiCard";
import { showToast, Toaster } from "@/components/ui/Toast";

const meta = {
  title: "Molecules/KPI Card",
  component: KpiCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Top-row KPI widget from the Home dashboard (Figma Home page → `.local_homepage_content` KPI row). White card on `#eaecf0` border with the subtle widget drop shadow; a 50px icon tile, the canonical 18/26 widget title (Helvetica Neue Medium — one shared title size across the whole page), a 12px caption, a 24px bold value with an optional trend delta (green `#027a48` when spend trends down, red `#d92d20` when up), a previous-period line, and a full-width WidgetButton CTA. The CTA navigates via `ctaHref` (Next Link) or falls back to `onCtaClick` — e.g. the CostGuard toast. Five default cards make up the dashboard row, laid out as equal-width grid columns.",
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    value: { control: "text" },
    previous: { control: "text" },
    cta: { control: "text" },
    ctaHref: { control: "text" },
    caption: { control: false },
    icon: { control: false },
    delta: { control: "object" },
    onCtaClick: { control: false },
    className: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 340 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof KpiCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default card 1 — dollar tile, downward (green) 7% delta, MegaBill CTA. */
export const MonthlyCloudSpend: Story = {
  args: {
    title: "Monthly cloud spend",
    caption: <span>Time frame: Current Month</span>,
    icon: <KpiTileDollar />,
    value: "$15,596",
    delta: { trend: "down", value: "7%" },
    previous: "$16,687 in previous month",
    cta: "Investigate in MegaBill",
    ctaHref: "/megabill",
  },
};

/** Default card 2 — same anatomy at daily granularity. */
export const AvgDailySpend: Story = {
  args: {
    title: "Avg. daily spend",
    caption: <span>Time frame: Current Month</span>,
    icon: <KpiTileDollar />,
    value: "$520",
    delta: { trend: "down", value: "7%" },
    previous: "$556 in previous month",
    cta: "Investigate in MegaBill",
    ctaHref: "/megabill",
  },
};

/** Default card 3 — chart-line tile and an upward (red) delta: projected spend rising 3%. */
export const ProjectedMonthlySpend: Story = {
  args: {
    title: "Projected monthly spend",
    caption: <span>Projection Period: Current Month</span>,
    icon: <KpiTileChartLine />,
    value: "$356,387",
    delta: { trend: "up", value: "3%" },
    previous: "$345,695 in previous month",
    cta: "Investigate in MegaBill",
    ctaHref: "/megabill",
  },
};

/** Default card 4 — rich caption (Monthly pill + info icon), no delta, toast CTA (click it!). */
export const MonthlyPotentialSavings: Story = {
  args: {
    title: "Monthly potential savings",
    caption: (
      <>
        <span>Time resolution: </span>
        <span className="bg-canvas flex items-center px-[6px] rounded-[8px]">
          <span className="font-medium text-text-primary">Monthly</span>
        </span>
        <InfoIcon16 />
      </>
    ),
    icon: <KpiTileWavyCheck />,
    value: "$26,802",
    cta: "Go to CostGuard",
    onCtaClick: () => showToast("CostGuard is next in the workshop 😉"),
  },
  render: (args) => (
    <>
      <KpiCard {...args} />
      <Toaster />
    </>
  ),
};

/** Default card 5 — plain count value (no currency, no delta), Anomalies CTA. */
export const Anomalies: Story = {
  args: {
    title: "Anomalies",
    caption: <span>Time frame: Last 7 Days</span>,
    icon: <KpiTileAnomaly />,
    value: "7",
    cta: "Go to Anomalies",
    ctaHref: "/anomalies",
  },
};

export const CustomCard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Playground story — tweak title, value, delta, previous, and CTA via Controls to compose a new KPI without touching code.",
      },
    },
  },
  args: {
    title: "Custom KPI",
    caption: <span>Time frame: Last 30 Days</span>,
    icon: <KpiTileDollar />,
    value: "$1,234",
    delta: { trend: "up", value: "12%" },
    previous: "$1,102 in previous period",
    cta: "Investigate",
    ctaHref: "/megabill",
  },
};

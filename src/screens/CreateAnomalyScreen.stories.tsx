import { Suspense } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CreateAnomalyScreen } from "./CreateAnomalyScreen";

const meta = {
  title: "Screens/Create Anomaly Alert",
  component: CreateAnomalyScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Create Usage Anomaly Alert form — a 1:1 rebuild of Figma node 1:13381, reached from the Anomalies feed CTA. The form stacks collapsible drawer organisms (AlertNameDrawer, AlertValuesDrawer, UsageTypeDrawer, ThresholdsDrawer, TimeIntervalDrawer) under a Cost/Usage switcher, with a sticky FormFooter for Cancel / Save. Save appends the alert to the feed's demo store and routes back to Anomalies; with `?edit=<index>` (from a card's \"Edit anomaly\") the drawers prefill from that card and Save updates it in place. The screen reads `useSearchParams`, so the story mirrors the app route by wrapping it in a `<Suspense>` boundary; it also composes Sidebar, TopNav (with BackLink) and PageTitleBar.",
      },
    },
  },
} satisfies Meta<typeof CreateAnomalyScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ height: "960px", display: "flex" }}>
      <Suspense fallback={null}>
        <CreateAnomalyScreen />
      </Suspense>
    </div>
  ),
};

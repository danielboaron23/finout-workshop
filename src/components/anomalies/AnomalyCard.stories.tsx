import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnomalyCard } from "./AnomalyCard";
import { Toaster, showToast } from "@/components/ui/Toast";

const meta = {
  title: "Organisms/Anomaly Card",
  component: AnomalyCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Usage anomaly feed card — Figma `.local_usage_anomaly_feed` (1:14693): date + Inter SemiBold 18 title + yellow \"Usage Anomaly\" badge over an info column (delta, expected vs actual usage, usage type, cost center, time-interval badges, scope tag) and the Highcharts render exported from the Figma node. Footer actions: Investigate, Edit anomaly (on the Anomalies screen this navigates to the /anomalies/create form pre-filled with the card's alert), Delete (removes the card with an undo toast), Add comment (toggles an inline input whose submissions append as `comments` lines) and \"Create a Jira issue\" (demo toast). All action callbacks are optional, so the card also renders statically.",
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof AnomalyCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Stateful wrapper: comments append locally, delete hides the card with a working undo. */
function InteractiveAnomalyCard() {
  const [comments, setComments] = useState<string[]>([]);
  const [deleted, setDeleted] = useState(false);
  if (deleted) return null;
  return (
    <AnomalyCard
      comments={comments}
      onInvestigate={() => showToast("Investigation opened")}
      onEdit={() => showToast("Would navigate to /anomalies/create with this alert")}
      onDelete={() => {
        setDeleted(true);
        showToast("Anomaly deleted", { undo: () => setDeleted(false) });
      }}
      onComment={(text) => setComments((prev) => [...prev, text])}
    />
  );
}

export const Default: Story = {
  render: () => <InteractiveAnomalyCard />,
};

export const WithComments: Story = {
  args: {
    comments: ["Flagged to the platform team — spike lines up with the batch eval run.", "Threshold review scheduled for Monday."],
  },
};

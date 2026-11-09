import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnomaliesScreen } from "./AnomaliesScreen";

const meta = {
  title: "Screens/Anomalies",
  component: AnomaliesScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Anomalies feed screen — a 1:1 rebuild of Figma node 1:14654. The feed filter row is live: date-range, Type, Cost Center, Key, Value and Threshold chips each open a Dropdown (select again to clear), and the search field narrows the anomaly cards from the demo store (`anomaly-cards`). The Manage Anomalies tab shows only custom alerts, where each card's menu links to the create form in edit mode (`/anomalies/create?edit=<index>`); the Create Anomaly Alert CTA navigates to the create screen. Composes Sidebar, TopNav and PageTitleBar with the FilterChip set and AnomaliesResults, which renders the Anomaly Card organism (see Organisms/Anomaly Card for the card in isolation).",
      },
    },
  },
} satisfies Meta<typeof AnomaliesScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {
  render: () => (
    <div style={{ height: "960px", display: "flex" }}>
      <AnomaliesScreen />
    </div>
  ),
};

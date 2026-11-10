import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReportsScreen } from "./ReportsScreen";

const meta = {
  title: "Screens/Reports",
  component: ReportsScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Reports list screen (Operate → Reports). Composes Sidebar, TopNav, PageTitleBar and Tabs above the Table organisms, with live search and All / Scheduled / On demand tab filtering over static demo data.",
      },
    },
  },
} satisfies Meta<typeof ReportsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ height: "960px", display: "flex" }}>
      <ReportsScreen />
    </div>
  ),
};

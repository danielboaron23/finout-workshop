import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sidebar } from "./Sidebar";

const meta = {
  title: "Organisms/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Finout's 220px dark navigation sidebar — Figma node 0:75858 (\"Sidebar navigation\"). Three sections (Inform / Optimize / Operate) over a #101828 surface, plus a footer card with Settings, Documentation and the account switcher. Overview, MegaBill, Virtual tags and Anomalies are real Next `<Link>`s to `/`, `/megabill`, `/virtual-tags` and `/anomalies`, so clicking them navigates the demo app; the rest are static placeholders. The `activeItem` prop highlights the current route's item (#475467 pill, white Inter Medium 14 label).",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: "1080px", display: "flex" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VirtualTagsActive: Story = {
  args: { activeItem: "Virtual tags" },
};

export const OverviewActive: Story = {
  args: { activeItem: "Overview" },
};

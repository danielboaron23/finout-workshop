import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sidebar } from "./Sidebar";

const meta = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
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

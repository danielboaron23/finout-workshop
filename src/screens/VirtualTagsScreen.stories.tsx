import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VirtualTagsScreen } from "./VirtualTagsScreen";

const meta = {
  title: "Screens/Virtual Tags",
  component: VirtualTagsScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof VirtualTagsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

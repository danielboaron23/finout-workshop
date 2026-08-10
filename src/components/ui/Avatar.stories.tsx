import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "./Avatar";

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'The "created by" identity circle from the Virtual Tags table, mapped to the Figma **Avatar** component. A 40px circle on the light `#f3f5f8` surface that renders either user initials (Helvetica Neue / `font-sans` Medium 14, `text-text-primary`) or, when no initials are given, the Finout fab logo as a system/service fallback.',
      },
    },
  },
  argTypes: {
    initials: { control: "text" },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Human user — two-letter initials centered in the circle. */
export const Initials: Story = {
  args: { initials: "DB" },
};

/** No initials — falls back to the Finout fab icon (tags created by the system). */
export const FinoutFallback: Story = {
  args: {},
};

export const Group: Story = {
  parameters: {
    docs: {
      description: {
        story: "Mixed creators as they appear down the table's Created By column.",
      },
    },
  },
  render: () => (
    <div className="flex gap-3 items-center">
      <Avatar initials="DB" />
      <Avatar initials="AK" />
      <Avatar initials="RS" />
      <Avatar />
    </div>
  ),
};

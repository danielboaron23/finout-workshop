import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Drawer } from "./Drawer";

const meta = {
  title: "Molecules/Drawer",
  component: Drawer,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Collapsible form section from the anomaly alert form, mapped to Figma **Horizontal Drawer** (e.g. 1:13394): a white `surface-primary` card with `border-light` border, 8px radius and 12px padding; a 24px tertiary chevron icon-button next to a Body/Medium 16/24 title and an optional 14/20 gray description. The drawer mounts open and the chevron toggles the content area (rotating -90° when collapsed, with `aria-expanded` kept in sync). The open state is internal — there is no prop to start collapsed.",
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    children: { control: false },
    className: { control: false },
  },
  args: {
    title: "Alert name",
    children: (
      <p className="font-sans font-normal leading-[20px] text-[14px] text-[#475467]">
        Drawer body content — form fields render here.
      </p>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 698 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default state — the drawer mounts open; click the chevron to collapse/expand. */
export const Open: Story = {};

/** With the optional 14/20 gray description under the title. */
export const WithDescription: Story = {
  args: {
    title: "Thresholds",
    description: "Define when a cost deviation becomes an anomaly alert.",
  },
};

export const CollapseInteraction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The play function clicks the chevron icon-button, leaving the drawer in its collapsed state (chevron rotated -90°, body unmounted, `aria-expanded=false`). The drawer always mounts open — collapse is only reachable through this interaction, not a prop.",
      },
    },
  },
  args: {
    title: "Time interval",
    description: "Collapsed via the play function — press the chevron to expand again.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { expanded: true });
    await userEvent.click(toggle);
    await expect(canvas.getByRole("button", { expanded: false })).toBeVisible();
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WidgetButton } from "./ProductCard";
import { showToast, Toaster } from "@/components/ui/Toast";

const meta = {
  title: "Atoms/Widget Button",
  component: WidgetButton,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The full-width CTA at the bottom of every home-dashboard widget, mapped to the Figma widget button: white fill, `#d0d5dd` border, 8px radius, subtle 1px shadow, and an Inter Semi Bold (`font-inter`) 14/20 label in `#344054`. Unlike the presentational Button atom it is actionable: pass `href` to render a Next.js `<Link>` with identical chrome (the KPI cards' `ctaHref` pattern), or `onClick` for in-place actions such as toasts. Used by KpiCard, ProductCard, and ProjectionCard.",
      },
    },
  },
  argTypes: {
    children: { control: "text" },
    href: { control: "text" },
    onClick: { control: false },
    className: { control: false },
  },
  args: { children: "Go to Dashboards" },
  decorators: [
    (Story) => (
      <div style={{ width: 260 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WidgetButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Plain button chrome — fills its container's width. */
export const Default: Story = {};

/** With `href` it renders a Next.js Link with the exact same chrome. */
export const AsLink: Story = {
  args: { children: "Go to Virtual Tags", href: "/virtual-tags" },
};

export const OnClickToast: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Without `href`, `onClick` handles the action — here firing the demo toast used by dashboard CTAs whose product areas are out of the workshop's scope.",
      },
    },
  },
  render: () => (
    <>
      <WidgetButton onClick={() => showToast("Opening Dashboards…")}>Go to Dashboards</WidgetButton>
      <Toaster />
    </>
  ),
};

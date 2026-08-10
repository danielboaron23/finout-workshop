import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button, ChevronDown16 } from "./Button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The core Finout action button, mapped 1:1 to the Figma **Button** components. Five variants cover the whole action hierarchy: `primary` (#1570ef fill), `secondary` (blue outline), `tertiary` (neutral #d0d5dd outline), `ghost` (borderless), and `link` (text-only #175cd3). Chrome is shared across variants: 36px min height, 8px radius, Helvetica Neue (`font-sans`) Medium 14/20, 8px gap for optional icons such as `ChevronDown16`. The atom is purely presentational — it takes no `onClick`/`href`; navigation CTAs in the product use `WidgetButton` (Atoms/Widget Button) or the KPI card's `ctaHref` pattern.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "ghost", "link"],
      description: "Visual hierarchy of the action",
    },
    children: { control: "text" },
    className: { control: false },
  },
  args: { children: "Button", variant: "primary" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Main call to action — one per view (e.g. "Create Virtual Tag", "Save"). */
export const Primary: Story = {
  args: { variant: "primary", children: "Save" },
};

/** Emphasized alternative action — blue #1570ef outline, #175cd3 text. */
export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};

/** Neutral action — #d0d5dd outline, #101828 text (e.g. "Cancel"). */
export const Tertiary: Story = {
  args: { variant: "tertiary", children: "Tertiary" },
};

/** Borderless action for dense toolbars. */
export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost" },
};

/** Text-only action in link blue #175cd3. */
export const LinkButton: Story = {
  name: "Link",
  args: { variant: "link", children: "Link button" },
};

export const WithChevron: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Split-action pattern from the Virtual Tags header: label + `ChevronDown16` icon (white on primary, dark on outlined variants).",
      },
    },
  },
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <Button variant="primary">
        Create Virtual Tag
        <ChevronDown16 white />
      </Button>
      <Button variant="tertiary">
        Group by
        <ChevronDown16 />
      </Button>
    </div>
  ),
};

export const AsLink: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "ctaHref-style usage: the `link` variant styled as an inline navigation CTA. Note the Button atom itself has no `href` prop — real navigation in the product goes through `WidgetButton href` / `KpiCard ctaHref`, which render a Next.js `<Link>` with button chrome.",
      },
    },
  },
  render: () => (
    <div className="flex gap-4 items-center">
      <Button variant="link">View all anomalies</Button>
      <Button variant="link">
        Investigate in MegaBill
        <ChevronDown16 />
      </Button>
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: "The full action hierarchy side by side, in priority order.",
      },
    },
  },
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

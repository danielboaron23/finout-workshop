import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ProductCard,
  ProductCardsRow,
  ProductIconTag,
  ProductIconPieChart,
  DEFAULT_PRODUCT_CARDS,
} from "./ProductCard";
import { showToast, Toaster } from "@/components/ui/Toast";

const meta = {
  title: "Molecules/Product Card",
  component: ProductCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Product shortcut card from the Home dashboard, mapped to Figma **Frame 1000005014** (1652×230): Financial Plans / Virtual Tags / Dashboards / Cost Centers. Anatomy: a product icon in a 50px light-blue `#eff8ff` tile, the shared 18/26 widget title with a 14px count line, a 14px `#475467` description, and a full-width WidgetButton CTA (`ctaHref` for navigation, `onCtaClick` for toasts). The row lays four cards out as equal-width `minmax(280px,1fr)` grid columns per the page-wide card rule.",
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    count: { control: "text" },
    description: { control: "text" },
    cta: { control: "text" },
    ctaHref: { control: "text" },
    icon: { control: false },
    onCtaClick: { control: false },
    className: { control: false },
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single card with a navigation CTA (`ctaHref` → /virtual-tags). */
export const SingleCard: Story = {
  args: {
    icon: <ProductIconTag />,
    title: "Virtual Tags",
    count: "50 Tags",
    description: "Unify cloud cost management with Finout’s dynamic Virtual Tags",
    cta: "Go to Virtual Tags",
    ctaHref: "/virtual-tags",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
};

/** CTA without `ctaHref` — `onCtaClick` fires a toast (click it!). */
export const WithToastCta: Story = {
  args: {
    icon: <ProductIconPieChart />,
    title: "Financial Plans",
    count: "0 Plans",
    description: "Plan annual cloud budgets and control costs with Finout",
    cta: "Go to Financial Plans",
    onCtaClick: () => showToast("Opening Financial Plans…"),
  },
  render: (args) => (
    <>
      <ProductCard {...args} />
      <Toaster />
    </>
  ),
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export const FourCardRow: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "The full dashboard row (`ProductCardsRow` with `DEFAULT_PRODUCT_CARDS`): equal-width cards that fill the row at any viewport, wrapping below 280px per card. Some CTAs navigate, others toast.",
      },
    },
  },
  args: { ...DEFAULT_PRODUCT_CARDS[0] },
  render: () => (
    <div className="p-[24px]">
      <ProductCardsRow cards={DEFAULT_PRODUCT_CARDS} />
      <Toaster />
    </div>
  ),
};

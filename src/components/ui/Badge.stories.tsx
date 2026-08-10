import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FolderBadge, ProductBadge } from "./Badge";

const meta = {
  title: "Atoms/Badge",
  component: FolderBadge,
  subcomponents: { ProductBadge },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Pill badges used in the Virtual Tags table. `FolderBadge` maps to the Figma **Badge / Status** (neutral solid: #f2f4f7 fill, #dee1e8 border, folder icon) and labels the folder a tag belongs to. `ProductBadge` maps to Figma **Badge / Product** with two variants — `blue` for Virtual Tag, `violet` for Relational Virtual Tag — and keeps the design's exact 1.241x table scale. Both use Geist Semibold (`font-geist`) labels on a fully-rounded pill.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
  },
  args: { label: "Kubernetes" },
} satisfies Meta<typeof FolderBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Neutral folder pill with the 16px folder icon — Figma "Badge / Status". */
export const Folder: Story = {
  args: { label: "Kubernetes" },
};

/** Product pill for a plain Virtual Tag — blue set (#f5faff / #84caff / #194185). */
export const ProductBlue: Story = {
  render: () => <ProductBadge label="Virtual Tag" variant="blue" />,
};

/** Product pill for a Relational Virtual Tag — violet set (#ede9fc / #cabdf7 / #53389e). */
export const ProductViolet: Story = {
  render: () => <ProductBadge label="Relational Virtual Tag" variant="violet" />,
};

export const AllBadges: Story = {
  parameters: {
    docs: {
      description: {
        story: "All badge flavors as they appear together in the Virtual Tags table.",
      },
    },
  },
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <FolderBadge label="Kubernetes" />
      <FolderBadge label="Data Platform" />
      <ProductBadge label="Virtual Tag" variant="blue" />
      <ProductBadge label="Relational Virtual Tag" variant="violet" />
    </div>
  ),
};

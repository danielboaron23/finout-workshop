import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertValuesDrawer } from "./AlertValuesDrawer";
import { Toaster, showToast } from "@/components/ui/Toast";

const meta = {
  title: "Organisms/Alert Values Drawer",
  component: AlertValuesDrawer,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "\"Alert Values\" horizontal drawer from the Create Anomaly form — Figma 1:13429 (1636x184): a collapsible white card (chevron toggles the content) whose row holds the vendor select (Anthropic / OpenAI / AWS, a real dropdown reported via `onVendorChange`), a Filters select, and the \"Group By\" grouped select whose gray tag (User Name / Model / Region) is removable via its x and restorable from the dropdown. Below sits the full-width tag area with removable filter tags (e.g. `claude-opus-4-8`) and a \"Clear\" action that empties them all — every control drives real internal state.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-[#f9fafb] p-[24px]">
        <Story />
        <Toaster />
      </div>
    ),
  ],
  // Untyped Meta/StoryObj: the component defaults its whole props object to {},
  // which collapses Storybook's inferred args type to `never`.
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <AlertValuesDrawer vendor="Anthropic" onVendorChange={(v: string) => showToast(`Vendor set to ${v}`)} />
  ),
};

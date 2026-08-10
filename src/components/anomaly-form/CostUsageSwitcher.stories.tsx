import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CostUsageSwitcher } from "./CostUsageSwitcher";

const meta = {
  title: "Atoms/Segmented Switcher",
  component: CostUsageSwitcher,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Two-segment Cost/Usage switcher from the anomaly alert form, mapped to Figma **"time frame and interval"** (1:13387), switcher 1:13388. A fixed 128×34 control of two 64px segments: the active segment gets `#eff8ff` fill, a full 1px `#1570ef` border and blue text (it also draws the shared middle edge); the inactive one stays white with a `#d0d5dd` border and `#101828` text. Labels are Helvetica Neue Medium 12/20; the control is fully controlled via `value` / `onChange` and exposes `aria-pressed` per segment.',
      },
    },
  },
  argTypes: {
    value: { control: "inline-radio", options: ["cost", "usage"] },
    onChange: { control: false },
  },
  args: { value: "cost", onChange: () => {} },
} satisfies Meta<typeof CostUsageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

function SwitcherDemo({ initial = "cost" }: { initial?: "cost" | "usage" }) {
  const [value, setValue] = useState<"cost" | "usage">(initial);
  return <CostUsageSwitcher value={value} onChange={setValue} />;
}

/** Stateful demo — click a segment to move the active (blue) state. */
export const Interactive: Story = {
  render: () => <SwitcherDemo />,
};

/** Static controlled state: Cost segment active. */
export const CostActive: Story = {
  args: { value: "cost" },
};

/** Static controlled state: Usage segment active. */
export const UsageActive: Story = {
  args: { value: "usage" },
};

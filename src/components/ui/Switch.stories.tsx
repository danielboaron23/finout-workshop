import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Switch } from "./Switch";

const meta = {
  title: "Atoms/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Figma Switch 33×18 — blue (#1570ef) track when on, white 16px knob. Lifted out of `anomaly-form/ThresholdsDrawer` for the Settings screen and given `checked` + `onChange`. Pass the pair and it is controlled; omit both and it keeps the uncontrolled behaviour the anomaly form relies on — the same extend shape as `CheckboxCell`.",
      },
    },
  },
  args: { ariaLabel: "Example toggle" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Uncontrolled — the original behaviour, unchanged. */
export const Uncontrolled: Story = { args: { defaultChecked: true } };

export const Off: Story = { args: { defaultChecked: false } };

/** Controlled — the parent both reads and drives the value. */
export const Controlled: Story = {
  render: function Render() {
    const [on, setOn] = useState(false);
    return (
      <span className="flex items-center gap-[12px]">
        <Switch checked={on} onChange={setOn} ariaLabel="Controlled toggle" />
        <span className="font-sans text-[14px] text-text-secondary">{on ? "On" : "Off"}</span>
      </span>
    );
  },
};

export const Disabled: Story = { args: { defaultChecked: true, disabled: true } };

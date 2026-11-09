import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";
import { Toaster, showToast } from "./Toast";

const meta = {
  title: "Atoms/Toast",
  component: Toaster,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Minimal toast system for the demo product experience: a dark `#101828` pill, white Helvetica Neue 14 text, and an optional blue `#84caff` **Undo** action, floating bottom-center with the md drop shadow. Mount `<Toaster />` once (app layout or story), then call `showToast(message, { undo })` from anywhere — toasts stack and auto-dismiss after 4 seconds; pressing Undo runs the callback and dismisses immediately. There is no direct Figma component — it reuses the dark-surface + Helvetica tokens from the system.",
      },
    },
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Click the buttons to fire real toasts (they appear bottom-center and auto-dismiss after 4s). The second trigger passes an `undo` callback, which adds the blue Undo action — pressing it fires a follow-up toast. The Button atom is presentational (no onClick), so the demo attaches the handler on a wrapper.",
      },
    },
  },
  render: () => (
    <div className="flex gap-[12px] items-center flex-wrap">
      <span onClick={() => showToast("Anomaly alert saved")}>
        <Button variant="primary">Show toast</Button>
      </span>
      <span
        onClick={() =>
          showToast("Virtual tag deleted", {
            undo: () => showToast("Virtual tag restored"),
          })
        }
      >
        <Button variant="tertiary">Show toast with Undo</Button>
      </span>
      <Toaster />
    </div>
  ),
};

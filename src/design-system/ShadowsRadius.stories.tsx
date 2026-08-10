import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { shadows, radii } from "./tokens";

/**
 * Foundations / Shadows & Radius — elevation tokens demoed on white cards,
 * and the corner-radius scale on squares. Data comes from tokens.ts.
 */

const meta = {
  title: "Foundations/Shadows & Radius",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Elevation and shape. Six shadow tokens (xs, sm, md, medium, lg, xl) go from a hairline lift on buttons up to modal-level elevation; five radius tokens (4, 8, 10, 12, full) map to badges, buttons, menus, cards and pills. All values live in the @theme block of globals.css.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Shadows: Story = {
  render: () => (
    <div className="font-sans" style={{ fontFamily: "var(--font-sans)" }}>
      <h2 className="text-[18px] font-medium leading-[26px] text-text-primary">Shadows</h2>
      <p className="mt-[2px] text-sm text-text-secondary">
        Rendered on white cards over the app canvas, exactly as they appear in the product.
      </p>
      <div
        className="mt-[16px] flex flex-wrap gap-[32px] rounded-xl p-[32px]"
        style={{ background: "var(--color-canvas)" }}
      >
        {shadows.map((token) => (
          <div key={token.name} className="w-[200px]">
            <div
              className="flex h-[96px] items-center justify-center rounded-xl bg-white"
              style={{ boxShadow: token.value }}
            >
              <span className="text-sm font-medium text-text-primary" style={{ fontFamily: "var(--font-geist)" }}>
                {token.name.replace("--shadow-", "shadow-")}
              </span>
            </div>
            <div
              className="mt-[8px] text-xs font-medium text-text-primary"
              style={{ fontFamily: "var(--font-geist)" }}
            >
              {token.name}
            </div>
            <div className="mt-[2px] text-xs leading-[16px] text-text-tertiary">{token.usage}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div className="font-sans" style={{ fontFamily: "var(--font-sans)" }}>
      <h2 className="text-[18px] font-medium leading-[26px] text-text-primary">Corner radius</h2>
      <p className="mt-[2px] text-sm text-text-secondary">
        Five steps: 4px (badges) → 8px (buttons, inputs) → 10px (menus) → 12px (cards) → full (pills).
      </p>
      <div className="mt-[16px] flex flex-wrap gap-[32px]">
        {radii.map((token) => (
          <div key={token.name} className="w-[160px]">
            <div
              className="h-[80px] w-[80px] border"
              style={{
                borderRadius: token.value,
                background: "var(--color-blue-50)",
                borderColor: "var(--color-blue-400)",
              }}
            />
            <div
              className="mt-[8px] text-xs font-medium text-text-primary"
              style={{ fontFamily: "var(--font-geist)" }}
            >
              {token.name}
            </div>
            <div className="text-xs text-text-secondary" style={{ fontFamily: "var(--font-geist)" }}>
              {token.value}
            </div>
            <div className="mt-[2px] text-xs leading-[16px] text-text-tertiary">{token.usage}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

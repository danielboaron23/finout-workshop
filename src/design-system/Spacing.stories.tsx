import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * Foundations / Spacing — the spacing steps actually used across the
 * project's components (paddings and gaps), on a 4px base grid.
 * Spacing is a convention here, not a @theme token: components use
 * Tailwind arbitrary values like p-[24px] / gap-[8px].
 */

const meta = {
  title: "Foundations/Spacing",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The spacing values actually used in the project's components — a 4px-base scale (4/8/12/16/24/32). Spacing is not defined in @theme; components apply it with Tailwind arbitrary values (p-[24px], gap-[8px], ...). This page documents which step to reach for where.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const SPACING: { px: number; usedFor: string }[] = [
  { px: 4, usedFor: "Icon-to-label gaps, badge inner gaps (gap-[4px])" },
  { px: 8, usedFor: "The workhorse gap — control rows, chips, dropdown offset (gap-[8px], px-[8px])" },
  { px: 12, usedFor: "Input/select horizontal padding, gaps inside cards (px-[12px], gap-[12px])" },
  { px: 16, usedFor: "Compact card padding, button horizontal padding (p-[16px], px-[16px])" },
  { px: 24, usedFor: "Default card/widget padding, grid gaps between cards (p-[24px], gap-[24px])" },
  { px: 32, usedFor: "Large section gaps between page regions (gap-[32px])" },
];

export const Scale: Story = {
  render: () => (
    <div className="max-w-[880px] font-sans" style={{ fontFamily: "var(--font-sans)" }}>
      <h2 className="text-[18px] font-medium leading-[26px] text-text-primary">Spacing scale</h2>
      <p className="mt-[2px] text-sm text-text-secondary">
        4px base grid. Six steps cover the whole product: 4 · 8 · 12 · 16 · 24 · 32.
      </p>
      <div className="mt-[16px] flex flex-col gap-[12px]">
        {SPACING.map(({ px, usedFor }) => (
          <div
            key={px}
            className="flex items-center gap-[24px] rounded-md border px-[16px] py-[12px]"
            style={{ borderColor: "var(--color-border-light)", background: "var(--color-surface-primary)" }}
          >
            <div
              className="w-[64px] shrink-0 text-sm font-medium text-text-primary"
              style={{ fontFamily: "var(--font-geist)" }}
            >
              {px}px
            </div>
            <div
              className="h-[16px] shrink-0 rounded-sm"
              style={{ width: px * 4, background: "var(--color-blue-400)" }}
              title={`${px}px (bar drawn at 4x)`}
            />
            <div className="min-w-0 text-sm text-text-secondary">{usedFor}</div>
          </div>
        ))}
      </div>
      <p className="mt-[12px] text-xs text-text-tertiary">
        Bars are drawn at 4× for legibility. In code, spacing is applied with Tailwind arbitrary
        values (e.g. <code>p-[24px]</code>) so it always matches the Figma measurement exactly.
      </p>

      {/* Live examples */}
      <h2 className="mt-[32px] text-[18px] font-medium leading-[26px] text-text-primary">In context</h2>
      <div className="mt-[16px] flex flex-wrap gap-[24px]">
        <div
          className="rounded-xl border p-[24px]"
          style={{ borderColor: "var(--color-border-light)", background: "var(--color-surface-primary)" }}
        >
          <div className="text-xs text-text-tertiary" style={{ fontFamily: "var(--font-geist)" }}>
            p-[24px] — widget card padding
          </div>
          <div className="mt-[8px] flex items-center gap-[8px]">
            <div className="h-[24px] w-[24px] rounded-sm" style={{ background: "var(--color-blue-50)" }} />
            <div className="text-sm text-text-secondary">gap-[8px] between icon and label</div>
          </div>
        </div>
        <div
          className="rounded-xl border p-[16px]"
          style={{ borderColor: "var(--color-border-light)", background: "var(--color-surface-primary)" }}
        >
          <div className="text-xs text-text-tertiary" style={{ fontFamily: "var(--font-geist)" }}>
            p-[16px] — compact card padding
          </div>
          <div className="mt-[8px] text-sm text-text-secondary">Used by KPI tiles and dense panels</div>
        </div>
      </div>
    </div>
  ),
};

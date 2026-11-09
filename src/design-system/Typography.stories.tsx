import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { typeScale, fonts, widgetTitleRule } from "./tokens";

/**
 * Foundations / Typography — the type scale (2xs → xl), the three font
 * families and where each is used, and the shared widget-title rule.
 */

const meta = {
  title: "Foundations/Typography",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The Finout type scale (text-2xs through text-xl, each a size/line-height pair from @theme) and the three font families: Helvetica Neue for headings/body/buttons, Inter for sidebar navigation, and Geist for inputs, counters and badges. Also documents the project rule that every widget title on a page shares one 18px/26px style.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const SAMPLE = "Monthly cloud spend $15,596";

const FONT_USAGE: { label: string; varName: string; stack: string; usedFor: string }[] = [
  {
    label: "Helvetica Neue",
    varName: "--font-sans",
    stack: "var(--font-sans)",
    usedFor: "Default UI font — headings, body copy, buttons, table cells",
  },
  {
    label: "Inter",
    varName: "--font-inter",
    stack: "var(--font-inter)",
    usedFor: "Sidebar navigation labels only",
  },
  {
    label: "Geist",
    varName: "--font-geist",
    stack: "var(--font-geist)",
    usedFor: "Inputs, counters and badges — anywhere digits must align cleanly",
  },
];

function ScaleRow({ className, size, lineHeight, usage }: (typeof typeScale)[number]) {
  return (
    <div
      className="flex items-baseline gap-[24px] border-b py-[16px]"
      style={{ borderColor: "var(--color-border-lighter)" }}
    >
      <div className="w-[176px] shrink-0">
        <div className="text-sm font-medium text-text-primary" style={{ fontFamily: "var(--font-geist)" }}>
          {className} · {parseInt(size)}/{parseInt(lineHeight)}
        </div>
        <div className="mt-[2px] text-xs leading-[16px] text-text-tertiary">{usage}</div>
      </div>
      <div
        className="min-w-0 text-text-primary"
        style={{ fontSize: size, lineHeight, fontFamily: "var(--font-sans)" }}
      >
        {SAMPLE}
      </div>
    </div>
  );
}

export const TypeScale: Story = {
  name: "Type Scale",
  render: () => (
    <div className="max-w-[880px] font-sans" style={{ fontFamily: "var(--font-sans)" }}>
      <h2 className="text-[18px] font-medium leading-[26px] text-text-primary">Type scale</h2>
      <p className="mt-[2px] text-sm text-text-secondary">
        Five steps, each a paired size/line-height token in <code>@theme</code>. Body typeface is
        Helvetica Neue.
      </p>
      <div className="mt-[8px]">
        {typeScale.map((entry) => (
          <ScaleRow key={entry.name} {...entry} />
        ))}
      </div>

      {/* Widget title rule */}
      <div
        className="mt-[24px] rounded-xl border p-[24px]"
        style={{ borderColor: "var(--color-border-light)", background: "var(--color-surface-primary)" }}
      >
        <div className="text-2xs font-medium uppercase tracking-[0.06em] text-text-tertiary">
          Project rule — widget titles
        </div>
        <div className={widgetTitleRule.className + " mt-[8px]"}>Monthly potential savings</div>
        <p className="mt-[8px] text-sm text-text-secondary">
          Every widget/card title on a page uses one shared style —{" "}
          <strong>
            {parseInt(widgetTitleRule.size)}/{parseInt(widgetTitleRule.lineHeight)} medium
          </strong>{" "}
          (<code>{widgetTitleRule.className}</code>) — sized so the longest title on the page fits one
          line inside an equal-width card. Never wrap a title and never shrink one title below its
          siblings; if a longer title arrives, lower the shared size for the whole page.
        </p>
      </div>
    </div>
  ),
};

export const FontFamilies: Story = {
  name: "Font Families",
  render: () => (
    <div className="max-w-[880px] font-sans" style={{ fontFamily: "var(--font-sans)" }}>
      <h2 className="text-[18px] font-medium leading-[26px] text-text-primary">Font families</h2>
      <p className="mt-[2px] text-sm text-text-secondary">
        Three families, each with a fixed role. All are loaded via <code>next/font</code> in{" "}
        <code>src/app/layout.tsx</code> and <code>.storybook/preview.tsx</code>.
      </p>
      <div className="mt-[16px] flex flex-col gap-[16px]">
        {FONT_USAGE.map((font) => (
          <div
            key={font.varName}
            className="rounded-xl border p-[24px]"
            style={{ borderColor: "var(--color-border-light)", background: "var(--color-surface-primary)" }}
          >
            <div className="flex flex-wrap items-baseline gap-x-[12px]">
              <div className="text-sm font-medium text-text-primary">{font.label}</div>
              <div className="text-xs text-text-tertiary" style={{ fontFamily: "var(--font-geist)" }}>
                {font.varName}
              </div>
            </div>
            <div
              className="mt-[8px] text-[20px] leading-[28px] text-text-primary"
              style={{ fontFamily: font.stack }}
            >
              {SAMPLE}
            </div>
            <div className="mt-[4px] text-sm text-text-secondary" style={{ fontFamily: font.stack }}>
              ABCDEFGHIJKLM abcdefghijklm 0123456789 $%&
            </div>
            <div className="mt-[8px] text-xs leading-[16px] text-text-tertiary">{font.usedFor}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

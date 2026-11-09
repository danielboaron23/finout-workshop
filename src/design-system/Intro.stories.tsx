import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * Design System / Welcome — the front door of the Finout workshop design system.
 * Explains the atomic structure and how tokens flow from Figma into components.
 */

const meta = {
  title: "Design System/Welcome",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Welcome page for the Finout workshop design system. It explains the atomic structure (Foundations → Atoms → Molecules → Organisms → Screens), shows one concrete composition example, and describes how design tokens flow from Figma variables into components.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const LEVELS: { level: string; means: string; examples: string }[] = [
  {
    level: "Foundations",
    means: "The raw design decisions — not components, but the values everything is built from.",
    examples: "Colors, typography, spacing, radius, shadows, icons",
  },
  {
    level: "Atoms",
    means: "The smallest usable UI pieces. One job each, no layout opinions.",
    examples: "Button, Badge, Avatar, SearchInput, Select",
  },
  {
    level: "Molecules",
    means: "A few atoms composed into one meaningful unit.",
    examples: "KPI card, table row, filter bar, folder menu",
  },
  {
    level: "Organisms",
    means: "Large, self-contained sections of a page.",
    examples: "Sidebar, top navigation, full data table, chart widget",
  },
  {
    level: "Screens",
    means: "Complete pages assembled from organisms — the 1:1 Figma rebuilds.",
    examples: "Home, Virtual Tags, Anomalies, MegaBill, Create Anomaly",
  },
];

const FLOW_STEPS: { step: string; detail: string }[] = [
  { step: "Figma variables", detail: "Designers define tokens in the Figma file (lhnXVSWU3CbI8QP3BKE0bx)" },
  { step: "globals.css @theme", detail: "Each token becomes a CSS variable — the single source of truth in code" },
  { step: "Tailwind classes", detail: "Tailwind v4 turns every @theme token into a utility class automatically" },
  { step: "Components", detail: "Components use only those classes — never hard-coded values" },
];

function WelcomePage() {
  return (
    <div
      className="mx-auto max-w-[880px] font-sans text-text-primary"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Hero */}
      <div
        className="rounded-xl px-[32px] py-[28px] text-text-inverse"
        style={{ background: "var(--color-neutral-500)" }}
      >
        <div className="text-xs font-medium uppercase tracking-[0.08em]" style={{ color: "var(--color-icon-brand)" }}>
          Finout Workshop
        </div>
        <h1 className="mt-[8px] text-[28px] font-medium leading-[36px]">Finout Design System</h1>
        <p className="mt-[8px] max-w-[600px] text-sm" style={{ color: "var(--color-neutral-200)" }}>
          A teaching design system: a 1:1 rebuild of five Finout screens, decomposed into tokens and
          components so you can see exactly how a real FinOps product is put together.
        </p>
      </div>

      {/* Atomic structure */}
      <h2 className="mt-[32px] text-[18px] font-medium leading-[26px]">The atomic structure</h2>
      <p className="mt-[8px] text-sm text-text-secondary">
        The Storybook sidebar is ordered from smallest to largest. Every level is built only from the
        levels below it — that constraint is what keeps the system consistent.
      </p>
      <div className="mt-[16px] flex flex-col gap-[8px]">
        {LEVELS.map((row, i) => (
          <div
            key={row.level}
            className="flex items-start gap-[16px] rounded-md border px-[16px] py-[12px]"
            style={{ borderColor: "var(--color-border-light)", background: "var(--color-surface-primary)" }}
          >
            <div
              className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-xs font-medium"
              style={{ background: "var(--color-blue-50)", color: "var(--color-text-link)" }}
            >
              {i + 1}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium">{row.level}</div>
              <div className="mt-[2px] text-sm text-text-secondary">{row.means}</div>
              <div className="mt-[2px] text-xs text-text-tertiary">e.g. {row.examples}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Composition example */}
      <h2 className="mt-[32px] text-[18px] font-medium leading-[26px]">One example of composition</h2>
      <p className="mt-[8px] text-sm text-text-secondary">
        The same piece of UI, moving up the ladder — an atom becomes part of a molecule, which becomes
        part of a screen:
      </p>
      <div
        className="mt-[16px] flex flex-wrap items-center gap-[12px] rounded-xl border p-[24px]"
        style={{ borderColor: "var(--color-border-light)", background: "var(--color-surface-primary)" }}
      >
        {[
          { tag: "Atom", label: "Button", note: '"View report" action' },
          { tag: "Molecule", label: "KpiCard", note: "value + trend badge + Button" },
          { tag: "Screen", label: "Home", note: "a row of equal-width KpiCards" },
        ].map((item, i, arr) => (
          <div key={item.label} className="flex items-center gap-[12px]">
            <div
              className="rounded-md border px-[16px] py-[10px]"
              style={{ borderColor: "var(--color-border-muted)", background: "var(--color-surface-secondary)" }}
            >
              <div className="text-2xs font-medium uppercase tracking-[0.06em] text-text-tertiary">{item.tag}</div>
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-xs text-text-secondary">{item.note}</div>
            </div>
            {i < arr.length - 1 && (
              <span className="text-base text-text-tertiary" aria-hidden>
                →
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Token flow */}
      <h2 className="mt-[32px] text-[18px] font-medium leading-[26px]">How tokens flow</h2>
      <p className="mt-[8px] text-sm text-text-secondary">
        There is exactly one source of truth in code: the <code>@theme</code> block in{" "}
        <code>src/app/globals.css</code>. Everything else derives from it.
      </p>
      <div className="mt-[16px] flex flex-col gap-[8px]">
        {FLOW_STEPS.map((row, i, arr) => (
          <div key={row.step} className="flex items-start gap-[12px]">
            <div className="flex flex-col items-center self-stretch">
              <div
                className="h-[10px] w-[10px] shrink-0 rounded-full"
                style={{ background: "var(--color-blue-400)", marginTop: 6 }}
              />
              {i < arr.length - 1 && (
                <div className="w-[2px] flex-1" style={{ background: "var(--color-border-light)" }} />
              )}
            </div>
            <div className="pb-[12px]">
              <div className="text-sm font-medium">{row.step}</div>
              <div className="text-sm text-text-secondary">{row.detail}</div>
            </div>
          </div>
        ))}
      </div>
      <div
        className="mt-[8px] rounded-md border px-[16px] py-[12px] text-sm"
        style={{ borderColor: "var(--color-success-200)", background: "var(--color-success-50)", color: "var(--color-success-700)" }}
      >
        Example: Figma variable <strong>text/primary</strong> → <code>--color-text-primary: #101828</code>{" "}
        in <code>@theme</code> → Tailwind class <code>text-text-primary</code> → used by Button, Table,
        every title.
      </div>

      {/* House rules */}
      <h2 className="mt-[32px] text-[18px] font-medium leading-[26px]">Workshop house rules</h2>
      <ul className="mt-[8px] flex list-disc flex-col gap-[4px] pl-[20px] text-sm text-text-secondary">
        <li>Tokens only — if a value is not in <code>@theme</code>, it does not go in a component.</li>
        <li>One shared widget-title style per page: 18px/26px medium, sized so the longest title fits one line.</li>
        <li>All icons are real Figma SVG exports (<code>public/icons/…</code>) — never hand-drawn.</li>
        <li>Pixel-perfect at 1920×1080; the whole UI scales proportionally to the viewport.</li>
      </ul>
    </div>
  );
}

export const Welcome: Story = {
  render: () => <WelcomePage />,
};

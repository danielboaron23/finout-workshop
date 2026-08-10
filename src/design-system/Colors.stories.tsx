import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { colorGroups, type Token } from "./tokens";

/**
 * Foundations / Colors — every color token from globals.css @theme,
 * grouped by role, rendered from the typed data in tokens.ts.
 */

const meta = {
  title: "Foundations/Colors",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Every color token in the system, grouped by role: semantic text/surface/border/icon colors first (use these), then the raw ramps (neutrals, grays, blues), status greens, and the chart-only data-viz palette. Values are read from src/design-system/tokens.ts, a typed mirror of the @theme block in src/app/globals.css.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** True for colors light enough to need a border on a white page. */
function isLight(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return true;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  // Perceived luminance, 0–255
  return 0.299 * r + 0.587 * g + 0.114 * b > 210;
}

function Swatch({ token }: { token: Token }) {
  return (
    <div className="w-[176px]">
      <div
        className="h-[64px] w-[64px] rounded-md"
        style={{
          background: token.value,
          border: isLight(token.value) ? "1px solid var(--color-border-muted)" : "1px solid transparent",
        }}
      />
      <div
        className="mt-[8px] break-all text-xs font-medium text-text-primary"
        style={{ fontFamily: "var(--font-geist)" }}
      >
        {token.name}
      </div>
      <div className="text-xs text-text-secondary" style={{ fontFamily: "var(--font-geist)" }}>
        {token.value}
      </div>
      <div className="mt-[2px] text-xs leading-[16px] text-text-tertiary">{token.usage}</div>
    </div>
  );
}

function ColorGroup({ title, description, tokens }: { title: string; description: string; tokens: Token[] }) {
  return (
    <section className="mb-[32px]">
      <h2 className="text-[18px] font-medium leading-[26px] text-text-primary">{title}</h2>
      <p className="mt-[2px] text-sm text-text-secondary">{description}</p>
      <div className="mt-[16px] flex flex-wrap gap-[24px]">
        {tokens.map((token) => (
          <Swatch key={token.name} token={token} />
        ))}
      </div>
    </section>
  );
}

export const AllColors: Story = {
  name: "All Colors",
  render: () => (
    <div className="font-sans" style={{ fontFamily: "var(--font-sans)" }}>
      {colorGroups.map((group) => (
        <ColorGroup key={group.title} {...group} />
      ))}
    </div>
  ),
};

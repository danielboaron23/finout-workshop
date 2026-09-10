import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ImpactPanel } from "./ImpactPanel";
import { allocationImpact, poolTotalFor, billTotalFor } from "./data";

const JULY = "2026-07";

const meta = {
  title: "Settings/ImpactPanel",
  component: ImpactPanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Shows what a staged setting will do to the numbers **before** it is published. Three honest outcomes, so it never has to invent a fourth — the same rule the CostGuard ledger runs on, where a saving it cannot verify is named rather than rounded to zero.\n\n- **money** — recomputed per team from real `cost_events` dollars\n- **boundaries** — the totals do not move, the periods around them do\n- **not-computable** — Finout does not hold what this would need, so it says so",
      },
    },
  },
  args: { impact: { kind: "none" } },
} satisfies Meta<typeof ImpactPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Switching shared costs from direct to an even split. Every figure is real. */
export const Money: Story = {
  args: {
    impact: {
      kind: "money",
      rows: allocationImpact("direct", "even", JULY),
      month: JULY,
      monthLabel: "July 2026",
      poolTotal: poolTotalFor(JULY),
      billTotal: billTotalFor(JULY),
    },
  },
};

/** The other split method — note that it disagrees with the even split about who wins. */
export const MoneyProportional: Story = {
  args: {
    impact: {
      kind: "money",
      rows: allocationImpact("direct", "proportional", JULY),
      month: JULY,
      monthLabel: "July 2026",
      poolTotal: poolTotalFor(JULY),
      billTotal: billTotalFor(JULY),
    },
  },
};

/** Fiscal year: monthly totals are unchanged, only the boundaries move. */
export const Boundaries: Story = {
  args: {
    impact: {
      kind: "boundaries",
      before: "Q3 (Jul–Sep)",
      after: "Q2 (Jun–Aug)",
      detail:
        "Monthly totals do not move — only the boundaries around them do. Every quarter-to-date and year-to-date figure in Finout is recut, and saved reports that compare quarters will not match their previous run.",
    },
  },
};

/** The honest refusal. Finout holds one cost figure per line for these accounts. */
export const NotComputable: Story = {
  args: {
    impact: {
      kind: "not-computable",
      reason:
        "Finout holds one cost figure per line for these accounts. Amortized and net cost need a commitment schedule and a discount agreement, and neither is connected.",
    },
  },
};

/** Nothing staged — the panel renders nothing at all. */
export const Nothing: Story = { args: { impact: { kind: "none" } } };

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SettingRow, RowDivider } from "./SettingRow";
import { Switch } from "@/components/ui/Switch";
import { Select } from "@/components/ui/Select";

const meta = {
  title: "Settings/SettingRow",
  component: SettingRow,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The atomic unit of the Settings screen. A label and description on the left, a control on the right — and the part no competitor's settings row carries: a **scope** line saying who this affects, stated before you touch it, and a **provenance** line saying who last changed it and why. The provenance line reuses the change-note idea real Finout already collects on a Virtual Tag, at a fraction of the cost of an audit log.",
      },
    },
  },
  args: {
    label: "Cost and usage type",
    description: "Which cost figure every screen shows by default. Everyone in the account sees the one chosen here.",
    control: <Select label="Unblended" width={190} />,
  },
} satisfies Meta<typeof SettingRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};

/** The full anatomy — scope and provenance are what make this row different. */
export const WithScopeAndProvenance: Story = {
  args: {
    label: "Shared cost allocation",
    description: "How platform and tooling costs that no single team buys are charged back.",
    scope: "Affects all 6 teams · $125,669 of July 2026's $290,178 bill is shared (43.3%)",
    provenance: "Last reviewed by Amit Shani · 11 Jun 2026 · “Left on direct pending a decision on who owns the k8s clusters”",
  },
};

/** Edited but not yet published. */
export const Staged: Story = {
  args: {
    label: "Shared cost allocation",
    description: "How platform and tooling costs that no single team buys are charged back.",
    scope: "Affects all 6 teams",
    provenance: "Last reviewed by Amit Shani · 11 Jun 2026",
    staged: true,
    control: <Select label="Even split across teams" width={250} />,
  },
};

/** A toggle rather than a select, and a personal setting with no scope line. */
export const ToggleControl: Story = {
  args: {
    label: "Weekly spend digest",
    description: "A Monday summary of last week's spend against budget.",
    scope: undefined,
    provenance: undefined,
    control: <Switch defaultChecked ariaLabel="Weekly spend digest" />,
  },
};

export const Stacked: Story = {
  render: () => (
    <div className="bg-surface-primary border border-solid border-border-light px-[24px] py-[6px] rounded-[10px]">
      <SettingRow label="Fiscal year starts in" description="The month your accounting year opens."
        scope="Affects every date picker · current quarter is Q3 (Jul–Sep)"
        provenance="Last reviewed by Noa Peretz · 2 Apr 2026"
        control={<Select label="January" width={160} />} />
      <RowDivider />
      <SettingRow label="Show negotiated discounts" description="Apply enterprise discount adjustments to displayed cost."
        scope="Affects all 6 teams · every screen" provenance="Never changed"
        control={<Switch defaultChecked={false} ariaLabel="Show negotiated discounts" />} />
    </div>
  ),
};

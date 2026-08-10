import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  FilterChip,
  FilterSeparator,
  SearchAnomalies,
  DotsMenuButton,
  CalendarIcon18,
} from "./FilterChip";

const meta = {
  title: "Molecules/Filter Chip",
  component: FilterChip,
  subcomponents: { SearchAnomalies, DotsMenuButton },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Filter controls from the Anomalies toolbar, mapped to the Figma **Buttons variants** set: white chip, `#cfcece` border, 8px radius, Helvetica Neue Medium 14 label in `#0d0d0d` with a 16px caret-down. `active` swaps the label to the switcher's blue `#1570ef` to mark an applied filter, and an optional leading `icon` (e.g. `CalendarIcon18`) supports the date-range chip. The file also ships the toolbar's companions: `SearchAnomalies` (225px search field, controllable) `DotsMenuButton` (36px overflow menu), and `FilterSeparator` (1px `#eaecf0` divider).",
      },
    },
  },
  argTypes: {
    children: { control: "text" },
    active: { control: "boolean" },
    icon: { control: false },
  },
  args: { children: "Anomaly Type", active: false },
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Resting chip — dark `#0d0d0d` label + caret. */
export const Default: Story = {};

/** Applied filter — label switches to the active blue `#1570ef`. */
export const Active: Story = {
  args: { children: "Severity", active: true },
};

/** Date-range chip with the leading 18px calendar icon. */
export const WithCalendarIcon: Story = {
  args: {
    icon: <CalendarIcon18 />,
    children: "Nov 13, 2025 - Dec 13, 2025",
  },
};

/** The 225px anomalies search field (uncontrolled here; supports `value`/`onChange`). */
export const SearchField: Story = {
  render: () => <SearchAnomalies />,
};

/** 36px three-dots overflow-menu trigger from the right edge of the toolbar. */
export const DotsMenu: Story = {
  render: () => <DotsMenuButton />,
};

export const ToolbarRow: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "The composed Anomalies filter toolbar: date chip, filter chips split by the 1px separator, then search and the overflow menu — the wrap-or-scroll row from the layout contract.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-[8px] items-center p-[24px]">
      <FilterChip icon={<CalendarIcon18 />}>Nov 13, 2025 - Dec 13, 2025</FilterChip>
      <FilterSeparator />
      <FilterChip active>Anomaly Type</FilterChip>
      <FilterChip>Severity</FilterChip>
      <FilterChip>Cost Center</FilterChip>
      <FilterSeparator />
      <SearchAnomalies />
      <DotsMenuButton />
    </div>
  ),
};

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DEFAULT_MEGABILL_ROWS, MegaBillActionsRow, MegaBillTable } from "./MegaBillTable";
import { columnValue, type MegaBillColumnKey, type MegaBillSort } from "./megabill-data";
import { Toaster } from "@/components/ui/Toast";

const meta = {
  title: "Organisms/MegaBill Table",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "MegaBill's pivot table plus its icons row — Figma \"MegaBill - New Components\" → 1:14334 (icons row) and 1:14341 (\"Table\", 1439x308). Intentionally different from the list-screen table primitives: 44px #fafafa headers with a funnel + dots icon per column, 44px cells, #e9eaeb cell borders. Each header funnel opens a value-checkbox menu that really filters the rows, the dots open an asc/desc/reset sort menu, and the icons row downloads the current rows as CSV or copies them as JSON (confirmed by a toast). On the screen MegaBillPageClient owns this state; the story wires the same optional props to local state so every menu works standalone.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Same filter → sort pipeline MegaBillPageClient runs, kept local to the story. */
function InteractiveMegaBillTable() {
  const [columnFilters, setColumnFilters] = useState<Partial<Record<MegaBillColumnKey, string[]>>>({});
  const [sort, setSort] = useState<MegaBillSort>(null);

  let visible = DEFAULT_MEGABILL_ROWS.filter((row) =>
    (Object.keys(columnFilters) as MegaBillColumnKey[]).every(
      (col) => !(columnFilters[col] ?? []).includes(columnValue(row, col)),
    ),
  );
  if (sort) {
    const { col, dir } = sort;
    visible = [...visible].sort((a, b) => {
      const cmp = columnValue(a, col).localeCompare(columnValue(b, col), undefined, { numeric: true });
      return dir === "asc" ? cmp : -cmp;
    });
  }

  return (
    <MegaBillTable
      rows={visible}
      baseRows={DEFAULT_MEGABILL_ROWS}
      columnFilters={columnFilters}
      onToggleColumnValue={(col, value) =>
        setColumnFilters((prev) => {
          const current = prev[col] ?? [];
          const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
          return { ...prev, [col]: next };
        })
      }
      sort={sort}
      onSortChange={(col, dir) => setSort(dir === null ? null : { col, dir })}
    />
  );
}

export const Default: Story = {
  render: () => (
    <div className="bg-[#f9fafb] p-[24px]">
      <div className="bg-white">
        <MegaBillActionsRow />
        <InteractiveMegaBillTable />
      </div>
      <Toaster />
    </div>
  ),
};

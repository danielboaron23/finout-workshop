import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TableShell, HeaderCell, Cell, CellText, MenuCell, CheckboxCell } from "./Table";
import { FolderBadge, ProductBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

const meta = {
  title: "Organisms/List Table",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "List-screen table primitives — Figma \"Tables\", which models the table as COLUMNS, not rows: each column is a vertical flex of one HeaderCell (#f2f4f7, 54px, Helvetica Neue Medium 14, right divider) over its body Cells (54px, #f2f4f7 bottom border), all laid side by side inside the h-scrolling TableShell. CellText renders body text at the design's exact 21.57/33.898 size, and CheckboxCell / MenuCell are the fixed 48px end columns. This story composes them into the Virtual Tags list shape with three rows; the \"Modified date\" header is sortable — clicking it toggles the direction and flips the arrow. The full interactive version (rename, move to folder, delete with undo) lives in Screens/Virtual Tags.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type Row = {
  id: string;
  name: string;
  folder?: string;
  type: "Virtual Tag" | "Relational Virtual Tag";
  createdBy: string;
  created: string;
  modified: string;
};

const ROWS: Row[] = [
  { id: "vt-1", name: "ProfitPulse", folder: "Folder name", type: "Virtual Tag", createdBy: "CN", created: "Jan 15, 2023", modified: "Feb 14, 2024" },
  { id: "vt-2", name: "RevenueRadar", folder: "Folder name", type: "Virtual Tag", createdBy: "CN", created: "Nov 8, 2022", modified: "Mar 3, 2024" },
  { id: "vt-3", name: "MarketMetrics", type: "Relational Virtual Tag", createdBy: "FN", created: "Feb 14, 2025", modified: "Jun 15, 2024" },
];

/** Virtual Tags list shape: checkbox | Name (flex) | Folder | Type | Created by | dates | menu. */
function VirtualTagsTable() {
  const [sortAsc, setSortAsc] = useState<boolean | null>(null);
  const rows =
    sortAsc === null
      ? ROWS
      : [...ROWS].sort((a, b) => (Date.parse(a.modified) - Date.parse(b.modified)) * (sortAsc ? 1 : -1));
  return (
    <TableShell>
      {/* checkbox column */}
      <div className="flex flex-col items-start w-[48px] shrink-0">
        <CheckboxCell header />
        {rows.map((r) => (
          <CheckboxCell key={r.id} />
        ))}
      </div>
      {/* Name column (flex) */}
      <div className="flex flex-col items-start flex-1 min-w-[160px]">
        <HeaderCell label="Name" />
        {rows.map((r) => (
          <Cell key={r.id}>
            <CellText>{r.name}</CellText>
          </Cell>
        ))}
      </div>
      {/* Folder column */}
      <div className="flex flex-col items-start w-[160px] shrink-0">
        <HeaderCell label="Folder" />
        {rows.map((r) => (
          <Cell key={r.id} className="px-[8px]">
            {r.folder && <FolderBadge label={r.folder} />}
          </Cell>
        ))}
      </div>
      {/* Type column */}
      <div className="flex flex-col items-start w-[300px] shrink-0">
        <HeaderCell label="Type" />
        {rows.map((r) => (
          <Cell key={r.id}>
            <ProductBadge label={r.type} variant={r.type === "Virtual Tag" ? "blue" : "violet"} />
          </Cell>
        ))}
      </div>
      {/* Created by column */}
      <div className="flex flex-col items-start w-[160px] shrink-0">
        <HeaderCell label="Created by" />
        {rows.map((r) => (
          <Cell key={r.id}>
            <Avatar initials={r.createdBy} />
          </Cell>
        ))}
      </div>
      {/* Creation date column */}
      <div className="flex flex-col items-start w-[210px] shrink-0">
        <HeaderCell label="Creation date" />
        {rows.map((r) => (
          <Cell key={r.id}>
            <CellText>{r.created}</CellText>
          </Cell>
        ))}
      </div>
      {/* Modified date column — sortable */}
      <div className="flex flex-col items-start w-[210px] shrink-0">
        <HeaderCell
          label="Modified date"
          sortable
          sortAsc={sortAsc === true}
          onClick={() => setSortAsc((v) => (v === null ? false : !v))}
        />
        {rows.map((r) => (
          <Cell key={r.id}>
            <CellText>{r.modified}</CellText>
          </Cell>
        ))}
      </div>
      {/* row-menu column */}
      <div className="flex flex-col items-start w-[48px] shrink-0">
        <HeaderCell />
        {rows.map((r) => (
          <MenuCell key={r.id} />
        ))}
      </div>
    </TableShell>
  );
}

export const VirtualTagsShape: Story = {
  render: () => (
    <div className="bg-[#f9fafb] p-[24px]">
      <VirtualTagsTable />
    </div>
  ),
};

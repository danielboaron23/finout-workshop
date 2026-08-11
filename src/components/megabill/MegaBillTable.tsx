"use client";

/*
 * MegaBill — icons row + pivot table under the chart.
 * Figma: "MegaBill - New Components" → 1:14334 "Frame 1000004924" (icons row)
 * and 1:14341 "Table" (1439x308).
 *
 * This table differs from src/components/table/Table.tsx (list screens) and the
 * home tables (CostCentersCard): header 44px bg #fafafa text 14px Medium #475467
 * with funnel + dots icons per column, cells 44px, cell borders #e9eaeb,
 * column bottom border #d0d5dd, header column dividers #d0d5dd 2x14px.
 * The delta cell is local (NOT home's DeltaCellContent): value #067647 Regular,
 * pill has a #abefc6 border on #ecfdf3 and no mix-blend.
 *
 * Interactivity (all optional props, driven by MegaBillPageClient): header
 * funnels open value-checkbox filters, header dots open sort menus, and the
 * icons row exports the current rows as CSV / copies them as JSON.
 */

import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { showToast } from "@/components/ui/Toast";
import { copyText, downloadCsvFile } from "./megabill-actions";
import { columnValue, rowsToCsv, type MegaBillColumnKey, type MegaBillSort } from "./megabill-data";
import { CheckRow } from "./MegaBillMenus";

/* ---------- icons row (1:14334) ---------- */

function IconButton({
  icon,
  inset,
  label,
  onClick,
}: {
  icon: string;
  inset: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="bg-surface-primary flex items-center justify-center min-h-[36px] min-w-[36px] p-[8px] rounded-[8px] shrink-0 size-[36px] cursor-pointer"
    >
      <div className="flex-1 h-full min-w-px overflow-clip relative">
        <div className={`absolute ${inset}`}>
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={icon} />
        </div>
      </div>
    </button>
  );
}

/** Right-aligned grid / download / dots icon-buttons row between chart and table */
export function MegaBillActionsRow({
  onDownloadCsv,
  onCopyData,
}: {
  onDownloadCsv?: () => void;
  onCopyData?: () => void;
} = {}) {
  const download =
    onDownloadCsv ?? (() => downloadCsvFile(rowsToCsv(DEFAULT_MEGABILL_ROWS, DEFAULT_DATE_HEADERS)));
  const copy =
    onCopyData ??
    (() => {
      copyText(JSON.stringify(DEFAULT_MEGABILL_ROWS, null, 2)).then(
        () => showToast("Data copied to clipboard"),
        () => showToast("Copy failed"),
      );
    });
  return (
    <div className="flex flex-col items-start px-[24px] py-[18px] w-full">
      <div className="flex h-[36px] items-start justify-center w-full">
        <div className="flex flex-1 gap-[12px] items-center justify-end min-w-px">
          <IconButton
            icon="/icons/megabill/grid.svg"
            inset="inset-[9.38%]"
            label="Layout"
            onClick={() => showToast("Layout options coming soon")}
          />
          <IconButton
            icon="/icons/megabill/download.svg"
            inset="inset-[9.38%]"
            label="Download"
            onClick={download}
          />
          <Dropdown
            align="right"
            trigger={() => (
              <IconButton
                icon="/icons/megabill/dots-vertical.svg"
                inset="inset-[13.54%_42.71%]"
                label="More options"
              />
            )}
          >
            {(close) => (
              <div className="flex flex-col min-w-[160px]">
                <DropdownItem
                  onClick={() => {
                    download();
                    close();
                  }}
                >
                  Export CSV
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    copy();
                    close();
                  }}
                >
                  Copy data
                </DropdownItem>
              </div>
            )}
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

/* ---------- table (1:14341) ---------- */

function FunnelIcon() {
  return (
    <div className="h-[13px] relative shrink-0 w-[13.419px]">
      <img
        alt=""
        className="absolute block inset-0 max-w-none size-full"
        src="/icons/megabill/funnel-base.svg"
      />
      <div className="absolute inset-[18.75%_13.32%_12.1%_13.32%]">
        <div className="absolute inset-[-5.56%_-5.08%]">
          <img alt="" className="block max-w-none size-full" src="/icons/megabill/funnel-vector.svg" />
        </div>
      </div>
    </div>
  );
}

function DotsIcon() {
  return (
    <div className="flex items-center justify-center relative shrink-0 size-[13px]">
      <div className="flex-none rotate-90">
        <div className="relative size-[13px]">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src="/icons/megabill/dots-three.svg"
          />
        </div>
      </div>
    </div>
  );
}

/** 44px header cell: label + funnel + dots, bg #fafafa; divider = 2x14 #d0d5dd column separator.
 * When filter/sort handlers are provided, the funnel opens a value-checkbox
 * menu (real row filter) and the dots open a sort menu. */
function MegaBillHeaderCell({
  label,
  divider = true,
  filterValues,
  unchecked = [],
  onToggleValue,
  sortDir = null,
  onSort,
}: {
  label: string;
  divider?: boolean;
  filterValues?: string[];
  unchecked?: string[];
  onToggleValue?: (value: string) => void;
  sortDir?: "asc" | "desc" | null;
  onSort?: (dir: "asc" | "desc" | null) => void;
}) {
  return (
    <div className="bg-[#fafafa] border-b border-solid border-[#e9eaeb] flex h-[44px] items-center justify-between p-[12px] relative shrink-0 w-full">
      <div className="flex flex-1 gap-[4px] items-center min-w-px">
        <p className="font-sans font-medium leading-[20px] text-text-secondary text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </p>
      </div>
      <div className="flex gap-[6px] items-center shrink-0">
        {onToggleValue && filterValues ? (
          <Dropdown
            align="right"
            trigger={() => (
              <span className="flex" style={{ cursor: "pointer" }} aria-label={`Filter ${label}`}>
                <FunnelIcon />
              </span>
            )}
          >
            <div className="flex flex-col gap-[2px] min-w-[170px]">
              {filterValues.map((v) => (
                <CheckRow
                  key={v}
                  label={v}
                  checked={!unchecked.includes(v)}
                  onToggle={() => onToggleValue(v)}
                />
              ))}
            </div>
          </Dropdown>
        ) : (
          <FunnelIcon />
        )}
        {onSort ? (
          <Dropdown
            align="right"
            trigger={() => (
              <span className="flex" style={{ cursor: "pointer" }} aria-label={`Sort ${label}`}>
                <DotsIcon />
              </span>
            )}
          >
            {(close) => (
              <div className="flex flex-col min-w-[170px]">
                <DropdownItem
                  selected={sortDir === "asc"}
                  onClick={() => {
                    onSort("asc");
                    close();
                  }}
                >
                  Sort ascending
                </DropdownItem>
                <DropdownItem
                  selected={sortDir === "desc"}
                  onClick={() => {
                    onSort("desc");
                    close();
                  }}
                >
                  Sort descending
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onSort(null);
                    close();
                  }}
                >
                  Reset
                </DropdownItem>
              </div>
            )}
          </Dropdown>
        ) : (
          <DotsIcon />
        )}
      </div>
      {divider && (
        <div className="-translate-y-1/2 absolute bg-neutral-200 h-[14px] right-0 top-[calc(50%+0.5px)] w-[2px]" />
      )}
    </div>
  );
}

/** 44px body cell, borders #e9eaeb (bottom + right) */
function MegaBillCell({ children, gap = 4 }: { children: React.ReactNode; gap?: 4 | 8 }) {
  return (
    <div className="bg-white border-b border-r border-solid border-[#e9eaeb] flex gap-[12px] h-[44px] items-center p-[12px] shrink-0 w-full">
      <div className={`flex flex-1 ${gap === 8 ? "gap-[8px]" : "gap-[4px]"} items-center min-w-px`}>
        {children}
      </div>
    </div>
  );
}

/** Name / date / total-cost cell text — Helvetica Neue Medium 14/20 #475467 */
function MegaBillCellText({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans font-medium leading-[20px] text-text-secondary text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">
      {children}
    </p>
  );
}

export type MegaBillDelta = { value: string; pct: string };

/** Green value + bordered success pill (local — differs from home DeltaCellContent) */
function MegaBillDeltaCell({ delta }: { delta: MegaBillDelta }) {
  return (
    <>
      <p className="font-sans font-normal leading-[20px] text-success-700 text-[14px] overflow-hidden text-ellipsis whitespace-nowrap shrink-0 text-center">
        {delta.value}
      </p>
      <div className="bg-success-50 border border-solid border-success-200 flex gap-[2px] items-center pl-[6px] pr-[8px] py-[2px] rounded-[9999px] shrink-0">
        <div className="overflow-clip relative shrink-0 size-[12px]">
          <div className="absolute inset-[20.83%]">
            <div className="absolute inset-[-10.71%]">
              <img
                alt=""
                className="block max-w-none size-full"
                src="/icons/megabill/badge-arrow-down.svg"
              />
            </div>
          </div>
        </div>
        <p className="font-inter font-medium leading-[18px] text-success-700 text-[12px] text-center whitespace-nowrap">
          {delta.pct}
        </p>
      </div>
    </>
  );
}

export type MegaBillRow = {
  name: string;
  /** value for the first date column */
  date1: string;
  /** value for the second date column */
  date2: string;
  totalCost: string;
  previous: MegaBillDelta;
  pctOfTotal: string;
};

const DELTA: MegaBillDelta = { value: "-$302,936", pct: "20%" };

export const DEFAULT_MEGABILL_ROWS: MegaBillRow[] = [
  { name: "AWS", date1: "$1,234", date2: "$1,234", totalCost: "$1,234", previous: DELTA, pctOfTotal: "56%" },
  { name: "Kubernetes", date1: "$1,234", date2: "$1,234", totalCost: "$1,234", previous: DELTA, pctOfTotal: "31%" },
  { name: "Datadog", date1: "$1,234", date2: "$1,234", totalCost: "$1,234", previous: DELTA, pctOfTotal: "8%" },
  { name: "GCP", date1: "$1,234", date2: "$1,234", totalCost: "$1,234", previous: DELTA, pctOfTotal: "4%" },
  { name: "CircleCI", date1: "$1,234", date2: "$1,234", totalCost: "$1,234", previous: DELTA, pctOfTotal: "0.586%" },
  { name: "Untagged", date1: "$1,234", date2: "$1,234", totalCost: "$1,234", previous: DELTA, pctOfTotal: "0.267%" },
];

export const DEFAULT_DATE_HEADERS: [string, string] = ["Jul 11, 2026", "Jul 12, 2026"];

export type MegaBillTableProps = {
  rows?: MegaBillRow[];
  dateHeaders?: [string, string];
  /** Pre-column-filter rows (funnel menus list their values). Default: rows. */
  baseRows?: MegaBillRow[];
  /** Per-column UNCHECKED funnel values. */
  columnFilters?: Partial<Record<MegaBillColumnKey, string[]>>;
  onToggleColumnValue?: (col: MegaBillColumnKey, value: string) => void;
  sort?: MegaBillSort;
  onSortChange?: (col: MegaBillColumnKey, dir: "asc" | "desc" | null) => void;
};

/** Column wrapper — bottom border #d0d5dd closes the column strip */
function Column({
  children,
  width,
  flex = false,
}: {
  children: React.ReactNode;
  width?: number;
  flex?: boolean;
}) {
  return (
    <div
      className={`border-b border-solid border-border-muted flex flex-col items-start ${
        flex ? "flex-1 min-w-0" : "shrink-0"
      }`}
      style={width ? { width } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * MegaBill pivot table: Name | date | date | Total cost | Previous perios total
 * cost [sic — typo kept from Figma] | Percentage of total cost.
 * Fixed column widths per Figma (243/166/166/221); last two columns flex-1.
 * H-scrolls below 1200px per the layout contract.
 */
export function MegaBillTable({
  rows = DEFAULT_MEGABILL_ROWS,
  dateHeaders = DEFAULT_DATE_HEADERS,
  baseRows,
  columnFilters,
  onToggleColumnValue,
  sort = null,
  onSortChange,
}: MegaBillTableProps) {
  const funnelSource = baseRows ?? rows;
  const headerProps = (col: MegaBillColumnKey) => ({
    filterValues: onToggleColumnValue
      ? Array.from(new Set(funnelSource.map((r) => columnValue(r, col))))
      : undefined,
    unchecked: columnFilters?.[col] ?? [],
    onToggleValue: onToggleColumnValue ? (value: string) => onToggleColumnValue(col, value) : undefined,
    sortDir: sort && sort.col === col ? sort.dir : null,
    onSort: onSortChange ? (dir: "asc" | "desc" | null) => onSortChange(col, dir) : undefined,
  });
  return (
    <div className="overflow-x-auto w-full">
      <div
        className="bg-white border border-solid border-[#e9eaeb] flex flex-col items-start shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] w-full"
        style={{ minWidth: 1200 }}
      >
        <div className="flex items-start w-full">
          <Column width={243}>
            <MegaBillHeaderCell label="Name" {...headerProps("name")} />
            {rows.map((row) => (
              <MegaBillCell key={row.name}>
                <MegaBillCellText>{row.name}</MegaBillCellText>
              </MegaBillCell>
            ))}
          </Column>
          <Column width={166}>
            <MegaBillHeaderCell label={dateHeaders[0]} {...headerProps("date1")} />
            {rows.map((row) => (
              <MegaBillCell key={row.name}>
                <MegaBillCellText>{row.date1}</MegaBillCellText>
              </MegaBillCell>
            ))}
          </Column>
          <Column width={166}>
            <MegaBillHeaderCell label={dateHeaders[1]} {...headerProps("date2")} />
            {rows.map((row) => (
              <MegaBillCell key={row.name}>
                <MegaBillCellText>{row.date2}</MegaBillCellText>
              </MegaBillCell>
            ))}
          </Column>
          <Column width={221}>
            <MegaBillHeaderCell label="Total cost" {...headerProps("totalCost")} />
            {rows.map((row) => (
              <MegaBillCell key={row.name}>
                <MegaBillCellText>{row.totalCost}</MegaBillCellText>
              </MegaBillCell>
            ))}
          </Column>
          <Column flex>
            <MegaBillHeaderCell label="Previous perios total cost" {...headerProps("previous")} />
            {rows.map((row) => (
              <MegaBillCell key={row.name} gap={8}>
                <MegaBillDeltaCell delta={row.previous} />
              </MegaBillCell>
            ))}
          </Column>
          <Column flex>
            <MegaBillHeaderCell
              label="Percentage of total cost"
              divider={false}
              {...headerProps("pctOfTotal")}
            />
            {rows.map((row) => (
              <MegaBillCell key={row.name}>
                <p className="font-sans font-normal leading-[20px] text-text-primary text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {row.pctOfTotal}
                </p>
              </MegaBillCell>
            ))}
          </Column>
        </div>
      </div>
    </div>
  );
}

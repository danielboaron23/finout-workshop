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
 */

/* ---------- icons row (1:14334) ---------- */

function IconButton({ icon, inset, label }: { icon: string; inset: string; label: string }) {
  return (
    <button
      aria-label={label}
      className="bg-[#fefefe] flex items-center justify-center min-h-[36px] min-w-[36px] p-[8px] rounded-[8px] shrink-0 size-[36px] cursor-pointer"
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
export function MegaBillActionsRow() {
  return (
    <div className="flex flex-col items-start px-[24px] py-[18px] w-full">
      <div className="flex h-[36px] items-start justify-center w-full">
        <div className="flex flex-1 gap-[12px] items-center justify-end min-w-px">
          <IconButton icon="/icons/megabill/grid.svg" inset="inset-[9.38%]" label="Layout" />
          <IconButton icon="/icons/megabill/download.svg" inset="inset-[9.38%]" label="Download" />
          <IconButton
            icon="/icons/megabill/dots-vertical.svg"
            inset="inset-[13.54%_42.71%]"
            label="More options"
          />
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

/** 44px header cell: label + funnel + dots, bg #fafafa; divider = 2x14 #d0d5dd column separator */
function MegaBillHeaderCell({ label, divider = true }: { label: string; divider?: boolean }) {
  return (
    <div className="bg-[#fafafa] border-b border-solid border-[#e9eaeb] flex h-[44px] items-center justify-between p-[12px] relative shrink-0 w-full">
      <div className="flex flex-1 gap-[4px] items-center min-w-px">
        <p className="font-sans font-medium leading-[20px] text-[#475467] text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </p>
      </div>
      <div className="flex gap-[6px] items-center shrink-0">
        <FunnelIcon />
        <DotsIcon />
      </div>
      {divider && (
        <div className="-translate-y-1/2 absolute bg-[#d0d5dd] h-[14px] right-0 top-[calc(50%+0.5px)] w-[2px]" />
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
    <p className="font-sans font-medium leading-[20px] text-[#475467] text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">
      {children}
    </p>
  );
}

export type MegaBillDelta = { value: string; pct: string };

/** Green value + bordered success pill (local — differs from home DeltaCellContent) */
function MegaBillDeltaCell({ delta }: { delta: MegaBillDelta }) {
  return (
    <>
      <p className="font-sans font-normal leading-[20px] text-[#067647] text-[14px] overflow-hidden text-ellipsis whitespace-nowrap shrink-0 text-center">
        {delta.value}
      </p>
      <div className="bg-[#ecfdf3] border border-solid border-[#abefc6] flex gap-[2px] items-center pl-[6px] pr-[8px] py-[2px] rounded-[9999px] shrink-0">
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
        <p className="font-inter font-medium leading-[18px] text-[#067647] text-[12px] text-center whitespace-nowrap">
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

const DEFAULT_ROWS: MegaBillRow[] = [
  { name: "AWS", date1: "$1,234", date2: "$1,234", totalCost: "$1,234", previous: DELTA, pctOfTotal: "56%" },
  { name: "Kubernetes", date1: "$1,234", date2: "$1,234", totalCost: "$1,234", previous: DELTA, pctOfTotal: "31%" },
  { name: "Datadog", date1: "$1,234", date2: "$1,234", totalCost: "$1,234", previous: DELTA, pctOfTotal: "8%" },
  { name: "GCP", date1: "$1,234", date2: "$1,234", totalCost: "$1,234", previous: DELTA, pctOfTotal: "4%" },
  { name: "CircleCI", date1: "$1,234", date2: "$1,234", totalCost: "$1,234", previous: DELTA, pctOfTotal: "0.586%" },
  { name: "Untagged", date1: "$1,234", date2: "$1,234", totalCost: "$1,234", previous: DELTA, pctOfTotal: "0.267%" },
];

export type MegaBillTableProps = {
  rows?: MegaBillRow[];
  dateHeaders?: [string, string];
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
      className={`border-b border-solid border-[#d0d5dd] flex flex-col items-start ${
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
  rows = DEFAULT_ROWS,
  dateHeaders = ["Jul 11, 2026", "Jul 12, 2026"],
}: MegaBillTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <div
        className="bg-white border border-solid border-[#e9eaeb] flex flex-col items-start shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] w-full"
        style={{ minWidth: 1200 }}
      >
        <div className="flex items-start w-full">
          <Column width={243}>
            <MegaBillHeaderCell label="Name" />
            {rows.map((row) => (
              <MegaBillCell key={row.name}>
                <MegaBillCellText>{row.name}</MegaBillCellText>
              </MegaBillCell>
            ))}
          </Column>
          <Column width={166}>
            <MegaBillHeaderCell label={dateHeaders[0]} />
            {rows.map((row) => (
              <MegaBillCell key={row.name}>
                <MegaBillCellText>{row.date1}</MegaBillCellText>
              </MegaBillCell>
            ))}
          </Column>
          <Column width={166}>
            <MegaBillHeaderCell label={dateHeaders[1]} />
            {rows.map((row) => (
              <MegaBillCell key={row.name}>
                <MegaBillCellText>{row.date2}</MegaBillCellText>
              </MegaBillCell>
            ))}
          </Column>
          <Column width={221}>
            <MegaBillHeaderCell label="Total cost" />
            {rows.map((row) => (
              <MegaBillCell key={row.name}>
                <MegaBillCellText>{row.totalCost}</MegaBillCellText>
              </MegaBillCell>
            ))}
          </Column>
          <Column flex>
            <MegaBillHeaderCell label="Previous perios total cost" />
            {rows.map((row) => (
              <MegaBillCell key={row.name} gap={8}>
                <MegaBillDeltaCell delta={row.previous} />
              </MegaBillCell>
            ))}
          </Column>
          <Column flex>
            <MegaBillHeaderCell label="Percentage of total cost" divider={false} />
            {rows.map((row) => (
              <MegaBillCell key={row.name}>
                <p className="font-sans font-normal leading-[20px] text-[#101828] text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">
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

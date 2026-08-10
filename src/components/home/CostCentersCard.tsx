"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

/*
 * Home dashboard widget primitives + "Monthly cost by cost centers" table.
 * Figma: Home page → .local_homepage_content → "Monthly cost by cost centers (table)".
 *
 * These home tables differ from src/components/table/Table.tsx (list screens):
 * header 44px bg #eaecf0 text 12px, cells 54px text 14px, row borders #ebebeb,
 * table wrapper rounded 12 border #f9f9f9 — so they get their own local primitives.
 */

/* ---------- shared widget primitives (reused by the other home cards) ---------- */

export function WidgetCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white border border-solid border-[#eaecf0] drop-shadow-[0px_1px_1px_rgba(16,24,40,0.06),0px_1px_1.5px_rgba(16,24,40,0.1)] flex flex-col gap-[8px] items-start px-[24px] py-[16px] rounded-[8px] w-full ${className}`}
    >
      {children}
    </div>
  );
}

export function WidgetTitle({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans font-medium leading-[26px] text-[#101828] text-[18px] w-full">{children}</p>
  );
}

/** "Time frame: … | Interval: …" caption under a widget title */
export function WidgetSubtitle({ timeFrame, interval }: { timeFrame: string; interval: string }) {
  return (
    <div className="flex items-center py-[4px] w-full">
      <div className="flex gap-[6px] items-center">
        <p className="font-sans font-normal leading-[20px] text-[#475467] text-[12px] whitespace-nowrap">
          Time frame: {timeFrame}
        </p>
        <div className="h-[10px] relative shrink-0 w-0">
          <div className="absolute inset-[-5%_-0.5px]">
            <img alt="" className="block max-w-none size-full" src="/icons/home/subtitle-divider.svg" />
          </div>
        </div>
        <p className="font-sans font-normal leading-[20px] text-[#475467] text-[12px] whitespace-nowrap">
          Interval: {interval}
        </p>
      </div>
    </div>
  );
}

/** Rounded table wrapper (rounded 12, border #f9f9f9, shadow sm) with h-scroll below min width */
export function HomeTableShell({
  children,
  minWidth,
}: {
  children: ReactNode;
  minWidth?: number;
}) {
  return (
    <div className="overflow-x-auto w-full rounded-[12px]">
      <div
        className="bg-white border border-solid border-[#f9f9f9] flex flex-col items-start overflow-clip rounded-[12px] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)] w-full"
        style={minWidth ? { minWidth } : undefined}
      >
        <div className="bg-white flex items-start w-full">{children}</div>
      </div>
    </div>
  );
}

export type SortDir = "asc" | "desc" | null;

/** "$184,058" / "-$165,062" / "+$4,805" → number, for table sorting */
export function parseMoney(value: string): number {
  return Number(value.replace(/[^0-9.-]/g, "")) || 0;
}

export function HomeHeaderCell({
  label,
  sortable = false,
  sortDir = null,
  onSort,
}: {
  label: string;
  sortable?: boolean;
  /** Current sort direction — "asc" flips the arrow via a rotate class */
  sortDir?: SortDir;
  /** When set, clicking the header cell toggles sorting */
  onSort?: () => void;
}) {
  return (
    <div
      onClick={onSort}
      className={`bg-[#eaecf0] border-b border-solid border-[#f9f9f9] flex gap-[12px] h-[44px] items-center p-[12px] shrink-0 w-full${onSort ? " cursor-pointer select-none" : ""}`}
    >
      <div className="flex flex-1 gap-[4px] items-center min-w-px">
        <p className="font-sans font-normal leading-[20px] text-[#101828] text-[12px] overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </p>
        {sortable && (
          <div className={`relative shrink-0 size-[16px]${sortDir === "asc" ? " rotate-180" : ""}`}>
            <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/sort-arrow-down.svg" />
          </div>
        )}
      </div>
    </div>
  );
}

/** Body cell — 54px, bottom border #ebebeb; the Total row swaps it for a top border #98a2b3 */
export function HomeCell({
  children,
  totalRow = false,
  className = "",
}: {
  children?: ReactNode;
  totalRow?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`${
        totalRow ? "border-t border-solid border-[#98a2b3]" : "border-b border-solid border-[#ebebeb]"
      } flex gap-[12px] h-[54px] items-center px-[24px] py-[16px] shrink-0 w-full ${className}`}
    >
      {children}
    </div>
  );
}

export function HomeCellText({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans font-normal leading-[22px] text-[#101828] text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">
      {children}
    </p>
  );
}

export type DeltaTrend = "up" | "down";

/** Colored delta value + pill badge: up = red (#f87979 / #fdf8f8), down = green (#49a57f / #ecfdf3) */
export function DeltaCellContent({ value, pct, trend }: { value: string; pct: string; trend: DeltaTrend }) {
  const color = trend === "up" ? "text-[#f87979]" : "text-[#49a57f]";
  const badgeBg = trend === "up" ? "bg-[#fdf8f8]" : "bg-[#ecfdf3]";
  const icon = trend === "up" ? "/icons/home/badge-arrow-up.svg" : "/icons/home/badge-arrow-down.svg";
  return (
    <>
      <p className={`font-sans font-medium leading-[22px] text-[14px] whitespace-nowrap ${color}`}>{value}</p>
      <div className={`${badgeBg} flex gap-[4px] items-center mix-blend-multiply pl-[6px] pr-[8px] py-[2px] rounded-[16px] shrink-0`}>
        <div className="overflow-clip relative shrink-0 size-[12px]">
          <div className="absolute inset-[20.83%]">
            <div className="absolute inset-[-10.71%]">
              <img alt="" className="block max-w-none size-full" src={icon} />
            </div>
          </div>
        </div>
        <p className={`font-inter font-medium leading-[18px] text-[12px] text-center whitespace-nowrap ${color}`}>{pct}</p>
      </div>
    </>
  );
}

/** Tertiary action button used inside home table cells (Inter Semi Bold, #d0d5dd border) */
export function TableActionButton({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-white border border-solid border-[#d0d5dd] flex gap-[8px] items-center justify-center min-w-0 overflow-clip px-[14px] py-[7px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer ${className}`}
    >
      <p className="font-inter font-semibold leading-[20px] text-[#344054] text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">
        {children}
      </p>
    </button>
  );
}

/* ---------- Monthly cost by cost centers ---------- */

export type CostCenterDelta = { value: string; pct: string; trend: DeltaTrend };

export type CostCenterRow = {
  name: string;
  totalCost: string;
  /** null renders the "-" placeholder */
  previous: CostCenterDelta | null;
  pctOfTotal: string;
  /** action button label; omit for no button */
  action?: string;
};

export type CostCentersCardProps = {
  title?: string;
  timeFrame?: string;
  interval?: string;
  rows?: CostCenterRow[];
  totalRow?: CostCenterRow;
};

const DEFAULT_ROWS: CostCenterRow[] = [
  { name: "kubernetes", totalCost: "$184,058", previous: { value: "+$4,805", pct: "3%", trend: "up" }, pctOfTotal: "67%", action: "Go to k8s dashboard" },
  { name: "AWS", totalCost: "$86,335", previous: { value: "-$165,062", pct: "35.658%", trend: "down" }, pctOfTotal: "32%", action: "Go to AWS dashboard" },
  { name: "GCP", totalCost: "$1,338", previous: { value: "-$118", pct: "8.093%", trend: "down" }, pctOfTotal: "0.491%", action: "Go to GCP dashboard" },
  { name: "OnPremCosts", totalCost: "$1,000", previous: null, pctOfTotal: "0.367%" },
  { name: "snowflake", totalCost: "$21", previous: { value: "-$2.423", pct: "10.189%", trend: "down" }, pctOfTotal: "0.008%", action: "Go to snowflake dashboard" },
];

const DEFAULT_TOTAL: CostCenterRow = {
  name: "Total",
  totalCost: "$272,767",
  previous: { value: "-$160,374", pct: "37.026%", trend: "down" },
  pctOfTotal: "100%",
};

function PreviousCellContent({ delta }: { delta: CostCenterDelta | null }) {
  if (!delta) {
    return <p className="font-inter font-normal leading-[20px] text-[#475467] text-[14px] whitespace-nowrap">-</p>;
  }
  return <DeltaCellContent value={delta.value} pct={delta.pct} trend={delta.trend} />;
}

export function CostCentersCard({
  title = "Monthly cost by cost centers",
  timeFrame = "Last 30 Days",
  interval = "Daily",
  rows = DEFAULT_ROWS,
  totalRow = DEFAULT_TOTAL,
}: CostCentersCardProps) {
  const router = useRouter();
  const [sortDir, setSortDir] = useState<SortDir>(null);
  // Sort data rows only — the Total row always stays pinned at the bottom
  const sorted = sortDir
    ? [...rows].sort((a, b) =>
        sortDir === "asc"
          ? parseMoney(a.totalCost) - parseMoney(b.totalCost)
          : parseMoney(b.totalCost) - parseMoney(a.totalCost),
      )
    : rows;
  const all = [...sorted, totalRow];
  const isTotal = (i: number) => i === all.length - 1;
  const toggleSort = () => setSortDir((d) => (d === "desc" ? "asc" : "desc"));
  return (
    <WidgetCard>
      <div className="flex flex-col gap-[16px] items-start rounded-[8px] w-full">
        <div className="flex flex-col gap-[8px] items-start w-full">
          <WidgetTitle>{title}</WidgetTitle>
          <WidgetSubtitle timeFrame={timeFrame} interval={interval} />
        </div>
        {/* 5 equal columns like Figma at every width; when a column gets too
            narrow for the widest action label, the button ellipsizes inside
            its box (Figma buttons are overflow-clip). Scroll only below 1000px */}
        <HomeTableShell minWidth={1000}>
          <div className="flex flex-1 flex-col items-start min-w-0">
            <HomeHeaderCell label="Name" />
            {all.map((row, i) => (
              <HomeCell key={row.name} totalRow={isTotal(i)}>
                <HomeCellText>{row.name}</HomeCellText>
              </HomeCell>
            ))}
          </div>
          <div className="flex flex-1 flex-col items-start min-w-0">
            <HomeHeaderCell label="Total Cost" sortable sortDir={sortDir} onSort={toggleSort} />
            {all.map((row, i) => (
              <HomeCell key={row.name} totalRow={isTotal(i)}>
                <HomeCellText>{row.totalCost}</HomeCellText>
              </HomeCell>
            ))}
          </div>
          <div className="flex flex-1 flex-col items-start min-w-0">
            <HomeHeaderCell label="Previous period total cost" />
            {all.map((row, i) => (
              <HomeCell key={row.name} totalRow={isTotal(i)}>
                <PreviousCellContent delta={row.previous} />
              </HomeCell>
            ))}
          </div>
          <div className="flex flex-1 flex-col items-start min-w-0">
            <HomeHeaderCell label="Percentage of total cost" />
            {all.map((row, i) => (
              <HomeCell key={row.name} totalRow={isTotal(i)}>
                <HomeCellText>{row.pctOfTotal}</HomeCellText>
              </HomeCell>
            ))}
          </div>
          <div className="flex flex-1 flex-col items-start min-w-0">
            <HomeHeaderCell label="Actions" />
            {all.map((row, i) => (
              <HomeCell key={row.name} totalRow={isTotal(i)}>
                {row.action !== undefined && (
                  <TableActionButton className="flex-1" onClick={() => router.push("/megabill")}>
                    {row.action}
                  </TableActionButton>
                )}
              </HomeCell>
            ))}
          </div>
        </HomeTableShell>
      </div>
    </WidgetCard>
  );
}

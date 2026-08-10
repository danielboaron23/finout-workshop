"use client";

import { useState } from "react";

/*
 * MegaBill — big-card upper "Content" section (Figma 1:13920, 1439x477).
 * KPI strip (Total Cost / Share of Total Cost / Average Daily Cost) + right
 * controls row (Group By select, comment button with counter badge, line/bar
 * chart toggle, grid / download / dots icon buttons) + stacked daily bar chart
 * (28 bars, Sep 17 → Oct 14) + series legend with "Unselect all" link.
 *
 * Bars reproduce the exact Figma render: each bar is a stack of LAYERED
 * bottom-aligned divs (one per series, painted top-of-stack first) where every
 * layer spans from the baseline up to the top of its segment and carries a 6px
 * rounded top cap — so the color beneath peeks out at the shoulders exactly
 * like the Figma rects. Segment heights come from the Figma bar SVGs
 * ($200k = 57px on the y grid).
 */

/* ---------------------------------------------------------------- series */

/** Legend + stacking order (index 0 = bottom of the stack). Exact Figma dot fills. */
export const CHART_SERIES = [
  { label: "AWS", color: "#9400D3" },
  { label: "GCP", color: "#1D90FF" },
  { label: "Kubernetes", color: "#F08080" },
  { label: "Datadog", color: "#707F90" },
  { label: "Azure", color: "#2E8B58" },
  { label: "Oracle Cloud", color: "#006400" },
  { label: "OpenAI", color: "#F4A461" },
  { label: "Snowflake", color: "#800080" },
  { label: "Databricks", color: "#DDA1DD" },
  { label: "Custom Cost", color: "#DB7092" },
] as const;

/** Muted "Total" legend entry (never stacked in the bars). */
export const TOTAL_LEGEND = { label: "Total", color: "#CCCCCC" } as const;

export type MegaBillBarDatum = {
  /** Dollar value per CHART_SERIES entry (AWS → Custom Cost); 0 renders nothing. */
  values: number[];
};

/* ------------------------------------------------------------- geometry */

const PLOT_H = 245; // y-axis block height
const ROW_H = 17; // one y-axis label row
const BASELINE_BOTTOM = 9; // 0-line offset from the plot bottom (row center)
const PLOT_LEFT = 48; // y label (40px) + 8px gap
const BAR_GAP = 20;
const PX_PER_DOLLAR = 57 / 200_000; // 57px between gridlines = $200k

const Y_LABELS = ["$800k", "$600k", "$400k", "$200k", "0"] as const;
const X_LABELS = [
  "Sep 17",
  "Sep 20",
  "Sep 23",
  "Sep 26",
  "Sep 29",
  "Oct 02",
  "Oct 05",
  "Oct 08",
  "Oct 11",
  "Oct 14",
] as const;

/* ------------------------------------------------------- default dataset */

/* Dollar values derived from the exact Figma bar SVG segment heights:
 * normal bar 153.44px, short (Sep 23) 118.31px, tall (Oct 02) 208.77px. */
const NORMAL = [241_500, 140_000, 65_400, 53_000, 20_000, 9_200, 0, 5_400, 3_850, 0];
const SHORT = [165_200, 75_900, 52_300, 79_850, 14_900, 6_900, 0, 9_300, 10_800, 0];
const TALL = [298_200, 121_300, 133_900, 79_150, 37_450, 21_450, 0, 8_350, 32_650, 0];

export const DEFAULT_CHART_DATA: MegaBillBarDatum[] = Array.from({ length: 28 }, (_, i) => ({
  values: i === 6 ? SHORT : i === 15 ? TALL : NORMAL,
}));

/* ------------------------------------------------------------ kpi strip */

function InfoIcon16() {
  return (
    <span className="overflow-clip relative shrink-0 size-[16px]">
      <span className="absolute inset-[5.21%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/megabill/info.svg" />
      </span>
    </span>
  );
}

function MetricItem({
  label,
  value,
  divider = true,
}: {
  label: string;
  value: string;
  divider?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-[4px] items-start justify-center pr-[20px] shrink-0 w-[168px] ${
        divider ? "border-r border-solid border-[#dee1e8]" : ""
      }`}
    >
      <div className="flex gap-[8px] items-center w-full">
        <p className="font-sans font-medium leading-[20px] text-[#475467] text-[14px] whitespace-nowrap">
          {label}
        </p>
        <InfoIcon16 />
      </div>
      <p className="font-sans font-medium leading-[24px] text-[#101828] text-[16px] whitespace-nowrap">
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- controls */

/* Gray filter tag (#ebebeb, h-28, radius 3) with removable x — matches the
 * anomaly-form tag but with this section's 14px label + local assets. */
function FilterTag({ label }: { label: string }) {
  return (
    <span className="bg-[#ebebeb] flex gap-[5px] h-[28px] items-center justify-center px-[6px] rounded-[3px] shrink-0">
      <span className="font-sans font-medium leading-[20px] text-[14px] text-[#101828] whitespace-nowrap">
        {label}
      </span>
      <span
        role="button"
        aria-label={`Remove ${label}`}
        className="cursor-pointer h-[12px] inline-block relative shrink-0 w-[12.387px]"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/megabill/x-frame.svg" />
        <span className="absolute inset-[21.88%]">
          <span className="absolute inset-[-7.41%_-7.18%]">
            <img alt="" className="block max-w-none size-full" src="/icons/megabill/x-vector-1.svg" />
          </span>
        </span>
        <span className="absolute inset-[21.88%]">
          <span className="absolute inset-[-7.41%_-7.18%]">
            <img alt="" className="block max-w-none size-full" src="/icons/megabill/x-vector-2.svg" />
          </span>
        </span>
      </span>
    </span>
  );
}

function Caret16() {
  return (
    <span className="relative shrink-0 size-[16px]">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/megabill/caret-frame.svg" />
      <span className="absolute inset-[37.5%_18.75%_31.25%_18.75%]">
        <span className="absolute inset-[-20%_-10%]">
          <img alt="" className="block max-w-none size-full" src="/icons/megabill/caret-vector.svg" />
        </span>
      </span>
    </span>
  );
}

/* "Group By [Global Cost Center x]" grouped select — Figma 1:13946. */
function GroupBySelect({ tag }: { tag: string }) {
  return (
    <div className="bg-white border border-[#d0d5dd] border-solid flex items-center pl-[4px] pr-[8px] py-[2px] rounded-[8px] shrink-0">
      <button
        type="button"
        className="cursor-pointer flex gap-[8px] items-center pl-[8px] pr-[4px] py-[2px] rounded-[2px]"
      >
        <span className="flex gap-[8px] items-center">
          <span className="flex gap-[4px] items-center py-px">
            <span className="font-sans font-medium leading-[20px] text-[#101828] text-[14px] whitespace-nowrap">
              Group By
            </span>
          </span>
          <FilterTag label={tag} />
        </span>
        <Caret16 />
      </button>
    </div>
  );
}

/* 36px tertiary icon button (#fefefe, radius 8; comment variant is bordered). */
function IconButton({
  inset,
  src,
  label,
  bordered = false,
}: {
  inset: string;
  src: string;
  label: string;
  bordered?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`bg-[#fefefe] cursor-pointer flex items-center justify-center min-h-[36px] min-w-[36px] p-[8px] rounded-[8px] shrink-0 size-[36px] ${
        bordered ? "border border-[#d0d5dd] border-solid" : ""
      }`}
    >
      <span className="flex-1 h-full min-w-px overflow-clip relative">
        <span className={`absolute ${inset}`}>
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={src} />
        </span>
      </span>
    </button>
  );
}

/* Comment icon button with the blue "0" counter badge — Figma 1:13957. */
function CommentButton({ count }: { count: number }) {
  return (
    <div className="relative shrink-0">
      <IconButton
        inset="inset-[9.38%_9.38%_9.37%_9.38%]"
        src="/icons/megabill/comment.svg"
        label="Comments"
        bordered
      />
      <div className="absolute bg-[#1570ef] flex flex-col h-[20px] items-center justify-center left-[26px] min-h-[16px] min-w-[20px] p-[2px] rounded-[40px] top-[-6px]">
        <p className="font-sans font-bold leading-[18px] text-[10px] text-center text-white whitespace-nowrap">
          {count}
        </p>
      </div>
    </div>
  );
}

/* Joined line-chart / bar-chart toggle (pill #f2f4f7, active tab white). */
function ChartTypeToggle({
  value,
  onChange,
}: {
  value: "line" | "bar";
  onChange: (value: "line" | "bar") => void;
}) {
  const tab = (kind: "line" | "bar", src: string, inset: string, label: string) => {
    const active = value === kind;
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        onClick={() => onChange(kind)}
        className={`cursor-pointer flex gap-[6px] items-center justify-center min-h-[29px] min-w-[29px] px-[8px] rounded-[10px] shrink-0 ${
          active
            ? "bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] py-[2px]"
            : "py-[4px]"
        }`}
      >
        <span className="overflow-clip relative shrink-0 size-[20px]">
          <span className={`absolute ${inset}`}>
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={src} />
          </span>
        </span>
      </button>
    );
  };
  return (
    <div className="bg-[#f2f4f7] flex gap-[4px] items-center px-[8px] py-[4px] rounded-[24px] shrink-0">
      {tab("line", "/icons/megabill/chart-line.svg", "inset-[9.38%]", "Line chart")}
      {tab("bar", "/icons/megabill/chart-column.svg", "inset-[9.38%]", "Bar chart")}
    </div>
  );
}

/* ---------------------------------------------------------------- chart */

/** One stacked daily bar: layered bottom-aligned divs, 6px rounded top caps. */
function Bar({ values }: { values: number[] }) {
  const px = values.map((v) => v * PX_PER_DOLLAR);
  const total = px.reduce((sum, h) => sum + h, 0);
  /* Paint top-of-stack series first; each layer runs baseline → top of its
   * segment so later (lower) layers cover it, exactly like the Figma rects. */
  const layers: { color: string; height: number }[] = [];
  let cumulative = total;
  for (let i = px.length - 1; i >= 0; i -= 1) {
    if (px[i] > 0) layers.push({ color: CHART_SERIES[i].color, height: cumulative });
    cumulative -= px[i];
  }
  return (
    <div className="flex-1 min-w-px relative" style={{ height: total }}>
      {layers.map((layer, i) => (
        <div
          key={i}
          className="absolute bottom-0 left-0 right-0 rounded-t-[6px]"
          style={{ height: layer.height, backgroundColor: layer.color }}
        />
      ))}
    </div>
  );
}

function StackedBarChart({ data }: { data: MegaBillBarDatum[] }) {
  return (
    <div className="flex flex-col items-start w-full">
      <div className="relative w-full">
        {/* Y axis: 5 label rows with light gridlines */}
        <div
          className="flex flex-col items-start justify-between w-full"
          style={{ height: PLOT_H }}
        >
          {Y_LABELS.map((label) => (
            <div key={label} className="flex gap-[8px] items-center w-full" style={{ height: ROW_H }}>
              <p className="font-inter font-normal leading-[18px] shrink-0 text-[#535862] text-[12px] text-right w-[40px]">
                {label}
              </p>
              <div className="bg-[#f5f5f5] flex-1 h-px min-w-px" />
            </div>
          ))}
        </div>
        {/* Bars overlay, bottoms on the 0 gridline */}
        <div
          className="absolute flex items-end right-0"
          style={{ bottom: BASELINE_BOTTOM, left: PLOT_LEFT, gap: BAR_GAP }}
        >
          {data.map((datum, i) => (
            <Bar key={i} values={datum.values} />
          ))}
        </div>
      </div>
      {/* X axis labels (every 3rd day) */}
      <div className="w-full" style={{ paddingLeft: PLOT_LEFT }}>
        <div className="flex items-center justify-between px-[24px] w-full">
          {X_LABELS.map((label) => (
            <p
              key={label}
              className="font-inter font-normal leading-[18px] shrink-0 text-[#535862] text-[12px] text-center whitespace-nowrap"
            >
              {label}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- legend */

function LegendDot({ color }: { color: string }) {
  return (
    <span
      className="rounded-full shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.1)] shrink-0 size-[8px]"
      style={{ backgroundColor: color }}
    />
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-[12px] items-start">
      <div className="flex gap-[8px] items-center shrink-0">
        <LegendDot color={TOTAL_LEGEND.color} />
        <p className="font-inter font-normal leading-[20px] text-[#8c8f95] text-[14px] whitespace-nowrap">
          {TOTAL_LEGEND.label}
        </p>
      </div>
      {CHART_SERIES.map((series) => (
        <div key={series.label} className="flex gap-[8px] items-center shrink-0">
          <LegendDot color={series.color} />
          <p className="font-inter font-normal leading-[20px] text-[#535862] text-[14px] whitespace-nowrap">
            {series.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- section */

export function MegaBillChartSection({
  data = DEFAULT_CHART_DATA,
  className = "",
}: {
  data?: MegaBillBarDatum[];
  className?: string;
}) {
  const [chartType, setChartType] = useState<"line" | "bar">("bar");
  return (
    <section className={`flex flex-col gap-[40px] items-start p-[24px] w-full ${className}`}>
      {/* KPI strip + controls row */}
      <div className="flex items-start justify-between w-full">
        <div className="flex gap-[20px] items-center shrink-0">
          <MetricItem label="Total Cost" value="$10,444,851" />
          <MetricItem label="Share of Total Cost" value="100%" />
          <MetricItem label="Average Daily Cost" value="$348,162" divider={false} />
        </div>
        <div className="flex gap-[12px] items-center shrink-0">
          <GroupBySelect tag="Global Cost Center" />
          <CommentButton count={0} />
          <ChartTypeToggle value={chartType} onChange={setChartType} />
          <IconButton inset="inset-[9.38%]" src="/icons/megabill/grid.svg" label="Dashboard view" />
          <IconButton inset="inset-[9.38%]" src="/icons/megabill/download.svg" label="Download" />
          <IconButton inset="inset-[13.54%_42.71%]" src="/icons/megabill/dots.svg" label="More options" />
        </div>
      </div>

      {/* Chart + legend */}
      <div className="flex flex-col gap-[20px] items-start w-full">
        <StackedBarChart data={data} />
        <div className="flex flex-col gap-[10px] items-start w-full">
          <Legend />
          <div className="flex items-center justify-between w-full">
            <div className="h-[20px] w-[151px]" />
            <button
              type="button"
              className="cursor-pointer flex gap-[8px] items-center justify-center min-h-[24px] px-[8px] py-[4px] rounded-[4px]"
            >
              <span className="font-sans font-medium leading-[20px] text-[#175cd3] text-[14px] whitespace-nowrap">
                Unselect all
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

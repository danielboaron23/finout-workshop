"use client";

import { useState } from "react";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { showToast } from "@/components/ui/Toast";
import { copyText, downloadCsvFile } from "./megabill-actions";

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
 *
 * The section is fully controllable (data/series/axes/visibility/group-by via
 * props, driven by MegaBillPageClient) and falls back to internal state +
 * the default dataset when uncontrolled (stories).
 */

/* ---------------------------------------------------------------- series */

export type MegaBillSeries = { label: string; color: string };

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
  /** Value per series entry (default: AWS → Custom Cost); 0 renders nothing. */
  values: number[];
};

/* ------------------------------------------------------------- geometry */

const PLOT_H = 245; // y-axis block height
const ROW_H = 17; // one y-axis label row
const BASELINE_BOTTOM = 9; // 0-line offset from the plot bottom (row center)
const PLOT_LEFT = 48; // y label (40px) + 8px gap
const BAR_GAP = 20;
const PX_PER_DOLLAR = 57 / 200_000; // 57px between gridlines = $200k
const LINE_PLOT_H = 4 * 57; // baseline → top gridline (line-chart plot height)

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

const DEFAULT_METRICS = [
  { label: "Total Cost", value: "$10,444,851" },
  { label: "Share of Total Cost", value: "100%" },
  { label: "Average Daily Cost", value: "$348,162" },
];

const DEFAULT_GROUP_OPTIONS = ["Global Cost Center", "Service", "Team"];

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
function FilterTag({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="bg-[#ebebeb] flex gap-[5px] h-[28px] items-center justify-center px-[6px] rounded-[3px] shrink-0">
      <span className="font-sans font-medium leading-[20px] text-[14px] text-[#101828] whitespace-nowrap">
        {label}
      </span>
      <span
        role="button"
        aria-label={`Remove ${label}`}
        onClick={
          onRemove
            ? (e) => {
                e.stopPropagation();
                onRemove();
              }
            : undefined
        }
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

/* "Group By [Global Cost Center x]" grouped select — Figma 1:13946.
 * The x removes the tag (→ Total-only chart); the dropdown re-picks a group. */
function GroupBySelect({
  tag,
  options,
  onChange,
}: {
  tag: string | null;
  options: readonly string[];
  onChange: (group: string | null) => void;
}) {
  return (
    <Dropdown
      align="right"
      trigger={() => (
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
              {tag !== null && <FilterTag label={tag} onRemove={() => onChange(null)} />}
            </span>
            <Caret16 />
          </button>
        </div>
      )}
    >
      {(close) => (
        <div className="flex flex-col min-w-[180px]">
          {options.map((o) => (
            <DropdownItem
              key={o}
              selected={o === tag}
              onClick={() => {
                onChange(o);
                close();
              }}
            >
              {o}
            </DropdownItem>
          ))}
        </div>
      )}
    </Dropdown>
  );
}

/* 36px tertiary icon button (#fefefe, radius 8; comment variant is bordered). */
function IconButton({
  inset,
  src,
  label,
  bordered = false,
  onClick,
}: {
  inset: string;
  src: string;
  label: string;
  bordered?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
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

/* Comment icon button with the blue counter badge — Figma 1:13957.
 * Opens an inline comment popover; submitting bumps the badge count. */
function CommentButton() {
  const [comments, setComments] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const submit = (close: () => void) => {
    const text = draft.trim();
    if (!text) return;
    setComments((prev) => [...prev, text]);
    setDraft("");
    close();
  };
  return (
    <div className="relative shrink-0">
      <Dropdown
        align="right"
        trigger={() => (
          <IconButton
            inset="inset-[9.38%_9.38%_9.37%_9.38%]"
            src="/icons/megabill/comment.svg"
            label="Comments"
            bordered
          />
        )}
      >
        {(close) => (
          <div className="flex flex-col gap-[8px] w-[240px]">
            {comments.map((c, i) => (
              <p key={i} className="font-sans font-normal leading-[20px] text-[14px] text-[#475467]">
                {c}
              </p>
            ))}
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(close);
              }}
              placeholder="Add a comment"
              className="border border-solid border-[#d0d5dd] rounded-[8px] px-[12px] py-[8px] font-sans font-normal leading-[20px] text-[14px] text-[#101828] placeholder:text-[#475467] outline-none w-full"
            />
            <button
              type="button"
              onClick={() => submit(close)}
              className="self-end font-sans font-medium leading-[20px] text-[14px] text-[#175cd3] cursor-pointer"
            >
              Comment
            </button>
          </div>
        )}
      </Dropdown>
      <div
        className="absolute bg-[#1570ef] flex flex-col h-[20px] items-center justify-center left-[26px] min-h-[16px] min-w-[20px] p-[2px] rounded-[40px] top-[-6px]"
        style={{ pointerEvents: "none" }}
      >
        <p className="font-sans font-bold leading-[18px] text-[10px] text-center text-white whitespace-nowrap">
          {comments.length}
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

/** One stacked daily bar: layered bottom-aligned divs, 6px rounded top caps.
 * Hidden (legend-toggled) series contribute 0 so the stack re-computes its
 * cumulative layer heights from the remaining visible series. */
function Bar({
  values,
  series,
  hidden,
  pxPerUnit,
}: {
  values: number[];
  series: readonly MegaBillSeries[];
  hidden: ReadonlySet<string>;
  pxPerUnit: number;
}) {
  const px = values.map((v, i) => (series[i] && hidden.has(series[i].label) ? 0 : v * pxPerUnit));
  const total = px.reduce((sum, h) => sum + h, 0);
  /* Paint top-of-stack series first; each layer runs baseline → top of its
   * segment so later (lower) layers cover it, exactly like the Figma rects. */
  const layers: { color: string; height: number }[] = [];
  let cumulative = total;
  for (let i = px.length - 1; i >= 0; i -= 1) {
    if (px[i] > 0) layers.push({ color: series[i].color, height: cumulative });
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

function StackedBarChart({
  data,
  series,
  hidden,
  pxPerUnit,
  yLabels,
  xLabels,
  rotateXLabels,
  chartType,
}: {
  data: MegaBillBarDatum[];
  series: readonly MegaBillSeries[];
  hidden: ReadonlySet<string>;
  pxPerUnit: number;
  yLabels: readonly string[];
  xLabels: readonly string[];
  rotateXLabels: boolean;
  chartType: "line" | "bar";
}) {
  /* Line mode: totals of the visible series per bar, same plot + gridlines. */
  const totals = data.map((d) =>
    d.values.reduce((sum, v, i) => sum + (series[i] && hidden.has(series[i].label) ? 0 : v), 0),
  );
  const points = (
    totals.length === 1
      ? [0, 1000].map((x) => `${x},${LINE_PLOT_H - Math.min(totals[0] * pxPerUnit, LINE_PLOT_H)}`)
      : totals.map((t, i) => {
          const x = ((i + 0.5) / totals.length) * 1000;
          const y = LINE_PLOT_H - Math.min(t * pxPerUnit, LINE_PLOT_H);
          return `${x},${y}`;
        })
  ).join(" ");
  return (
    <div className="flex flex-col items-start w-full">
      <div className="relative w-full">
        {/* Y axis: 5 label rows with light gridlines */}
        <div
          className="flex flex-col items-start justify-between w-full"
          style={{ height: PLOT_H }}
        >
          {yLabels.map((label, i) => (
            <div key={i} className="flex gap-[8px] items-center w-full" style={{ height: ROW_H }}>
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
          {chartType === "bar" ? (
            data.map((datum, i) => (
              <Bar key={i} values={datum.values} series={series} hidden={hidden} pxPerUnit={pxPerUnit} />
            ))
          ) : (
            <svg
              className="flex-1 min-w-px"
              style={{ height: LINE_PLOT_H }}
              viewBox={`0 0 1000 ${LINE_PLOT_H}`}
              preserveAspectRatio="none"
              aria-label="Total line chart"
            >
              <polyline
                points={points}
                fill="none"
                stroke="#1570ef"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          )}
        </div>
      </div>
      {/* X axis labels (every 3rd day; series names in the Service pivot) */}
      <div className="w-full" style={{ paddingLeft: PLOT_LEFT }}>
        <div className="flex items-center justify-between px-[24px] w-full">
          {xLabels.map((label, i) => (
            <p
              key={`${label}-${i}`}
              className="font-inter font-normal leading-[18px] shrink-0 text-[#535862] text-[12px] text-center whitespace-nowrap"
              style={rotateXLabels ? { transform: "rotate(-20deg)" } : undefined}
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

function Legend({
  series,
  hidden,
  onToggle,
}: {
  series: readonly MegaBillSeries[];
  hidden: ReadonlySet<string>;
  onToggle: (label: string) => void;
}) {
  const items = series.filter((s) => s.label !== TOTAL_LEGEND.label);
  return (
    <div className="flex flex-wrap gap-[12px] items-start">
      <div className="flex gap-[8px] items-center shrink-0">
        <LegendDot color={TOTAL_LEGEND.color} />
        <p className="font-inter font-normal leading-[20px] text-[#8c8f95] text-[14px] whitespace-nowrap">
          {TOTAL_LEGEND.label}
        </p>
      </div>
      {items.map((s) => (
        <div
          key={s.label}
          role="button"
          aria-pressed={!hidden.has(s.label)}
          onClick={() => onToggle(s.label)}
          className="flex gap-[8px] items-center shrink-0"
          style={{ cursor: "pointer", opacity: hidden.has(s.label) ? 0.4 : 1 }}
        >
          <LegendDot color={s.color} />
          <p className="font-inter font-normal leading-[20px] text-[#535862] text-[14px] whitespace-nowrap">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- section */

export type MegaBillChartSectionProps = {
  data?: MegaBillBarDatum[];
  className?: string;
  /** Displayed series (legend + stack order). Default: the 10 cost series. */
  series?: readonly MegaBillSeries[];
  xLabels?: readonly string[];
  yLabels?: readonly string[];
  /** Pixels per data unit (57px per y-axis step). Default: $200k steps. */
  pxPerUnit?: number;
  /** Rotate x labels (Service pivot). */
  rotateXLabels?: boolean;
  /** KPI strip items. Default: the cost KPIs. */
  metrics?: readonly { label: string; value: string }[];
  /** Controlled legend-hidden series; falls back to internal state. */
  hiddenSeries?: readonly string[];
  onToggleSeries?: (label: string) => void;
  /** Unselect all / Select all (true = hide all displayed series). */
  onToggleAll?: (hideAll: boolean) => void;
  chartType?: "line" | "bar";
  onChartTypeChange?: (type: "line" | "bar") => void;
  /** Group By tag; null = tag removed. Falls back to internal state. */
  groupTag?: string | null;
  groupOptions?: readonly string[];
  onGroupChange?: (group: string | null) => void;
  /** Download / Export CSV action; falls back to serializing the chart data. */
  onDownloadCsv?: () => void;
  /** Copy data action; falls back to copying the chart data JSON. */
  onCopyData?: () => void;
};

export function MegaBillChartSection({
  data = DEFAULT_CHART_DATA,
  className = "",
  series = CHART_SERIES,
  xLabels = X_LABELS,
  yLabels = Y_LABELS,
  pxPerUnit = PX_PER_DOLLAR,
  rotateXLabels = false,
  metrics = DEFAULT_METRICS,
  hiddenSeries,
  onToggleSeries,
  onToggleAll,
  chartType,
  onChartTypeChange,
  groupTag,
  groupOptions = DEFAULT_GROUP_OPTIONS,
  onGroupChange,
  onDownloadCsv,
  onCopyData,
}: MegaBillChartSectionProps) {
  const [internalHidden, setInternalHidden] = useState<string[]>([]);
  const [internalType, setInternalType] = useState<"line" | "bar">("bar");
  const [internalGroup, setInternalGroup] = useState<string | null>("Global Cost Center");

  const hidden = new Set(hiddenSeries ?? internalHidden);
  const toggleSeries =
    onToggleSeries ??
    ((label: string) =>
      setInternalHidden((prev) =>
        prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
      ));
  const type = chartType ?? internalType;
  const setType = onChartTypeChange ?? setInternalType;
  const group = groupTag === undefined ? internalGroup : groupTag;
  const changeGroup = onGroupChange ?? setInternalGroup;

  const allHidden = series.length > 0 && series.every((s) => hidden.has(s.label));
  const toggleAll =
    onToggleAll ??
    ((hideAll: boolean) => setInternalHidden(hideAll ? series.map((s) => s.label) : []));

  const download =
    onDownloadCsv ??
    (() => {
      const lines = [
        ["Bar", ...series.map((s) => s.label)].join(","),
        ...data.map((d, i) => [String(i + 1), ...d.values.map((v) => String(v))].join(",")),
      ];
      downloadCsvFile(lines.join("\n"));
    });
  const copy =
    onCopyData ??
    (() => {
      copyText(JSON.stringify(data, null, 2)).then(
        () => showToast("Data copied to clipboard"),
        () => showToast("Copy failed"),
      );
    });

  return (
    <section className={`flex flex-col gap-[40px] items-start p-[24px] w-full ${className}`}>
      {/* KPI strip + controls row */}
      <div className="flex items-start justify-between w-full">
        <div className="flex gap-[20px] items-center shrink-0">
          {metrics.map((m, i) => (
            <MetricItem key={m.label} label={m.label} value={m.value} divider={i < metrics.length - 1} />
          ))}
        </div>
        <div className="flex gap-[12px] items-center shrink-0">
          <GroupBySelect tag={group} options={groupOptions} onChange={changeGroup} />
          <CommentButton />
          <ChartTypeToggle value={type} onChange={setType} />
          <IconButton
            inset="inset-[9.38%]"
            src="/icons/megabill/grid.svg"
            label="Dashboard view"
            onClick={() => showToast("Layout options coming soon")}
          />
          <IconButton
            inset="inset-[9.38%]"
            src="/icons/megabill/download.svg"
            label="Download"
            onClick={download}
          />
          <Dropdown
            align="right"
            trigger={() => (
              <IconButton inset="inset-[13.54%_42.71%]" src="/icons/megabill/dots.svg" label="More options" />
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

      {/* Chart + legend */}
      <div className="flex flex-col gap-[20px] items-start w-full">
        <StackedBarChart
          data={data}
          series={series}
          hidden={hidden}
          pxPerUnit={pxPerUnit}
          yLabels={yLabels}
          xLabels={xLabels}
          rotateXLabels={rotateXLabels}
          chartType={type}
        />
        <div className="flex flex-col gap-[10px] items-start w-full">
          <Legend series={series} hidden={hidden} onToggle={toggleSeries} />
          <div className="flex items-center justify-between w-full">
            <div className="h-[20px] w-[151px]" />
            <button
              type="button"
              onClick={() => toggleAll(!allHidden)}
              className="cursor-pointer flex gap-[8px] items-center justify-center min-h-[24px] px-[8px] py-[4px] rounded-[4px]"
            >
              <span className="font-sans font-medium leading-[20px] text-[#175cd3] text-[14px] whitespace-nowrap">
                {allHidden ? "Select all" : "Unselect all"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

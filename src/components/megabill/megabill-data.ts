import {
  CHART_SERIES,
  DEFAULT_CHART_DATA,
  TOTAL_LEGEND,
  type MegaBillBarDatum,
  type MegaBillSeries,
} from "./MegaBillChart";
import type { MegaBillRow } from "./MegaBillTable";

/*
 * MegaBill — pure view-state + data-pipeline logic for the interactive page.
 * The pipeline order is: mode (cost→usage) → amortized factor → slice last N
 * days → series filter → group-by transform → pivot (date/service) →
 * aggregation (daily/weekly/monthly) → y-axis auto-scale.
 * All functions are pure; the client container (MegaBillPageClient) owns state.
 */

/* ------------------------------------------------------------- view state */

export type MegaBillMode = "cost" | "usage";
export type MegaBillAggregation = "daily" | "weekly" | "monthly";
export type MegaBillRangeDays = 7 | 14 | 30;
export type MegaBillXAxis = "date" | "service";
export type MegaBillAmortized = "Amortized Cost" | "Net Cost" | "List Cost";
export type MegaBillGroupBy = "Global Cost Center" | "Service" | "Team" | null;
export type MegaBillChartType = "line" | "bar";

export type MegaBillColumnKey = "name" | "date1" | "date2" | "totalCost" | "previous" | "pctOfTotal";
export type MegaBillSort = { col: MegaBillColumnKey; dir: "asc" | "desc" } | null;

export type MegaBillViewState = {
  mode: MegaBillMode;
  aggregation: MegaBillAggregation;
  rangeDays: MegaBillRangeDays;
  /** Legend-toggled-off series (by displayed label) — chart only. */
  hiddenSeries: string[];
  /** Filters-chip unchecked base series — removed from chart AND table. */
  filteredSeries: string[];
  xAxis: MegaBillXAxis;
  amortized: MegaBillAmortized;
  /** null = "Global Cost Center" tag removed → single gray Total series. */
  groupBy: MegaBillGroupBy;
  chartType: MegaBillChartType;
  /** Per-column UNCHECKED funnel values (row hidden when its value matches). */
  columnFilters: Partial<Record<MegaBillColumnKey, string[]>>;
  sort: MegaBillSort;
};

export const DEFAULT_VIEW_STATE: MegaBillViewState = {
  mode: "cost",
  aggregation: "daily",
  rangeDays: 30,
  hiddenSeries: [],
  filteredSeries: [],
  xAxis: "date",
  amortized: "Amortized Cost",
  groupBy: "Global Cost Center",
  chartType: "bar",
  columnFilters: {},
  sort: null,
};

/** Saved view = named snapshot of the full view state ("megabill-saved-views"). */
export type MegaBillSavedView = { name: string; state: MegaBillViewState };

export const GROUP_BY_OPTIONS = ["Global Cost Center", "Service", "Team"] as const;
export const AMORTIZED_OPTIONS = ["Amortized Cost", "Net Cost", "List Cost"] as const;
export const AGGREGATION_OPTIONS: { value: MegaBillAggregation; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];
export const RANGE_OPTIONS: MegaBillRangeDays[] = [7, 14, 30];

/** Canonical string form (order-insensitive lists) — used for dirty checks. */
export function serializeViewState(s: MegaBillViewState): string {
  const filters = (Object.keys(s.columnFilters) as MegaBillColumnKey[])
    .filter((k) => (s.columnFilters[k] ?? []).length > 0)
    .sort()
    .map((k) => [k, [...(s.columnFilters[k] ?? [])].sort()]);
  return JSON.stringify([
    s.mode,
    s.aggregation,
    s.rangeDays,
    [...s.hiddenSeries].sort(),
    [...s.filteredSeries].sort(),
    s.xAxis,
    s.amortized,
    s.groupBy,
    s.chartType,
    filters,
    s.sort,
  ]);
}

export function toggleInList(list: readonly string[], item: string): string[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function toggleColumnFilter(
  filters: MegaBillViewState["columnFilters"],
  col: MegaBillColumnKey,
  value: string,
): MegaBillViewState["columnFilters"] {
  const current = filters[col] ?? [];
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  return { ...filters, [col]: next };
}

/* ------------------------------------------------------------------ dates */

/** 28 day labels, Sep 17 → Oct 14, matching the chart's default x axis. */
export const DAY_LABELS: string[] = [
  ...Array.from({ length: 14 }, (_, i) => `Sep ${17 + i}`),
  ...Array.from({ length: 14 }, (_, i) => `Oct ${String(i + 1).padStart(2, "0")}`),
];

/* ---------------------------------------------------------- usage dataset */

/** Deterministic 0.6–1.4 per-series factor for the usage variant. */
function usageFactor(seriesIndex: number): number {
  return 0.6 + ((seriesIndex * 53) % 81) / 100;
}

/** Usage dataset: cost dollars → tokens (×10 scale) × per-series factor. */
export function toUsageData(data: MegaBillBarDatum[]): MegaBillBarDatum[] {
  return data.map((d) => ({ values: d.values.map((v, i) => Math.round(v * 10 * usageFactor(i))) }));
}

/* ------------------------------------------------------------- kpi strip */

export function kpiMetrics(mode: MegaBillMode): { label: string; value: string }[] {
  return mode === "usage"
    ? [
        { label: "Total Usage", value: "10,4M Tokens" },
        { label: "Share of Total Usage", value: "100%" },
        { label: "Average Daily Usage", value: "348K Tokens" },
      ]
    : [
        { label: "Total Cost", value: "$10,444,851" },
        { label: "Share of Total Cost", value: "100%" },
        { label: "Average Daily Cost", value: "$348,162" },
      ];
}

/* ----------------------------------------------------------- chart pivot */

/** Team grouping: same data bucketed into three teams (labels relabeled). */
const TEAM_SERIES: MegaBillSeries[] = [
  { label: "T1", color: "#9400D3" },
  { label: "T2", color: "#1D90FF" },
  { label: "T3", color: "#F08080" },
];
const TEAM_BUCKETS: number[][] = [
  [0, 1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

export type MegaBillChartView = {
  series: MegaBillSeries[];
  data: MegaBillBarDatum[];
  xLabels: string[];
  yLabels: string[];
  pxPerUnit: number;
  rotateXLabels: boolean;
};

const GRID_STEPS = 4; // gridline steps above the 0 line
const PX_PER_STEP = 57; // px between gridlines (Figma)

function niceStep(raw: number): number {
  const pow = 10 ** Math.floor(Math.log10(raw));
  for (const m of [1, 2, 2.5, 5, 10]) {
    const s = m * pow;
    if (s >= raw) return s;
  }
  return 10 * pow;
}

function formatAxisValue(v: number, mode: MegaBillMode): string {
  if (v === 0) return "0";
  const money = mode === "cost";
  if (v >= 1_000_000) {
    const n = Math.round((v / 1_000_000) * 10) / 10;
    return money ? `$${n}M` : `${n}M`;
  }
  const n = Math.round(v / 1_000);
  return money ? `$${n}k` : `${n}K`;
}

/**
 * Full chart pipeline: state → displayed series + per-bar values + axes.
 * Slice is applied BEFORE aggregation (Last N Days × Daily/Weekly/Monthly).
 */
export function computeChartView(state: MegaBillViewState): MegaBillChartView {
  const daily = state.mode === "usage" ? toUsageData(DEFAULT_CHART_DATA) : DEFAULT_CHART_DATA;
  const amortFactor = state.amortized === "Net Cost" ? 0.9 : state.amortized === "List Cost" ? 1.1 : 1;
  const sliced = daily.slice(-state.rangeDays).map((d) => d.values.map((v) => v * amortFactor));
  const slicedDates = DAY_LABELS.slice(-state.rangeDays);

  // Filters chip: drop unchecked base series entirely.
  const keptIdx: number[] = [];
  CHART_SERIES.forEach((s, i) => {
    if (!state.filteredSeries.includes(s.label)) keptIdx.push(i);
  });

  // Group-by transform (per day, values aligned to the displayed series).
  let series: MegaBillSeries[];
  let rows: number[][];
  if (state.groupBy === null) {
    series = [{ label: TOTAL_LEGEND.label, color: TOTAL_LEGEND.color }];
    rows = sliced.map((values) => [keptIdx.reduce((sum, i) => sum + values[i], 0)]);
  } else if (state.groupBy === "Team") {
    series = TEAM_SERIES.map((s) => ({ ...s }));
    rows = sliced.map((values) =>
      TEAM_BUCKETS.map((bucket) =>
        bucket.filter((i) => keptIdx.includes(i)).reduce((sum, i) => sum + values[i], 0),
      ),
    );
  } else {
    series = keptIdx.map((i) => ({ label: CHART_SERIES[i].label, color: CHART_SERIES[i].color }));
    rows = sliced.map((values) => keptIdx.map((i) => values[i]));
  }

  // Pivot + aggregation.
  let data: MegaBillBarDatum[];
  let xLabels: string[];
  let rotateXLabels = false;

  if (state.xAxis === "service") {
    // One single-color bar per displayed series (its total across the slice).
    const totals = series.map((_, j) => rows.reduce((sum, r) => sum + r[j], 0));
    data = totals.map((t, j) => ({ values: series.map((_, k) => (k === j ? t : 0)) }));
    xLabels = series.map((s) => s.label);
    rotateXLabels = true;
  } else if (state.aggregation === "weekly") {
    data = [];
    xLabels = [];
    for (let start = 0; start < rows.length; start += 7) {
      const week = rows.slice(start, start + 7);
      data.push({ values: series.map((_, j) => week.reduce((sum, r) => sum + r[j], 0)) });
      xLabels.push(slicedDates[start]);
    }
  } else if (state.aggregation === "monthly") {
    data = [{ values: series.map((_, j) => rows.reduce((sum, r) => sum + r[j], 0)) }];
    xLabels = [slicedDates[0].slice(0, 3)];
  } else {
    data = rows.map((values) => ({ values }));
    xLabels = slicedDates.filter((_, i) => i % 3 === 0);
  }

  // Y axis: keep the Figma scale while data fits, else grow to a nice step.
  const baseStep = state.mode === "usage" ? 2_000_000 : 200_000;
  const maxTotal = data.reduce((max, d) => Math.max(max, d.values.reduce((s, v) => s + v, 0)), 0);
  const step = maxTotal > baseStep * GRID_STEPS ? niceStep(maxTotal / GRID_STEPS) : baseStep;
  const yLabels: string[] = [];
  for (let k = GRID_STEPS; k >= 0; k -= 1) yLabels.push(formatAxisValue(k * step, state.mode));

  return { series, data, xLabels, yLabels, pxPerUnit: PX_PER_STEP / step, rotateXLabels };
}

/* ----------------------------------------------------------------- table */

export function columnValue(row: MegaBillRow, col: MegaBillColumnKey): string {
  switch (col) {
    case "name":
      return row.name;
    case "date1":
      return row.date1;
    case "date2":
      return row.date2;
    case "totalCost":
      return row.totalCost;
    case "previous":
      return row.previous.value;
    case "pctOfTotal":
      return row.pctOfTotal;
  }
}

function parseNumeric(v: string): number | null {
  const n = parseFloat(v.replace(/[$,%\s]/g, ""));
  return Number.isNaN(n) ? null : n;
}

/**
 * Table pipeline: series filter (Filters chip) → per-column funnel filters →
 * sort. Returns both the pre-funnel rows (for funnel value lists) and the
 * final visible rows.
 */
export function computeTableRows(
  baseRows: MegaBillRow[],
  state: MegaBillViewState,
): { seriesFiltered: MegaBillRow[]; visible: MegaBillRow[] } {
  const seriesFiltered = baseRows.filter((r) => !state.filteredSeries.includes(r.name));
  let visible = seriesFiltered.filter((r) =>
    (Object.keys(state.columnFilters) as MegaBillColumnKey[]).every(
      (col) => !(state.columnFilters[col] ?? []).includes(columnValue(r, col)),
    ),
  );
  if (state.sort) {
    const { col, dir } = state.sort;
    visible = [...visible].sort((a, b) => {
      const av = columnValue(a, col);
      const bv = columnValue(b, col);
      const an = parseNumeric(av);
      const bn = parseNumeric(bv);
      const cmp = an !== null && bn !== null ? an - bn : av.localeCompare(bv);
      return dir === "asc" ? cmp : -cmp;
    });
  }
  return { seriesFiltered, visible };
}

/** Serialize table rows to CSV (quoted cells). */
export function rowsToCsv(rows: MegaBillRow[], dateHeaders: [string, string]): string {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [
    ["Name", dateHeaders[0], dateHeaders[1], "Total cost", "Previous period total cost", "Previous period change", "Percentage of total cost"]
      .map(esc)
      .join(","),
  ];
  for (const r of rows) {
    lines.push(
      [r.name, r.date1, r.date2, r.totalCost, r.previous.value, r.previous.pct, r.pctOfTotal].map(esc).join(","),
    );
  }
  return lines.join("\n");
}

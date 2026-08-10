import { WidgetSubtitle } from "./CostCentersCard";

/*
 * "Monthly cost changes (year to date)" chart card ("Daily cost change current month", 1652x312).
 * Figma: Home page → .local_homepage_content → Daily cost change current month.
 *
 * Static pixel-fidelity rebuild: 9 monthly clusters of stacked colored bars
 * straddling the $0 baseline (plain divs, exact px segment heights read from the
 * Figma rects; consecutive segments overlap by 2px exactly as drawn). The plot
 * scales horizontally (percentage cluster positions), heights stay fixed.
 */

/** Series order = stacking order away from the zero line (top of stack = AWS for bars below $0). */
export const CHART_SERIES = [
  { label: "AWS", color: "#9806ce" },
  { label: "kubernetes", color: "#0091fb" },
  { label: "GCP", color: "#f88081" },
  { label: "OnPremCosts", color: "#6e808e" },
  { label: "snowflake", color: "#006310" },
  { label: "Azure", color: "#fba368" },
  { label: "OpenAI", color: "#df9fdb" },
  { label: "Oracle Cloud", color: "#e17093" },
] as const;

const TOTAL_LEGEND = { label: "Total", color: "#98a2b3" };

export type MonthlyCostDatum = {
  month: string;
  /** "up" renders the stack above the $0 line, "down" below it */
  direction: "up" | "down";
  /** Segment heights in px, one per CHART_SERIES entry (AWS → Oracle Cloud) */
  heights: number[];
};

/** Default data — exact segment heights measured from the Figma bars */
export const DEFAULT_MONTHLY_COST_DATA: MonthlyCostDatum[] = [
  { month: "Feb. 25", direction: "down", heights: [10, 5, 7, 8, 8, 4, 5, 8] },
  { month: "Mar. 25", direction: "up", heights: [7, 7, 7, 8, 8, 4, 5, 5] },
  { month: "Apr. 25", direction: "down", heights: [10, 10, 7, 8, 8, 4, 5, 11] },
  { month: "May. 25", direction: "up", heights: [7, 7, 7, 8, 8, 4, 5, 5] },
  { month: "Jun 25", direction: "up", heights: [7, 7, 7, 8, 8, 4, 5, 5] },
  { month: "Jul. 25", direction: "down", heights: [10, 7, 7, 5, 8, 4, 5, 6] },
  { month: "Aug. 25", direction: "down", heights: [10, 10, 7, 8, 8, 4, 5, 11] },
  { month: "Sep. 25", direction: "up", heights: [7, 7, 7, 8, 8, 4, 5, 5] },
  { month: "Oct. 25", direction: "down", heights: [10, 10, 7, 8, 8, 4, 5, 11] },
];

/* Plot geometry (px from Figma, card content coordinates) */
const PLOT_H = 150; // y-axis label column + gridline area height
const ZERO_Y = 70; // $0 baseline within the plot
const GRID_TOPS = [4, 37, 69, 103, 137];
const Y_LABELS = ["$100", "$100", "$0", "-$100", "-$200"];
const Y_LABEL_TOPS = [0, 33, 66, 99, 132];
/** Cluster left offsets as % of the gridline area (measured: x/1561) */
const CLUSTER_LEFTS = [3.78, 15.06, 25.95, 37.28, 48.37, 59.13, 70.21, 81.1, 92.25];
const CLUSTER_W = 5.125; // 80/1561
const OVERLAP = 2; // consecutive segments overlap by 2px in Figma

function clusterLeft(i: number, count: number): number {
  if (count === CLUSTER_LEFTS.length) return CLUSTER_LEFTS[i];
  return ((i + 0.5) / count) * 100 - CLUSTER_W / 2;
}

function stackHeight(heights: number[]): number {
  return heights.reduce((sum, h) => sum + h, 0) - OVERLAP * (heights.length - 1);
}

/** CurrencyCircleDollar 28px icon (top-right of the card) */
export function CurrencyCircleDollarIcon() {
  return (
    <div className="relative shrink-0 size-[28px]">
      <div className="absolute bottom-[65.63%] left-1/2 right-1/2 top-[28.13%]">
        <div className="absolute inset-[-57.14%_-1px]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/currency-vector-1.svg" />
        </div>
      </div>
      <div className="absolute bottom-[28.13%] left-1/2 right-1/2 top-[65.63%]">
        <div className="absolute inset-[-57.14%_-1px]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/currency-vector-1.svg" />
        </div>
      </div>
      <div className="absolute inset-[12.5%]">
        <div className="absolute inset-[-4.76%]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/currency-vector-2.svg" />
        </div>
      </div>
      <div className="absolute inset-[34.38%_37.5%]">
        <div className="absolute inset-[-11.43%_-14.29%]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/currency-vector-3.svg" />
        </div>
      </div>
    </div>
  );
}

function BarCluster({ datum, left }: { datum: MonthlyCostDatum; left: number }) {
  const total = stackHeight(datum.heights);
  const up = datum.direction === "up";
  const segments = datum.heights.map((h, i) => ({ h, color: CHART_SERIES[i]?.color ?? "#98a2b3" }));
  const ordered = up ? [...segments].reverse() : segments;
  return (
    <div
      className="absolute flex flex-col"
      style={{
        left: `${left}%`,
        width: `${CLUSTER_W}%`,
        top: up ? ZERO_Y - 1 - total : ZERO_Y - 2,
        height: total,
      }}
    >
      {ordered.map((seg, i) => (
        <div
          key={i}
          className="w-full"
          style={{ height: seg.h, backgroundColor: seg.color, marginTop: i === 0 ? 0 : -OVERLAP }}
        />
      ))}
    </div>
  );
}

export function MonthlyCostChart({
  data = DEFAULT_MONTHLY_COST_DATA,
  className = "",
}: {
  data?: MonthlyCostDatum[];
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-solid border-[#eaecf0] drop-shadow-[0px_1px_1px_rgba(16,24,40,0.06),0px_1px_1.5px_rgba(16,24,40,0.1)] flex flex-col gap-[8px] items-start p-[16px] rounded-[8px] w-full ${className}`}
    >
      <div className="w-full">
        {/* Title + top-right $ icon */}
        <div className="flex items-start justify-between w-full">
          <p className="flex-1 font-sans font-medium leading-[26px] min-w-px text-[#101828] text-[18px]">
            Monthly cost changes (year to date)
          </p>
          <CurrencyCircleDollarIcon />
        </div>
        <div className="mt-[4px]">
          <WidgetSubtitle timeFrame="Current year" interval="Monthly" />
        </div>

        {/* Plot area */}
        <div className="mt-[4px] relative w-full" style={{ height: PLOT_H }}>
          {/* Y-axis labels */}
          {Y_LABELS.map((label, i) => (
            <p
              key={i}
              className="absolute font-sans font-normal leading-[18px] left-0 text-[#494646] text-[10px] text-right w-[26px]"
              style={{ top: Y_LABEL_TOPS[i] }}
            >
              {label}
            </p>
          ))}
          {/* Gridlines + bars */}
          <div className="absolute inset-y-0 left-[43px] right-[16px]">
            {GRID_TOPS.map((top, i) => (
              <div key={i} className="absolute bg-[#eaecf0] h-px left-0 right-0" style={{ top }} />
            ))}
            {data.map((datum, i) => (
              <BarCluster key={datum.month} datum={datum} left={clusterLeft(i, data.length)} />
            ))}
          </div>
        </div>

        {/* Rotated month labels */}
        <div className="h-[38px] relative w-full">
          <div className="absolute inset-y-0 left-[43px] right-[16px]">
            {data.map((datum, i) => (
              <p
                key={datum.month}
                className="-rotate-45 -translate-x-1/2 absolute font-sans font-normal leading-[18px] text-[#494646] text-[10px] top-[10px] whitespace-nowrap"
                style={{ left: `${clusterLeft(i, data.length) + CLUSTER_W / 2}%` }}
              >
                {datum.month}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-[16px] items-center w-full">
        <div className="flex gap-[8px] items-center">
          <div className="rounded-[1px] size-[9px]" style={{ backgroundColor: TOTAL_LEGEND.color }} />
          <p className="font-sans font-normal leading-[20px] text-[#98a2b3] text-[12px] whitespace-nowrap">
            {TOTAL_LEGEND.label}
          </p>
        </div>
        {CHART_SERIES.map((series) => (
          <div key={series.label} className="flex gap-[4px] items-center">
            <div className="size-[12px]" style={{ backgroundColor: series.color }} />
            <p className="font-sans font-medium leading-[20px] text-[#333333] text-[12px] whitespace-nowrap">
              {series.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

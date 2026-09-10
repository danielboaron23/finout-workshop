"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { TopNav } from "@/components/navigation/TopNav";
import { PageTitleBar } from "@/components/navigation/PageTitleBar";
import { TableShell, HeaderCell, Cell } from "@/components/table/Table";
import { SpendChart, type SpendPoint } from "@/components/costguard/SpendChart";

/*
 * Spend vs budget and forecast, by month.
 *
 * Structure taken from the reference in Figma — "CostGuard — design research"
 * → 7shifts — variance as its own column (node 37:7872): a legend and an
 * actual-vs-projected chart on top, then one row per period, paired metric
 * columns with the variance computed for the reader, closed by a Total row.
 * Rebuilt with Finout's tokens, components and data.
 *
 * Every figure is computed from workshop-data/seed.sql — monthly cost_events
 * totals against the budgets table. August is partial (data ends 26 Aug).
 */

type Row = SpendPoint;

const ROWS: Row[] = [
  { month: "March 2026", short: "Mar",     actual: 257169, budget: 287000, forecast: 257170 },
  { month: "April 2026", short: "Apr",     actual: 255690, budget: 287000, forecast: 255689 },
  { month: "May 2026", short: "May",       actual: 262917, budget: 287000, forecast: 262917 },
  { month: "June 2026", short: "Jun",      actual: 266241, budget: 287000, forecast: 266241 },
  { month: "July 2026", short: "Jul",      actual: 290177, budget: 287000, forecast: 290177 },
  { month: "August 2026", short: "Aug",    actual: 238315, budget: 287000, forecast: 284145, partial: true },
];

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const sum = (f: (r: Row) => number) => ROWS.reduce((s, r) => s + f(r), 0);

const T = {
  actual: sum((r) => r.actual),
  budget: sum((r) => r.budget),
  forecast: sum((r) => r.forecast),
};

/** Spend under budget is good; over is not. Sign and word carry it, colour only reinforces. */
function Variance({ value, big = false, onTarget = "On forecast" }: { value: number; big?: boolean; onTarget?: string }) {
  // A rounding-level difference is not a variance. Saying "−$0 under" is noise
  // dressed as precision — the flaw the reference was logged for.
  if (Math.abs(value) < 50) {
    return <span className="font-sans font-normal text-[14px] text-text-tertiary whitespace-nowrap">{onTarget}</span>;
  }
  const over = value > 0;
  return (
    <span className={`font-geist ${big ? "font-semibold" : "font-normal"} text-[16px] tabular-nums whitespace-nowrap ${over ? "text-red-800" : "text-success-700"}`}>
      {over ? "+" : "−"}{usd(Math.abs(value))}
      <span className="font-sans font-normal text-[12px] text-text-tertiary"> {over ? "over" : "under"}</span>
    </span>
  );
}

const Num = ({ v, dim = false }: { v: number; dim?: boolean }) => (
  <span className={`font-geist font-normal text-[16px] tabular-nums whitespace-nowrap ${dim ? "text-text-tertiary" : "text-text-primary"}`}>
    {usd(v)}
  </span>
);

/** Centred legend; line series get a line-with-a-dot swatch, as the reference draws them. */
const LineSwatch = ({ color, dashed = false }: { color: string; dashed?: boolean }) => (
  <svg width="26" height="10" viewBox="0 0 26 10" aria-hidden="true">
    <line x1="0" y1="5" x2="26" y2="5" stroke={color} strokeWidth="2" strokeDasharray={dashed ? "4 3" : undefined} />
    <circle cx="13" cy="5" r="3.4" fill="var(--color-surface-primary)" stroke={color} strokeWidth="2" />
  </svg>
);

const Legend = () => (
  <div className="flex flex-wrap items-center justify-center gap-x-[26px] gap-y-[8px] w-full">
    <span className="flex items-center gap-[8px]">
      <span className="bg-blue-400 rounded-[2px] size-[11px]" aria-hidden="true" />
      <span className="font-sans font-normal leading-[20px] text-[13px] text-text-secondary">Actual spend</span>
    </span>
    <span className="flex items-center gap-[8px]">
      <LineSwatch color="var(--color-text-primary)" />
      <span className="font-sans font-normal leading-[20px] text-[13px] text-text-secondary">Budget</span>
    </span>
    <span className="flex items-center gap-[8px]">
      <LineSwatch color="var(--color-text-tertiary)" dashed />
      <span className="font-sans font-normal leading-[20px] text-[13px] text-text-secondary">Forecast</span>
    </span>
  </div>
);

export function CostGuardVarianceScreen() {
  const col = "flex flex-col items-start shrink-0";
  const totalCell = "bg-canvas";

  return (
    <div className="bg-canvas flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="CostGuard" />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto bg-surface-primary">
        <TopNav compact />
        <PageTitleBar title="Spend vs budget" linkLabel="How forecasts are calculated" />

        <div className="flex flex-col gap-[20px] w-full px-[32px] py-[24px]">

          <div className="bg-surface-primary border border-solid border-border-light flex flex-col gap-[14px] px-[24px] py-[20px] rounded-[10px]">
            <Legend />
            <SpendChart data={ROWS} />
          </div>

          <TableShell>
            <div className={`${col} flex-1 min-w-[190px]`}>
              <HeaderCell label="Month" />
              {ROWS.map((r) => (
                <Cell key={r.month}>
                  <span className="font-sans font-medium leading-[22px] text-[16px] text-text-primary whitespace-nowrap">
                    {r.month}
                    {r.partial && <span className="font-normal text-[13px] text-text-tertiary"> · to 26th</span>}
                  </span>
                </Cell>
              ))}
              <Cell className={totalCell}>
                <span className="font-sans font-medium leading-[22px] text-[16px] text-text-primary">Total</span>
              </Cell>
            </div>

            <div className={`${col} w-[150px]`}>
              <HeaderCell label="Actual spend" />
              {ROWS.map((r) => <Cell key={r.month}><Num v={r.actual} /></Cell>)}
              <Cell className={totalCell}>
                <span className="font-geist font-semibold text-[16px] text-text-primary tabular-nums">{usd(T.actual)}</span>
              </Cell>
            </div>

            <div className={`${col} w-[140px]`}>
              <HeaderCell label="Budget" />
              {ROWS.map((r) => <Cell key={r.month}><Num v={r.budget} dim /></Cell>)}
              <Cell className={totalCell}>
                <span className="font-geist font-semibold text-[16px] text-text-primary tabular-nums">{usd(T.budget)}</span>
              </Cell>
            </div>

            <div className={`${col} w-[180px]`}>
              <HeaderCell label="Budget variance" />
              {ROWS.map((r) => <Cell key={r.month}><Variance value={r.actual - r.budget} onTarget="On budget" /></Cell>)}
              <Cell className={totalCell}><Variance value={T.actual - T.budget} big /></Cell>
            </div>

            <div className={`${col} w-[140px]`}>
              <HeaderCell label="Forecast" />
              {ROWS.map((r) => <Cell key={r.month}><Num v={r.forecast} dim /></Cell>)}
              <Cell className={totalCell}>
                <span className="font-geist font-semibold text-[16px] text-text-primary tabular-nums">{usd(T.forecast)}</span>
              </Cell>
            </div>

            <div className={`${col} w-[180px]`}>
              <HeaderCell label="Forecast variance" />
              {ROWS.map((r) => <Cell key={r.month}><Variance value={r.actual - r.forecast} /></Cell>)}
              <Cell className={totalCell}><Variance value={T.actual - T.forecast} big /></Cell>
            </div>

            <div className={`${col} w-[130px]`}>
              <HeaderCell label="Utilisation" />
              {ROWS.map((r) => (
                <Cell key={r.month}>
                  <span className={`font-geist font-normal text-[16px] tabular-nums ${r.actual > r.budget ? "text-red-800" : "text-text-primary"}`}>
                    {((r.actual / r.budget) * 100).toFixed(1)}%
                  </span>
                </Cell>
              ))}
              <Cell className={totalCell}>
                <span className="font-geist font-semibold text-[16px] text-text-primary tabular-nums">
                  {((T.actual / T.budget) * 100).toFixed(1)}%
                </span>
              </Cell>
            </div>
          </TableShell>

          <p className="font-sans font-normal leading-[22px] text-[13px] text-text-tertiary">
            August is partial — cost data ends 26 August, so its actual is below both budget and forecast for that reason.
            July is the only month that ran over budget, by {usd(3177)}.
          </p>

        </div>
      </div>
    </div>
  );
}

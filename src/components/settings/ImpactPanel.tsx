"use client";

import { useEffect, useRef, useState } from "react";
import { TableShell, HeaderCell, Cell } from "@/components/table/Table";
import { Callout } from "@/components/ui/Callout";
import { usd, signedUsd, type Impact, type ImpactRow } from "./data";

/*
 * ImpactPanel — COMPOSE (TableShell + Callout).
 *
 * The point of the whole screen: before a number-changing setting is published,
 * show what it does to the numbers. Three honest outcomes, so it never has to
 * invent a fourth — the same rule the CostGuard ledger runs on, where a saving
 * it cannot verify is named rather than rounded to zero.
 *
 *   money           — recomputed per team from real cost_events dollars
 *   boundaries      — the totals do not move, the periods around them do
 *   not-computable  — Finout does not hold what this would need. Say so.
 */

/** Counts a figure from its old value to its new one. Motion carries the delta. */
function useCountUp(to: number, from: number, ms = 520) {
  const [v, setV] = useState(to);
  const raf = useRef<number | undefined>(undefined);
  useEffect(() => {
    const reduce = typeof window !== "undefined"
      && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // Land on the final figure without animating it, on the next frame so
      // the update stays out of the effect body.
      raf.current = requestAnimationFrame(() => setV(to));
      return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    }
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      setV(from + (to - from) * e);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [to, from, ms]);
  return v;
}

function AfterCell({ row }: { row: ImpactRow }) {
  const v = useCountUp(row.after, row.before);
  return (
    <span className="font-geist font-semibold text-[16px] tabular-nums text-text-primary whitespace-nowrap">
      {usd(v)}
    </span>
  );
}

/** Sign and word carry the meaning; colour only reinforces it. */
function Delta({ value }: { value: number }) {
  if (Math.abs(value) < 50) {
    return <span className="font-sans font-normal text-[14px] text-text-tertiary whitespace-nowrap">No change</span>;
  }
  const up = value > 0;
  return (
    <span className={`font-geist font-normal text-[16px] tabular-nums whitespace-nowrap ${up ? "text-red-800" : "text-success-700"}`}>
      {signedUsd(value)}
      <span className="font-sans font-normal text-[12px] text-text-tertiary"> {up ? "more" : "less"}</span>
    </span>
  );
}

function MoneyImpact({ impact }: { impact: Extract<Impact, { kind: "money" }> }) {
  const col = "flex flex-col items-start shrink-0";
  const { rows, poolTotal, billTotal, monthLabel } = impact;
  const flipped = rows.filter((r) => r.flips !== "none");
  const biggest = [...rows].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0];

  return (
    <div className="flex flex-col gap-[12px] w-full">
      <p className="font-sans font-normal leading-[22px] text-[14px] text-text-secondary">
        Recalculated from {monthLabel}&rsquo;s real cost events. The shared pool is{" "}
        <span className="font-medium text-text-primary">{usd(poolTotal)}</span> of a{" "}
        <span className="font-medium text-text-primary">{usd(billTotal)}</span> bill —{" "}
        {((poolTotal / billTotal) * 100).toFixed(1)}% of everything, moving between teams.
      </p>

      <TableShell>
        <div className={`${col} flex-1 min-w-[170px]`}>
          <HeaderCell label="Team" />
          {rows.map((r) => (
            <Cell key={r.team}>
              <span className="font-sans font-medium leading-[22px] text-[16px] text-text-primary whitespace-nowrap">
                {r.team}
              </span>
            </Cell>
          ))}
        </div>
        <div className={`${col} w-[140px]`}>
          <HeaderCell label="Today" />
          {rows.map((r) => (
            <Cell key={r.team}>
              <span className="font-geist font-normal text-[16px] tabular-nums text-text-tertiary whitespace-nowrap">
                {usd(r.before)}
              </span>
            </Cell>
          ))}
        </div>
        <div className={`${col} w-[150px]`}>
          <HeaderCell label="After this change" />
          {rows.map((r) => <Cell key={r.team}><AfterCell row={r} /></Cell>)}
        </div>
        <div className={`${col} w-[170px]`}>
          <HeaderCell label="Difference" />
          {rows.map((r) => <Cell key={r.team}><Delta value={r.delta} /></Cell>)}
        </div>
        <div className={`${col} w-[150px]`}>
          <HeaderCell label="Against budget" />
          {rows.map((r) => (
            <Cell key={r.team}>
              <span className={`font-geist font-normal text-[16px] tabular-nums whitespace-nowrap ${
                r.after > r.budget ? "text-red-800" : "text-text-primary"
              }`}>
                {((r.after / r.budget) * 100).toFixed(1)}%
              </span>
            </Cell>
          ))}
        </div>
      </TableShell>

      {flipped.length > 0 ? (
        <Callout tone="danger" title={`${flipped.length} team${flipped.length > 1 ? "s cross" : " crosses"} the budget line`}>
          {flipped.map((r) => `${r.team} moves ${r.flips === "over-budget" ? "over" : "back inside"} budget`).join(" · ")}.
        </Callout>
      ) : (
        <p className="font-sans font-normal leading-[22px] text-[13px] text-text-tertiary">
          No team crosses its monthly budget under either method. The largest single move is{" "}
          {biggest.team} at {signedUsd(biggest.delta)}.
        </p>
      )}
    </div>
  );
}

export function ImpactPanel({ impact }: { impact: Impact }) {
  if (impact.kind === "none") return null;

  return (
    <div
      aria-live="polite"
      className="bg-surface-secondary border border-solid border-border-light flex flex-col gap-[12px] mt-[4px] px-[18px] py-[16px] rounded-[10px] w-full"
    >
      <p className="font-sans font-medium leading-[20px] text-[11px] tracking-[0.06em] uppercase text-text-tertiary">
        Before you publish
      </p>

      {impact.kind === "money" && <MoneyImpact impact={impact} />}

      {impact.kind === "boundaries" && (
        <div className="flex flex-col gap-[10px]">
          <div className="flex flex-wrap items-center gap-[10px]">
            <span className="font-geist font-normal text-[16px] text-text-tertiary line-through">{impact.before}</span>
            <span className="font-sans text-[14px] text-text-tertiary" aria-hidden="true">&rarr;</span>
            <span className="font-geist font-semibold text-[16px] text-text-primary">{impact.after}</span>
            <span className="font-sans font-normal text-[13px] text-text-tertiary">is the current quarter</span>
          </div>
          <p className="font-sans font-normal leading-[22px] text-[14px] text-text-secondary max-w-[72ch]">
            {impact.detail}
          </p>
        </div>
      )}

      {impact.kind === "not-computable" && (
        <Callout tone="warning" title="Impact cannot be shown for this change">
          {impact.reason}
        </Callout>
      )}
    </div>
  );
}

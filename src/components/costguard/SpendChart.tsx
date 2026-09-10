"use client";

import { useState } from "react";

/*
 * Spend vs budget and forecast.
 *
 * One data series (actual spend, as bars) read against two reference lines
 * (budget solid, forecast dashed). Identity is carried by mark shape as well as
 * colour, so the chart survives colourblindness, print and forced-colours.
 * The table beneath the chart is its table view.
 */

export type SpendPoint = { month: string; short: string; actual: number; budget: number; forecast: number; partial?: boolean };

const W = 900, H = 260, PL = 64, PB = 30, PT = 18;
const MAX = 320000;
const TICKS = [0, 100000, 200000, 300000];
const BAR = 44;

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function SpendChart({ data }: { data: SpendPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const band = (W - PL - 20) / data.length;
  const cx = (i: number) => PL + (i + 0.5) * band;
  const cy = (v: number) => PT + (1 - v / MAX) * (H - PT - PB);
  const base = cy(0);

  // rounded only at the data end, square on the baseline
  const barPath = (i: number, v: number) => {
    const x = cx(i) - BAR / 2, y = cy(v);
    return `M ${x},${base} L ${x},${y} L ${x + BAR},${y} L ${x + BAR},${base} Z`;
  };
  /* Catmull-Rom through the points, converted to cubic beziers — the reference
     draws its series as smooth curves, not straight segments. */
  const line = (key: "budget" | "forecast") => {
    const pts = data.map((d, i) => [cx(i), cy(d[key])] as const);
    if (pts.length < 2) return "";
    let out = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? pts[i + 1];
      const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      out += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
    }
    return out;
  };

  const h = hover === null ? null : data[hover];

  return (
    <div className="relative w-full">
      <style>{`
        @keyframes cgBarIn{from{transform:scaleY(0)}to{transform:scaleY(1)}}
        @keyframes cgDraw{to{stroke-dashoffset:0}}
        @keyframes cgFade{from{opacity:0}to{opacity:1}}
        .cg-bar{transform-box:fill-box;transform-origin:50% 100%;
          animation:cgBarIn .55s cubic-bezier(.16,1,.3,1) both;transition:opacity .18s ease}
        .cg-line{stroke-dasharray:1000;stroke-dashoffset:1000;animation:cgDraw 1s cubic-bezier(.16,1,.3,1) .35s both}
        .cg-dash{animation:cgFade .5s ease .9s both}
        .cg-dot{animation:cgFade .35s ease both;transition:r .15s ease}
        .cg-lbl{animation:cgFade .4s ease 1.1s both}
        @media(prefers-reduced-motion:reduce){
          .cg-bar,.cg-line,.cg-dash,.cg-dot,.cg-lbl{animation:none;stroke-dashoffset:0;transform:none}
        }
      `}</style>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full block"
        style={{ aspectRatio: `${W} / ${H}` }}
        role="img"
        aria-label={`Monthly actual spend from ${data[0]?.month} to ${data[data.length - 1]?.month}, shown as bars against a budget line of ${usd(data[0]?.budget ?? 0)} and a dashed forecast line. Full figures are in the table below.`}
        onMouseLeave={() => setHover(null)}
      >
        {TICKS.map((v) => (
          <g key={v}>
            <line x1={PL} y1={cy(v)} x2={W - 20} y2={cy(v)} stroke="var(--color-border-lighter)" strokeWidth="1" />
            <text x={PL - 12} y={cy(v) + 4} textAnchor="end" className="font-geist" fontSize="11" fill="var(--color-text-tertiary)">
              ${v / 1000}k
            </text>
          </g>
        ))}

        {/* crosshair behind the marks */}
        {hover !== null && (
          <line x1={cx(hover)} y1={PT} x2={cx(hover)} y2={base} stroke="var(--color-border-default)" strokeWidth="1" />
        )}

        {data.map((d, i) => (
          <path
            key={d.month}
            className="cg-bar"
            style={{ animationDelay: `${i * 60}ms`, opacity: hover === null || hover === i ? (d.partial ? 0.5 : 1) : 0.35 }}
            d={barPath(i, d.actual)}
            fill="var(--color-blue-400)"
          />
        ))}

        <path className="cg-line" d={line("budget")} fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" />
        <path className="cg-dash" d={line("forecast")} fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />

        {/* point markers — the reference's clearest signature */}
        {(["budget", "forecast"] as const).map((key) =>
          data.map((d, i) => (
            <circle
              key={key + d.month}
              className="cg-dot"
              style={{ animationDelay: `${900 + i * 45}ms` }}
              cx={cx(i)}
              cy={cy(d[key])}
              r={hover === i ? 5 : 3.8}
              fill="var(--color-surface-primary)"
              stroke={key === "budget" ? "var(--color-text-primary)" : "var(--color-text-tertiary)"}
              strokeWidth="2"
            />
          ))
        )}

        {/* one selective direct label: the only month that went over */}
        {data.map((d, i) =>
          d.actual > d.budget ? (
            <text key={"l" + d.month} className="cg-lbl font-geist" x={cx(i)} y={cy(d.actual) - 10} textAnchor="middle" fontSize="11.5" fontWeight="600" fill="var(--color-red-800)">
              +{usd(d.actual - d.budget)} over
            </text>
          ) : null
        )}

        {data.map((d, i) => (
          <text key={"x" + d.month} x={cx(i)} y={H - 8} textAnchor="middle" className="font-geist" fontSize="11"
            fill={hover === i ? "var(--color-text-primary)" : "var(--color-text-tertiary)"}>
            {d.short}
          </text>
        ))}

        {/* hit targets — wider than the marks */}
        {data.map((d, i) => (
          <rect key={"h" + d.month} x={cx(i) - band / 2} y={PT} width={band} height={base - PT} fill="transparent"
            onMouseEnter={() => setHover(i)} />
        ))}
      </svg>

      {h && (
        <div
          className="absolute z-10 pointer-events-none bg-surface-primary border border-solid border-border-light rounded-[8px] shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.1),0px_2px_4px_-2px_rgba(16,24,40,0.06)] px-[14px] py-[11px] min-w-[204px]"
          style={{ left: `${(cx(hover!) / W) * 100}%`, top: 8, transform: "translateX(-50%)" }}
        >
          <p className="font-sans font-medium leading-[20px] text-[14px] text-text-primary whitespace-nowrap">
            {h.month}{h.partial && <span className="font-normal text-text-tertiary"> · to 26th</span>}
          </p>
          <div className="flex flex-col gap-[3px] pt-[7px]">
            {[
              { k: "Actual", v: usd(h.actual), dot: "bg-blue-400" },
              { k: "Budget", v: usd(h.budget), dot: "bg-text-primary" },
              { k: "Forecast", v: usd(h.forecast), dot: "bg-text-tertiary" },
            ].map((r) => (
              <span key={r.k} className="flex items-center justify-between gap-[16px]">
                <span className="flex items-center gap-[7px]">
                  <span className={`${r.dot} rounded-[2px] size-[8px]`} aria-hidden="true" />
                  <span className="font-sans font-normal leading-[18px] text-[12.5px] text-text-secondary">{r.k}</span>
                </span>
                <span className="font-geist font-normal text-[13px] text-text-primary tabular-nums">{r.v}</span>
              </span>
            ))}
            <span className="flex items-center justify-between gap-[16px] border-t border-solid border-border-lighter mt-[5px] pt-[6px]">
              <span className="font-sans font-normal leading-[18px] text-[12.5px] text-text-secondary">vs budget</span>
              <span className={`font-geist font-medium text-[13px] tabular-nums ${h.actual > h.budget ? "text-red-800" : "text-success-700"}`}>
                {h.actual > h.budget ? "+" : "−"}{usd(Math.abs(h.actual - h.budget))} {h.actual > h.budget ? "over" : "under"}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { EV_SERIES, EV_START, evIndex } from "./evidence";
import type { CgMarker } from "./data";

/*
 * EvidenceChart — the real daily cost for the service behind a recommendation,
 * straight from workshop-data/seed.sql. A recommendation the user cannot verify
 * is a claim; with the cost history beside it, it becomes an argument.
 *
 * Hover reads out the exact day and amount — charts alone are not enough
 * (see the chart rules in ui-ux-pro-max: tooltip-on-interact, axis-labels).
 */

const W = 720, H = 210, PAD_L = 46, PAD_B = 22, PAD_T = 14;

export function EvidenceChart({ slug, markers = [] }: { slug: string; markers?: CgMarker[] }) {
  const series = EV_SERIES[slug];
  const [hover, setHover] = useState<number | null>(null);

  const geo = useMemo(() => {
    if (!series) return null;
    const min = Math.min(...series), max = Math.max(...series);
    const lo = Math.max(0, min - (max - min) * 0.25), hi = max + (max - min) * 0.12;
    const px = (i: number) => PAD_L + (i / (series.length - 1)) * (W - PAD_L - 12);
    const py = (v: number) => PAD_T + (1 - (v - lo) / (hi - lo || 1)) * (H - PAD_T - PAD_B);
    const line = series.map((v, i) => (i ? "L" : "M") + px(i).toFixed(1) + "," + py(v).toFixed(1)).join(" ");
    return { min, max, lo, hi, px, py, line, area: line + ` L${px(series.length - 1)},${H - PAD_B} L${px(0)},${H - PAD_B} Z` };
  }, [series]);

  if (!series || !geo) return null;
  const { px, py, line, area, max, lo, hi } = geo;

  const label = (i: number) => {
    const d = new Date(EV_START);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  return (
    <div className="flex flex-col gap-[6px] w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full block"
        style={{ aspectRatio: `${W} / ${H}` }}
        role="img"
        aria-label={`Daily cost for this service from ${label(0)} to ${label(series.length - 1)}, ranging from $${geo.min} to $${max} per day.`}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((x - PAD_L) / (W - PAD_L - 12)) * (series.length - 1));
          setHover(i >= 0 && i < series.length ? i : null);
        }}
      >
        {[hi, (hi + lo) / 2, lo].map((v, k) => (
          <g key={k}>
            <line x1={PAD_L} y1={py(v)} x2={W - 12} y2={py(v)} stroke="var(--color-border-lighter)" strokeWidth="1" />
            <text x={PAD_L - 8} y={py(v) + 4} textAnchor="end" className="font-geist" fontSize="10" fill="var(--color-text-tertiary)">
              ${Math.round(v)}
            </text>
          </g>
        ))}

        <path d={area} fill="var(--color-blue-25)" />
        <path d={line} fill="none" stroke="var(--color-blue-400)" strokeWidth="1.6" strokeLinejoin="round" />

        {markers.map((m) => {
          const i = evIndex(m.at);
          if (i < 0) return null;
          return (
            <g key={m.at}>
              <line x1={px(i)} y1={PAD_T} x2={px(i)} y2={H - PAD_B} stroke="var(--color-red-400)" strokeWidth="1.4" strokeDasharray="3 3" />
              <text x={px(i) + 5} y={PAD_T + 10} className="font-geist" fontSize="10" fill="var(--color-red-800)">{m.label}</text>
            </g>
          );
        })}

        {hover !== null && (
          <g>
            <line x1={px(hover)} y1={PAD_T} x2={px(hover)} y2={H - PAD_B} stroke="var(--color-text-tertiary)" strokeWidth="1" />
            <circle cx={px(hover)} cy={py(series[hover])} r="3.5" fill="var(--color-blue-400)" stroke="white" strokeWidth="1.5" />
          </g>
        )}

        <text x={PAD_L} y={H - 6} className="font-geist" fontSize="10" fill="var(--color-text-tertiary)">{label(0)}</text>
        <text x={W - 12} y={H - 6} textAnchor="end" className="font-geist" fontSize="10" fill="var(--color-text-tertiary)">
          {label(series.length - 1)}
        </text>
      </svg>

      <p className="font-sans font-normal leading-[18px] text-[12px] text-text-tertiary" aria-live="polite">
        {hover !== null ? (
          <>
            <span className="font-medium text-text-primary">{label(hover)}</span> — ${series[hover].toLocaleString("en-US")} that day
          </>
        ) : (
          <>Daily cost, {label(0)} to {label(series.length - 1)}. Hover for a single day.</>
        )}
      </p>
    </div>
  );
}

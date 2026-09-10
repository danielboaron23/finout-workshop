"use client";

import { useState } from "react";
import Link from "next/link";
import { CG_ROWS, isOpen, usd } from "@/components/costguard/data";

/*
 * CostGuard — "The Statement". An alternative direction, deliberately outside
 * the Finout design system (see docs/prd/costguard-follow-through.md for the
 * problem it solves).
 *
 * The argument: a savings programme is a balance, not a list. Money only enters
 * the balance once it is verified against the bill, and a regression is a debit
 * that visibly takes it back out. Open opportunities sit below the line,
 * explicitly not counted — which is the honest version of "$26,802 potential".
 *
 * Palette and type are scoped to this route only. Every colour lives in the one
 * :root block below rather than scattered through the markup.
 */

type Entry = {
  date: string;
  label: string;
  service: string;
  owner: string;
  state: "VERIFIED" | "REVERTED" | "UNVERIFIED";
  amount: number | null;
  balance: number;
};

const ENTRIES: Entry[] = [
  { date: "2026-04-02", label: "Weekend auto-suspend enabled", service: "Snowflake Warehouse", owner: "Amit Shani", state: "VERIFIED", amount: 2075, balance: 2075 },
  { date: "2026-05-28", label: "Idle instance terminated", service: "RDS", owner: "Tomer Adler", state: "VERIFIED", amount: 812, balance: 2887 },
  { date: "2026-06-06", label: "Auto-suspend stopped running", service: "Snowflake Warehouse", owner: "Amit Shani", state: "REVERTED", amount: -2075, balance: 812 },
  { date: "2026-06-14", label: "Lifecycle policy applied", service: "S3 Storage", owner: "Amit Shani", state: "VERIFIED", amount: 301, balance: 1113 },
  { date: "2026-08-30", label: "Rightsized db.r5.xlarge", service: "RDS", owner: "Noa Peretz", state: "UNVERIFIED", amount: null, balance: 1113 },
];

const BALANCE = 1113;
const LOST = 2075;

/* step chart: x = days since 1 Apr over 158, y = balance over 3000 */
const PTS: [number, number][] = [[0, 0], [6, 2075], [361, 2075], [361, 2887], [418, 2887], [418, 812], [468, 812], [468, 1113], [1000, 1113]];
const CH_W = 1000, CH_H = 180, MAX = 3000;
const py = (v: number) => CH_H - (v / MAX) * CH_H;
const line = PTS.map(([x, v], i) => (i === 0 ? "M" : "L") + x + "," + py(v)).join(" ");
const area = line + ` L${CH_W},${CH_H} L0,${CH_H} Z`;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();

const STATE_TONE: Record<Entry["state"], string> = {
  VERIFIED: "var(--credit)",
  REVERTED: "var(--debit)",
  UNVERIFIED: "var(--faint)",
};

export function CostGuardLedgerScreen() {
  const [showPending, setShowPending] = useState(true);
  const pending = CG_ROWS.filter(isOpen).sort((a, b) => b.projectedMonthlyUsd - a.projectedMonthlyUsd);
  const pendingTotal = pending.reduce((s, r) => s + r.projectedMonthlyUsd, 0);

  return (
    <div className="cg-stmt flex flex-col h-full flex-1 w-full overflow-y-auto">
      <style>{`
        .cg-stmt{
          --bg:#0b0f14; --surface:#11171f; --raised:#161d26; --line:#1e2732;
          --text:#e6edf3; --dim:#8a97a6; --faint:#5a6675;
          --credit:#4fb286; --debit:#e5574a; --pending:#d89a4e;
          background:var(--bg); color:var(--text);
          font-family:var(--cg-sans),system-ui,sans-serif;
        }
        .cg-stmt .mono{font-family:var(--cg-mono),ui-monospace,monospace;font-variant-numeric:tabular-nums;}
        .cg-stmt a:focus-visible,.cg-stmt button:focus-visible{outline:2px solid var(--credit);outline-offset:2px;border-radius:4px;}
        .cg-stmt .row{transition:background .15s ease;}
        .cg-stmt .row:hover{background:var(--raised);}
        @media (prefers-reduced-motion:reduce){.cg-stmt *{transition:none!important;animation:none!important;}}
      `}</style>

      {/* command bar — no sidebar, on purpose */}
      <header className="flex items-center justify-between border-b px-[28px] py-[14px] shrink-0" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center gap-[14px]">
          <span className="mono text-[13px] tracking-[0.18em] uppercase" style={{ color: "var(--faint)" }}>finout</span>
          <span style={{ color: "var(--line)" }}>/</span>
          <span className="mono text-[13px] tracking-[0.06em]" style={{ color: "var(--text)" }}>costguard</span>
          <span className="mono text-[11px] px-[6px] py-[2px] rounded-[3px]" style={{ background: "var(--raised)", color: "var(--dim)" }}>STATEMENT</span>
        </div>
        <div className="flex items-center gap-[20px]">
          <span className="mono text-[12px]" style={{ color: "var(--faint)" }}>APR 1 — SEP 6, 2026</span>
          <Link href="/costguard" className="mono text-[12px] underline underline-offset-4" style={{ color: "var(--dim)" }}>
            Table view
          </Link>
        </div>
      </header>

      <main className="flex flex-col gap-[36px] px-[28px] py-[32px] max-w-[1400px] w-full">
        {/* hero — the balance is the thesis */}
        <section className="flex flex-col gap-[22px]">
          <div className="flex flex-wrap items-end justify-between gap-[28px]">
            <div className="flex flex-col gap-[6px]">
              <p className="mono text-[11px] tracking-[0.18em] uppercase" style={{ color: "var(--faint)" }}>
                Realized savings · running balance
              </p>
              <p className="mono font-medium leading-[1] text-[76px] tracking-[-0.03em]">
                {usd(BALANCE)}<span className="text-[26px]" style={{ color: "var(--dim)" }}> /mo</span>
              </p>
              <p className="text-[15px]" style={{ color: "var(--dim)" }}>
                Verified against the bill and still holding today.
              </p>
            </div>
            <div className="flex gap-[36px]">
              <div className="flex flex-col gap-[4px]">
                <p className="mono text-[11px] tracking-[0.14em] uppercase" style={{ color: "var(--faint)" }}>Lost to regression</p>
                <p className="mono text-[28px]" style={{ color: "var(--debit)" }}>−{usd(LOST)}</p>
                <p className="text-[13px]" style={{ color: "var(--faint)" }}>1 entry reverted</p>
              </div>
              <div className="flex flex-col gap-[4px]">
                <p className="mono text-[11px] tracking-[0.14em] uppercase" style={{ color: "var(--faint)" }}>Below the line</p>
                <p className="mono text-[28px]" style={{ color: "var(--pending)" }}>{usd(pendingTotal)}</p>
                <p className="text-[13px]" style={{ color: "var(--faint)" }}>{pending.length} not yet counted</p>
              </div>
            </div>
          </div>

          {/* signature: the balance line, with the fall where the saving died */}
          <figure className="m-0 rounded-[10px] border p-[20px]" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
            <svg viewBox={`0 0 ${CH_W} ${CH_H + 26}`} className="w-full block" style={{ aspectRatio: `${CH_W} / ${CH_H + 26}` }} role="img"
              aria-label={`Running balance from April to September 2026. Rises to $2,887 by late May, falls to $812 on 6 June when the Snowflake saving reverted, recovers to $1,113 on 14 June and holds.`}>
              <defs>
                <linearGradient id="cgFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--credit)" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="var(--credit)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1000, 2000, 3000].map((v) => (
                <g key={v}>
                  <line x1="0" y1={py(v)} x2={CH_W} y2={py(v)} stroke="var(--line)" strokeWidth="1" />
                  <text x={CH_W - 4} y={py(v) + 13} textAnchor="end" className="mono" fontSize="10" fill="var(--faint)">
                    {v === 0 ? "0" : "$" + v / 1000 + "k"}
                  </text>
                </g>
              ))}
              <path d={area} fill="url(#cgFill)" />
              <path d={line} fill="none" stroke="var(--credit)" strokeWidth="2.5" strokeLinejoin="round" />
              {/* the drop */}
              <line x1="418" y1={py(2887)} x2="418" y2={py(812)} stroke="var(--debit)" strokeWidth="2.5" />
              <circle cx="418" cy={py(812)} r="4.5" fill="var(--debit)" />
              <text x="432" y={py(2150)} className="mono" fontSize="11" fill="var(--debit)">
                6 JUN — SNOWFLAKE REVERTED
              </text>
              <text x="432" y={py(2150) + 15} className="mono" fontSize="13" fill="var(--debit)">
                −$2,075/mo
              </text>
              <text x="0" y={CH_H + 20} className="mono" fontSize="10" fill="var(--faint)">APR</text>
              <text x="480" y={CH_H + 20} className="mono" fontSize="10" fill="var(--faint)">JUN</text>
              <text x="960" y={CH_H + 20} className="mono" fontSize="10" fill="var(--faint)">SEP</text>
            </svg>
          </figure>
        </section>

        {/* the ledger */}
        <section className="flex flex-col gap-[10px]">
          <h2 className="mono text-[11px] tracking-[0.18em] uppercase" style={{ color: "var(--faint)" }}>
            Entries · money that moved
          </h2>
          <div className="rounded-[10px] border overflow-x-auto" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
            <div className="grid grid-cols-[92px_minmax(240px,1fr)_150px_120px_130px_130px] gap-[16px] px-[20px] py-[11px] border-b mono min-w-[900px] text-[10px] tracking-[0.14em] uppercase"
              style={{ borderColor: "var(--line)", color: "var(--faint)" }}>
              <span>Date</span><span>Entry</span><span>Owner</span><span>State</span>
              <span className="text-right">Amount</span><span className="text-right">Balance</span>
            </div>
            {ENTRIES.map((e, i) => (
              <div key={i} className="row grid grid-cols-[92px_minmax(240px,1fr)_150px_120px_130px_130px] gap-[16px] px-[20px] py-[13px] items-center min-w-[900px]"
                style={{ borderBottom: i < ENTRIES.length - 1 ? "1px solid var(--line)" : "none" }}>
                <span className="mono text-[12px]" style={{ color: "var(--dim)" }}>{fmtDate(e.date)}</span>
                <span className="flex flex-col gap-[1px] min-w-0">
                  <span className="text-[15px] truncate">{e.label}</span>
                  <span className="mono text-[11px]" style={{ color: "var(--faint)" }}>{e.service}</span>
                </span>
                <span className="text-[13px] truncate" style={{ color: "var(--dim)" }}>{e.owner}</span>
                <span className="mono text-[11px] tracking-[0.1em]" style={{ color: STATE_TONE[e.state] }}>{e.state}</span>
                <span className="mono text-[15px] text-right" style={{ color: e.amount === null ? "var(--faint)" : e.amount < 0 ? "var(--debit)" : "var(--credit)" }}>
                  {e.amount === null ? "—" : (e.amount < 0 ? "−" : "+") + usd(Math.abs(e.amount))}
                </span>
                <span className="mono text-[15px] text-right" style={{ color: "var(--text)" }}>{usd(e.balance)}</span>
              </div>
            ))}
          </div>
          <p className="text-[13px]" style={{ color: "var(--faint)" }}>
            An entry marked <span className="mono" style={{ color: "var(--faint)" }}>UNVERIFIED</span> has no comparable baseline, so it adds nothing to the balance. It is not a zero — it is unknown.
          </p>
        </section>

        {/* below the line */}
        <section className="flex flex-col gap-[10px] pb-[40px]">
          <div className="flex items-center justify-between gap-[16px]">
            <h2 className="mono text-[11px] tracking-[0.18em] uppercase" style={{ color: "var(--faint)" }}>
              Below the line · {usd(pendingTotal)} not counted
            </h2>
            <button onClick={() => setShowPending((v) => !v)} className="mono text-[11px] tracking-[0.1em] uppercase cursor-pointer"
              style={{ color: "var(--dim)" }} aria-expanded={showPending}>
              {showPending ? "Collapse" : "Expand"}
            </button>
          </div>
          {showPending && (
            <div className="rounded-[10px] border overflow-x-auto" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
              {pending.map((r, i) => (
                <div key={r.id} className="row grid grid-cols-[minmax(240px,1fr)_150px_120px_130px] gap-[16px] px-[20px] py-[12px] items-center min-w-[760px]"
                  style={{ borderBottom: i < pending.length - 1 ? "1px solid var(--line)" : "none" }}>
                  <span className="flex flex-col gap-[1px] min-w-0">
                    <span className="text-[15px] truncate">{r.title}</span>
                    <span className="mono text-[11px]" style={{ color: "var(--faint)" }}>{r.service} · {r.team}</span>
                  </span>
                  <span className="text-[13px] truncate" style={{ color: r.owner ? "var(--dim)" : "var(--pending)" }}>
                    {r.owner ?? "Unassigned"}
                  </span>
                  <span className="mono text-[11px] tracking-[0.1em]" style={{ color: r.regressed ? "var(--debit)" : "var(--faint)" }}>
                    {r.regressed ? "REVERTED" : r.status.toUpperCase()}
                  </span>
                  <span className="mono text-[15px] text-right" style={{ color: "var(--pending)" }}>{usd(r.projectedMonthlyUsd)}</span>
                </div>
              ))}
            </div>
          )}
          <p className="text-[13px] max-w-[70ch]" style={{ color: "var(--faint)" }}>
            These are projections. They join the balance above only once the bill agrees — which is the difference between a
            savings programme and a spreadsheet of intentions.
          </p>
        </section>
      </main>
    </div>
  );
}

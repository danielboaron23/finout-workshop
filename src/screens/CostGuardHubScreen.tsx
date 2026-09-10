"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { TopNav } from "@/components/navigation/TopNav";
import { PageTitleBar } from "@/components/navigation/PageTitleBar";
import { Tabs } from "@/components/navigation/Tabs";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { StatusBadge, type StatusBadgeVariant } from "@/components/ui/Badge";
import { TableShell, HeaderCell, Cell, CellText } from "@/components/table/Table";
import { EvidenceChart } from "@/components/costguard/EvidenceChart";
import { KpiCard, KpiTileDollar, KpiTileWavyCheck, KpiTileAnomaly } from "@/components/home/KpiCard";
import { SavingsCell } from "@/components/costguard/SavingsCell";
import {
  CG_ROWS, ageLabel, isOpen, isVerifying, verifyDaysLeft, usd, type CgRow,
} from "@/components/costguard/data";

/*
 * CostGuard — one hub, three stakeholder views.
 *
 * Reference: finout.io/costguard — "One Hub for Every Stakeholder" names
 * FinOps Teams, Engineering & Platform and Executives. Those are the same three
 * personas docs/prd/costguard-follow-through.md §2 arrived at from the data, so
 * the split is validated from both directions.
 *
 * The point is that these are not three filters. Each stakeholder is asking a
 * different question, so each view is a different information design over the
 * same rows:
 *   FinOps       — what is stuck, and who owns nothing?      (governance, a ledger)
 *   Engineering  — is this real, and what do I do?            (evidence, per team)
 *   Executive    — did the programme work?                    (one number, no table)
 *
 * Built entirely from the existing component inventory — no new components.
 */

const VARIANT: Record<string, StatusBadgeVariant> = {
  New: "new", "Working on it": "working", Done: "done", Dismissed: "dismissed",
};
const initials = (n: string) => n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const VIEWS = ["FinOps", "Engineering & Platform", "Executives"];
/* View and team live in the URL so Back returns to the previous view. */
const VIEW_SLUGS = ["finops", "engineering", "executives"];

function readHash() {
  if (typeof window === "undefined") return { view: 0, team: "Platform" };
  const h = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const v = VIEW_SLUGS.indexOf(h.get("view") ?? "");
  return { view: v >= 0 ? v : 0, team: h.get("team") || "Platform" };
}

export function CostGuardHubScreen() {
  const [view, setView] = useState(0);
  const [team, setTeam] = useState("Platform");

  useEffect(() => {
    const sync = () => { const st = readHash(); setView(st.view); setTeam(st.team); };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const push = useCallback((v: number, t: string) => {
    const q = new URLSearchParams();
    q.set("view", VIEW_SLUGS[v]);
    if (v === 1) q.set("team", t);
    window.history.pushState({ cgPushed: true }, "", "#" + q.toString());
  }, []);

  const selectView = (v: number) => { setView(v); push(v, team); };
  const selectTeam = (t: string) => { setTeam(t); push(view, t); };

  const open = CG_ROWS.filter(isOpen);
  const done = CG_ROWS.filter((r) => r.status === "Done" && !r.regressed);
  const regressed = CG_ROWS.filter((r) => r.regressed);

  const banked = done.reduce((s, r) => s + (r.realizedMonthlyUsd ?? 0), 0);
  const lost = regressed.reduce((s, r) => s + r.projectedMonthlyUsd, 0);
  const inProgress = CG_ROWS.filter((r) => r.status === "Working on it").reduce((s, r) => s + r.projectedMonthlyUsd, 0);
  const notStarted = CG_ROWS.filter((r) => r.status === "New").reduce((s, r) => s + r.projectedMonthlyUsd, 0);
  const identified = banked + lost + inProgress + notStarted;
  const rate = Math.round((banked / identified) * 100);
  const unowned = open.filter((r) => !r.owner).length;

  const teams = useMemo(() => [...new Set(CG_ROWS.map((r) => r.team))].sort(), []);
  const mine = open.filter((r) => r.team === team);

  return (
    <div className="bg-canvas flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="CostGuard" />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto bg-surface-primary">
        <TopNav compact />
        <PageTitleBar title="CostGuard" linkLabel="How recommendations are generated" />
        <Tabs
          items={[
            { label: VIEWS[0], count: open.length },
            { label: VIEWS[1], count: mine.length },
            { label: VIEWS[2] },
          ]}
          activeIndex={view}
          onTabChange={selectView}
        />

        <div className="flex flex-col gap-[24px] w-full px-[32px] py-[24px]">
          <p className="font-sans font-normal leading-[22px] text-[14px] text-text-secondary max-w-[80ch]">
            {view === 0 && "Governance view — every recommendation across every team, and what is stuck."}
            {view === 1 && "Delivery view — only your team's work, with the cost evidence behind each claim."}
            {view === 2 && "Programme view — did the money we found actually reach the bill?"}
          </p>

          {/* ───────────── FinOps: the governance ledger ───────────── */}
          {view === 0 && (
            <>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[16px] w-full">
                <KpiCard
                  title="Banked savings" caption={<span>Verified against the bill</span>}
                  icon={<KpiTileWavyCheck />} value={usd(banked) + " /mo"}
                  footer={
                    <div className="flex flex-col gap-[6px] w-full pt-[4px]">
                      <div className="bg-canvas h-[6px] rounded-full w-full overflow-hidden">
                        <div className="bg-success-500 h-full rounded-full" style={{ width: Math.max(rate, 1.5) + "%" }} />
                      </div>
                      <p className="font-sans font-normal leading-[20px] text-[13px] text-text-secondary">
                        <span className="font-medium text-text-primary">{rate}%</span> of the {usd(identified)} we identified
                      </p>
                    </div>
                  }
                />
                <KpiCard
                  title="Waiting to be banked" caption={<span>Found, not yet on the bill</span>}
                  icon={<KpiTileDollar />} value={usd(inProgress + notStarted + lost) + " /mo"}
                  footer={
                    <p className="font-sans font-normal leading-[20px] text-[13px] text-text-secondary pt-[4px]">
                      {open.length} recommendations
                      {unowned > 0 && <> · <span className="font-medium text-text-primary">{unowned} with no owner</span></>}
                    </p>
                  }
                />
                <KpiCard
                  title="Lost to regression" caption={<span>Banked, then it came back</span>}
                  icon={<KpiTileAnomaly />} value={usd(lost) + " /mo"} tone="danger"
                  footer={
                    <p className="font-sans font-normal leading-[20px] text-[13px] text-text-secondary pt-[4px]">
                      {regressed[0]?.service} — reverted{" "}
                      <span className="font-medium text-text-primary">{ageLabel(regressed[0]?.regressedAt ?? "")} ago</span>
                    </p>
                  }
                />
              </div>
              <LedgerTable rows={[...regressed, ...open.filter((r) => !r.regressed)]} />
            </>
          )}

          {/* ───────────── Engineering: is it real, and what do I do? ───────────── */}
          {view === 1 && (
            <>
              <div className="flex items-center gap-[12px] flex-wrap">
                <Dropdown trigger={() => <Select label={team} width={180} />}>
                  {(close) => (
                    <>
                      {teams.map((t) => (
                        <DropdownItem key={t} selected={t === team} onClick={() => { selectTeam(t); close(); }}>{t}</DropdownItem>
                      ))}
                    </>
                  )}
                </Dropdown>
                <p className="font-sans font-normal leading-[20px] text-[14px] text-text-secondary">
                  {mine.length} open · {usd(mine.reduce((s, r) => s + r.projectedMonthlyUsd, 0))}/mo at stake
                </p>
              </div>

              {mine.length === 0 ? (
                <div className="bg-surface-primary border border-solid border-border-light flex flex-col gap-[8px] px-[32px] py-[40px] rounded-[10px]">
                  <p className="font-sans font-medium leading-[26px] text-[18px] text-text-primary">Nothing open for {team}</p>
                  <p className="font-sans font-normal leading-[22px] text-[15px] text-text-secondary">
                    The last scan found no outstanding work for this team.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-[16px]">
                  {mine.map((r) => (
                    <article key={r.id} className="bg-surface-primary border border-solid border-border-light flex flex-col gap-[16px] px-[24px] py-[20px] rounded-[10px]">
                      <div className="flex items-start justify-between gap-[16px] flex-wrap">
                        <div className="flex flex-col gap-[4px] min-w-0">
                          <p className="font-sans font-normal leading-[18px] text-[12px] text-text-tertiary">
                            {r.service} · {r.provider} · {r.type}
                          </p>
                          <h3 className="font-sans font-medium leading-[26px] text-[18px] text-text-primary">{r.title}</h3>
                        </div>
                        <div className="flex items-center gap-[12px]">
                          <StatusBadge label={r.regressed ? "Regressed" : r.status} variant={r.regressed ? "regressed" : VARIANT[r.status]} />
                          <span className="font-sans font-bold leading-[26px] text-[19px] text-text-primary whitespace-nowrap">
                            {usd(r.projectedMonthlyUsd)}<span className="font-normal text-[14px] text-text-tertiary"> /mo</span>
                          </span>
                        </div>
                      </div>
                      <p className="font-sans font-normal leading-[22px] text-[15px] text-text-secondary max-w-[76ch]">{r.why}</p>
                      <div className="max-w-[660px] w-full">
                        <EvidenceChart slug={r.serviceSlug} markers={r.markers} />
                      </div>
                      <div className="flex items-center justify-between gap-[16px] flex-wrap">
                        <span className="flex items-center gap-[8px]">
                          {r.owner ? <Avatar initials={initials(r.owner)} /> : null}
                          <span className="font-sans font-normal leading-[20px] text-[14px] text-text-secondary">
                            {r.owner ?? "Unassigned"} · open {ageLabel(r.createdAt)}
                          </span>
                        </span>
                        <Link href="/costguard" className="font-sans font-medium leading-[20px] text-[14px] text-text-link hover:underline">
                          Open in the ledger →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ───────────── Executive: one number, no table ───────────── */}
          {view === 2 && (
            <div className="flex flex-col gap-[28px] max-w-[1000px]">
              <div className="flex flex-col gap-[6px]">
                <p className="font-sans font-normal leading-[20px] text-[13px] text-text-tertiary uppercase tracking-[0.1em]">
                  Realized savings, verified against the bill
                </p>
                <p className="font-sans font-bold leading-[1] text-[64px] text-text-primary tracking-[-0.03em]">
                  {usd(banked)}<span className="text-[24px] font-normal text-text-tertiary"> /mo</span>
                </p>
                <p className="font-sans font-normal leading-[24px] text-[17px] text-text-secondary">
                  We identified {usd(identified)} of savings this period and kept{" "}
                  <span className="font-medium text-text-primary">{rate}%</span> of it.
                </p>
              </div>

              {/* where the money actually went — the whole programme in one bar */}
              <div className="flex flex-col gap-[12px]">
                <div className="flex h-[44px] rounded-[8px] overflow-hidden w-full">
                  <div className="bg-success-500 h-full" style={{ width: (banked / identified) * 100 + "%" }} title="Banked" />
                  <div className="bg-red-400 h-full" style={{ width: (lost / identified) * 100 + "%" }} title="Lost to regression" />
                  <div className="bg-blue-300 h-full" style={{ width: (inProgress / identified) * 100 + "%" }} title="In progress" />
                  <div className="bg-neutral-100 h-full" style={{ width: (notStarted / identified) * 100 + "%" }} title="Not started" />
                </div>
                <div className="flex flex-wrap gap-x-[28px] gap-y-[8px]">
                  {[
                    { c: "bg-success-500", l: "Banked", v: banked },
                    { c: "bg-red-400", l: "Lost to regression", v: lost },
                    { c: "bg-blue-300", l: "In progress", v: inProgress },
                    { c: "bg-neutral-100", l: "Not started", v: notStarted },
                  ].map((seg) => (
                    <span key={seg.l} className="flex items-center gap-[8px]">
                      <span className={`${seg.c} rounded-[3px] size-[10px]`} aria-hidden="true" />
                      <span className="font-sans font-normal leading-[20px] text-[14px] text-text-secondary">
                        {seg.l} <span className="font-medium text-text-primary">{usd(seg.v)}</span>
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[16px]">
                {[
                  { t: "Realization rate", v: rate + "%", s: "of everything we found" },
                  { t: "Accountability gap", v: String(unowned), s: "open items with no named owner" },
                  { t: "Savings that decayed", v: usd(lost) + " /mo", s: "banked, then quietly reverted" },
                ].map((k) => (
                  <div key={k.t} className="bg-surface-primary border border-solid border-border-light flex flex-col gap-[4px] px-[20px] py-[18px] rounded-[10px]">
                    <p className="font-sans font-normal leading-[20px] text-[13px] text-text-tertiary">{k.t}</p>
                    <p className="font-sans font-bold leading-[32px] text-[26px] text-text-primary">{k.v}</p>
                    <p className="font-sans font-normal leading-[20px] text-[13px] text-text-secondary">{k.s}</p>
                  </div>
                ))}
              </div>

              <p className="font-sans font-normal leading-[24px] text-[15px] text-text-secondary border-l-2 border-solid border-border-primary pl-[16px] max-w-[76ch]">
                The programme is finding far more than it banks. The largest single loss this period was not a
                missed opportunity — it was a saving we had already made and stopped watching.
              </p>

              <div className="flex gap-[10px]">
                <Button variant="secondary">Export for the board</Button>
                <Link href="/costguard"><Button variant="tertiary">See the ledger</Button></Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Compact ledger — the governance table, reusing the shared table primitives. */
function LedgerTable({ rows }: { rows: CgRow[] }) {
  const tint = (r: CgRow) => (r.regressed ? "bg-red-50" : "");
  return (
    <TableShell>
      <div className="flex flex-col items-start flex-1 min-w-[280px]">
        <HeaderCell label="Recommendation" />
        {rows.map((r) => (
          <Cell key={r.id} className={tint(r)}>
            <div className="flex flex-col gap-[1px] min-w-0">
              <p className="font-sans font-medium leading-[22px] text-[16px] text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">{r.title}</p>
              <p className="font-sans font-normal leading-[18px] text-[13px] text-text-tertiary whitespace-nowrap">{r.service} · {r.type}</p>
            </div>
          </Cell>
        ))}
      </div>
      <div className="flex flex-col items-start w-[150px] shrink-0">
        <HeaderCell label="Team" />
        {rows.map((r) => <Cell key={r.id} className={tint(r)}><CellText>{r.team}</CellText></Cell>)}
      </div>
      <div className="flex flex-col items-start w-[180px] shrink-0">
        <HeaderCell label="Owner" />
        {rows.map((r) => (
          <Cell key={r.id} className={tint(r)}>
            {r.owner ? (
              <span className="flex items-center gap-[8px] min-w-0">
                <Avatar initials={initials(r.owner)} />
                <span className="font-sans font-normal leading-[20px] text-[14px] text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">{r.owner}</span>
              </span>
            ) : (
              <span className="font-sans font-medium leading-[20px] text-[14px] text-red-800 whitespace-nowrap">Unassigned</span>
            )}
          </Cell>
        ))}
      </div>
      <div className="flex flex-col items-start w-[230px] shrink-0">
        <HeaderCell label="Savings" />
        {rows.map((r) => (
          <Cell key={r.id} className={tint(r)}>
            <SavingsCell
              projected={r.projectedMonthlyUsd} realized={r.realizedMonthlyUsd}
              status={r.status} regressed={r.regressed}
              verifying={isVerifying(r)} daysLeft={verifyDaysLeft(r)}
            />
          </Cell>
        ))}
      </div>
      <div className="flex flex-col items-start w-[160px] shrink-0">
        <HeaderCell label="Status" />
        {rows.map((r) => (
          <Cell key={r.id} className={tint(r)}>
            <StatusBadge label={r.regressed ? "Regressed" : r.status} variant={r.regressed ? "regressed" : VARIANT[r.status]} />
          </Cell>
        ))}
      </div>
      <div className="flex flex-col items-start w-[110px] shrink-0">
        <HeaderCell label="Age" />
        {rows.map((r) => <Cell key={r.id} className={tint(r)}><CellText>{ageLabel(r.regressedAt ?? r.createdAt)}</CellText></Cell>)}
      </div>
    </TableShell>
  );
}

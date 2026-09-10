"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { TopNav } from "@/components/navigation/TopNav";
import { PageTitleBar } from "@/components/navigation/PageTitleBar";
import { Tabs } from "@/components/navigation/Tabs";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { SearchInput } from "@/components/ui/Input";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge, type StatusBadgeVariant } from "@/components/ui/Badge";
import { TableShell, HeaderCell, Cell, CellText, CheckboxCell, MenuCell } from "@/components/table/Table";
import { KpiCard, KpiTileDollar, KpiTileWavyCheck, KpiTileAnomaly } from "@/components/home/KpiCard";
import { SavingsCell } from "@/components/costguard/SavingsCell";
import { DetailDrawer } from "@/components/costguard/DetailDrawer";
import { showToast } from "@/components/ui/Toast";
import { BulkActionBar } from "@/components/costguard/BulkActionBar";
import {
  CG_ROWS, CG_EVENTS, CG_CHECKS, CG_TODAY, ageLabel, isOpen, isVerifying, verifyDaysLeft, usd,
  type CgRow, type CgEvent,
} from "@/components/costguard/data";

/*
 * Screen: CostGuard — the recommendation ledger.
 * Brief: docs/prd/costguard-follow-through.md §9
 * Research: docs/research/costguard-follow-through/study.md
 *
 * Two open decisions from the research, resolved here:
 *  - Flat list with counts in the tabs, NOT collapsible status groups, so a
 *    regressed item can never be hidden inside a collapsed section.
 *  - Projected and realized share one composite cell so it can render the
 *    third outcome, "Not verifiable", which is a verdict rather than a number.
 */

const TABS = ["All", "Needs attention", "Done", "Dismissed"] as const;
/* Tab and open recommendation live in the URL: Back steps through them instead
 * of leaving the screen, and any view can be linked to. */
const TAB_SLUGS = ["all", "needs", "done", "dismissed"];

function readHash() {
  if (typeof window === "undefined") return { tab: 1, rec: null as string | null };
  const h = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const t = TAB_SLUGS.indexOf(h.get("tab") ?? "");
  return { tab: t >= 0 ? t : 1, rec: h.get("rec") };
}

const STATUS_VARIANT: Record<string, StatusBadgeVariant> = {
  New: "new",
  "Working on it": "working",
  Done: "done",
  Dismissed: "dismissed",
};

const initials = (name: string) =>
  name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

function FilterDropdown({
  label,
  value,
  options,
  onSelect,
  width = 150,
}: {
  label: string;
  value: string | null;
  options: string[];
  onSelect: (v: string | null) => void;
  width?: number;
}) {
  return (
    <Dropdown trigger={() => <Select label={value ?? label} width={width} />}>
      {(close) => (
        <>
          <DropdownItem selected={value === null} onClick={() => { onSelect(null); close(); }}>
            All {label.toLowerCase()}
          </DropdownItem>
          {options.map((o) => (
            <DropdownItem key={o} selected={value === o} onClick={() => { onSelect(value === o ? null : o); close(); }}>
              {o}
            </DropdownItem>
          ))}
        </>
      )}
    </Dropdown>
  );
}

export function CostGuardScreen() {
  /* Live prototype state. Every transition is optimistic and undoable — the
     lifecycle is documented in components/costguard/data.ts. */
  const [rows, setRows] = useState<CgRow[]>(CG_ROWS);
  const [events, setEvents] = useState<Record<string, CgEvent[]>>(CG_EVENTS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [tab, setTab] = useState(1);

  // keep the URL and the view in step, in both directions
  useEffect(() => {
    const sync = () => { const st = readHash(); setTab(st.tab); setOpenId(st.rec); };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const push = useCallback((nextTab: number, nextRec: string | null) => {
    const q = new URLSearchParams();
    q.set("tab", TAB_SLUGS[nextTab]);
    if (nextRec) q.set("rec", nextRec);
    window.history.pushState({ cgPushed: true }, "", "#" + q.toString());
  }, []);

  const selectTab = (i: number) => { setTab(i); setSelected([]); setOpenId(null); push(i, null); };
  const openRec = (id: string) => { setOpenId(id); push(tab, id); };
  const closeRec = () => {
    // Back and the close button must agree; a deep link has nothing to go back to
    if (window.history.state?.cgPushed) window.history.back();
    else { setOpenId(null); window.history.replaceState(null, "", "#tab=" + TAB_SLUGS[tab]); }
  };
  const [team, setTeam] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [owner, setOwner] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  /** apply a transition, log it, and offer an undo */
  const apply = (ids: string[], change: (r: CgRow) => CgRow, toast: string, logged: string) => {
    const prevRows = rows, prevEvents = events;
    setRows((rs) => rs.map((r) => (ids.includes(r.id) ? change(r) : r)));
    setEvents((ev) => {
      const next = { ...ev };
      ids.forEach((id) => {
        next[id] = [...(next[id] ?? []), { at: CG_TODAY, who: "You", what: logged, kind: "person" as const }];
      });
      return next;
    });
    showToast(toast, { undo: () => { setRows(prevRows); setEvents(prevEvents); } });
  };

  const assign2 = (ids: string[], owner: string) =>
    apply(ids, (r) => ({ ...r, owner }), ids.length > 1 ? `${ids.length} assigned to ${owner}` : `Assigned to ${owner}`, `Assigned to ${owner}`);
  const assign = (id: string, owner: string) =>
    apply([id], (r) => ({ ...r, owner }), `Assigned to ${owner}`, `Assigned to ${owner}`);
  const start = (id: string) =>
    apply([id], (r) => ({ ...r, status: "Working on it" }), "Moved to Working on it", "Moved to Working on it");
  const complete = (id: string) =>
    apply([id], (r) => ({ ...r, status: "Done", doneAt: CG_TODAY, realizedMonthlyUsd: null }),
      "Marked done — verification starts now", "Marked done — 14-day verification started");
  const dismiss = (ids: string[], reason: string) =>
    apply(ids, (r) => ({ ...r, status: "Dismissed", dismissReason: reason }),
      ids.length > 1 ? `${ids.length} dismissed` : "Dismissed", `Dismissed — ${reason}`);
  const reopen = (id: string) =>
    apply([id], (r) => ({ ...r, status: "Working on it", regressed: false, realizedMonthlyUsd: null }),
      "Reopened", "Reopened for a fix");
  const restore = (id: string) =>
    apply([id], (r) => ({ ...r, status: "New", dismissReason: undefined }), "Restored to the ledger", "Restored to the ledger");

  const rescan = () => {
    setScanning(true);
    showToast("Scanning 19 services…");
    window.setTimeout(() => {
      setScanning(false);
      showToast("Scan complete — no new recommendations");
    }, 1600);
  };

  const teams = useMemo(() => [...new Set(rows.map((r) => r.team))].sort(), [rows]);
  const providers = useMemo(() => [...new Set(rows.map((r) => r.provider))].sort(), [rows]);
  const owners = useMemo(() => ["Unassigned", ...new Set(rows.map((r) => r.owner).filter(Boolean) as string[])], [rows]);

  const openRows = rows.filter(isOpen);
  const doneRows = rows.filter((r) => r.status === "Done" && !r.regressed);
  const dismissedRows = rows.filter((r) => r.status === "Dismissed");
  const regressed = rows.filter((r) => r.regressed);

  const openPotential = openRows.reduce((s, r) => s + r.projectedMonthlyUsd, 0);
  const regressedTotal = regressed.reduce((s, r) => s + r.projectedMonthlyUsd, 0);
  const unowned = rows.filter((r) => isOpen(r) && !r.owner).length;

  const realizedTotal = doneRows.reduce((s, r) => s + (r.realizedMonthlyUsd ?? 0), 0);

  const base = tab === 0 ? rows : tab === 1 ? openRows : tab === 2 ? doneRows : dismissedRows;

  const visible = base
    .slice()
    // a saving that came back outranks one nobody has started
    .sort((a, b) => Number(!!b.regressed) - Number(!!a.regressed) || b.projectedMonthlyUsd - a.projectedMonthlyUsd)
    .filter((r) => {
    if (team && r.team !== team) return false;
    if (provider && r.provider !== provider) return false;
    if (owner === "Unassigned" && r.owner) return false;
    if (owner && owner !== "Unassigned" && r.owner !== owner) return false;
    if (search && !(r.title + " " + r.service).toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

  /** regressed visible carry a tint through every column of the row */
  const rowTint = (r: CgRow) => (r.regressed ? "bg-red-50" : "");

  // only count selections still visible in this view — a bar reading "2 selected"
  // above an empty list is a lie about what an action would apply to
  const openRow = rows.find((r) => r.id === openId) ?? null;
  const selectedRows = visible.filter((r) => selected.includes(r.id));
  const selectedTotal = selectedRows.reduce((s, r) => s + r.projectedMonthlyUsd, 0);
  const toggle = (id: string) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  // Money we found vs money we kept. The ratio is the point of the screen.
  const identified = openPotential + realizedTotal;
  const realizationPct = identified === 0 ? 0 : Math.round((realizedTotal / identified) * 100);

  const kpiCards = [
    {
      title: "Banked savings",
      caption: <span>Verified against the bill</span>,
      icon: <KpiTileWavyCheck />,
      value: usd(realizedTotal) + " /mo",
      footer: (
        <div className="flex flex-col gap-[6px] w-full pt-[4px]">
          <div className="bg-canvas h-[6px] rounded-full w-full overflow-hidden">
            <div
              className="bg-success-500 h-full rounded-full"
              style={{ width: Math.max(realizationPct, 1.5) + "%" }}
            />
          </div>
          <p className="font-sans font-normal leading-[20px] text-[13px] text-text-secondary">
            <span className="font-medium text-text-primary">{realizationPct}%</span> of the {usd(identified)} we identified
          </p>
        </div>
      ),
    },
    {
      title: "Waiting to be banked",
      caption: <span>Found, not yet on the bill</span>,
      icon: <KpiTileDollar />,
      value: usd(openPotential) + " /mo",
      footer: (
        <p className="font-sans font-normal leading-[20px] text-[13px] text-text-secondary pt-[4px]">
          {openRows.length} recommendations
          {unowned > 0 && (
            <>
              {" · "}
              <span className="font-medium text-text-primary">{unowned} with no owner</span>
            </>
          )}
        </p>
      ),
    },
    {
      title: "Lost to regression",
      caption: <span>Banked, then it came back</span>,
      icon: <KpiTileAnomaly />,
      value: usd(regressedTotal) + " /mo",
      tone: "danger" as const,
      footer: (
        <p className="font-sans font-normal leading-[20px] text-[13px] text-text-secondary pt-[4px]">
          {regressed.length === 1 && regressed[0].regressedAt ? (
            <>
              {regressed[0].service} — reverted{" "}
              <span className="font-medium text-text-primary">{ageLabel(regressed[0].regressedAt)} ago</span>
            </>
          ) : (
            <>{regressed.length} savings reverted</>
          )}
        </p>
      ),
    },
  ];

  return (
    <div className="bg-canvas flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="CostGuard" />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto bg-surface-primary">
        <TopNav compact />
        <PageTitleBar title="CostGuard" linkLabel="How recommendations are generated" />
        <Tabs
          items={[
            { label: TABS[0], count: CG_ROWS.length },
            { label: TABS[1], count: openRows.length },
            { label: TABS[2], count: doneRows.length },
            { label: TABS[3], count: dismissedRows.length },
          ]}
          activeIndex={tab}
          onTabChange={selectTab}
        />

        <div className="flex flex-col gap-[24px] w-full px-[32px] py-[24px]">
          {/* KPI row — equal-width cards, one shared title size */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[16px] w-full">
            {kpiCards.map((c) => (
              <KpiCard key={c.title} {...c} />
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between gap-[16px] flex-wrap w-full">
            <div className="flex gap-[8px] items-center flex-wrap">
              <FilterDropdown label="Provider" value={provider} options={providers} onSelect={setProvider} />
              <FilterDropdown label="Team" value={team} options={teams} onSelect={setTeam} />
              <FilterDropdown label="Owner" value={owner} options={owners} onSelect={setOwner} width={170} />
              <SearchInput placeholder="Search recommendations" value={search} onChange={setSearch} width={300} />
            </div>
            <div className="flex items-center gap-[12px]">
              <p className="font-sans font-normal leading-[20px] text-[14px] text-text-tertiary whitespace-nowrap">
                {scanning ? "Scanning 19 services…" : "Last scan 2 hours ago"}
              </p>
              <Button variant="tertiary" onClick={rescan} disabled={scanning}>
                {scanning ? "Scanning…" : "Re-run scan"}
              </Button>
            </div>
          </div>

          {selectedRows.length > 0 && (
            <BulkActionBar
              count={selectedRows.length}
              totalUsd={selectedTotal}
              onAssign={(o) => { assign2(selectedRows.map((r) => r.id), o); setSelected([]); }}
              onDismiss={(reason) => { dismiss(selectedRows.map((r) => r.id), reason); setSelected([]); }}
              onClear={() => setSelected([])}
            />
          )}

          {visible.length === 0 ? (
            <EmptyState realized={realizedTotal} />
          ) : (
            <TableShell>
              <div className="flex flex-col items-start w-[48px] shrink-0">
                <CheckboxCell
                  header
                  checked={visible.length > 0 && visible.every((r) => selected.includes(r.id))}
                  onChange={(c) => setSelected(c ? visible.map((r) => r.id) : [])}
                />
                {visible.map((r) => (
                  <div key={r.id} className={rowTint(r)}>
                    <CheckboxCell checked={selected.includes(r.id)} onChange={() => toggle(r.id)} />
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-start flex-1 min-w-[300px]">
                <HeaderCell label="Recommendation" />
                {visible.map((r) => (
                  <Cell key={r.id} className={rowTint(r)}>
                    <button
                      onClick={() => openRec(r.id)}
                      className="flex flex-col gap-[1px] min-w-0 text-left cursor-pointer w-full"
                      aria-label={`Open ${r.title}`}
                    >
                      <span className="font-sans font-medium leading-[22px] text-[16px] text-text-primary overflow-hidden text-ellipsis whitespace-nowrap hover:underline">
                        {r.title}
                      </span>
                      <span className="font-sans font-normal leading-[18px] text-[13px] text-text-tertiary whitespace-nowrap">
                        {r.service} · {r.type}
                      </span>
                    </button>
                  </Cell>
                ))}
              </div>

              <div className="flex flex-col items-start w-[150px] shrink-0">
                <HeaderCell label="Team" />
                {visible.map((r) => (
                  <Cell key={r.id} className={rowTint(r)}><CellText>{r.team}</CellText></Cell>
                ))}
              </div>

              <div className="flex flex-col items-start w-[180px] shrink-0">
                <HeaderCell label="Owner" />
                {visible.map((r) => (
                  <Cell key={r.id} className={rowTint(r)}>
                    {r.owner ? (
                      <span className="flex items-center gap-[8px] min-w-0">
                        <Avatar initials={initials(r.owner)} />
                        <span className="font-sans font-normal leading-[20px] text-[14px] text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                          {r.owner}
                        </span>
                      </span>
                    ) : (
                      <button
                        onClick={() => openRec(r.id)}
                        className="font-sans font-medium leading-[20px] text-[14px] text-text-link cursor-pointer whitespace-nowrap hover:underline"
                      >
                        Assign owner
                      </button>
                    )}
                  </Cell>
                ))}
              </div>

              <div className="flex flex-col items-start w-[230px] shrink-0">
                <HeaderCell label="Savings" />
                {visible.map((r) => (
                  <Cell key={r.id} className={rowTint(r)}>
                    <SavingsCell
                      projected={r.projectedMonthlyUsd}
                      realized={r.realizedMonthlyUsd}
                      status={r.status}
                      regressed={r.regressed}
                      verifying={isVerifying(r)}
                      daysLeft={verifyDaysLeft(r)}
                    />
                  </Cell>
                ))}
              </div>

              <div className="flex flex-col items-start w-[160px] shrink-0">
                <HeaderCell label="Status" />
                {visible.map((r) => (
                  <Cell key={r.id} className={rowTint(r)}>
                    <StatusBadge
                      label={r.regressed ? "Regressed" : r.status}
                      variant={r.regressed ? "regressed" : STATUS_VARIANT[r.status]}
                    />
                  </Cell>
                ))}
              </div>

              <div className="flex flex-col items-start w-[110px] shrink-0">
                <HeaderCell label="Age" />
                {visible.map((r) => (
                  <Cell key={r.id} className={rowTint(r)}>
                    <CellText>{ageLabel(r.regressedAt ?? r.createdAt)}</CellText>
                  </Cell>
                ))}
              </div>

              <div className="flex flex-col items-start w-[56px] shrink-0">
                <HeaderCell />
                {visible.map((r) => (
                  <div key={r.id} className={rowTint(r)}>
                    <MenuCell />
                  </div>
                ))}
              </div>
            </TableShell>
          )}
        </div>
      </div>

      {openRow && (
        <DetailDrawer
          row={openRow}
          events={events[openRow.id] ?? []}
          onClose={closeRec}
          onAssign={(o) => assign(openRow.id, o)}
          onStart={() => start(openRow.id)}
          onDone={() => complete(openRow.id)}
          onDismiss={(reason) => dismiss([openRow.id], reason)}
          onReopen={() => reopen(openRow.id)}
          onRestore={() => restore(openRow.id)}
        />
      )}
    </div>
  );
}

/* Empty state — COMPOSE. Nothing to fix is a result, not a blank screen: name
 * every check that ran, and show what has already been banked. */
function EmptyState({ realized }: { realized: number }) {
  return (
    <div className="bg-surface-primary border border-solid border-border-light flex flex-col gap-[20px] items-start px-[32px] py-[40px] rounded-[10px] w-full">
      <div className="flex flex-col gap-[6px]">
        <p className="font-sans font-medium leading-[26px] text-[18px] text-text-primary">
          Nothing to fix here
        </p>
        <p className="font-sans font-normal leading-[22px] text-[15px] text-text-secondary max-w-[62ch]">
          The last scan ran 2 hours ago and found no open recommendations matching this view.
          You have banked {usd(realized)} per month so far.
        </p>
      </div>
      <div className="flex flex-col gap-[8px] w-full">
        <p className="font-sans font-medium leading-[20px] text-[13px] text-text-tertiary uppercase tracking-[0.08em]">
          What we checked
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-[32px] gap-y-[6px] w-full">
          {CG_CHECKS.map((c) => (
            <p key={c} className="font-sans font-normal leading-[22px] text-[14px] text-text-secondary">
              <span className="text-success-700">✓</span> {c}
            </p>
          ))}
        </div>
      </div>
      <Button variant="tertiary">Re-run scan</Button>
    </div>
  );
}

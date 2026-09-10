"use client";

import { useDemoStore, setDemo } from "@/lib/demo-store";
import {
  AL_TEAMS, AL_MONTHS, AL_MONTH_LABELS, AL_PARTIAL_MONTH, AL_BUDGET,
  AL_DIRECT, AL_POOL_TODAY, AL_SHARED_SERVICES, type AlTeam,
} from "./allocation-data";

/*
 * Settings — the FinOps control room.
 * Brief: the settings that change the numbers, not the org admin console.
 *
 * The organising idea: a setting here rewrites figures that have already been
 * reported. So every number-changing setting carries three things a normal
 * settings row does not — the scope it affects, the date it takes effect from
 * (with closed periods locked), and who last changed it and why.
 */

export const SETTINGS_TODAY = "2026-09-06"; // same clock as costguard/data.ts

export const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
export const signedUsd = (n: number) =>
  (n > 0 ? "+" : n < 0 ? "−" : "") + "$" + Math.round(Math.abs(n)).toLocaleString("en-US");

/* ------------------------------- The rail -------------------------------- */

export type SectionId =
  | "overview" | "cost-model" | "allocation" | "budgets" | "alerts" | "access"
  | "preferences" | "notifications";

export type Section = {
  id: SectionId;
  label: string;
  scope: "organisation" | "personal";
  /** Marks a section whose settings rewrite figures across the product. */
  rewrites?: boolean;
  blurb: string;
};

/* Ordered by blast radius, not by org chart. Cost model is first because a
 * change there moves every number on every other screen. */
export const SECTIONS: Section[] = [
  { id: "overview", label: "Overview", scope: "organisation",
    blurb: "What is set, what has been changed, and what it affects." },
  { id: "cost-model", label: "Cost model", scope: "organisation", rewrites: true,
    blurb: "How spend is measured and split before anyone sees it." },
  { id: "allocation", label: "Allocation & tagging", scope: "organisation", rewrites: true,
    blurb: "The rules that decide whose spend this is." },
  { id: "budgets", label: "Budgets & thresholds", scope: "organisation",
    blurb: "What counts as over, and what is worth surfacing." },
  { id: "alerts", label: "Alerts & destinations", scope: "organisation",
    blurb: "Where Finout sends things. Triggers stay on the object that fires them." },
  { id: "access", label: "Access & teams", scope: "organisation",
    blurb: "Who can see and change what." },
  { id: "preferences", label: "Preferences", scope: "personal",
    blurb: "How Finout looks and opens for you. Nobody else is affected." },
  { id: "notifications", label: "My notifications", scope: "personal",
    blurb: "What reaches you, and where." },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);
export const isSectionId = (v: string): v is SectionId =>
  (SECTION_IDS as string[]).includes(v);

/* ----------------------------- Closed periods ----------------------------
 * The concept the whole screen turns on, and the one thing no competitor has.
 * A period that has been reported to finance cannot be silently rewritten.
 * NOTE: no period-close exists in workshop-data/schema.sql. This is new data
 * and the PRD must declare it as such. */

export type Period = {
  month: string;
  label: string;
  closed: boolean;
  /** Set only when closed — the day the number left the building. */
  reportedOn?: string;
  note?: string;
};

export const PERIODS: Period[] = [
  { month: "2026-03", label: "March 2026",  closed: true,  reportedOn: "2026-04-04" },
  { month: "2026-04", label: "April 2026",  closed: true,  reportedOn: "2026-05-05" },
  { month: "2026-05", label: "May 2026",    closed: true,  reportedOn: "2026-06-04" },
  { month: "2026-06", label: "June 2026",   closed: true,  reportedOn: "2026-07-06" },
  { month: "2026-07", label: "July 2026",   closed: true,  reportedOn: "2026-08-04" },
  { month: "2026-08", label: "August 2026", closed: false, note: "Still reconciling — data ends 26 August" },
];

export const CLOSED_PERIODS = PERIODS.filter((p) => p.closed);
export const OPEN_PERIOD = PERIODS.find((p) => !p.closed)!;

/** How far back a change is allowed to reach. */
export type EffectiveFrom = "forward" | "open" | "all";

export const EFFECTIVE_OPTIONS: { id: EffectiveFrom; label: string; detail: string }[] = [
  { id: "forward", label: "Forward only, from 1 September",
    detail: "History is left exactly as reported. Charts will show a seam." },
  { id: "open", label: `Back to the open period (${OPEN_PERIOD.label})`,
    detail: "Recalculates the month still being reconciled. Nothing already reported moves." },
  { id: "all", label: "All history, back to March 2026",
    detail: `Restates ${CLOSED_PERIODS.length} closed periods. Numbers already sent to finance will change.` },
];

/** Which closed periods a given effective choice would rewrite. */
export function periodsRestated(from: EffectiveFrom): Period[] {
  return from === "all" ? CLOSED_PERIODS : [];
}

/* ------------------------- The cost-model settings ------------------------ */

export type AllocationMethod = "direct" | "even" | "proportional";
export type CostType = "unblended" | "amortized" | "net";

export const ALLOCATION_OPTIONS: { id: AllocationMethod; label: string; detail: string }[] = [
  { id: "direct", label: "Direct only",
    detail: "Shared infrastructure stays on whoever the provider billed. Today's behaviour." },
  { id: "even", label: "Even split across teams",
    detail: "The shared pool is divided equally between all six teams." },
  { id: "proportional", label: "Proportional to direct spend",
    detail: "The shared pool follows each team's own footprint. Bigger teams absorb more." },
];

export const COST_TYPE_OPTIONS: { id: CostType; label: string; detail: string }[] = [
  { id: "unblended", label: "Unblended", detail: "What the provider charged, on the day they charged it." },
  { id: "amortized", label: "Amortized", detail: "Upfront commitment fees spread across the term they cover." },
  { id: "net", label: "Net", detail: "After negotiated discounts and credits are applied." },
];

export const FISCAL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export type SettingsState = {
  allocationMethod: AllocationMethod;
  costType: CostType;
  fiscalYearStart: number; // 0-11
  showDiscounts: boolean;
  effectiveFrom: EffectiveFrom;
};

export const DEFAULT_SETTINGS: SettingsState = {
  allocationMethod: "direct",
  costType: "unblended",
  fiscalYearStart: 0,
  showDiscounts: false,
  effectiveFrom: "open",
};

/* ------------------------------- Provenance ------------------------------
 * D4: an inline line, not an audit log. It reuses the change-note idea real
 * Finout already collects on a Virtual Tag (280 characters, optional). */

export type Provenance = { by: string; on: string; note?: string };

export const PROVENANCE: Partial<Record<keyof SettingsState, Provenance>> = {
  costType: { by: "Noa Peretz", on: "2026-04-02", note: "Set at onboarding — matches how finance books cloud spend" },
  fiscalYearStart: { by: "Noa Peretz", on: "2026-04-02" },
  allocationMethod: { by: "Amit Shani", on: "2026-06-11", note: "Left on direct pending a decision on who owns the k8s clusters" },
};

export const dateLabel = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });

/* --------------------------- The allocation math -------------------------
 * All of this is arithmetic over real cost_events dollars. Nothing is
 * modelled, estimated or scaled. */

const monthIndex = (month: string) => AL_MONTHS.indexOf(month as (typeof AL_MONTHS)[number]);

/** What a team is charged for `month` under a given method. */
export function allocatedFor(team: AlTeam, month: string, method: AllocationMethod): number {
  const i = monthIndex(month);
  if (i < 0) return 0;
  const direct = AL_DIRECT[team][i];
  const poolTotal = AL_TEAMS.reduce((s, t) => s + AL_POOL_TODAY[t][i], 0);

  if (method === "direct") return direct + AL_POOL_TODAY[team][i];
  if (method === "even") return direct + poolTotal / AL_TEAMS.length;

  const directTotal = AL_TEAMS.reduce((s, t) => s + AL_DIRECT[t][i], 0);
  return direct + poolTotal * (directTotal === 0 ? 0 : direct / directTotal);
}

export function poolTotalFor(month: string): number {
  const i = monthIndex(month);
  if (i < 0) return 0;
  return AL_TEAMS.reduce((s, t) => s + AL_POOL_TODAY[t][i], 0);
}

export function billTotalFor(month: string): number {
  const i = monthIndex(month);
  if (i < 0) return 0;
  return AL_TEAMS.reduce((s, t) => s + AL_DIRECT[t][i] + AL_POOL_TODAY[t][i], 0);
}

export type ImpactRow = {
  team: AlTeam;
  before: number;
  after: number;
  delta: number;
  budget: number;
  /** Crossing the budget line in either direction is the thing worth flagging. */
  flips: "none" | "into-budget" | "over-budget";
};

export function allocationImpact(
  from: AllocationMethod,
  to: AllocationMethod,
  month: string,
): ImpactRow[] {
  return AL_TEAMS.map((team) => {
    const before = allocatedFor(team, month, from);
    const after = allocatedFor(team, month, to);
    const budget = AL_BUDGET[team];
    const wasOver = before > budget;
    const isOver = after > budget;
    return {
      team, before, after, delta: after - before, budget,
      flips: wasOver === isOver ? "none" : isOver ? "over-budget" : "into-budget",
    };
  });
}

/* --------------------------- What a change means -------------------------
 * Three honest outcomes, so the panel never has to invent one. This is the
 * same rule the CostGuard ledger runs on: a figure it cannot verify is named,
 * not rounded to zero. */

export type Impact =
  | { kind: "money"; rows: ImpactRow[]; month: string; monthLabel: string; poolTotal: number; billTotal: number }
  | { kind: "boundaries"; before: string; after: string; detail: string }
  | { kind: "none" }
  | { kind: "not-computable"; reason: string };

const QUARTER_OF = (monthIdx: number, fyStart: number) => Math.floor(((monthIdx - fyStart + 12) % 12) / 3);

/** The quarter August 2026 falls in, spelled out, for a given fiscal start. */
export function currentQuarterLabel(fyStart: number): string {
  const aug = 7;
  const q = QUARTER_OF(aug, fyStart);
  const s = (fyStart + q * 3) % 12;
  return `Q${q + 1} (${FISCAL_MONTHS[s].slice(0, 3)}–${FISCAL_MONTHS[(s + 2) % 12].slice(0, 3)})`;
}

export function impactOf(
  key: keyof SettingsState,
  committed: SettingsState,
  staged: SettingsState,
  month: string,
): Impact {
  if (committed[key] === staged[key]) return { kind: "none" };

  if (key === "allocationMethod") {
    return {
      kind: "money",
      rows: allocationImpact(committed.allocationMethod, staged.allocationMethod, month),
      month,
      monthLabel: AL_MONTH_LABELS[monthIndex(month)] ?? month,
      poolTotal: poolTotalFor(month),
      billTotal: billTotalFor(month),
    };
  }

  if (key === "fiscalYearStart") {
    return {
      kind: "boundaries",
      before: currentQuarterLabel(committed.fiscalYearStart),
      after: currentQuarterLabel(staged.fiscalYearStart),
      detail:
        "Monthly totals do not move — only the boundaries around them do. Every quarter-to-date and year-to-date figure in Finout is recut, and saved reports that compare quarters will not match their previous run.",
    };
  }

  if (key === "costType") {
    return {
      kind: "not-computable",
      reason:
        "Finout holds one cost figure per line for these accounts. Amortized and net cost need a commitment schedule and a discount agreement, and neither is connected. The setting will apply to data ingested from the effective date; it cannot restate what is already here.",
    };
  }

  if (key === "showDiscounts") {
    return {
      kind: "not-computable",
      reason: "No negotiated rate is on file for the connected accounts, so there is nothing to add or remove yet.",
    };
  }

  return { kind: "none" };
}

/* ------------------------- Staged vs committed state ----------------------
 * Two layers. `committed` is what the product is using; `staged` is what the
 * user is proposing. Nothing reaches the rest of the app until Publish. */

const COMMITTED_KEY = "settings-committed";
const STAGED_KEY = "settings-staged";

export function useCommitted(): SettingsState {
  return useDemoStore<SettingsState>(COMMITTED_KEY, DEFAULT_SETTINGS);
}
export function useStaged(): SettingsState {
  return useDemoStore<SettingsState>(STAGED_KEY, DEFAULT_SETTINGS);
}

export function stage(patch: Partial<SettingsState>, current: SettingsState) {
  setDemo(STAGED_KEY, { ...current, ...patch });
}
export function publish(staged: SettingsState) {
  setDemo(COMMITTED_KEY, staged);
}
export function discard(committed: SettingsState) {
  setDemo(STAGED_KEY, committed);
}

export const CHANGED_KEYS = (committed: SettingsState, staged: SettingsState) =>
  (Object.keys(DEFAULT_SETTINGS) as (keyof SettingsState)[])
    .filter((k) => k !== "effectiveFrom" && committed[k] !== staged[k]);

export const isDefault = (s: SettingsState, k: keyof SettingsState) => s[k] === DEFAULT_SETTINGS[k];

export { AL_TEAMS, AL_BUDGET, AL_SHARED_SERVICES, AL_MONTHS, AL_MONTH_LABELS, AL_PARTIAL_MONTH };
export type { AlTeam };

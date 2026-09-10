"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { TopNav } from "@/components/navigation/TopNav";
import { PageTitleBar } from "@/components/navigation/PageTitleBar";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Switch } from "@/components/ui/Switch";
import { Callout } from "@/components/ui/Callout";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { TableShell, HeaderCell, Cell } from "@/components/table/Table";
import { showToast } from "@/components/ui/Toast";
import { useDemoStore, setDemo } from "@/lib/demo-store";
import { SettingsRail } from "@/components/settings/SettingsRail";
import { SettingRow, RowDivider } from "@/components/settings/SettingRow";
import { ImpactPanel } from "@/components/settings/ImpactPanel";
import { StagedChangeBar } from "@/components/settings/StagedChangeBar";
import {
  SECTIONS, isSectionId, type SectionId,
  ALLOCATION_OPTIONS, COST_TYPE_OPTIONS, FISCAL_MONTHS,
  PERIODS, CLOSED_PERIODS, OPEN_PERIOD,
  useCommitted, useStaged, stage, publish, discard,
  CHANGED_KEYS, isDefault, impactOf, PROVENANCE, dateLabel,
  usd, poolTotalFor, billTotalFor, allocatedFor, currentQuarterLabel,
  AL_TEAMS, AL_BUDGET, AL_SHARED_SERVICES, AL_MONTHS, AL_MONTH_LABELS,
  type SettingsState, type EffectiveFrom,
} from "@/components/settings/data";

/*
 * Screen: Settings — the FinOps control room.
 *
 * Settings has been a live sidebar row with no href since the prototype began
 * (Sidebar.tsx footer card) — it keeps the hover choreography and swallows the
 * click. This is that promise kept.
 *
 * The organising decision: this page owns the settings that CHANGE THE NUMBERS,
 * and indexes the ones that live on the screen where the work happens. Real
 * Finout has this inverted — Cost and Usage Type, EDP adjustments and Fiscal
 * Year each rewrite every figure for every user behind a bare toggle and a
 * Save, while a Virtual Tag, which moves a subset of spend, gets a preview, a
 * draft state and a change note. Here the ceremony follows the blast radius.
 *
 * Every figure on this screen is computed from workshop-data/seed.sql.
 */

const IMPACT_MONTH_DEFAULT = "2026-07"; // the month with the most to say — July ran over budget

/* ------------------------------ local helpers ---------------------------- */

function SectionHead({ id, action }: { id: SectionId; action?: ReactNode }) {
  const s = SECTIONS.find((x) => x.id === id)!;
  return (
    <div className="flex flex-wrap gap-[12px] items-start justify-between w-full">
      <div className="flex flex-col gap-[2px] min-w-0">
        <h2 className="font-sans font-medium leading-[26px] text-[18px] text-text-primary">{s.label}</h2>
        <p className="font-sans font-normal leading-[22px] text-[14px] text-text-secondary max-w-[70ch]">{s.blurb}</p>
      </div>
      {action}
    </div>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface-primary border border-solid border-border-light flex flex-col px-[24px] py-[6px] rounded-[10px] w-full">
      {children}
    </div>
  );
}

/** A card on Overview. Carries STATE — the thing no settings index ships. */
function IndexCard({
  id, values, footnote, href,
}: {
  id: SectionId;
  values: string[];
  footnote: string;
  href?: string;
}) {
  const s = SECTIONS.find((x) => x.id === id)!;
  const body = (
    <div className="bg-white border border-solid border-neutral-100 drop-shadow-[0px_1px_1px_rgba(16,24,40,0.06),0px_1px_1.5px_rgba(16,24,40,0.1)] flex flex-col gap-[8px] h-full px-[20px] py-[16px] rounded-[8px] w-full transition-colors hover:border-border-muted">
      {/* Title owns its own line at the page's shared title size — the layout
          contract says one size everywhere, always one line. */}
      <p className="font-sans font-medium leading-[26px] text-[18px] text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">
        {s.label}
      </p>
      {s.rewrites && (
        <div><StatusBadge label="Affects every number" variant="working" /></div>
      )}
      <div className="flex flex-col gap-[3px] flex-1 pt-[2px]">
        {values.map((v) => (
          <p key={v} className="font-sans font-normal leading-[22px] text-[14px] text-text-secondary">{v}</p>
        ))}
      </div>
      <p className="font-sans font-normal leading-[20px] text-[12px] text-text-tertiary">{footnote}</p>
    </div>
  );
  return href ? <a href={href} className="flex w-full">{body}</a> : body;
}

/* ------------------------------- Overview -------------------------------- */

function OverviewSection({ committed, stagedCount }: { committed: SettingsState; stagedCount: number }) {
  const allocLabel = ALLOCATION_OPTIONS.find((o) => o.id === committed.allocationMethod)!.label;
  const costLabel = COST_TYPE_OPTIONS.find((o) => o.id === committed.costType)!.label;
  const untouched = (Object.keys(PROVENANCE) as (keyof SettingsState)[])
    .every((k) => isDefault(committed, k));

  return (
    <div className="flex flex-col gap-[20px] w-full">
      <SectionHead id="overview" />

      {stagedCount > 0 ? (
        <Callout tone="warning" title={`${stagedCount} change${stagedCount > 1 ? "s are" : " is"} staged and not published`}>
          Nothing has been applied to the product yet. Open <a href="#cost-model" className="underline">Cost model</a> to
          review the impact and publish.
        </Callout>
      ) : untouched ? (
        /* Empty is a result, not a blank screen: everything sitting at its
           default is a statement about the account, so say what that means. */
        <Callout tone="info" title="Everything is at its default">
          Spend is measured as invoiced and charged to whoever the provider billed. No allocation rule is moving money
          between teams, so every figure in Finout is the raw bill. {CLOSED_PERIODS.length} periods are closed and
          {" "}{OPEN_PERIOD.label} is still reconciling.
        </Callout>
      ) : null}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[16px] items-stretch w-full">
        <IndexCard
          id="cost-model"
          href="#cost-model"
          values={[
            `Shared costs: ${allocLabel}`,
            `Cost type: ${costLabel}`,
            `Fiscal year starts ${FISCAL_MONTHS[committed.fiscalYearStart]}`,
          ]}
          footnote={
            PROVENANCE.allocationMethod
              ? `${isDefault(committed, "allocationMethod") ? "Last reviewed by" : "Changed by"} ${PROVENANCE.allocationMethod.by} · ${dateLabel(PROVENANCE.allocationMethod.on)}`
              : "Never changed"
          }
        />
        <IndexCard
          id="allocation"
          href="#allocation"
          values={["7 Virtual Tags across 2 folders", "100% of spend allocated to a team", "No untagged bucket"]}
          footnote="Never changed"
        />
        <IndexCard
          id="budgets"
          href="#budgets"
          values={[`6 team budgets · ${usd(287000)}/mo total`, "CostGuard scans: weekly", "Anomaly sensitivity: medium"]}
          footnote="Never changed"
        />
        <IndexCard
          id="alerts"
          href="#alerts"
          values={["2 destinations connected", "6 rules routed", "Slack + email"]}
          footnote="Never changed"
        />
        <IndexCard
          id="access"
          href="#access"
          values={["6 teams", "Roles managed outside Finout", "Read-only here"]}
          footnote="Managed by your identity provider"
        />
      </div>

      <div className="flex flex-col gap-[10px] w-full">
        <h3 className="font-sans font-medium leading-[26px] text-[18px] text-text-primary">Reporting periods</h3>
        <p className="font-sans font-normal leading-[22px] text-[14px] text-text-secondary max-w-[70ch]">
          A closed period has been reported to finance. Settings changes cannot silently rewrite one — reaching back
          into a closed month is an explicit restatement.
        </p>
        <div className="flex flex-wrap gap-[8px]">
          {PERIODS.map((p) => (
            <div
              key={p.month}
              className={`border border-solid flex flex-col gap-[2px] px-[14px] py-[10px] rounded-[8px] ${
                p.closed ? "bg-surface-secondary border-border-light" : "bg-blue-50 border-dataviz-blue-100"
              }`}
            >
              <p className="font-sans font-medium leading-[20px] text-[13px] text-text-primary whitespace-nowrap">
                {p.label}
              </p>
              <p className="font-sans font-normal leading-[18px] text-[11px] text-text-tertiary whitespace-nowrap">
                {p.closed ? `Closed · reported ${dateLabel(p.reportedOn!)}` : "Open · still reconciling"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Cost model ------------------------------ */

function CostModelSection({
  committed, staged, month, onMonth,
}: {
  committed: SettingsState;
  staged: SettingsState;
  month: string;
  onMonth: (m: string) => void;
}) {
  const set = (patch: Partial<SettingsState>) => stage(patch, staged);
  /* A setting can have been looked at and deliberately left alone. Saying
     "changed" about a value still sitting at its default is a small lie, and
     it contradicts the Overview. */
  const prov = (k: keyof SettingsState) => {
    const p = PROVENANCE[k];
    if (!p) return "Never changed";
    const verb = isDefault(committed, k) ? "Last reviewed by" : "Changed by";
    return `${verb} ${p.by} · ${dateLabel(p.on)}${p.note ? ` · “${p.note}”` : ""}`;
  };
  const changedKeys = CHANGED_KEYS(committed, staged);
  const isStaged = (k: keyof SettingsState) => changedKeys.includes(k);
  const impact = (k: keyof SettingsState) => impactOf(k, committed, staged, month);

  const pool = poolTotalFor(month);
  const bill = billTotalFor(month);
  const monthLabel = AL_MONTH_LABELS[AL_MONTHS.indexOf(month as (typeof AL_MONTHS)[number])];

  return (
    <div className="flex flex-col gap-[20px] w-full">
      <SectionHead
        id="cost-model"
        action={
          <Dropdown
            align="right"
            trigger={() => <Select label={`Preview against ${monthLabel}`} width={240} />}
          >
            {(close) => (
              <>
                {AL_MONTHS.map((m, i) => (
                  <DropdownItem key={m} selected={m === month} onClick={() => { onMonth(m); close(); }}>
                    {AL_MONTH_LABELS[i]}
                  </DropdownItem>
                ))}
              </>
            )}
          </Dropdown>
        }
      />

      <Callout tone="warning" title="These settings change figures that have already been reported">
        A change here re-cuts every dashboard, report and budget in Finout. Nothing applies until you publish it, and
        the {CLOSED_PERIODS.length} closed periods stay as reported unless you restate them on purpose.
      </Callout>

      <Panel>
        <SettingRow
          label="Shared cost allocation"
          description="How platform and tooling costs that no single team buys are charged back. This is the setting that moves the most money between teams."
          scope={
            <>
              Affects all {AL_TEAMS.length} teams · {usd(pool)} of {monthLabel}&rsquo;s {usd(bill)} bill is shared
              ({((pool / bill) * 100).toFixed(1)}%) · pool is {AL_SHARED_SERVICES.join(", ")}
            </>
          }
          provenance={prov("allocationMethod")}
          staged={isStaged("allocationMethod")}
          nonDefault={!isDefault(committed, "allocationMethod")}
          control={
            <Dropdown
              align="right"
              panelClassName="min-w-[330px]"
              trigger={() => (
                <Select label={ALLOCATION_OPTIONS.find((o) => o.id === staged.allocationMethod)!.label} width={250} />
              )}
            >
              {(close) => (
                <>
                  {ALLOCATION_OPTIONS.map((o) => (
                    <DropdownItem
                      key={o.id}
                      selected={o.id === staged.allocationMethod}
                      onClick={() => { set({ allocationMethod: o.id }); close(); }}
                    >
                      <span className="flex flex-col gap-[2px] py-[2px]">
                        <span className="font-medium">{o.label}</span>
                        <span className="font-normal text-[12px] leading-[18px] text-text-secondary">{o.detail}</span>
                      </span>
                    </DropdownItem>
                  ))}
                </>
              )}
            </Dropdown>
          }
        >
          <ImpactPanel impact={impact("allocationMethod")} />
        </SettingRow>

        <RowDivider />

        <SettingRow
          label="Cost and usage type"
          description="Which cost figure every screen shows by default. Everyone in the account sees the one chosen here."
          scope={<>Affects all {AL_TEAMS.length} teams · every screen · every saved report</>}
          provenance={prov("costType")}
          staged={isStaged("costType")}
          nonDefault={!isDefault(committed, "costType")}
          control={
            <Dropdown
              align="right"
              panelClassName="min-w-[320px]"
              trigger={() => (
                <Select label={COST_TYPE_OPTIONS.find((o) => o.id === staged.costType)!.label} width={190} />
              )}
            >
              {(close) => (
                <>
                  {COST_TYPE_OPTIONS.map((o) => (
                    <DropdownItem
                      key={o.id}
                      selected={o.id === staged.costType}
                      onClick={() => { set({ costType: o.id }); close(); }}
                    >
                      <span className="flex flex-col gap-[2px] py-[2px]">
                        <span className="font-medium">{o.label}</span>
                        <span className="font-normal text-[12px] leading-[18px] text-text-secondary">{o.detail}</span>
                      </span>
                    </DropdownItem>
                  ))}
                </>
              )}
            </Dropdown>
          }
        >
          <ImpactPanel impact={impact("costType")} />
        </SettingRow>

        <RowDivider />

        <SettingRow
          label="Fiscal year starts in"
          description="The month your accounting year opens. Every date preset, quarter and year-to-date figure in Finout is cut from this."
          scope={<>Affects every date picker · current quarter is {currentQuarterLabel(committed.fiscalYearStart)}</>}
          provenance={prov("fiscalYearStart")}
          staged={isStaged("fiscalYearStart")}
          nonDefault={!isDefault(committed, "fiscalYearStart")}
          control={
            <Dropdown
              align="right"
              trigger={() => <Select label={FISCAL_MONTHS[staged.fiscalYearStart]} width={160} />}
            >
              {(close) => (
                <>
                  {FISCAL_MONTHS.map((m, i) => (
                    <DropdownItem
                      key={m}
                      selected={i === staged.fiscalYearStart}
                      onClick={() => { set({ fiscalYearStart: i }); close(); }}
                    >
                      {m}
                    </DropdownItem>
                  ))}
                </>
              )}
            </Dropdown>
          }
        >
          <ImpactPanel impact={impact("fiscalYearStart")} />
        </SettingRow>

        <RowDivider />

        <SettingRow
          label="Show negotiated discounts"
          description="Apply enterprise discount adjustments to displayed cost, rather than showing list price."
          scope={<>Affects all {AL_TEAMS.length} teams · every screen</>}
          provenance={prov("showDiscounts")}
          staged={isStaged("showDiscounts")}
          nonDefault={!isDefault(committed, "showDiscounts")}
          control={
            <Switch
              checked={staged.showDiscounts}
              onChange={(v) => set({ showDiscounts: v })}
              ariaLabel="Show negotiated discounts"
            />
          }
        >
          <ImpactPanel impact={impact("showDiscounts")} />
        </SettingRow>
      </Panel>
    </div>
  );
}

/* ----------------------------- Indexed sections -------------------------- */

function LinkOutRow({ label, description, value, href, cta }: {
  label: string; description: string; value: string; href: string; cta: string;
}) {
  return (
    <SettingRow
      label={label}
      description={description}
      scope={<>Currently: {value}</>}
      control={<Link href={href}><Button variant="secondary">{cta}</Button></Link>}
    />
  );
}

function AllocationSection() {
  return (
    <div className="flex flex-col gap-[20px] w-full">
      <SectionHead id="allocation" />
      <Callout tone="info" title="Configured where the work happens">
        Tagging rules are edited on the Virtual Tags screen, not here. This page owns organisation-wide policy and
        indexes the rest, so there is one place to see what an account is set to without taking the controls away from
        the person mid-task.
      </Callout>
      <Panel>
        <LinkOutRow
          label="Virtual Tags"
          description="The rules that decide whose spend a resource is. Finout's model: ownership is a rule, not a cloud tag."
          value="7 rules across 2 folders · 4 Virtual Tags, 3 Relational"
          href="/virtual-tags"
          cta="Open Virtual Tags"
        />
        <RowDivider />
        <SettingRow
          label="Untagged spend"
          description="Cost that no rule claims. It has to land somewhere, and the somewhere is a policy decision."
          scope={<>Currently: none — every cost event carries a team, so nothing is unallocated</>}
          control={<StatusBadge label="0% untagged" variant="done" />}
        />
      </Panel>
    </div>
  );
}

function BudgetsSection({ month }: { month: string }) {
  const i = AL_MONTHS.indexOf(month as (typeof AL_MONTHS)[number]);
  const col = "flex flex-col items-start shrink-0";
  const rows = AL_TEAMS.map((t) => {
    const spend = allocatedFor(t, month, "direct");
    return { team: t, budget: AL_BUDGET[t], spend, over: spend > AL_BUDGET[t] };
  });

  return (
    <div className="flex flex-col gap-[20px] w-full">
      <SectionHead id="budgets" />
      <TableShell>
        <div className={`${col} flex-1 min-w-[180px]`}>
          <HeaderCell label="Team" />
          {rows.map((r) => (
            <Cell key={r.team}>
              <span className="font-sans font-medium leading-[22px] text-[16px] text-text-primary whitespace-nowrap">{r.team}</span>
            </Cell>
          ))}
        </div>
        <div className={`${col} w-[170px]`}>
          <HeaderCell label="Monthly budget" />
          {rows.map((r) => (
            <Cell key={r.team}>
              <span className="font-geist font-normal text-[16px] tabular-nums text-text-primary">{usd(r.budget)}</span>
            </Cell>
          ))}
        </div>
        <div className={`${col} w-[180px]`}>
          <HeaderCell label={`Spend · ${AL_MONTH_LABELS[i]}`} />
          {rows.map((r) => (
            <Cell key={r.team}>
              <span className={`font-geist font-normal text-[16px] tabular-nums ${r.over ? "text-red-800" : "text-text-primary"}`}>
                {usd(r.spend)}
              </span>
            </Cell>
          ))}
        </div>
        <div className={`${col} w-[150px]`}>
          <HeaderCell label="Status" />
          {rows.map((r) => (
            <Cell key={r.team}>
              <StatusBadge label={r.over ? "Over budget" : "Within budget"} variant={r.over ? "regressed" : "done"} />
            </Cell>
          ))}
        </div>
      </TableShell>
      <Panel>
        <LinkOutRow
          label="CostGuard scan thresholds"
          description="The minimum saving worth raising, and how often the scans run. Set where the recommendations are read."
          value="Weekly scans · recommendations above $250/mo"
          href="/costguard"
          cta="Open CostGuard"
        />
        <RowDivider />
        <LinkOutRow
          label="Anomaly detection"
          description="How far a service has to move before Finout calls it an anomaly."
          value="5 rules · medium sensitivity"
          href="/anomalies"
          cta="Open Anomalies"
        />
      </Panel>
    </div>
  );
}

function AlertsSection() {
  const dests = [
    { name: "#finops-alerts", kind: "Slack", rules: "4 anomaly rules · 2 budget alerts", state: "Connected" },
    { name: "finops@finout.io", kind: "Email", rules: "Weekly digest · monthly close", state: "Connected" },
  ];
  return (
    <div className="flex flex-col gap-[20px] w-full">
      <SectionHead id="alerts" />
      <Callout tone="info" title="Destinations here, triggers on the object">
        A Slack channel is reused by anomalies, budgets and reports, so it belongs in one place. A threshold is a
        property of the budget that fires it, so it stays there.
      </Callout>
      <Panel>
        {dests.map((d, i) => (
          <div key={d.name}>
            {i > 0 && <RowDivider />}
            <SettingRow
              label={d.name}
              description={`${d.kind} destination`}
              scope={<>{d.rules}</>}
              control={<StatusBadge label={d.state} variant="done" />}
            />
          </div>
        ))}
      </Panel>
    </div>
  );
}

function AccessSection() {
  const LEADS: Record<string, string> = {
    Platform: "Noa Peretz", Data: "Amit Shani", AI: "Lior Katz",
    Growth: "Maya Rosen", "Core Product": "Tomer Adler", DevOps: "Dana Weiss",
  };
  const initials = (n: string) => n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const col = "flex flex-col items-start shrink-0";

  return (
    <div className="flex flex-col gap-[20px] w-full">
      <SectionHead id="access" />
      <Callout tone="info" title="Read-only in this build">
        Finout has no user or role records of its own for this account — identity is managed by your provider. What is
        shown is the team structure the cost data actually carries, which is real.
      </Callout>
      <TableShell>
        <div className={`${col} flex-1 min-w-[200px]`}>
          <HeaderCell label="Team" />
          {AL_TEAMS.map((t) => (
            <Cell key={t}>
              <span className="font-sans font-medium leading-[22px] text-[16px] text-text-primary whitespace-nowrap">{t}</span>
            </Cell>
          ))}
        </div>
        <div className={`${col} w-[240px]`}>
          <HeaderCell label="Lead" />
          {AL_TEAMS.map((t) => (
            <Cell key={t}>
              <span className="flex items-center gap-[10px]">
                <span className="scale-[0.6] origin-left -mr-[16px]"><Avatar initials={initials(LEADS[t])} /></span>
                <span className="font-sans font-normal leading-[22px] text-[15px] text-text-primary whitespace-nowrap">{LEADS[t]}</span>
              </span>
            </Cell>
          ))}
        </div>
        <div className={`${col} w-[190px]`}>
          <HeaderCell label="Sees" />
          {AL_TEAMS.map((t) => (
            <Cell key={t}>
              <span className="font-sans font-normal leading-[22px] text-[15px] text-text-secondary">Their own spend</span>
            </Cell>
          ))}
        </div>
        <div className={`${col} w-[190px]`}>
          <HeaderCell label="Can change settings" />
          {AL_TEAMS.map((t) => (
            <Cell key={t}>
              <StatusBadge label="No" variant="dismissed" />
            </Cell>
          ))}
        </div>
      </TableShell>
    </div>
  );
}

/* ------------------------------ Personal --------------------------------- */

const PERSONAL_KEY = "settings-personal";
type Personal = { landing: string; density: string; weeklyDigest: boolean; regressionAlerts: boolean; slackDm: boolean };
const PERSONAL_DEFAULT: Personal = {
  landing: "Overview", density: "Comfortable", weeklyDigest: true, regressionAlerts: true, slackDm: false,
};

function PersonalSection({ id }: { id: "preferences" | "notifications" }) {
  const p = useDemoStore<Personal>(PERSONAL_KEY, PERSONAL_DEFAULT);
  const set = (patch: Partial<Personal>) => setDemo(PERSONAL_KEY, { ...p, ...patch });

  return (
    <div className="flex flex-col gap-[20px] w-full">
      <SectionHead id={id} />
      <Callout tone="info" title="Saved as you change them">
        Nothing on this page affects anyone else, so there is nothing to stage and nothing to publish. The ceremony
        belongs where the blast radius is.
      </Callout>
      <Panel>
        {id === "preferences" ? (
          <>
            <SettingRow
              label="Open Finout on"
              description="The screen you land on when you sign in."
              control={
                <Dropdown align="right" trigger={() => <Select label={p.landing} width={190} />}>
                  {(close) => (
                    <>
                      {["Overview", "MegaBill", "CostGuard", "Anomalies"].map((v) => (
                        <DropdownItem key={v} selected={v === p.landing} onClick={() => { set({ landing: v }); close(); }}>
                          {v}
                        </DropdownItem>
                      ))}
                    </>
                  )}
                </Dropdown>
              }
            />
            <RowDivider />
            <SettingRow
              label="Table density"
              description="How much vertical room a row takes in tables."
              control={
                <Dropdown align="right" trigger={() => <Select label={p.density} width={170} />}>
                  {(close) => (
                    <>
                      {["Comfortable", "Compact"].map((v) => (
                        <DropdownItem key={v} selected={v === p.density} onClick={() => { set({ density: v }); close(); }}>
                          {v}
                        </DropdownItem>
                      ))}
                    </>
                  )}
                </Dropdown>
              }
            />
          </>
        ) : (
          <>
            <SettingRow
              label="Weekly spend digest"
              description="A Monday summary of last week's spend against budget."
              control={<Switch checked={p.weeklyDigest} onChange={(v) => set({ weeklyDigest: v })} ariaLabel="Weekly spend digest" />}
            />
            <RowDivider />
            <SettingRow
              label="Regression alerts"
              description="Tell me when a saving that was verified comes back."
              scope={<>Sent to #finops-alerts</>}
              control={<Switch checked={p.regressionAlerts} onChange={(v) => set({ regressionAlerts: v })} ariaLabel="Regression alerts" />}
            />
            <RowDivider />
            <SettingRow
              label="Direct message me on Slack"
              description="Rather than posting to the shared channel."
              control={<Switch checked={p.slackDm} onChange={(v) => set({ slackDm: v })} ariaLabel="Slack direct message" />}
            />
          </>
        )}
      </Panel>
    </div>
  );
}

/* -------------------------------- Screen --------------------------------- */

function readHash(): SectionId {
  if (typeof window === "undefined") return "overview";
  const h = window.location.hash.replace(/^#/, "");
  return isSectionId(h) ? h : "overview";
}

export function SettingsScreen() {
  const [section, setSection] = useState<SectionId>("overview");
  const [month, setMonth] = useState(IMPACT_MONTH_DEFAULT);
  const committed = useCommitted();
  const staged = useStaged();

  /* Section lives in the URL, so a section is linkable and Back steps through
     them instead of leaving the screen. Anchors do the pushing for us. */
  useEffect(() => {
    const sync = () => setSection(readHash());
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  const changed = useMemo(() => CHANGED_KEYS(committed, staged), [committed, staged]);

  const onPublish = useCallback(() => {
    const n = changed.length;
    const before = committed;
    publish(staged);
    showToast(`${n} change${n > 1 ? "s" : ""} published`, { undo: () => { setDemo("settings-committed", before); setDemo("settings-staged", before); } });
  }, [changed.length, committed, staged]);

  const onDiscard = useCallback(() => {
    discard(committed);
    showToast("Staged changes discarded");
  }, [committed]);

  return (
    <div className="bg-canvas flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="Settings" />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto bg-surface-primary">
        <TopNav compact />
        <PageTitleBar title="Settings" />

        <div className="flex gap-[32px] items-start w-full px-[32px] py-[24px]">
          <div className="sticky top-[24px] shrink-0">
            <SettingsRail active={section} />
          </div>

          <div className="flex flex-col flex-1 gap-[20px] min-w-0 pb-[40px]">
            {section === "overview" && <OverviewSection committed={committed} stagedCount={changed.length} />}
            {section === "cost-model" && (
              <CostModelSection committed={committed} staged={staged} month={month} onMonth={setMonth} />
            )}
            {section === "allocation" && <AllocationSection />}
            {section === "budgets" && <BudgetsSection month={month} />}
            {section === "alerts" && <AlertsSection />}
            {section === "access" && <AccessSection />}
            {section === "preferences" && <PersonalSection id="preferences" />}
            {section === "notifications" && <PersonalSection id="notifications" />}

            <StagedChangeBar
              count={changed.length}
              effectiveFrom={staged.effectiveFrom}
              onEffectiveChange={(v: EffectiveFrom) => stage({ effectiveFrom: v }, staged)}
              onPublish={onPublish}
              onDiscard={onDiscard}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

# CostGuard — the recommendation ledger

**Status:** draft
**Date:** 2026-09-06
**Surface:** `/costguard`
**Sources:** `src/components/sidebar/Sidebar.tsx` · `src/components/home/KpiCard.tsx` ·
`src/components/home/RecommendationsCard.tsx` · `workshop-data/seed.sql` ·
`DESIGN_CONTEXT.md` · docs.finout.io/user-guide/optimize/costguard ·
finout.io/blog/the-savings-that-never-show-up

## 1. Problem

Finding cloud waste is solved. Every cloud already emits recommendations, and Finout
already unifies, prioritises and assigns them. What is not solved is everything after
the list: **nobody can prove the money was ever saved.** Finout's own writing names the
failure modes — *"a recommendation without a named individual owner defaults to no one"*,
decisions made in Slack with no audit trail, and tickets closed without checking whether
the projected saving reached the bill.

Our own data contains the sharpest version of this. Snowflake Warehouse weekend cost ran
at **40% of weekday** ($155 vs $383/day) from April through 5 June — an optimisation that
was working. On **6 June it stopped**: weekends now cost **100% of weekday** ($390 vs
$389). That regression has cost **$5,596 across 24 weekend days, ≈$2,075/month**, and it
is still running today. No anomaly fired: all five rows in the `anomalies` table are other
services.

So the problem is not only that savings are unproven. **A saving that was real can
quietly die, and today nothing is watching.**

Meanwhile the product advertises the destination in three places and delivers a toast.

## 2. Who it's for

**Primary — the FinOps lead.** Owns the total number and has to answer "what did the
programme actually save this quarter?" Today they cannot, because implementation lives in
other people's backlogs.

**Secondary — the engineering owner.** Receives the work. Needs to know it is genuinely
theirs, how much it is worth, and that closing it will be believed. Allergic to being
handed someone else's cleanup.

**Secondary — the executive.** Wants one number, its trend, and evidence somebody is
acting. Reads the top of the screen and leaves.

Not served in this version: anyone doing the remediation itself. This screen tracks work;
it does not perform it.

## 3. What exists today

- `Sidebar.tsx` lists **CostGuard** under *Optimize*. It has no `href`. One of twelve
  dead nav items out of sixteen.
- `KpiCard.tsx` shows **"Monthly potential savings · $26,802"** with a **"Go to CostGuard"**
  button whose handler is `showToast("CostGuard is next in the workshop 😉")`.
- `RecommendationsCard.tsx` lists *RDS - Idle*, *RDS - Rightsizing*, *K8s - Deployment*
  with per-row savings, a **Cost Waste Percentage**, and a **Number of Resources** column.
  Its action fires `showToast("Opening scan in CostGuard…")`.
- `/anomalies` exists and is a genuinely different job: it detects unexpected *change*.
  This screen tracks committed *work*. They should link, not merge.

**The status quo we are competing with** is a spreadsheet of optimisation tickets pasted
into a monthly Slack update. It is honestly adequate for tracking *that* work happened.
It cannot verify the bill went down, and it cannot notice a saving reverting. That is the
only ground on which this screen wins.

## 4. Non-goals

- **The scan engine.** Recommendations are assumed to arrive. We do not detect them here.
- **Cloud-native scan ingestion** (AWS Compute Optimizer, Azure Advisor, GCP Recommender).
- **Jira sync.** Finout marks it "coming soon"; we design the owner and status model it
  would need, and stop there.
- **Commitments and Savings Plans.** Separate nav items, separate purchase workflow.
- **Resource-level drill-down.** See Decision D1.
- **Performing remediation.** No infrastructure is changed from this screen.

## 5. Decisions

| Decision | Choice | Why |
|---|---|---|
| **D1** Unit of the screen | The **recommendation**, not the resource | `cost_events` is grained at service × team × environment × day and has no resource identity. A recommendation references a *service*, which the data supports. Home's *Number of Resources* column stays on Home and is out of scope here — noted, not silently dropped |
| **D2** What "Act" means | Assign a named owner and a due date **inside Finout** | Jira sync is a non-goal, but the ownership model it needs is exactly what fixes "defaults to no one". Design the model, not the integration |
| **D3** What "realized" means | Actual service cost over the 14 days after `done_at`, compared against the 14 days before `created_at`, expressed as $/month | It is computable from `cost_events` today, and 14 days matches CostGuard's documented analysis window |
| **D4** What happens after Done | Verification **keeps running**. If cost returns to baseline, status becomes **Regressed** | This is the gap. Finout's "Prove" is described as a report; our data proves it has to be a watchdog |
| **D5** Status model | Real four — `New` · `Working on it` · `Done` · `Dismissed` — plus derived **`Regressed`** | Matches the shipped product so it stays recognisable; the fifth state is the new idea and is derived, never set by hand |
| **D6** Verification without a baseline | Show **"Not verifiable"**, never $0 | A missing baseline is not a zero saving. Claiming otherwise is the exact dishonesty this screen exists to end |
| **D7** Dismissed | Kept, filterable, and re-raised if the same opportunity recurs after 90 days | Finout's post names opportunities that "resurface repeatedly" — silent deletion is how that happens |

## 6. User stories

1. As a **FinOps lead**, I want every open recommendation to show a named owner and an age,
   so I can see what is stalled without opening a spreadsheet.
2. As a **FinOps lead**, I want projected savings and realized savings side by side, so I
   can report what actually reached the bill.
3. As a **FinOps lead**, I want to be told when a saving I already banked has come back, so
   I stop counting money I no longer save.
4. As an **engineering owner**, I want to see why this was assigned to me and what it is
   worth, so I can judge it against my other work.
5. As an **engineering owner**, I want to move an item to *Working on it* and *Done* and
   have the system check my work, so closing it means something.
6. As an **executive**, I want one realized-savings number with a trend, so I can tell
   whether the programme is working.
7. As a **FinOps lead**, I want to dismiss a recommendation with a reason and have it come
   back if it recurs, so the same argument is not had twice.

## 7. Success metrics

| Metric | Definition | Baseline |
|---|---|---|
| Ownership coverage | % of non-dismissed recommendations with a named owner | No baseline exists — nothing assigns owners today |
| Time to done | Median days from `created_at` to `done_at` | No baseline exists |
| **Realization rate** | Realized $/month ÷ projected $/month, for items marked Done | No baseline exists. The headline metric |
| Regression caught | $/month of savings detected as reverted | Currently **$0 detected** against **$2,075/month actually regressing** on Snowflake alone |
| Verification coverage | % of Done items with a computable baseline | No baseline exists |

The fourth row is the one that justifies the screen: the gap between what is being lost
and what is being noticed is presently the whole amount.

## 8. Open questions

- **Who assigns owners** — auto-assign from the team on `cost_events`, or always a human
  choice? Auto-assignment is what Finout advertises via Virtual Tags, but wrong
  auto-assignment is how engineers learn to ignore a tool. *Decide with Daniel before build.*
- **How long must a saving hold** before it counts as realized — 14 days, or a full billing
  cycle? Affects only copy and thresholds, not layout.
- **Should Regressed reopen the original item or create a new one?** Reopening keeps the
  history together; a new item keeps the realization stats honest. Leaning reopen with a
  visible event log. *Designer's input welcome.*
- **Does the executive need a separate view**, or is the top of this screen enough?

## 9. Screen requirements

### Surfaces

| Surface | Detail |
|---|---|
| Route | `/costguard` |
| Sidebar entry | `CostGuard`, in the **Optimize** section — give the existing item an `href` |
| Entry points | `KpiCard.tsx` "Go to CostGuard" (replace `showToast` with a link) · `RecommendationsCard.tsx` "Go to scan" · Sidebar |
| Exits | A recommendation's detail · `/anomalies` for related detections · `/megabill` to see the service's spend |

Breadboard:

```
Home · "Go to CostGuard"
  → CostGuard ledger  (KPI row · filters · table)
  → pick a row
    → detail  (why it was raised · the cost evidence · projected saving)
      → assign owner + set "Working on it"
      → set "Done"
        → system verifies against cost_events after 14 days
          → realized  → counts toward the realized total
          → not verifiable → flagged, no number claimed
          → cost returns → REGRESSED → back to the top of the ledger
```

### States

| State | When | What the user sees |
|---|---|---|
| **Empty** | No open recommendations | A success state, not a blank. What was checked, when, and what it found — Snowflake's "we ran these checks and found nothing" is the model. Show the realized total earned so far |
| Loading | Scan in progress | Last scan time and progress; the previous list stays readable |
| Populated | Default | KPI row, filters, ledger table |
| **Regressed present** | ≥1 item reverted | The regression is surfaced above the ordinary list — it is more urgent than a new opportunity, because it was already believed |
| Not verifiable | Done, no computable baseline | "Not verifiable" with the reason. Never a zero |
| Error | Verification or scan failed | What failed, when it was last good, and what still holds |
| Permission | Viewer without assign rights | Read the ledger, cannot change status or owner |

### Data fields

| Field | Source | Example | Notes |
|---|---|---|---|
| Recommendation id | **new** | `rec_014` | |
| Title | **new** | `Snowflake warehouse runs all weekend` | |
| Type | **new** | `Idle` / `Rightsizing` / `Commitment` | Finout's three documented categories |
| Service | `services.name` | `Snowflake Warehouse` | service_id 17 |
| Provider | `services.provider` | `Snowflake` | |
| Team | `teams.name` | `Data` | Owning team |
| Owner | **new** | person, not team | D2. `Avatar` exists for this |
| Status | **new** | `New` · `Working on it` · `Done` · `Dismissed` | D5 |
| Regressed | **derived** | boolean + `regressed_at` | D4. Never set by hand |
| Projected saving | **new** | `$2,075 / month` | |
| Realized saving | **derived from `cost_events`** | `$2,075 / month` or `Not verifiable` | D3, D6 |
| Baseline window | **new** | `2026-04-01 → 2026-06-05` | Makes the claim auditable |
| Created / Done at | **new** | `2026-06-06` / `—` | Drives age and time-to-done |
| Age | derived | `92 days` | |
| Confidence | **new** | `high` / `medium` / `low` | Only if the scan supplies it; omit rather than invent |
| Dismiss reason | **new** | free text | D7 |

**A `recommendations` table does not exist and is part of this work.** Everything in the
Realized column is computable from `cost_events` today — that is the point, and it is why
this screen is buildable rather than aspirational.

### Components

**Reuse** — from the inventory in `DESIGN_CONTEXT.md`:
- `Sidebar` with `activeItem="CostGuard"`
- `TopNav`, `PageTitleBar` — match `AnomaliesScreen.tsx`
- `Tabs` — the ledger's cuts (All / Open / Done / Regressed / Dismissed)
- `ChipFilter` pattern from `AnomaliesScreen.tsx` — provider, team, type, owner
- `SearchInput`, `Select`
- `TableShell`, `HeaderCell`, `Cell`, `CellText`, `MenuCell`, `CheckboxCell`
- `Button` — primary for the row action, tertiary for bulk
- `Avatar` — the owner cell
- KPI row: follow the equal-width card rule; `KpiCard` currently lives under
  `components/home/` and would need lifting to be shared — flag as a small refactor, not a
  new component

**New** — each one a cost:
- **Status badge** — five states including Regressed. *Extend the existing `Badge` with a
  status variant rather than build a new component.* Reusable on `/anomalies` immediately.
- **Savings delta** — projected vs realized in one cell, including the "Not verifiable"
  case. Nothing existing shows two related figures with a verdict. Reusable wherever
  forecast meets actual, e.g. `budgets`.
- **Bulk action bar** — appears on row selection, shows count and combined $/month.
  `CheckboxCell` already exists and currently leads nowhere.

Not proposing layout, hierarchy or visual treatment. Those belong to design.

## Appendix — how the numbers were derived

Computed from `workshop-data/seed.sql`, all 12,172 `cost_events` rows parsed.

**Snowflake Warehouse (service 17)**
- Baseline 1 Apr – 5 Jun: weekday $383/day, weekend $155/day = **40%**
- Since 6 Jun: weekday $389/day, weekend $390/day = **100%**
- Expected weekend at baseline ratio: $157/day → excess **$233/weekend-day**
- 24 weekend days → **$5,596 total ≈ $2,075/month**

**EKS Cluster (service 1)** — the second undetected story
- 1–14 Apr: $32,398 over 668,792 vCPU-hours = **$0.0484/vCPU-h**
- 13–26 Aug: $37,898 over 698,503 vCPU-hours = **$0.0543/vCPU-h**
- Unit cost **+12.2%** while usage rose 4.4% → ≈**$8,950/month** of drift

**Two discrepancies with `workshop-data/README.md`, flagged not resolved:**
1. The README states the Snowflake gap is **~$1,412/mo**; computing from the rows gives
   **$2,075/mo**. Different baseline method, most likely. The computed figure is used here
   because it is reproducible from the data.
2. The README describes **three** flagged anomalies. The `anomalies` table contains
   **five**: Anthropic API, BigQuery, Datadog Logs, **EC2 Instances** and **S3 Storage**.
   The last two are not mentioned in the README. Only three carry a `cost_impact_usd`.

Neither affects the design. Both should be reconciled before the workshop, since
participants will compute these themselves.

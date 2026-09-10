# Finout — product context

Table of contents:
1. What Finout is
2. What exists in this repo
3. Promises the product has not kept
4. CostGuard (the real product)
5. The mock data
6. Competitor landscape

---

## 1. What Finout is

Finout is a FinOps platform: it takes cloud spend from many providers (AWS, GCP,
Azure, Kubernetes, Snowflake, Datadog, OpenAI, Anthropic…) and makes it
understandable, attributable, and reducible.

Three jobs, which map to the sidebar's three sections:

| Section | Job | Question it answers |
|---|---|---|
| **Inform** | Show me the money | Where did the spend go? Whose is it? |
| **Optimize** | Find the waste | What are we paying for and not using? |
| **Operate** | Run the practice | Who owns what, and are we on budget? |

The three personas throughout:

- **FinOps lead** — owns the total number. Wants allocation, budgets, and someone
  to hand each problem to. The primary user of most screens.
- **Engineering owner** (team lead / platform engineer) — receives the problem.
  Cares whether it's real, whether it's theirs, and how much work the fix is.
  Deeply allergic to false positives.
- **Executive** — wants one number, its trend, and confidence that someone is
  acting on it. Reads a summary, not a table.

Vocabulary that must be used correctly:

- **Virtual Tag** — a user-defined rule that groups raw cloud resources into a
  business concept (team, product, environment). Finout's signature idea:
  ownership is a *rule*, not a cloud tag. Relational Virtual Tags derive from
  other tags.
- **Cost center** — a business unit the spend rolls up to.
- **Showback / chargeback** — reporting spend to a team vs. actually billing it.
- **Rightsizing** — the resource is used but is bigger than it needs to be.
- **Idle** — the resource is running and essentially unused.
- **Commitment** — a Savings Plan or Reserved Instance: pay upfront, pay less.
- **Realized vs. potential savings** — what was actually banked vs. what a
  recommendation claimed. The gap between them is where trust is won or lost.

## 2. What exists in this repo

A 1:1 rebuild of five representative screens plus a Storybook design system.
Read `DESIGN_CONTEXT.md` for the layout contract and the component inventory —
do not restate its rules from memory, they change.

Built screens (`src/screens/*Screen.tsx`, routed in `src/app/<slug>/page.tsx`):

| Screen | Route | What it does |
|---|---|---|
| Home / Overview | `/` | KPI row, monthly cost chart, cost centers, recommendations teaser, recent activity |
| MegaBill | `/megabill` | Cost breakdown by provider — the main "where did it go" screen |
| Virtual Tags | `/virtual-tags` | Table of tagging rules, with folders |
| Anomalies | `/anomalies` | Feed of detected cost anomalies |
| Create Anomaly | `/anomalies/create` | The form for defining an anomaly rule |

## 3. Promises the product has not kept

**This section is the single richest source of briefs in the repo.** The
prototype advertises far more than it delivers, and every gap is a real, already
justified product problem — no invention required.

`src/components/sidebar/Sidebar.tsx` defines 16 nav items. **Four are built.
Twelve lead nowhere:**

- *Inform*: Dashboards · Financial Plans · Resources · Data Explorer
- *Optimize*: **CostGuard** · My Commitments · Commitments Log
- *Operate*: Cost per entity · Reports · Governance
- *Top level*: Finops for AI · Billy

Dead ends inside screens that already ship:

- `src/components/home/KpiCard.tsx` — the "Monthly potential savings · $26,802"
  card has a **"Go to CostGuard"** button whose handler is
  `showToast("CostGuard is next in the workshop 😉")`.
- `src/components/home/RecommendationsCard.tsx` — "Recent recommendations" lists
  `RDS - Idle`, `RDS - Rightsizing`, `K8s - Deployment`, `Persistent Disk`,
  `Network Load B…` with per-row savings, resource counts and a
  **Cost Waste Percentage**. Its action fires
  `showToast("Opening scan in CostGuard…")`.
- Home's "Cost Waste Percentage" KPI has no destination either.

When shaping a new screen, **check this list first.** A brief that completes a
promise the product already made is stronger than one that invents a need — the
user has already been told the thing exists.

## 4. CostGuard (the real product)

Verified from Finout's public docs, September 2026. Sources:
- https://docs.finout.io/user-guide/optimize/costguard
- https://docs.finout.io/user-guide/optimize/costguard/finout-scans
- https://www.finout.io/costguard

Finout positions CostGuard as the **"action hub for cloud recommendations."**
The insight: AWS Cost Explorer, Compute Optimizer, Azure Advisor, GCP Recommender,
Kubernetes and Snowflake all emit recommendations already. Nobody acts on any of
them. CostGuard unifies them and drives them to done.

Their five stages:

| Stage | What it does | Status |
|---|---|---|
| Unify | Pull recommendations from every cloud + native source into one list | shipped |
| Prioritize | Thresholds and policies that strip out low-value noise | shipped |
| Own | Auto-assign to a team via tags and Virtual Tags | shipped |
| Act | Sync the task to Jira | **marked "coming soon"** |
| Prove | Potential vs. realized savings over time, auditable | **marked "coming soon"** |

**Act and Prove being unbuilt is the most valuable fact in this file.** It is a
publicly stated gap in a real product — briefs aimed there cannot be wrong, and
they are not hypothetical.

Screen mechanics, as documented:

- Filters: Cost Center · Scan Source (Finout Scans vs. Cloud Native Scans) ·
  free-text search · Group By · Additional Columns
- Table columns: resource, its cost and waste, potential savings (shown
  annually), status
- **Four statuses: `New` → `Working on it` → `Done`, plus `Dismissed`**
- Actions: change status singly or in bulk · Download CSV · Generate Report
  (shareable snapshot link) · a **"To Do"** view of everything "Working on it"
- Analysis window is typically the last 14 days

Three recommendation categories, with real thresholds:

- **Idle** — EC2 CPU <5%; RDS zero connections; ELB <100 requests; ElastiCache
  max CPU <2%; S3 zero requests; unattached EBS; Snowflake tables with no queries
- **Rightsizing** — EC2 max CPU <50%; RDS max CPU <50%; GCP VM CPU <80%;
  Snowflake warehouse utilization <50%; Kubernetes CPU/memory requests vs. actual
  usage at the 85th–100th percentile; EBS gp2→gp3
- **Commitments** — Savings Plans and Reserved Instances from 30-day on-demand usage

## 5. The mock data

`workshop-data/schema.sql` is the source of truth for shape;
`workshop-data/README.md` documents the planted stories. Read them rather than
trusting this summary.

Tables: `teams` (6) · `services` (19) · `cost_events` (~12,172 daily rows,
2026-03-01 → 2026-08-26) · `virtual_tags` (7) · `anomalies` (5) · `budgets` (36).
Views: `v_monthly_provider_costs` · `v_team_monthly_spend` ·
`v_service_week_over_week`.

**The critical modelling gap:** `cost_events` is grained at
*service × team × environment × day*. It has **no resource-level rows** — no
instance IDs, no volume IDs. But CostGuard is inherently resource-level, and
Home's recommendations card already promises a *Number of Resources* column.

Never paper over this. Any CostGuard-adjacent PRD must explicitly choose one:
(a) define recommendations at service level and drop resource counts,
(b) specify a new `resources` table as part of the work, or
(c) scope the feature so it doesn't need resource identity.

Five planted stories. Three are in the `anomalies` table; **two are deliberately
absent** so the product can be shown to have missed something:

| # | Story | Flagged? |
|---|---|---|
| 1 | BigQuery ×4.4 spike, Platform team, Jul 14–27 — pushes Platform over its July budget | yes (acknowledged) |
| 2 | Anthropic tokens +9% on May 24 (37,557 → 40,937) | yes (resolved) |
| 3 | Datadog Logs +28% step from Aug 1 (plan change) | yes (open) |
| 4 | **Snowflake weekend cost stops dropping from Jun 6** — auto-suspend broke; weekends now cost ≈ weekdays instead of ~40%. ~$1,412/mo | **no** |
| 5 | **EKS cost-per-vCPU creeps +0.09%/day since Apr 1** while usage stays flat — idle overprovisioning | **no** |

Story 4 checked against Finout's real documented scans: they cover Snowflake
*idle tables* (no queries in 7 days) and *warehouse utilization* (<50% → downsize).
A broken auto-suspend **schedule** is neither. The gap is genuine, not an artifact
of the mock.

Numbers that are safe to cite because they exist in the code or data:
$26,802 monthly potential savings · $1,412/mo Snowflake waste · 6 teams ·
19 services · ~$238k–290k monthly spend, July highest.

## 6. Competitor landscape

Starting map only. **Verify anything specific with WebSearch before it goes in a
PRD** — feature sets move fast and a wrong claim about a rival is the fastest way
to lose a room.

| Player | Shape | Why it matters here |
|---|---|---|
| **AWS Cost Explorer / Compute Optimizer** | Free, native, single-cloud | The default. Anything Finout charges for must beat "already included" |
| **Vantage** | Developer-first, fast onboarding, strong at showing per-service cost | The usability benchmark |
| **CloudZero** | Unit-economics angle — cost per customer, per feature | Reframes the question from "what did we spend" to "what did it cost to serve" |
| **Cloudability** (Apptio/IBM) | Enterprise incumbent, deep allocation and governance | Where large procurement defaults |
| **Kubecost / OpenCost** | Kubernetes-only, open source | Sets free-tier expectations for k8s attribution |
| **Datadog Cloud Cost Management** | Bolted onto an observability suite | Wins when the buyer already owns Datadog |
| **Cast AI / Zesty / ProsperOps** | Automated remediation — they act, not just advise | The real threat to the "Act" stage: they close the loop without a human |

Finout's differentiators to reason from: MegaBill (one bill across every
provider), Virtual Tags (ownership as a rule rather than a cloud tag), and
CostGuard as an aggregator of other tools' recommendations rather than yet
another recommendation engine.

The strategic question worth holding: if Cast AI and friends *automatically*
remediate, what is the durable value of a product that recommends and tracks?
The answer probably lives in **Own** and **Prove** — accountability and proof —
not in finding more waste.

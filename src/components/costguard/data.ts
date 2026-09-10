/*
 * CostGuard ledger model.
 *
 * Every service here exists in workshop-data/seed.sql, so each recommendation
 * can be plotted against its real daily cost (see evidence.ts). Open items sum
 * to $26,802, matching the "Monthly potential savings" KPI on Home.
 *
 * Lifecycle (see the guard in canStart):
 *   New --assign--> New(owned) --start--> Working on it --complete--> Done
 *   Done --verify--> Verified | Not verifiable --decay--> Regressed --reopen--> Working
 *   any open --dismiss(reason)--> Dismissed --restore--> New
 */

export type CgStatus = "New" | "Working on it" | "Done" | "Dismissed";
export type CgType = "Idle" | "Rightsizing" | "Commitment";

export type CgMarker = { at: string; label: string };

export type CgRow = {
  id: string;
  title: string;
  service: string;
  /** key into EV_SERIES — the real cost history behind the claim */
  serviceSlug: string;
  provider: string;
  type: CgType;
  team: string;
  owner: string | null;
  status: CgStatus;
  /** derived, never set by hand: was Done, then the cost came back */
  regressed?: boolean;
  projectedMonthlyUsd: number;
  /** null while open; null on a Done row means no computable baseline */
  realizedMonthlyUsd: number | null;
  baseline?: string;
  createdAt: string;
  doneAt?: string;
  regressedAt?: string;
  dismissReason?: string;
  /** provenance — how the scan found this, answerable without leaving the page */
  why: string;
  markers?: CgMarker[];
};

export type CgEvent = { at: string; who: string; what: string; kind: "system" | "person" };

export const CG_TODAY = "2026-09-06";

export const OWNERS = ["Noa Peretz", "Amit Shani", "Lior Katz", "Maya Rosen", "Tomer Adler", "Dana Weiss"];

export const DISMISS_REASONS = [
  "Needed for a scheduled workload",
  "Retained for an audit",
  "Owner disputes the saving",
  "Already planned in another ticket",
];

export const CG_ROWS: CgRow[] = [
  {
    id: "rec-014",
    title: "Warehouse runs at weekday cost every weekend",
    service: "Snowflake Warehouse", serviceSlug: "snowflake-warehouse", provider: "Snowflake",
    type: "Idle", team: "Data", owner: "Amit Shani",
    status: "Done", regressed: true,
    projectedMonthlyUsd: 2075, realizedMonthlyUsd: 0,
    baseline: "1 Apr – 5 Jun 2026",
    createdAt: "2026-03-28", doneAt: "2026-04-02", regressedAt: "2026-06-06",
    why: "Weekend cost held at 40% of weekday ($155 vs $383/day) from April until 5 June, then returned to 100% ($390 vs $389). The auto-suspend schedule stopped firing.",
    markers: [{ at: "2026-06-06", label: "Auto-suspend stopped" }],
  },
  {
    id: "rec-031",
    title: "Cluster overprovisioned — cost per vCPU-hour up 12.2%",
    service: "EKS Cluster", serviceSlug: "eks-cluster", provider: "Kubernetes",
    type: "Rightsizing", team: "Platform", owner: null, status: "New",
    projectedMonthlyUsd: 8950, realizedMonthlyUsd: null, createdAt: "2026-08-30",
    why: "Cost per vCPU-hour rose from $0.0484 (1–14 Apr) to $0.0543 (13–26 Aug) while usage grew only 4.4%. Capacity is being reserved and not used.",
  },
  {
    id: "rec-028",
    title: "Scheduled query scans an unpartitioned table",
    service: "BigQuery", serviceSlug: "bigquery", provider: "GCP",
    type: "Rightsizing", team: "Platform", owner: "Noa Peretz", status: "Working on it",
    projectedMonthlyUsd: 7068, realizedMonthlyUsd: null, createdAt: "2026-07-16",
    why: "A daily scheduled query scanned the full table from 14 July, multiplying bytes processed 4.4x. Partitioning on the date column removes the repeat scan.",
    markers: [{ at: "2026-07-16", label: "Scan begins" }],
  },
  {
    id: "rec-022",
    title: "CPU requests exceed p95 usage across deployments",
    service: "GKE Cluster", serviceSlug: "gke-cluster", provider: "Kubernetes",
    type: "Rightsizing", team: "DevOps", owner: "Dana Weiss", status: "Working on it",
    projectedMonthlyUsd: 4689, realizedMonthlyUsd: null, createdAt: "2026-07-02",
    why: "Requested CPU sits well above the 95th percentile of actual usage across the cluster's deployments. The gap is reserved capacity nobody consumes.",
  },
  {
    id: "rec-033",
    title: "Log retention plan changed on 1 August",
    service: "Datadog Logs", serviceSlug: "datadog-logs", provider: "Datadog",
    type: "Rightsizing", team: "DevOps", owner: null, status: "New",
    projectedMonthlyUsd: 2341, realizedMonthlyUsd: null, createdAt: "2026-08-01",
    why: "Daily log spend stepped up 28% on 1 August and has held flat since — a plan change, not a traffic change.",
    markers: [{ at: "2026-08-01", label: "Plan change" }],
  },
  {
    id: "rec-030",
    title: "Read replica idle — zero connections for 7 days",
    service: "RDS Postgres", serviceSlug: "rds-postgres", provider: "AWS",
    type: "Idle", team: "Core Product", owner: "Tomer Adler", status: "New",
    projectedMonthlyUsd: 1245, realizedMonthlyUsd: null, createdAt: "2026-08-24",
    why: "The replica accepted no database connections across the last 7 days while continuing to bill at full instance rate.",
  },
  {
    id: "rec-029",
    title: "Build parallelism reserved and unused",
    service: "CircleCI", serviceSlug: "circleci", provider: "Custom Cost",
    type: "Idle", team: "Growth", owner: "Maya Rosen", status: "New",
    projectedMonthlyUsd: 434, realizedMonthlyUsd: null, createdAt: "2026-08-19",
    why: "Reserved build concurrency is roughly double observed peak usage over the last 30 days.",
  },
  {
    id: "rec-011",
    title: "Cold blobs left on the hot access tier",
    service: "Blob Storage", serviceSlug: "blob-storage", provider: "Azure",
    type: "Idle", team: "Core Product", owner: "Tomer Adler", status: "Done",
    projectedMonthlyUsd: 830, realizedMonthlyUsd: 812,
    baseline: "1 May – 14 May 2026", createdAt: "2026-05-15", doneAt: "2026-05-28",
    why: "Objects untouched for 90 days were billing at hot-tier rates. Moved to cool tier.",
  },
  {
    id: "rec-009",
    title: "Lifecycle policy missing on cold buckets",
    service: "S3 Storage", serviceSlug: "s3-storage", provider: "AWS",
    type: "Idle", team: "Data", owner: "Amit Shani", status: "Done",
    projectedMonthlyUsd: 290, realizedMonthlyUsd: 301,
    baseline: "20 May – 2 Jun 2026", createdAt: "2026-06-02", doneAt: "2026-06-14",
    why: "Buckets with no lifecycle rule kept every version indefinitely. A 90-day expiry was applied.",
  },
  {
    id: "rec-018",
    title: "Rightsize db.r5.xlarge to db.r5.large",
    service: "RDS Postgres", serviceSlug: "rds-postgres", provider: "AWS",
    type: "Rightsizing", team: "Platform", owner: "Noa Peretz", status: "Done",
    projectedMonthlyUsd: 450, realizedMonthlyUsd: null,
    createdAt: "2026-07-20", doneAt: "2026-08-30",
    why: "Max CPU stayed under 50% for 7 days. Marked done on 30 August — too recent for a 14-day comparison, so the saving cannot be confirmed yet.",
  },
  {
    id: "rec-015",
    title: "Intelligent-Tiering enabled on archive buckets",
    service: "S3 Storage", serviceSlug: "s3-storage", provider: "AWS",
    type: "Idle", team: "Data", owner: "Amit Shani", status: "Done",
    projectedMonthlyUsd: 620, realizedMonthlyUsd: null,
    createdAt: "2026-05-04", doneAt: "2026-05-20",
    why: "Archive buckets were on Standard storage. Intelligent-Tiering was enabled — but a bucket migration landed in the same week, so no clean before/after window exists. The saving cannot be confirmed either way.",
  },
  {
    id: "rec-007",
    title: "Snapshots retained beyond policy",
    service: "Blob Storage", serviceSlug: "blob-storage", provider: "Azure",
    type: "Idle", team: "Platform", owner: "Noa Peretz", status: "Dismissed",
    projectedMonthlyUsd: 434, realizedMonthlyUsd: null, createdAt: "2026-06-11",
    dismissReason: "Retained for an audit",
    why: "Snapshots older than the 30-day retention policy are still billing.",
  },
];

export const CG_EVENTS: Record<string, CgEvent[]> = {
  "rec-014": [
    { at: "2026-03-28", who: "CostGuard", what: "Raised — weekend cost 2.5x the weekday baseline", kind: "system" },
    { at: "2026-03-29", who: "Noa Peretz", what: "Assigned to Amit Shani", kind: "person" },
    { at: "2026-04-02", who: "Amit Shani", what: "Marked Done — auto-suspend schedule added", kind: "person" },
    { at: "2026-04-16", who: "CostGuard", what: "Verified — $2,075/mo confirmed against the bill", kind: "system" },
    { at: "2026-06-06", who: "CostGuard", what: "Regressed — weekend cost returned to weekday levels", kind: "system" },
  ],
  "rec-028": [
    { at: "2026-07-16", who: "CostGuard", what: "Raised — bytes processed up 4.4x", kind: "system" },
    { at: "2026-07-18", who: "Noa Peretz", what: "Self-assigned", kind: "person" },
    { at: "2026-07-18", who: "Noa Peretz", what: "Moved to Working on it", kind: "person" },
  ],
  "rec-011": [
    { at: "2026-05-15", who: "CostGuard", what: "Raised — hot-tier objects untouched 90 days", kind: "system" },
    { at: "2026-05-28", who: "Tomer Adler", what: "Marked Done — moved to cool tier", kind: "person" },
    { at: "2026-06-11", who: "CostGuard", what: "Verified — $812/mo confirmed against the bill", kind: "system" },
  ],
};

export const CG_CHECKS = [
  "Idle compute instances (CPU under 5%)",
  "Idle databases (zero connections)",
  "Unattached storage volumes",
  "Load balancers under 100 requests",
  "Kubernetes requests vs p95 usage",
  "Warehouse utilisation under 50%",
  "Savings Plan and Reserved Instance coverage",
];

export const isOpen = (r: CgRow) => !!r.regressed || r.status === "New" || r.status === "Working on it";

/** Guard: you cannot start work nobody owns. */
export const canStart = (r: CgRow) => !!r.owner;

/** Done, but the 14-day comparison window has not closed yet. */
export const isVerifying = (r: CgRow) =>
  r.status === "Done" && !r.regressed && r.realizedMonthlyUsd === null && !!r.doneAt && ageInDays(r.doneAt) < 14;

export const verifyDaysLeft = (r: CgRow) => (r.doneAt ? Math.max(0, 14 - ageInDays(r.doneAt)) : 0);

export const usd = (n: number) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

export function ageInDays(iso: string, today = CG_TODAY) {
  return Math.max(0, Math.round((new Date(today).getTime() - new Date(iso).getTime()) / 86400000));
}

export function ageLabel(iso: string, today = CG_TODAY) {
  const d = ageInDays(iso, today);
  if (d === 0) return "today";
  if (d === 1) return "1 day";
  if (d < 60) return d + " days";
  return Math.round(d / 30) + " months";
}

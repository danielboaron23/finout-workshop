/*
 * Shared-cost allocation data — GENERATED from workshop-data/seed.sql.
 * Real numbers. 12,172 daily cost_events rows summed to team x month,
 * split into two buckets by service.
 *
 * The app has no runtime data access (no Supabase client, no fetch — the
 * dependency list is next/react/react-dom), so seed-derived figures are baked
 * into TypeScript. Same precedent as components/costguard/evidence.ts.
 *
 * The ONE product judgement in this file is which services count as shared
 * platform overhead. It is stated here rather than hidden in a formula:
 *   EKS Cluster, GKE Cluster, Datadog APM, Datadog Logs, CircleCI
 * Everything else is arithmetic over real dollars.
 *
 * AL_POOL_TODAY is rounded from the real sum; AL_DIRECT is then derived as
 * (rounded team total - rounded pool), so the two buckets always add back up
 * to the team month that appears everywhere else in the app. Rounding each
 * bucket independently put Core Product 1 dollar out.
 *
 * August 2026 is partial — cost_events ends 26 August.
 */

export const AL_MONTHS = ["2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"] as const;
export const AL_MONTH_LABELS = ["March 2026", "April 2026", "May 2026", "June 2026", "July 2026", "August 2026"] as const;
export const AL_PARTIAL_MONTH = "2026-08";

export const AL_SHARED_SERVICES = ["EKS Cluster", "GKE Cluster", "Datadog APM", "Datadog Logs", "CircleCI"];

export const AL_TEAMS = ["Platform", "Data", "AI", "Growth", "Core Product", "DevOps"] as const;
export type AlTeam = (typeof AL_TEAMS)[number];

/** Monthly budget per team — teams.monthly_budget_usd. Sums to $287,000. */
export const AL_BUDGET: Record<AlTeam, number> = {
  "Platform": 96500,
  "Data": 31500,
  "AI": 35500,
  "Growth": 17500,
  "Core Product": 46500,
  "DevOps": 59500,
};

/** Spend charged directly to the team, EXCLUDING the shared pool. */
export const AL_DIRECT: Record<AlTeam, number[]> = {
  "Platform": [40062, 39825, 40247, 39822, 48491, 34187],
  "Data": [24187, 23981, 24144, 26107, 27127, 22673],
  "AI": [18068, 18856, 20515, 21364, 23635, 20905],
  "Growth": [15539, 15470, 15998, 16221, 17206, 14487],
  "Core Product": [33352, 33162, 33322, 33194, 34770, 28470],
  "DevOps": [12820, 12552, 12823, 12635, 13279, 10981],
};

/** The team's CURRENT share of shared-pool services — what today's bill charges them. */
export const AL_POOL_TODAY: Record<AlTeam, number[]> = {
  "Platform": [46334, 45748, 48022, 48646, 53038, 44217],
  "Data": [4220, 4157, 4301, 4162, 4340, 4703],
  "AI": [13591, 13281, 13555, 13466, 14220, 11755],
  "Growth": [0, 0, 0, 0, 0, 0],
  "Core Product": [8317, 8138, 8431, 8197, 8545, 7663],
  "DevOps": [40680, 40521, 41560, 42427, 45526, 38273],
};

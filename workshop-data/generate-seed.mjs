#!/usr/bin/env node
/*
 * Deterministic mock-data generator for the Finout workshop Supabase project.
 * Writes seed.sql (~18k cost events, Mar 1 – Aug 26 2026) whose numbers mirror
 * the prototype's screens (MegaBill providers, Home cost centers ≈ $270k/mo,
 * the Anthropic Tokens anomaly card, the Virtual Tags rows) and plant five
 * discoverable stories:
 *
 *   1. BigQuery ×4.4 spike, Platform team, Jul 14–27   → IN anomalies table
 *   2. Anthropic tokens +9% on May 24 (the feed card)  → IN anomalies table
 *   3. Datadog Logs +28% step from Aug 1 (plan change) → IN anomalies table
 *   4. Snowflake weekends stop dropping from Jun 6
 *      (warehouse auto-suspend broke)                  → NOT flagged — the gap
 *   5. EKS cost creeps +0.09%/day since Apr 1 while
 *      usage stays flat (idle overprovisioning)        → NOT flagged — subtle
 *
 * Stories 4+5 are deliberately missing from `anomalies` so participants can
 * discover something the product "missed" and spec a feature from it.
 *
 * Run: node generate-seed.mjs   (self-checks verify every planted story)
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "seed.sql");

// mulberry32 — seeded PRNG so every run emits byte-identical data
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260827);
const noise = (spread = 0.12) => 1 + (rand() - 0.5) * spread;

/* ------------------------------------------------------------------ teams */
const TEAMS = [
  { id: 1, name: "Platform",     department: "Engineering",      lead: "Noa Peretz" },
  { id: 2, name: "Data",         department: "Data & Analytics", lead: "Amit Shani" },
  { id: 3, name: "AI",           department: "AI/ML",            lead: "Lior Katz" },
  { id: 4, name: "Growth",       department: "Product",          lead: "Maya Rosen" },
  { id: 5, name: "Core Product", department: "Engineering",      lead: "Tomer Adler" },
  { id: 6, name: "DevOps",       department: "Engineering",      lead: "Dana Weiss" },
];

/* --------------------------------------------------------------- services */
// provider matches the MegaBill chart series; baseDaily = production $/day;
// weekend = weekend cost factor; teams = [teamId, weight] pairs (sum 1).
const SERVICES = [
  { id: 1,  name: "EKS Cluster",         provider: "Kubernetes",   category: "Compute",       unit: "vCPU-hours",     price: 0.048,    baseDaily: 2600, weekend: 0.6,  region: "us-east-1",    teams: [[1, 0.6], [6, 0.4]] },
  { id: 2,  name: "GKE Cluster",         provider: "Kubernetes",   category: "Compute",       unit: "vCPU-hours",     price: 0.045,    baseDaily: 900,  weekend: 0.6,  region: "europe-west1", teams: [[3, 0.55], [6, 0.45]] },
  { id: 3,  name: "EC2 Instances",       provider: "AWS",          category: "Compute",       unit: "instance-hours", price: 0.11,     baseDaily: 1500, weekend: 0.55, region: "us-east-1",    teams: [[1, 0.5], [5, 0.5]] },
  { id: 4,  name: "S3 Storage",          provider: "AWS",          category: "Storage",       unit: "GB-months",      price: 0.023,    baseDaily: 350,  weekend: 0.95, region: "us-east-1",    teams: [[1, 0.7], [2, 0.3]] },
  { id: 5,  name: "RDS Postgres",        provider: "AWS",          category: "Database",      unit: "instance-hours", price: 0.19,     baseDaily: 600,  weekend: 0.8,  region: "us-east-1",    teams: [[1, 0.45], [5, 0.55]] },
  { id: 6,  name: "BigQuery",            provider: "GCP",          category: "Analytics",     unit: "TB-scanned",     price: 6.25,     baseDaily: 420,  weekend: 0.5,  region: "us-central1",  teams: [[1, 0.4], [2, 0.6]] },
  { id: 7,  name: "CloudSQL",            provider: "GCP",          category: "Database",      unit: "instance-hours", price: 0.17,     baseDaily: 240,  weekend: 0.8,  region: "us-central1",  teams: [[4, 0.5], [5, 0.5]] },
  { id: 8,  name: "Compute Engine",      provider: "GCP",          category: "Compute",       unit: "instance-hours", price: 0.095,    baseDaily: 300,  weekend: 0.55, region: "europe-west1", teams: [[4, 0.6], [6, 0.4]] },
  { id: 9,  name: "Gemini API",          provider: "GCP",          category: "AI",            unit: "tokens",         price: 0.000004, baseDaily: 180,  weekend: 0.85, region: "global",       teams: [[3, 0.75], [4, 0.25]] },
  { id: 10, name: "Azure VMs",           provider: "Azure",        category: "Compute",       unit: "instance-hours", price: 0.10,     baseDaily: 260,  weekend: 0.55, region: "westeurope",   teams: [[4, 0.55], [6, 0.45]] },
  { id: 11, name: "Blob Storage",        provider: "Azure",        category: "Storage",       unit: "GB-months",      price: 0.02,     baseDaily: 90,   weekend: 0.95, region: "westeurope",   teams: [[6, 1]] },
  { id: 12, name: "Oracle DB",           provider: "Oracle Cloud", category: "Database",      unit: "instance-hours", price: 0.30,     baseDaily: 120,  weekend: 0.9,  region: "us-ashburn-1", teams: [[6, 1]] },
  { id: 13, name: "Datadog APM",         provider: "Datadog",      category: "Observability", unit: "hosts",          price: 1.06,     baseDaily: 260,  weekend: 1,    region: "us1",          teams: [[1, 0.4], [5, 0.6]] },
  { id: 14, name: "Datadog Logs",        provider: "Datadog",      category: "Observability", unit: "GB-ingested",    price: 0.10,     baseDaily: 210,  weekend: 1,    region: "us1",          teams: [[2, 0.65], [5, 0.35]] },
  { id: 15, name: "OpenAI API",          provider: "OpenAI",       category: "AI",            unit: "tokens",         price: 0.000008, baseDaily: 310,  weekend: 0.85, region: "global",       teams: [[3, 0.8], [4, 0.2]] },
  { id: 16, name: "Anthropic API",       provider: "Custom Cost",  category: "AI",            unit: "tokens",         price: 0.003467, baseDaily: 105.5, weekend: 0.85, region: "global",      teams: [[3, 1]] },
  { id: 17, name: "Snowflake Warehouse", provider: "Snowflake",    category: "Analytics",     unit: "credits",        price: 3.0,      baseDaily: 380,  weekend: 0.4,  region: "us-east-1",    teams: [[2, 1]] },
  { id: 18, name: "Databricks Jobs",     provider: "Databricks",   category: "Analytics",     unit: "DBUs",           price: 0.40,     baseDaily: 290,  weekend: 0.5,  region: "us-east-1",    teams: [[2, 0.6], [3, 0.4]] },
  { id: 19, name: "CircleCI",            provider: "Custom Cost",  category: "CI-CD",         unit: "credit-minutes", price: 0.0006,   baseDaily: 95,   weekend: 0.3,  region: "global",       teams: [[5, 0.5], [6, 0.5]] },
];

/* ------------------------------------------------------------ virtual tags */
// Mirrors src/components/virtual-tags/data.ts
const VIRTUAL_TAGS = [
  { id: 1, name: "ProfitPulse",          folder: "Folder name", type: "Virtual Tag",            by: "CN", rule: { if: [{ dimension: "aws:tag:cost-center", operator: "contains", value: "profit" }], then: "ProfitPulse" }, created: "2023-01-15", updated: "2024-02-14" },
  { id: 2, name: "RevenueRadar",         folder: "Folder name", type: "Virtual Tag",            by: "CN", rule: { if: [{ dimension: "gcp:label:team", operator: "is", value: "growth" }], then: "RevenueRadar" }, created: "2022-11-08", updated: "2024-03-03" },
  { id: 3, name: "ProfitPulseDashboard", folder: "Folder name", type: "Virtual Tag",            by: "CN", rule: { if: [{ dimension: "k8s:namespace", operator: "starts_with", value: "prod-" }], then: "Production" }, created: "2023-09-03", updated: "2024-04-27" },
  { id: 4, name: "RevenueStreamMap",     folder: "Folder name", type: "Relational Virtual Tag", by: "CN", rule: { join: "teams", on: "k8s:label:team", map: "team → revenue stream" }, created: "2024-12-27", updated: "2024-05-09" },
  { id: 5, name: "MarketMetrics",        folder: null,          type: "Relational Virtual Tag", by: null, rule: { join: "services", on: "provider", map: "provider → market segment" }, created: "2025-02-14", updated: "2024-06-15" },
  { id: 6, name: "ExpenseEagle",         folder: null,          type: "Relational Virtual Tag", by: null, rule: { join: "teams", on: "aws:tag:owner", map: "owner → department" }, created: "2023-07-06", updated: "2024-07-22" },
  { id: 7, name: "FinanceFalcon",        folder: null,          type: "Relational Virtual Tag", by: null, rule: { join: "budgets", on: "team_id", map: "team → budget line" }, created: "2024-10-30", updated: "2024-08-30" },
];

/* ------------------------------------------------------------------ dates */
const START = Date.UTC(2026, 2, 1);  // Mar 1 2026
const END = Date.UTC(2026, 7, 26);   // Aug 26 2026 (inclusive)
const DAY = 86_400_000;
const iso = (t) => new Date(t).toISOString().slice(0, 10);
const between = (d, a, b) => d >= a && d <= b;

/* ----------------------------------------------------------- planted math */
const AI_GROWTH = 0.0025;   // +0.25%/day for AI services → ×~1.56 over the run
const BASE_GROWTH = 0.0002; // gentle background growth for everything else
const EKS_CREEP = 0.0009;   // story 5: +0.09%/day cost-only creep from Apr 1

function factors(svc, d, dateStr) {
  const dow = new Date(d).getUTCDay();
  const isWeekend = dow === 0 || dow === 6;
  const daysIn = (d - START) / DAY;

  let weekend = isWeekend ? svc.weekend : 1;
  let cost = 1;
  let usage = 1;

  const growth = svc.category === "AI" ? AI_GROWTH : BASE_GROWTH;
  cost *= (1 + growth) ** daysIn;
  usage *= (1 + growth) ** daysIn;

  // Story 4: Snowflake auto-suspend breaks Jun 6 — weekends stop dropping.
  if (svc.name === "Snowflake Warehouse" && isWeekend && dateStr >= "2026-06-06") weekend = 1;
  // Story 5: EKS cost creeps while usage stays flat.
  if (svc.name === "EKS Cluster" && dateStr >= "2026-04-01") {
    const creepDays = (d - Date.UTC(2026, 3, 1)) / DAY;
    cost *= (1 + EKS_CREEP) ** creepDays;
  }
  // Story 3: Datadog Logs plan change.
  if (svc.name === "Datadog Logs" && dateStr >= "2026-08-01") { cost *= 1.28; usage *= 1.28; }
  // Story 2: the Anthropic feed-card day.
  if (svc.name === "Anthropic API" && dateStr === "2026-05-24") { cost *= 1.09; usage *= 1.09; }
  // Minor resolved blips that the anomalies table DOES know about.
  if (svc.name === "EC2 Instances" && between(dateStr, "2026-04-12", "2026-04-13")) { cost *= 1.18; usage *= 1.18; }
  if (svc.name === "S3 Storage" && dateStr === "2026-06-02") { cost *= 1.12; usage *= 1.12; }

  return { weekend, cost, usage };
}

// Story 1 lives at the (service, team) level: BigQuery × Platform only.
function bigquerySpike(svc, teamId, dateStr) {
  return svc.name === "BigQuery" && teamId === 1 && between(dateStr, "2026-07-14", "2026-07-27") ? 4.4 : 1;
}

/* -------------------------------------------------------------- generate */
const events = []; // [dateStr, serviceId, teamId, env, region, usageQty, costUsd]
const stats = {
  bqPlatform: {},      // month → cost (BigQuery, Platform team)
  snowWk: {}, snowWd: {}, // month → [sum, n] weekend/weekday Snowflake daily cost
  ddLogs: {},          // month → cost
  ai: {},              // month → cost across AI category
  total: {},           // month → cost
  teamMonth: {},       // `${teamId}|${month}` → cost
  bqSpikeExtra: 0,     // extra $ during the BigQuery window vs baseline
  bqPlatformDailyBefore: [], bqPlatformDailyDuring: [],
};

for (let d = START; d <= END; d += DAY) {
  const dateStr = iso(d);
  const month = dateStr.slice(0, 7);
  for (const svc of SERVICES) {
    const f = factors(svc, d, dateStr);
    let svcSnowDay = 0;
    for (const [teamId, w] of svc.teams) {
      const spike = bigquerySpike(svc, teamId, dateStr);
      for (const [env, envShare] of [["production", 0.8], ["staging", 0.2]]) {
        const cost = svc.baseDaily * w * envShare * f.weekend * f.cost * spike * noise();
        const usage = (cost / svc.price) * (f.usage / f.cost) * noise(0.04);
        events.push([dateStr, svc.id, teamId, env, svc.region, usage, cost]);

        stats.total[month] = (stats.total[month] ?? 0) + cost;
        const tm = `${teamId}|${month}`;
        stats.teamMonth[tm] = (stats.teamMonth[tm] ?? 0) + cost;
        if (svc.category === "AI") stats.ai[month] = (stats.ai[month] ?? 0) + cost;
        if (svc.name === "Datadog Logs") stats.ddLogs[month] = (stats.ddLogs[month] ?? 0) + cost;
        if (svc.name === "Snowflake Warehouse") svcSnowDay += cost;
        if (svc.name === "BigQuery" && teamId === 1) {
          stats.bqPlatform[month] = (stats.bqPlatform[month] ?? 0) + cost;
          if (spike > 1) {
            stats.bqSpikeExtra += cost - cost / spike;
            stats.bqPlatformDailyDuring.push(cost);
          } else if (between(dateStr, "2026-06-14", "2026-07-13")) {
            stats.bqPlatformDailyBefore.push(cost);
          }
        }
      }
    }
    if (svc.name === "Snowflake Warehouse") {
      const dow = new Date(d).getUTCDay();
      const bucket = dow === 0 || dow === 6 ? stats.snowWk : stats.snowWd;
      const cur = bucket[month] ?? [0, 0];
      bucket[month] = [cur[0] + svcSnowDay, cur[1] + 1];
    }
  }
}

/* -------------------------------------------------------------- anomalies */
const avg = (a) => a.reduce((s, v) => s + v, 0) / a.length;
// Daily totals across both envs = sum of per-env rows; our arrays hold per-row
// values, so rebuild daily means from window length (14 days × 2 envs).
const bqBeforeDaily = (stats.bqPlatformDailyBefore.reduce((s, v) => s + v, 0) / 30);
const bqDuringDaily = (stats.bqPlatformDailyDuring.reduce((s, v) => s + v, 0) / 14);
const bqPct = Math.round(((bqDuringDaily - bqBeforeDaily) / bqBeforeDaily) * 100);

const ANOMALIES = [
  // The feed card (node 1:14693) — numbers match the prototype exactly.
  { id: 1, at: "2026-05-24", svc: 16, team: 3, metric: "usage", sev: "low",
    expected: 37557, actual: 40937, pct: 9.0, impact: 11.72, status: "resolved",
    desc: "Anthropic token usage exceeded the expected range (+3,380 tokens). Matches the alert shown in the product's anomaly feed." },
  { id: 2, at: "2026-07-16", svc: 6, team: 1, metric: "cost", sev: "high",
    expected: Math.round(bqBeforeDaily), actual: Math.round(bqDuringDaily), pct: bqPct,
    impact: Math.round(stats.bqSpikeExtra), status: "acknowledged",
    desc: "BigQuery daily cost for the Platform team spiked ~4x. Root cause: an unpartitioned events table scanned by a new scheduled query. Ran Jul 14-27." },
  { id: 3, at: "2026-08-01", svc: 14, team: 2, metric: "cost", sev: "medium",
    expected: 210, actual: 269, pct: 28.0, impact: null, status: "open",
    desc: "Datadog Logs daily cost stepped up ~28% on Aug 1 after the ingestion plan changed. Impact still accruing." },
  { id: 4, at: "2026-04-12", svc: 3, team: 5, metric: "cost", sev: "low",
    expected: 750, actual: 885, pct: 18.0, impact: 270, status: "resolved",
    desc: "EC2 spot interruption forced two days of on-demand fallback (Apr 12-13)." },
  { id: 5, at: "2026-06-02", svc: 4, team: 1, metric: "cost", sev: "low",
    expected: 245, actual: 274, pct: 12.0, impact: 29, status: "resolved",
    desc: "S3 storage one-day bump from a retained backup snapshot." },
];
// Deliberately absent: the Snowflake weekend regression (since Jun 6) and the
// EKS cost-per-vCPU creep — participants should find these themselves.

/* ---------------------------------------------------------------- budgets */
// Budget = (Mar+Apr avg monthly spend) × 1.12, rounded to $500.
// Forecast: closed months = actual; Aug = extrapolated from 26 days to 31.
const MONTHS = ["2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"];
const budgets = [];
for (const t of TEAMS) {
  const baseline = ((stats.teamMonth[`${t.id}|2026-03`] ?? 0) + (stats.teamMonth[`${t.id}|2026-04`] ?? 0)) / 2;
  const budget = Math.round((baseline * 1.12) / 500) * 500;
  t.budget = budget;
  for (const m of MONTHS) {
    const actual = stats.teamMonth[`${t.id}|${m}`] ?? 0;
    const forecast = m === "2026-08" ? (actual / 26) * 31 : actual;
    budgets.push([t.id, `${m}-01`, budget, forecast.toFixed(2)]);
  }
}

/* ------------------------------------------------------------ self-checks */
const checks = [];
function check(label, value, ok) {
  checks.push({ label, value, ok });
  if (!ok) process.exitCode = 1;
}
const bqRatio = stats.bqPlatform["2026-07"] / stats.bqPlatform["2026-06"];
check("BigQuery Platform Jul/Jun ratio > 2.2", bqRatio.toFixed(2), bqRatio > 2.2);
const snowJulRatio = (stats.snowWk["2026-07"][0] / stats.snowWk["2026-07"][1]) / (stats.snowWd["2026-07"][0] / stats.snowWd["2026-07"][1]);
const snowAprRatio = (stats.snowWk["2026-04"][0] / stats.snowWk["2026-04"][1]) / (stats.snowWd["2026-04"][0] / stats.snowWd["2026-04"][1]);
check("Snowflake weekend/weekday Apr < 0.6", snowAprRatio.toFixed(2), snowAprRatio < 0.6);
check("Snowflake weekend/weekday Jul > 0.85", snowJulRatio.toFixed(2), snowJulRatio > 0.85);
const ddRatio = (stats.ddLogs["2026-08"] / 26) / (stats.ddLogs["2026-07"] / 31);
check("Datadog Logs Aug/Jul daily ratio ≈ 1.28", ddRatio.toFixed(2), ddRatio > 1.18 && ddRatio < 1.4);
const aiGrowth = (stats.ai["2026-08"] / 26) / (stats.ai["2026-03"] / 31);
check("AI daily spend Aug/Mar > 1.35", aiGrowth.toFixed(2), aiGrowth > 1.35);
const julyTotal = stats.total["2026-07"];
check("July total in $230k-$340k", `$${Math.round(julyTotal).toLocaleString("en-US")}`, julyTotal > 230_000 && julyTotal < 340_000);
const platformOver = stats.teamMonth["1|2026-07"] > TEAMS[0].budget;
check("Platform exceeds budget in July", `$${Math.round(stats.teamMonth["1|2026-07"]).toLocaleString("en-US")} vs $${TEAMS[0].budget.toLocaleString("en-US")}`, platformOver);

/* -------------------------------------------------------------- write SQL */
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const lines = [];
lines.push("-- GENERATED by generate-seed.mjs — do not edit by hand. Run schema.sql first.");
lines.push("begin;");
lines.push("truncate teams, services, cost_events, virtual_tags, anomalies, budgets restart identity cascade;");

lines.push("insert into teams (id, name, department, lead_name, monthly_budget_usd) values");
lines.push(TEAMS.map((t) => `(${t.id}, ${q(t.name)}, ${q(t.department)}, ${q(t.lead)}, ${t.budget})`).join(",\n") + ";");

lines.push("insert into services (id, name, provider, category, usage_unit) values");
lines.push(SERVICES.map((s) => `(${s.id}, ${q(s.name)}, ${q(s.provider)}, ${q(s.category)}, ${q(s.unit)})`).join(",\n") + ";");

lines.push("insert into virtual_tags (id, name, folder, tag_type, created_by, rule, created_at, updated_at) values");
lines.push(VIRTUAL_TAGS.map((v) =>
  `(${v.id}, ${q(v.name)}, ${v.folder ? q(v.folder) : "null"}, ${q(v.type)}, ${v.by ? q(v.by) : "null"}, ${q(JSON.stringify(v.rule))}::jsonb, ${q(v.created)}, ${q(v.updated)})`,
).join(",\n") + ";");

const BATCH = 1000;
for (let i = 0; i < events.length; i += BATCH) {
  lines.push("insert into cost_events (usage_date, service_id, team_id, environment, region, usage_qty, cost_usd) values");
  lines.push(events.slice(i, i + BATCH).map(
    ([d, s, t, env, r, u, c]) => `(${q(d)}, ${s}, ${t}, ${q(env)}, ${q(r)}, ${u.toFixed(2)}, ${c.toFixed(2)})`,
  ).join(",\n") + ";");
}

lines.push("insert into anomalies (id, detected_at, service_id, team_id, metric, severity, expected_value, actual_value, pct_change, cost_impact_usd, status, description) values");
lines.push(ANOMALIES.map((a) =>
  `(${a.id}, ${q(a.at)}, ${a.svc}, ${a.team}, ${q(a.metric)}, ${q(a.sev)}, ${a.expected}, ${a.actual}, ${a.pct}, ${a.impact ?? "null"}, ${q(a.status)}, ${q(a.desc)})`,
).join(",\n") + ";");

lines.push("insert into budgets (team_id, month, budget_usd, forecast_usd) values");
lines.push(budgets.map(([t, m, b, f]) => `(${t}, ${q(m)}, ${b}, ${f})`).join(",\n") + ";");

lines.push("commit;");
lines.push("analyze;");
writeFileSync(OUT, lines.join("\n") + "\n");

/* ----------------------------------------------------------------- report */
console.log(`seed.sql written: ${events.length.toLocaleString("en-US")} cost events, ${TEAMS.length} teams, ${SERVICES.length} services, ${ANOMALIES.length} anomalies, ${budgets.length} budget rows`);
console.log("\nMonthly totals:");
for (const m of MONTHS) console.log(`  ${m}  $${Math.round(stats.total[m]).toLocaleString("en-US")}${m === "2026-08" ? " (26 days)" : ""}`);
console.log("\nPlanted-story checks:");
for (const c of checks) console.log(`  ${c.ok ? "PASS" : "FAIL"}  ${c.label}  [${c.value}]`);
if (process.exitCode) console.error("\nSOME CHECKS FAILED — do not ship this seed.");

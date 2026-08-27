# Workshop Data — mock Finout database on Supabase

A Postgres database of realistic FinOps data that mirrors the prototype's
screens: same providers as the MegaBill chart, monthly totals that match the
Home dashboard (~$270k/mo), the exact Anthropic Tokens card from the Anomalies
feed, and the Virtual Tags rows. Participants connect Claude Code to it via
MCP, ask questions in plain language, find real (planted) cost stories, and
turn them into PRDs.

## Files

| File | What |
|---|---|
| `schema.sql` | Tables + convenience views + (commented) read-only role. Run first. |
| `generate-seed.mjs` | Deterministic generator — same output every run. `node generate-seed.mjs` |
| `seed.sql` | Generated data: ~12k daily cost events (Mar 1 – Aug 26 2026), 6 teams, 19 services, 5 anomalies, budgets. |
| `exercises.md` | Participant prompts + facilitator notes (spoilers inside). |

## Setup (facilitator, ~10 minutes)

1. **Create a project** at [supabase.com](https://supabase.com) (free tier is plenty — the data is <20 MB).
2. **SQL Editor → paste `schema.sql` → Run.**
3. **SQL Editor → paste `seed.sql` → Run** (762 KB — takes a few seconds).
   Or from a terminal: `psql "<connection-string>" -f seed.sql`
4. **Create the read-only role** — uncomment the block at the bottom of
   `schema.sql`, choose a password, run it.
5. **Get the connection string participants will use:** dashboard → Connect →
   **Session pooler** (the pooler works on IPv4 networks; the direct
   `db.*.supabase.co` host is IPv6-only and fails on most office Wi-Fi).
   Replace the user with `workshop_reader.<project-ref>` and use the password
   from step 4.

Sanity check in the SQL editor:

```sql
select month, sum(total_cost_usd) from v_monthly_provider_costs group by 1 order by 1;
-- expect ~$255k–290k per month, July highest
```

## Participants connect (one line)

```bash
claude mcp add finout-data -- npx -y @modelcontextprotocol/server-postgres \
  "postgresql://workshop_reader.<project-ref>:<password>@<pooler-host>:5432/postgres"
```

Then in Claude Code: *"What data do I have access to in finout-data?"*

Safety: the MCP server runs read-only transactions AND the role only has
SELECT — participants cannot change anything, so one shared credential for
the whole room is fine. Rotate the password after the workshop.

## What's in the data (facilitator spoilers — don't share)

Five stories are planted. Three are flagged in the `anomalies` table; **two
are deliberately missing** so participants can discover something the product
"missed" and spec a feature from it:

| # | Story | In `anomalies`? |
|---|---|---|
| 1 | BigQuery ×4.4 spike, Platform team, Jul 14–27 (unpartitioned table + scheduled query). Pushes Platform over its July budget. | ✅ acknowledged |
| 2 | Anthropic tokens +9% on May 24 — the exact card from the prototype's feed (37,557 → 40,937 tokens). | ✅ resolved |
| 3 | Datadog Logs +28% step from Aug 1 (plan change). | ✅ open |
| 4 | **Snowflake weekends stop dropping from Jun 6** — warehouse auto-suspend broke; weekend cost ≈ weekday cost (was ~40%). ~$1.4k/mo waste. | ❌ the gap |
| 5 | **EKS cost-per-vCPU creeps +0.09%/day since Apr 1** while usage stays flat — idle overprovisioning. | ❌ subtle gap |

Background trends: AI spend (OpenAI + Gemini + Anthropic) grows ~45% over the
six months; everything else is roughly flat with weekday/weekend seasonality.

Regenerating: `node generate-seed.mjs` — seeded PRNG, byte-identical output,
and it self-checks that every planted story is statistically detectable
(exits non-zero if not).

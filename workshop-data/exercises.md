# Data → Insights → PRD — workshop exercises

You have read-only access to Finout's (mock) product database through the
`finout-data` MCP connection. Everything below is a prompt you paste into
Claude Code — no SQL knowledge needed. The goal: experience the full loop
**question → data → insight → spec document**.

## Warm-up

**1. Meet the data.**
> What do I have access to in finout-data? Describe the tables, how they
> relate, and show me one example row from each.

**2. First answers.**
> What did we spend last month, broken down by provider? Which provider is
> growing fastest since March?

*(Cross-check: open the prototype's MegaBill screen — same providers.)*

## Find insights

**3. Anomaly hunt.**
> Look at daily costs over the whole period. Find anything unusual — spikes,
> steps, trend breaks — and for each one tell me: which service, which team,
> when, and how much it cost us.

**4. Did the product catch it?**
> Compare what you just found against the `anomalies` table. Did Finout's
> anomaly detection miss anything? If so, why do you think its detection
> logic missed it?

**5. Budget forecast.**
> Which teams exceeded their monthly budget so far, and which are on track to
> exceed it this quarter if current trends continue? Show the math.

## Turn an insight into a spec

**6. Write the PRD.**
> Based on the Snowflake pattern you found in exercise 4: write a one-page
> PRD for a new Finout feature that would catch this class of waste
> automatically and help the customer act on it. Include: problem statement
> (with the real numbers from our data), target persona, user stories, how it
> surfaces in the existing UI (use the Anomalies feed and Home dashboard from
> our prototype as the surface), success metrics, and open questions.

**7. Improve an existing feature.**
> The `anomalies` table shows what our detection engine flags today. Write a
> short spec for improving the anomaly feed card: what extra context from the
> database (team, budget impact, similar past anomalies) should each card
> show so a PM can triage without leaving the page? Reference the current
> card design in the prototype.

---

## Facilitator notes (don't share — spoilers)

| Exercise | Expected discovery |
|---|---|
| 2 | AI providers (OpenAI, Gemini, Anthropic via Custom Cost) grew ~45% Mar→Aug; everything else roughly flat. |
| 3 | Should surface: BigQuery ×4.4 (Jul 14–27, Platform), Datadog Logs +28% step (Aug 1), Snowflake weekend flattening (from Jun 6), possibly the EKS cost-per-vCPU creep (divide cost_usd by usage_qty!). |
| 4 | **The gap:** Snowflake weekend regression and EKS creep are NOT in `anomalies`. Discussion: threshold-based detection catches spikes, not "cost stopped going down" or slow drift. |
| 5 | Platform blew its July budget ($101.5k vs $96.5k) — driven by the BigQuery spike. Data team trending over in August (Datadog step). |
| 6 | The money moment: a PRD grounded in real numbers, referencing screens the room already knows. Push for specificity — where does the alert appear, what does the card say, what's the CTA? |
| 7 | Lighter variant of 6 for a second round or slower groups — improving an existing surface instead of inventing one. |

Timing suggestion: 1–2 warm-up (10 min) → 3–4 together (15 min) →
5 or 6 by persona (20 min) → share-outs. Exercise 6 works well as the
closing demo if time runs short.

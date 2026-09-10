# Competitive design analysis — framework

Adapted from `competitive-analysis` in Owl-Listener/designer-skills, sharpened
for FinOps and for this repo.

Table of contents:
1. Who counts as a competitor
2. Evaluation dimensions
3. The comparison matrix
4. Reading a reference honestly
5. From references to an opportunity

---

## 1. Who counts as a competitor

Pick references in three bands. A board with only direct competitors produces a
design that looks exactly like the category — which is how products become
interchangeable.

| Band | Definition | Why it earns a slot |
|---|---|---|
| **Direct** | Same problem, same buyer | Establishes table stakes. What users already expect to find |
| **Indirect** | Same problem, different buyer or shape | Shows the problem solved under different constraints |
| **Aspirational** | Best-in-class from an adjacent domain | Where the actual idea comes from |

For FinOps work, the aspirational band usually matters most, because the
category's own design is weak. When researching anything about **owning,
tracking or proving work** — recommendations, remediation, accountability — the
best prior art is not in cost tooling at all. It is in issue trackers and
incident tools: Linear, Jira, Sentry, PagerDuty, Datadog monitors. Search those
too, always.

The market landscape for the direct band lives in
`../finout-pm/references/product-context.md` §6, if that skill is installed.

Also research the **status quo**: a spreadsheet, a Slack thread, a recurring
meeting. If the honest answer is that people forward a CSV to each other, that
is the competitor to beat, and it should appear on the board.

## 2. Evaluation dimensions

Score each reference on the dimensions that matter for the screen at hand — not
all of them, every time. Pick three to five and use the same set across every
reference, or the matrix is meaningless.

- **Information architecture** — what is grouped with what, and what is one
  click away
- **Density** — how much is on screen at once, and whether it scales to
  hundreds of rows
- **Prioritization** — how the eye is directed to what matters first
- **Status and ownership** — how state and responsibility are shown
- **Actionability** — how far the user gets without leaving the screen
- **Evidence** — how a claim is justified (chart, number, provenance)
- **Empty and success states** — what happens when there is nothing to show

## 3. The comparison matrix

One row per reference, one column per dimension. Score 1–5 and add a short
verdict. The matrix is the slide that earns the research — it turns twelve
screenshots into a defensible point of view.

| Reference | IA | Density | Prioritization | Evidence | Verdict |
|---|---|---|---|---|---|

Never present screenshots without the matrix. A wall of inspiration is not
research; it is a mood board with a job title.

## 4. Reading a reference honestly

The discipline that separates research from screenshot collecting:

- **Describe what is actually on the screen**, not what the app is famous for.
  Look at the image. Metadata and brand reputation lie.
- **Name what it gets wrong.** Every reference has a flaw. A board where
  everything is excellent is a board where nobody looked properly, and it gives
  the designer nothing to react against.
- **Separate the pattern from the skin.** The transferable thing is usually
  structure — "status is a column, not a badge on the card" — not colour or
  corner radius.
- **Ask what constraint produced it.** A dense enterprise table exists because
  its users scan hundreds of rows daily. Copying the density without the
  constraint produces a worse screen.
- **Say when a reference does not transfer.** A consumer app's playful empty
  state will not survive contact with a FinOps buyer. Note it and move on.

## 5. From references to an opportunity

End every study with a point of view, not a summary. Three parts:

1. **Table stakes** — what every reference does, which this screen must
   therefore do. Skipping these reads as broken, not as innovative.
2. **The split** — where references genuinely disagree. This is the real design
   decision, and it belongs in front of the designer as an explicit choice with
   named trade-offs, not resolved silently.
3. **The gap** — what none of them do, that this product is positioned to do.
   Tie it to something the product actually has. An opportunity nobody can build
   is trivia.

Then state the recommendation and what would have to be true for it to be wrong.

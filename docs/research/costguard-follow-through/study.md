# CostGuard ledger — design research

**Date:** 2026-09-06
**Brief:** `docs/prd/costguard-follow-through.md` §9
**Question:** How do products show a ledger of committed work with owners and
statuses, put projected against realized figures, admit that finished work came
undone, and treat an empty list as a success?
**12 references, all from Mobbin, platform `web`.**

---

## Where we looked

| Band | Who | Why |
|---|---|---|
| **Direct** | AWS, Snowflake | The category. Establishes what a FinOps buyer already expects |
| **Indirect** | 7shifts, Xero, Clay | Products that live or die on projected vs. actual, and on who owns a line |
| **Aspirational** | Supabase, Linear, Jira, GitLab, ClickUp, Twenty | Issue and incident tooling, where accountability was solved a decade ago |

The aspirational band earned its place. FinOps tools are strong at *finding* and
weak at *following through*; issue trackers are the reverse. The interesting
references are almost all outside the category.

**The status quo** — a spreadsheet of optimisation tickets pasted into a monthly
Slack update — is the honest competitor. It is genuinely adequate at recording
that work happened. It cannot verify the bill moved, and it cannot notice a
saving reverting. Everything below is judged against that bar, not against AWS.

## What each reference teaches

### Direct

**AWS — Recommended actions**
Puts recommendations beside the spend as dismissible cards, each with a title,
one line of explanation and a single link.
*Right:* the recommendation sits next to the number that motivates it; dismissal
is one click and visually obvious.
*Wrong:* a card carries no owner, no status and no age. Dismissing is
indistinguishable from doing. Three cards work; forty would be unusable.
[Mobbin](https://mobbin.com/screens/b59a3360-394f-4a2e-8cb7-eebfd3652808)

**AWS — plan table with State and a summary row**
A dense table with checkboxes, a `State` column of `New` badges, group-by, and a
footer reading *Number of lines 5/2000 · Historical cost $0.00 · Estimated cost
$14.60*.
*Right:* the persistent summary footer — the total is always visible without
scrolling or selecting. Directly applicable to a ledger of dollar amounts.
*Wrong:* `State` has exactly one value in practice, so the column is decoration.
A status column only earns its width when states genuinely differ.
[Mobbin](https://mobbin.com/screens/e02ff405-fa55-4cb4-93a5-8b86dbb137ed)

**Snowflake — Cost insights**
Lists every check it ran — *large tables never queried, rarely used materialized
views, inefficient multi-cluster autoscale* — each with a green tick, under the
heading that it found no savings opportunities.
*Right:* **the best empty state in the set.** It converts "nothing to show" into
"here is exactly what we checked, and it is fine." Absence becomes evidence.
*Wrong:* it is a dead end. Every check passing gives no way to see history, or
to know when the checks last changed.
[Mobbin](https://mobbin.com/screens/725959e2-fde7-4b89-a8e3-1d272d9ec735)

### Aspirational

**Supabase — Security Advisor**
The closest analogue anyone has to a recommendations ledger: severity tabs with
counts (*Errors 2 · Warnings 7 · Info 8 suggestions*), a scannable issue list
with `CRITICAL` badges, a **Rerun linter** action, and an inline
*"How are these suggestions generated?"* explainer.
*Right:* three things worth stealing — counts live in the tabs, the scan is
re-runnable from the screen, and provenance is explained in place rather than in
docs.
*Wrong:* every issue is anonymous. Nothing is assigned, nothing is aged, and
there is no notion of an issue being handled. It is a findings list, not a ledger.
[Mobbin](https://mobbin.com/screens/48251c0c-48b0-4de9-a687-8882b41a8e59)

**Linear — issue activity**
The activity feed collapses a regression into one line:
*"Alex Smith moved the issue to Done, then back to In Progress · 22h ago."*
*Right:* the only reference in the set that acknowledges finished work coming
undone, and it does so with admirable economy.
*Wrong:* **it is buried in an activity log on a detail page.** Nothing in the
list view says this issue has bounced. The one product that models regression
hides it from the only view where it would change a decision.
[Mobbin](https://mobbin.com/screens/beb9d6b3-ec34-46d7-9332-320fcb32a338)

**Snowflake — closed support case**
Status `Closed`, with **Reopen Case** and, beneath it,
*"Available for 1 week, 2 days, 23 hours."*
*Right:* reopening is time-boxed. A closed thing is not closed forever, but it is
not reopenable forever either — a genuinely useful idea for a saving that must be
watched for a bounded window.
*Wrong:* the countdown is arbitrary and unexplained. The user cannot tell why
that window, or what happens at the end of it.
[Mobbin](https://mobbin.com/screens/e81c4b97-52ae-4e4f-93fa-6abd84817c65)

**Jira — issue History tab**
Every field change logged: *"Sam Lee changed the Assignee · Unassigned → Sam Lee",*
start date, team, comments, each with an actor and a relative timestamp.
*Right:* the audit trail Finout's own blog says is missing when decisions happen
in Slack. Assignment changes are first-class events.
*Wrong:* undifferentiated. Deleting a comment and reassigning ownership get equal
visual weight, so the events that matter are lost among the ones that do not.
[Mobbin](https://mobbin.com/screens/4ecaec7d-b384-4747-b30e-8735992c5ecf)

**Twenty — task table**
Title, Status, Created by, Due Date, Assignee, and a creation column rendering as
*"about 2 hours ago."*
*Right:* relative age as a column. For a ledger whose central failure is items
going stale, "92 days" says more than a date does.
*Wrong:* status is a bare text label with no weight or colour, so scanning for
state across rows fails at any real density.
[Mobbin](https://mobbin.com/screens/272a0f20-51e9-4b9c-bb2e-27d82a590ea1)

**ClickUp — list grouped by status**
Rows grouped under collapsible status headers, each with a count, assignee
avatars and due dates.
*Right:* grouping by status with counts answers "what is stuck" before any
filter is touched.
*Wrong:* six groups is too many. Collapsed groups hide work, and the eye has no
default resting place.
[Mobbin](https://mobbin.com/screens/8b2419a3-f16a-4a36-8269-871829c24f8c)

### Indirect

**7shifts — labour variance table**
Adjacent columns: *Actual Sales · Projected Sales · Sales Variance · Actual
Labor · Scheduled Labor · Labor Variance*, variance signed and coloured, with a
Total row, over a chart plotting actual against projected.
*Right:* **the clearest projected-vs-actual model in the set.** Variance is its
own column rather than something the reader computes, and the total is always
present. This is the shape the realized-savings problem needs.
*Wrong:* six numeric columns with near-identical headers. Without the colour
you could not parse it, and colour alone is not an accessible carrier.
[Mobbin](https://mobbin.com/screens/e7f4ff6e-88da-4978-839d-66550face4ad)

**Xero — bulk selection panel**
A side panel listing overdue bills with checkboxes, *"Select all · 2 selected"*,
per-row amounts and dates, and a primary **Update bills** action.
*Right:* selection state, count and the resulting action stay together in one
place, and each row shows the amount at stake.
*Wrong:* the count says how many, never how much. For money work the selected
total is the number that governs the decision.
[Mobbin](https://mobbin.com/screens/d7179a06-0195-4f94-97a9-19e781e3f50e)

**Clay — workspace usage**
Indented rows with an **Owner** column of avatar-plus-name, `Archived` badges,
and usage figures.
*Right:* owner is a column with a face in it, not a filter. Archived stays
visible rather than disappearing.
*Wrong:* every owner in view is the same person, so the column carries no
information. An ownership column only works when ownership is genuinely
distributed.
[Mobbin](https://mobbin.com/screens/7998e986-ae95-46d2-b147-363f2d1463a8)

## The matrix

Scored 1–5 on the four dimensions the brief actually contests.

| Reference | Status legibility | Ownership | Evidence in place | Shows regression | Verdict |
|---|---|---|---|---|---|
| AWS · Recommended actions | 2 | 1 | 3 | 1 | Good placement, no accountability |
| AWS · plan + summary row | 2 | 1 | 3 | 1 | Steal the persistent total footer |
| Snowflake · Cost insights | — | 1 | 5 | 1 | **Best empty state anywhere** |
| Supabase · Security Advisor | 4 | 1 | 4 | 1 | Closest analogue; findings, not a ledger |
| Linear · activity | 3 | 5 | 4 | **3** | Only one to model regression — and it hides it |
| Snowflake · reopen window | 4 | 2 | 2 | **3** | Time-boxed reopen is a real idea |
| Jira · History | 2 | 5 | 5 | 2 | The audit trail, undifferentiated |
| Twenty · task table | 2 | 4 | 2 | 1 | Relative age as a column |
| ClickUp · status groups | 5 | 4 | 2 | 1 | Grouping with counts, too many groups |
| 7shifts · variance | 3 | 1 | 5 | 1 | **The projected-vs-actual model** |
| Xero · bulk panel | 3 | 2 | 4 | 1 | Selection + action together; count without total |
| Clay · owner column | 3 | 4 | 2 | 1 | Owner as a column with a face |

Nothing scores above 3 on regression. Two references touch it; both put it
somewhere you would never look in time.

## Design direction

### Table stakes

Not doing these reads as broken, because every comparable product does them:

- **Status as a weighted, coloured label** — never bare text (Twenty's failure).
- **A named person as a column, with a face** — not a team, not a filter (Clay,
  Linear, Jira).
- **Counts against each cut of the list**, in the tabs themselves (Supabase,
  ClickUp).
- **Relative age**, not a creation date (Twenty).
- **A persistent total that does not depend on selection** (AWS summary row).
- **Provenance in place** — why this was raised, answerable without leaving the
  screen (Supabase's "How are these suggestions generated?").
- **Re-run the scan from the screen** (Supabase's Rerun linter).
- **An audit trail of who changed what, when** (Jira) — the fix for the
  untracked-decisions failure Finout names in its own writing.

### The split

Two genuine disagreements. Both are the designer's call, not ours:

**1. Group by status, or filter by status?**
ClickUp groups into collapsible sections with counts — "what is stuck" is
answered before you touch anything, but work hides inside collapsed groups and
the eye has no default home. Supabase and Twenty keep one flat list and put the
cuts in tabs — always scannable, but you must choose a tab to see the shape.
*Weight for this screen:* the ledger has five states and one of them (Regressed)
must never be collapsible. That pushes toward flat-plus-tabs, but a designer
could reasonably pin Regressed above a grouped list instead.

**2. Is variance its own column, or a treatment on the realized figure?**
7shifts gives variance a dedicated column — unambiguous, and it costs a full
column of width in a table that already wants many. The alternative renders
projected and realized in one cell with the delta as a treatment — compact, and
it keeps the pair adjacent, but it invents a component and leans on colour.
*Weight:* the PRD's "Not verifiable" case has to live wherever this lands, and it
is a state, not a number. That argues for one composite cell that can hold a
verdict — but the accessibility cost of colour-carried meaning is real and 7shifts
shows it plainly.

### The gap

**No reference surfaces work that was completed and then came undone.**

Linear models it and buries it in an activity log. Snowflake allows a reopen and
time-boxes it, on a detail page. Nowhere does a list view say *this was done, and
it is not done any more.*

Finout is positioned to close this precisely, and uniquely:

- It already holds daily cost per service in `cost_events`, so a saving can be
  **verified against the bill** rather than against someone marking a ticket Done.
- Verification that runs once is a report; verification that keeps running is a
  watchdog. The data supports the second at no extra cost.
- Our own seed proves the need. Snowflake Warehouse weekend cost held at **40% of
  weekday** ($155 vs $383/day) until **6 June**, then returned to **100%** ($390 vs
  $389) — **$5,596 across 24 weekend days, ≈$2,075/month**, still running. No
  anomaly fired.

The category treats an optimisation as an event. The data says it is a state that
can decay. That is the opening.

### Recommended structure

A **ledger**, not a findings list. Concretely:

1. **Regression is a first-class row state, surfaced above the ordinary list** —
   the one place every reference fails. Something already believed and now false
   outranks something merely new.
2. **Flat list with counts in the tabs**, not collapsible groups, so Regressed can
   never be hidden.
3. **Projected and realized adjacent, with the verdict in the same cell** — able
   to render *"Not verifiable"* as a first-class outcome, never `$0`.
4. **Owner as an avatar column**, assignable inline.
5. **Relative age** on every open row.
6. **A persistent footer total** that shows realized-to-date, plus a selected
   total when rows are checked — Xero's panel fixed by AWS's footer.
7. **Empty state modelled on Snowflake's Cost insights**: name every check that
   ran, tick them, and show the realized total earned so far. Nothing to fix is a
   result, not a blank screen.
8. **Every status change logged with actor and timestamp**, Jira-style but
   weighted — assignment and verification events louder than edits.

**What would make this wrong:** if FinOps leads do not actually revisit closed
items, the regression state is engineering nobody asked for and the screen should
be a simpler findings list. Testable in one conversation with a real FinOps lead —
ask what they did the last time a saving came back, and whether they found out at
all. Worth asking before build.

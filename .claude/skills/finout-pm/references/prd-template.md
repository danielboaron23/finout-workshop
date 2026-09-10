# PRD template

Write to `docs/prd/<slug>.md`. Keep sections 1–8 to roughly one page. Section 9
is the machine-readable handoff and may run longer.

Delete any section that genuinely does not apply — but say why in Open questions
rather than leaving it silently missing.

---

```markdown
# <Screen or feature name>

**Status:** draft | reviewed | approved
**Date:** <YYYY-MM-DD>
**Surface:** <route, e.g. /costguard>
**Sources:** <files and tables this is grounded in>

## 1. Problem

Three to five sentences, no solution in them. Name who is stuck, what they were
trying to do, what stops them, and what it costs — with a number traceable to
the repo or workshop-data/.

If the problem is a promise the product already made and did not keep, quote the
promise and cite the file.

## 2. Who it's for

Primary persona and the decision they are trying to make. Secondary personas and
what they need from the same screen. Anyone explicitly not served.

## 3. What exists today

What the product does now, and where it stops. Cite real screens, components and
routes. If a competitor or the status quo already solves this adequately, say so
here — that is a reason not to build.

## 4. Non-goals

What this is deliberately not doing, and why. Scope creep dies here.

## 5. Decisions

The hard calls, made — not deferred. One line of rationale each.

| Decision | Choice | Why |
|---|---|---|
| | | |

Every PRD touching cost recommendations must resolve the service-level vs.
resource-level data question here. See product-context.md §5.

## 6. User stories

As a <persona>, I want <capability> so that <outcome>.

Ordered by importance. Each one must be observable in the UI — if it can't be
seen on a screen, it belongs in Non-goals or Open questions.

## 7. Success metrics

What changes if this works, stated specifically enough to settle a future
argument. Include the current baseline where the data supports one, and say
plainly where no baseline exists.

## 8. Open questions

Genuinely unresolved things, each with who decides and by when. Do not park
decisions here that section 5 should have made.

## 9. Screen requirements

Fixed shape. The design-research and designer skills read this section — keep the
four sub-headings exactly as written.

### Surfaces

Where this lives and how it is reached.

| Surface | Detail |
|---|---|
| Route | |
| Sidebar entry | item label, which section (Inform / Optimize / Operate) |
| Entry points | existing screens/components that link here, with file paths |
| Exits | where the user goes next |

Include a breadboard of the main flow:
`<trigger> → <screen> → <action> → <result> → <next choice>`

### States

Every state the screen must handle. Empty is not optional — for an optimization
screen, "nothing to fix" is a *success* state and should feel like one.

| State | When | What the user sees |
|---|---|---|
| Empty | | |
| Loading | | |
| Populated | | |
| Error | | |
| Permission | | |

### Data fields

Every field on the screen, with its origin. "new" means the schema does not have
it yet and the work includes adding it.

| Field | Source | Example | Notes |
|---|---|---|---|
| | table.column / derived / new | | |

### Components

Reuse is the default. Each new component is a cost that must earn its place.

**Reuse** (from the inventory in DESIGN_CONTEXT.md):
- `<Component>` — used for what

**New:**
- `<Component>` — what it does, why nothing existing covers it, where else it
  would be reused

## Appendix

Supporting queries, competitor notes, screenshots, anything too long for above.
```

# Frameworks

Method adapted from **Lenny's Product Skills** (`RefoundAI/lenny-skills`), which
distills Lenny's Podcast and Newsletter. Quotes below are verbatim from that
source. Applied here to a repo-connected FinOps product.

Table of contents:
1. Shape before you spec
2. The 1-pager: five elements
3. Problem first, always
4. Brevity as a forcing function
5. Don't micromanage the design
6. Competitor research method
7. Review checklist

---

## 1. Shape before you spec

> "What we need to do in a shaping session is we come out with some kind of
> diagram where engineers, product and design, they're saying, 'We understand
> that.' So the first thing is we are not going to start something unless we can
> see the end from the beginning."
> — Ryan Singer

Do not open the PRD template on a fuzzy idea. Shape it to a bounded concept
first, then write.

Two shaping tools, both deliberately cruder than Figma:

- **Breadboarding** — a text flow of screens, actions, and connections:
  *"Hit this button → go to this screen → this calculation runs → get this answer
  → choice to go here or here."* Test it by asking whether a builder could say
  "I know what to go build."
- **Fat marker sketching** — thick, rough shapes. Low fidelity on purpose:
  nobody can argue about colour, so they have to argue about the concept.

> "Use big chunky blocks to represent where things might be located. Because it
> is so low fidelity, stakeholders cannot comment on colors or shapes, forcing
> them to discuss the core concept and flow." — Bob Baxley, on block diagrams

In this repo, breadboarding is the right output of the shaping conversation and
it feeds the **Surfaces** section of the handoff contract directly.

Also true here:

> "We used to go off and make this two-year, five-year, 10-year vision even. Now
> it becomes a vision that's three to six months out, and isn't necessarily
> creating this beautiful deck, sometimes just creating a prototype that points
> people in the right direction." — Jenny Wen

The prototype in this repo *is* the artifact. A PRD that ends in a built screen
beats one that ends in a document.

## 2. The 1-pager: five elements

The evaluation rubric — use it both to write and to review.

1. **Problem-oriented** — crystallize the problem in a few strong sentences,
   ideally near the top, to focus everyone's brainpower in the same direction.
2. **Clear success criteria** — super-specifically define what success looks like
   when it ships. First to check it's worth doing at all, then to settle
   trade-off arguments later.
3. **Just enough direction** — give readers enough to know what the project
   entails, including requirements and constraints, *without* eliminating their
   chance to find a better solution.
4. **Urgency** — a proposed timeline to review, align, build and ship. Prevents
   scope explosion.
5. **Short and sweet** — keep it brief, clean up the formatting when it gets
   messy, push extra context to an appendix.

## 3. Problem first, always

> "Problem-oriented: They crystallize the problem being solved in a few strong
> sentences—ideally near the top of the document—to focus the brainpower of every
> teammate in the same direction."

> "So we have this concept of chaos to clarity and every idea starts in the chaos
> side, and then you have to work all the way to the other side, which is clarity.
> And so chaos can be an idea, it can be a problem, it can be a philosophy or a
> belief." — Melanie Perkins

A problem statement in this repo is only finished when it names: who is stuck,
what they are trying to do, what stops them, and what it costs — **with a number
traceable to the code or `workshop-data/`**.

## 4. Brevity as a forcing function

> "A reminder of how valuable it is to keep these to one page, at least to start"

One page. If it doesn't fit, the problem isn't bounded yet — go back to shaping.

## 5. Don't micromanage the design

> "There's a fine line between articulating the important details of a project
> spec and spending three pages explaining one button. This annoying habit can
> apply to both the beginning of a project, telling designers and engineers
> exactly how a feature needs to work, and also at the end when you spec out each
> feature for days."

The handoff contract exists to hold this line. Specify **what must be true** —
which surfaces, which states, which data, which components exist already. Do not
specify layout, hierarchy, or visual treatment. That is the designer's job, and
the next skill in the pipeline owns it.

Katie Dill's partnership rules, compressed:

- Trust the designer's expertise; defer on UX when they have the context.
- Be the conductor — set problem, goals and constraints; coordinate, don't play
  every instrument.
- Include designers early. Waterfall handoffs lose both ideas and context.
- Reframe design goals (consistency, usability, accessibility, delight) as
  sub-goals of business metrics, not a separate agenda.

## 6. Competitor research method

> "And so when you start to realize that, jobs helps you see the true competitive
> set from what we call the demand side of the world as opposed to the
> competitive set from the supply side of the world, which is the technology or
> the underlying business model by how which we're making it." — Bob Moesta

Research the **demand side**: what would this user do if our screen didn't exist?
For most FinOps problems the honest answer is a spreadsheet, a Slack thread, or
nothing at all — and those are the real competitors, not the other vendor.

> "Less than a year later, Google Photos launches. And not only does it provide a
> lot of the same value, but they also gave you free unlimited storage for life.
> And so, they just totally nuked our business model." — Drew Houston

Treat incumbent launches as signals about where the market is going, not just as
feature comparisons.

Procedure:

1. Name the job, not the category. "Prove the savings were real," not
   "cost optimization tooling."
2. List who serves that job today, including the spreadsheet and the status quo.
3. For each, note what they do well and what they structurally *cannot* do.
4. **Verify with WebSearch before citing anything specific.** See the landscape
   table in `product-context.md` for starting points — it is a map, not a fact
   sheet, and vendor features move fast.
5. Land on the gap Finout is uniquely placed to fill, given MegaBill, Virtual
   Tags, and CostGuard's aggregator position.
6. State what would have to be true for the gap to close on its own. If it would
   close without us, that's not a strategy.

## 7. Review checklist

Run before declaring a PRD done:

- [ ] Problem stated before any solution, in a few strong sentences
- [ ] Every number traceable to the repo or `workshop-data/` — nothing invented
- [ ] Success criteria specific enough to settle a future argument
- [ ] Non-goals written down explicitly
- [ ] The word **"just"** does not appear
- [ ] No layout or visual prescription — surfaces, states and data only
- [ ] Component reuse vs. new is counted, and each new one is justified
- [ ] Data the feature needs but the schema lacks is named, not assumed
- [ ] Fits on one page, appendix aside
- [ ] Handoff contract present and complete

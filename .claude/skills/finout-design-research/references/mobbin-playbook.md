# Mobbin playbook

How to get genuinely useful references out of Mobbin, and how to get them onto
disk so they can reach Figma and the deck.

Table of contents:
1. The three tools
2. Writing a query that works
3. Search settings
4. Managing context
5. Downloading the images
6. Citation rule

---

## 1. The three tools

| Tool | Returns | Use for |
|---|---|---|
| `mcp__mobbin__search_screens` | Single screens, inline images + metadata | The default. One screen = one design decision to study |
| `mcp__mobbin__search_flows` | Multi-step journeys with per-step previews | When the question is about sequence — what happens after the click |
| `mcp__mobbin__search_sections` | Marketing-site sections (pricing, hero, footer) | Rarely relevant for in-product screens. Skip unless researching a marketing page |

For a product screen study, run several `search_screens` calls, then one or two
`search_flows` calls if the brief involves a multi-step action such as assigning
an owner or applying a fix.

## 2. Writing a query that works

Describe **one screen**, in plain language, by what you would see on it and how
the parts relate. Specificity wins.

Good:
- `cost optimization recommendations list with potential savings amounts per row`
- `issue detail view with assignee, status dropdown and activity timeline`
- `dashboard with a single large savings metric and a supporting trend chart`

Bad, and why:
- `modern clean dashboard` — style adjectives match nothing
- `recommendations and settings and billing` — multiple intents; run separate searches
- `table without pagination` — negations are not understood
- `finops, waste, k8s, savings` — disconnected keywords

Rules:
- **Never put the platform in the query text.** Use the `platform` parameter.
- **Name an app to filter to it** — `Linear issue detail screen` returns Linear.
  Use this when the brief calls for a specific benchmark.
- One query, one idea. Run more searches rather than longer ones.

Translate the brief into queries by taking the **handoff contract** from the PRD
and turning each item into its own search: one per surface, one per hard state
(especially empty), one per contested interaction.

## 3. Search settings

- `platform` — **use `web` for Finout.** It is a desktop web SaaS. Only search
  `ios` when the brief is explicitly about mobile.
- `mode` — leave at `deep`. It interprets intent and scores relevance, which
  matters for nuanced product queries. Use `standard` only when latency is a
  problem.
- `limit` — 6–10 per query is usually right. The cap is 30 for screens, 10 for
  flows.
- `task_intent` — one short sentence describing the overall research task. **Keep
  it identical across every call in one study.** Do not paste user messages,
  file contents, or personal data into it.
- `exclude_screen_ids` — pass IDs already collected when running a follow-up
  search on a similar query, so results widen instead of repeating.

## 4. Managing context

Every result renders an inline image, so searches are expensive. Discipline:

- Plan the full query list before running any of them.
- Start at `limit: 6`. Raise it only if a query underperforms.
- Aim for **8–14 keepers total** across the whole study. More than that and the
  board stops being a point of view.
- Look at each image and judge it immediately. Do not re-run a search to
  "have another look" — record the verdict the first time.

## 5. Downloading the images

Each result carries an `image_url` that serves a plain image over HTTPS with no
authentication. Verified: it returns `image/webp`, typically 768px wide.

Save keepers into the study folder, named so a human can read the list:

```bash
mkdir -p docs/research/<slug>/assets
curl -sL -o docs/research/<slug>/assets/<app>-<what-it-shows>.webp "<image_url>"
```

Use lowercase-hyphenated names describing the app and the subject:
`aws-recommended-actions.webp`, `linear-issue-detail.webp`. These filenames end
up in the deck and in the Figma layer names, so they are user-facing.

Verify each download is a real image before continuing — a zero-byte file breaks
both the deck and the Figma upload:

```bash
file docs/research/<slug>/assets/*.webp
```

768px is fine for a reference board and for slides. It is not enough to zoom
into fine typography — say so rather than pretending detail is available.

**Convert to PNG before sending anything to Figma.** Figma's `upload_assets`
lists WebP as supported and a WebP upload returns HTTP 200, produces a valid
`imageHash`, and reports the fill as `type: "IMAGE"` — but it never rasterizes,
so every reference renders as a blank box. Verified the hard way. Convert first
and upload the PNGs:

```bash
for f in docs/research/<slug>/assets/*.webp; do
  sips -s format png "$f" --out "${f%.webp}.png" >/dev/null
done
```

Keep both: the `.webp` files are what the deck loads (smaller), the `.png` files
are what Figma gets. Always screenshot a node after uploading — a fill reporting
`IMAGE` is not proof that anything is visible.

## 6. Citation rule

**Every reference shown anywhere must link to its `mobbin_url`.** In the deck, in
the Figma annotation, and in any summary written back to the user.

Two reasons: the team can open the full record on Mobbin, and an uncited
screenshot of a real product with no provenance is indistinguishable from a
claim you made up. Keep `app_name`, `mobbin_url` and the local filename together
for every keeper — they are needed by both the deck and the board.

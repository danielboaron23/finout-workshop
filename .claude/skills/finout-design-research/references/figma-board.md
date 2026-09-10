# Figma reference board

The board is the artifact the design work actually happens next to. It must be
readable without narration.

Table of contents:
1. Mandatory prerequisites
2. What the board contains
3. Build order
4. Naming
5. When Figma is unavailable

---

## 1. Mandatory prerequisites

**These are not optional and skipping them causes hard-to-debug failures.**

| Before calling | Invoke this skill first |
|---|---|
| `mcp__plugin_figma_figma__create_new_file` | `figma:figma-create-new-file` |
| `mcp__plugin_figma_figma__use_figma` | `figma:figma-use` |

Invoke the skill, follow its instructions, then make the tool call. Never call
either tool directly.

`mcp__plugin_figma_figma__upload_assets` is how local image files get into the
file. **Upload PNGs, never WebP** — a WebP upload succeeds, hashes, and reports
the fill as `IMAGE`, but renders blank. See `mobbin-playbook.md` §5 for the
conversion step.

Create the image nodes first, then pass their ids as `nodeIds` so each image
lands on a known node. Uploading without a target places frames on whatever page
happens to be current, which is not necessarily yours.

Ask the user whether to create a new file or add a page to an existing one
before creating anything. Creating stray Figma files is annoying to clean up.

## 2. What the board contains

Four frames, left to right, on one page.

**Frame 1 — Brief.** Study title, date, the question being researched in one
sentence, and a link to the PRD it came from. Someone opening this file in three
weeks must be able to tell what it was for.

**Frame 2 — References.** The grid. One card per keeper, four across.

Each card is a column:
- The Mobbin screenshot (768px wide as downloaded)
- Directly beneath, a caption block of the same width containing:
  - **App name** — bold
  - **What it does well** — one sentence, about structure not styling
  - **What it gets wrong** — one sentence. Never leave this empty; if a
    reference has no flaw, it was not examined properly
  - **Mobbin link** — the `mobbin_url`, as a clickable link

Group the cards by band — direct competitors, indirect, aspirational — with a
section label above each group. The bands are the argument: seeing three cost
tools beside three issue trackers is what makes the point.

**Frame 3 — Matrix.** The comparison table from `analysis-framework.md` §3, as
real text rows, not an image. It must be editable — this is where the team will
argue.

**Frame 4 — Opportunity.** Three stacked blocks: table stakes, the split, the
gap. Same content as the deck's closing slides, so the two never drift.

## 3. Build order

1. Confirm new file vs. existing file with the user.
2. Invoke `figma:figma-create-new-file`, then create the file (or open the
   existing one).
3. Upload every downloaded image via `upload_assets` and keep the returned
   references mapped to app name and `mobbin_url`.
4. Invoke `figma:figma-use`, then build the frames in the order above.
5. Report the file URL back to the user, with a one-line summary of what is on it.

Build the reference grid **before** the matrix and opportunity frames. If
something fails partway, a board with images and captions is still useful; a
board with only a matrix is not.

## 4. Naming

Layer and frame names are user-facing here — this file gets opened by other
people.

- Frames: `01 Brief`, `02 References`, `03 Matrix`, `04 Opportunity`
- Reference cards: `<app-name> — <what it shows>`, e.g. `Linear — issue detail`
- Match the local filenames from the Mobbin download so the two can be
  cross-referenced

## 5. When Figma is unavailable

If the Figma MCP is not connected or authentication fails, do not silently drop
the board. Say so plainly, then:

- Confirm the images are on disk under `docs/research/<slug>/assets/`
- Confirm the HTML deck was produced — it contains the same content
- Tell the user the board can be built later by re-running the skill with the
  study folder as input, no re-searching required

The downloaded images and the study markdown are the source of truth. Figma is a
rendering of them, not the original.

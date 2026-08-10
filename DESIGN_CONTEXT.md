# DESIGN_CONTEXT — Finout Workshop

Updated: 2026-08-10 · Source of truth: Figma `lhnXVSWU3CbI8QP3BKE0bx` ("Representative Screens" `0:75856`) + tokens in code.

## Product
Finout — FinOps cost-management platform (finout.io). Workshop repo: 1:1 rebuild of 5 representative screens + Storybook DS. Language: English, LTR. Desktop-first web app; must degrade gracefully to laptop widths (sidebar fixed, content column fluid, tables h-scroll below their min width).

## Tokens (pointers — read live, never copy values)
- `src/app/globals.css` `@theme` — colors (text/surface/border/dataviz/success), radii, shadows, type scale.
- Fonts: Helvetica Neue = `font-sans` (headings, body, buttons) · Inter = `font-inter` (sidebar nav) · Geist = `font-geist` (inputs, counters, badges). Loaded via next/font in `src/app/layout.tsx` AND `.storybook/preview.tsx`.

## Component inventory (REUSE these)
- `src/components/sidebar/Sidebar.tsx` (+`sidebar-icons.tsx`) — 220px dark nav, activeItem prop
- `src/components/navigation/` — `TopNav`, `PageTitleBar`, `Tabs`
- `src/components/ui/` — `Button` (primary/secondary/tertiary/ghost/link) + `ChevronDown16`, `SearchInput`, `Select`, `Badge` (FolderBadge/ProductBadge), `Avatar`, `FolderMenu`
- `src/components/table/Table.tsx` — `TableShell`, `HeaderCell`, `Cell`, `CellText`, `MenuCell`, `CheckboxCell`
- Screens live in `src/screens/*Screen.tsx` + route in `src/app/<slug>/page.tsx` + story per screen.

## Assets
Exported Figma SVGs only (never hand-drawn): `public/icons/{sidebar,topnav,ui}`, `public/brand/finout-logo.svg`.

## Behaviors (design intent, from Daniel)
- **FolderMenu is a dropdown** anchored to the "Folders" Select (opens on click, left-aligned, 8px below). It is never statically overlaid on the table.
- Figma renders all text underlined (missing-font artifact) — build WITHOUT underlines.
- Table cell text 21.57px/33.898 is the design's real rendered size (kept 1:1).

## Layout contract (applies to EVERY screen)
- **Card rows: equal-width cards, container-query titles** (Daniel's rule): rows are `grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))]` so every card is the same size and the row fills the screen at any width. Each card is `@container` and its title steps with card width — `15px/22` base, `@[300px]:17px/24`, `@[310px]:18px/26`, `@[340px]:20px/28` (Figma's 20px needs a ≥340px card) — so text always fits inside the card, never overflows and never gets truncated.
- Root: `flex h-screen overflow-hidden`; Sidebar `shrink-0`; content column `flex-1 min-w-0 overflow-y-auto`.
- Pixel-perfect at 1920×1080 (Figma frame size); fluid below — tables wrap in `overflow-x-auto`, filters row wraps or scrolls, nothing overflows the viewport horizontally.
- Verify loop: `node scripts/shot.mjs <url> <out.png> <w> <h>` at 1920×1080 + 1440×900 + 1280×800, compare vs Figma `get_screenshot`.

## Output contract
Working code + Storybook story per component/screen; commit per milestone; verification screenshots before declaring done.

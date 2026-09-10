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
- `src/components/ui/` — `Button` (primary/secondary/tertiary/ghost/link) + `ChevronDown16`, `SearchInput`, `Select`, `Badge` (FolderBadge/ProductBadge), `Avatar`, `FolderMenu`, `Switch`, `Callout`, `ActionBar`, `Dropdown`/`DropdownItem`, `Toast`
- `src/components/table/Table.tsx` — `TableShell`, `HeaderCell`, `Cell`, `CellText`, `MenuCell`, `CheckboxCell`
- `src/components/costguard/` — `SavingsCell` (projected + realized + verdict in one cell, renders "Not verifiable"), `BulkActionBar` (selection count + $ at stake + actions — now a thin wrapper over `ui/ActionBar`)
- `src/components/settings/` — `SettingsRail` (vertical grouped nav), `SettingRow` (label + control + scope + provenance) + `RowDivider`, `ImpactPanel` (what a staged change does to the numbers), `StagedChangeBar`, `data.ts` (settings model + allocation math), `allocation-data.ts` (generated from seed)
- Screens live in `src/screens/*Screen.tsx` + route in `src/app/<slug>/page.tsx` + story per screen.

### Accepted extends (Sidebar hover choreography, 2026-09-09) — treat as REUSE from here
- Uniform hover on every sidebar row (`.sb-row`/`.sb-ico`/`.sb-label` in globals.css): row tint + label slide-and-brighten, icon jelly-pop (`sbJelly`) with breathing green halo (`sbGlow`, brand green) + brightness/drop-shadow glow. Pure CSS, works expanded + collapsed, `prefers-reduced-motion` safe. This is the app's icon-hover language — reuse the classes, don't invent new hover effects per surface.

### Accepted extends (Sidebar collapse, 2026-09-09) — treat as REUSE from here
- `Sidebar` → client component with collapse-to-rail: clicking the logo toggles 220px ↔ 64px (green mark stays, wordmark clipped away, labels hide, CSS tooltips on hover, section labels become dividers). Persists via localStorage `finout-sidebar-collapsed`; transitions suppressed on first paint so a stored state applies instantly. Expanded layout unchanged (1:1 Figma). `public/brand/finout-mark.svg` = extracted green mark.

### Accepted extends + invents (Settings, 2026-09-10) — treat as REUSE from here
- **INVENT** `SettingsRail` — vertical grouped nav with scope headings; every row a real anchor so a section is deep-linkable. `Tabs` cannot do this (horizontal, fixed 68px, bottom-border indicator, `TabItem` has no href).
- **INVENT** `SettingRow` (+ `RowDivider`) — label + description + control, plus the two lines that make a settings row honest: `scope` (who this affects, stated before the change) and `provenance` (who last changed it and why). Reuses real Finout's Virtual Tag change-note idea without an audit log.
- **INVENT** `Callout` (`ui/`) — tinted panel stating a consequence, tones info/warning/danger, all from existing tokens. Absorbs the private `InfoBanner` in `ThresholdsDrawer`; also fits the four places CostGuard inlines this by hand.
- **EXTEND** `Switch` → lifted from `anomaly-form/ThresholdsDrawer` to `ui/Switch.tsx` and given `checked` + `onChange` (+ `disabled`). Controlled when both are passed, uncontrolled otherwise — same shape as the `CheckboxCell` extend. Existing call sites unchanged.
- **EXTEND** `ActionBar` (`ui/`) — the dark conditional bar lifted out of `BulkActionBar`, which was welded to CostGuard's owners/reasons. Takes `label` + `actions`; `BulkActionBar` keeps its API and renders through it.
- **EXTEND** `Dropdown` → `placement?: "bottom" | "top"`. A menu on a bar pinned to the bottom of the viewport opened off-screen.
- **EXTEND** `Sidebar` → the footer `Settings` row now has `href="/settings"` and an active state. It had been a dead row with full hover choreography since the prototype began.
- Note: `Select` is a **trigger only** (no value/options/onChange) — pair it with `Dropdown` for a working single-select. There is still no generic `Input`, radio, textarea, modal or date picker; Settings deliberately uses a preset `Dropdown` for its effective-date control rather than introducing a picker.

### Accepted extends (CostGuard, 2026-09-06) — treat as REUSE from here
- `Badge` → `StatusBadge` (new / working / done / regressed / dismissed)
- `Button` → `onClick`, `type`, `disabled` (was presentation-only)
- `CheckboxCell` → optional `checked` + `onChange`; renders a real checkbox when interactive, stays a spacer otherwise
- Note: `SearchInput` is exported from `src/components/ui/Input.tsx`, not `SearchInput.tsx`

## Assets
Exported Figma SVGs only (never hand-drawn): `public/icons/{sidebar,topnav,ui}`, `public/brand/finout-logo.svg`.

## Behaviors (design intent, from Daniel)
- **FolderMenu is a dropdown** anchored to the "Folders" Select (opens on click, left-aligned, 8px below). It is never statically overlaid on the table.
- Figma renders all text underlined (missing-font artifact) — build WITHOUT underlines.
- Table cell text 21.57px/33.898 is the design's real rendered size (kept 1:1).

## Layout contract (applies to EVERY screen)
- **Proportional scaling (Daniel's global rule)**: the app is designed at the Figma frame width (1920) and the whole UI zooms uniformly to the viewport via `.app-zoom` on `<body>` (`--app-zoom: clamp(0.6667, 100vw/1920px, 10)` in globals.css). On ANY screen — small laptop or large monitor — every screen looks exactly like the Figma at the same proportions; typography is always its Figma size (titles 20px logical everywhere). Floor 1280/1920; below it the fluid grid behaviors take over. New screens: root `h-full flex-1` (NOT `h-screen` — viewport units are not divided by zoom).
- **Card rows: equal-width cards** (Daniel's rule): rows are `grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))]` so every card is the same size and the row fills the screen at any width.
- **One title typography everywhere, always one line** (Daniel's rule): every widget/card title on a page uses the exact same style — `font-sans font-medium leading-[26px] text-[18px] text-[#101828]` — sized so the LONGEST title fits one line inside an equal-width card (18px chosen because "Monthly potential savings" needs ≤217px in a 311px KPI card). Never step or shrink title fonts per component; if a future screen's longest title doesn't fit at the shared size, lower the shared size for the whole page, don't wrap and don't make one title smaller than its siblings.
- Root: `flex h-screen overflow-hidden`; Sidebar `shrink-0`; content column `flex-1 min-w-0 overflow-y-auto`.
- Pixel-perfect at 1920×1080 (Figma frame size); fluid below — tables wrap in `overflow-x-auto`, filters row wraps or scrolls, nothing overflows the viewport horizontally.
- Verify loop: `node scripts/shot.mjs <url> <out.png> <w> <h>` at 1920×1080 + 1440×900 + 1280×800, compare vs Figma `get_screenshot`.

## Output contract
Working code + Storybook story per component/screen; commit per milestone; verification screenshots before declaring done.

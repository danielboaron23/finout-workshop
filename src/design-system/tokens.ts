/**
 * Finout Design Tokens — typed mirror of `src/app/globals.css` `@theme`.
 *
 * SOURCE OF TRUTH: src/app/globals.css (@theme block), which itself mirrors the
 * Figma variables in file lhnXVSWU3CbI8QP3BKE0bx ("Representative Screens").
 * Values here are copied EXACTLY — never edit one file without the other.
 *
 * Flow: Figma variables → globals.css @theme → Tailwind utility classes → components.
 * These exports exist so Storybook Foundations pages can render the tokens;
 * application code should keep using the Tailwind classes generated from @theme.
 */

export interface Token {
  /** CSS custom property name as written in globals.css, e.g. "--color-text-primary" */
  name: string;
  /** Exact value from globals.css */
  value: string;
  /** One-line usage guidance */
  usage: string;
}

export interface TypeToken {
  /** CSS custom property name, e.g. "--text-sm" */
  name: string;
  /** Tailwind class, e.g. "text-sm" */
  className: string;
  /** Font size, e.g. "14px" */
  size: string;
  /** Line height, e.g. "22px" */
  lineHeight: string;
  /** One-line usage guidance */
  usage: string;
}

/* ================================================================== */
/* Colors                                                             */
/* ================================================================== */

export const neutrals: Token[] = [
  { name: "--color-neutral-0", value: "#ffffff", usage: "Pure white — card and popover backgrounds" },
  { name: "--color-neutral-50", value: "#f3f5f8", usage: "Lightest neutral fill — page sections, hover fills" },
  { name: "--color-neutral-100", value: "#eaecf0", usage: "Subtle fills and dividers" },
  { name: "--color-neutral-200", value: "#d0d5dd", usage: "Mid-light neutral — muted borders, disabled fills" },
  { name: "--color-neutral-300", value: "#98a2b3", usage: "Mid neutral — placeholder and secondary strokes" },
  { name: "--color-neutral-400", value: "#57677f", usage: "Dark neutral — secondary emphasis" },
  { name: "--color-neutral-500", value: "#101828", usage: "Darkest neutral — sidebar background, strongest text" },
];

export const grays: Token[] = [
  { name: "--color-gray-200", value: "#eaecf0", usage: "Table row dividers and light strokes" },
  { name: "--color-gray-300", value: "#d0d5dd", usage: "Table and control borders" },
  { name: "--color-gray-600", value: "#475467", usage: "Table body text and secondary labels" },
  { name: "--color-gray-700", value: "#344054", usage: "Table header text and stronger labels" },
];

export const blues: Token[] = [
  { name: "--color-blue-25", value: "#f5faff", usage: "Faintest blue tint — selected row / hover backgrounds" },
  { name: "--color-blue-50", value: "#eff8ff", usage: "Light blue fill — info tiles, badge backgrounds" },
  { name: "--color-blue-300", value: "#2e90fa", usage: "Mid brand blue — accents and charts" },
  { name: "--color-blue-400", value: "#1570ef", usage: "Primary action blue — buttons, active states" },
  { name: "--color-blue-600", value: "#1570ef", usage: "Alias of blue-400 — strong action blue" },
];

export const textColors: Token[] = [
  { name: "--color-text-primary", value: "#101828", usage: "Primary text on light surfaces" },
  { name: "--color-text-secondary", value: "#475467", usage: "Secondary text — descriptions, table cells" },
  { name: "--color-text-tertiary", value: "#7b889e", usage: "Tertiary text — hints, muted labels, placeholders" },
  { name: "--color-text-inverse", value: "#f3f5f8", usage: "Text on dark surfaces (sidebar nav)" },
  { name: "--color-text-link", value: "#175cd3", usage: "Links and link-style buttons" },
];

export const iconColors: Token[] = [
  { name: "--color-icon-primary", value: "#7b889e", usage: "Default icon color — nav and neutral icons" },
  { name: "--color-icon-secondary", value: "#475467", usage: "Icons paired with secondary text" },
  { name: "--color-icon-dark", value: "#101828", usage: "High-emphasis icons on light surfaces" },
  { name: "--color-icon-link", value: "#175cd3", usage: "Icons inside links and link buttons" },
  { name: "--color-icon-inverse", value: "#ffffff", usage: "Icons on dark or colored surfaces" },
  { name: "--color-icon-disabled", value: "#939393", usage: "Disabled-state icons" },
  { name: "--color-icon-brand", value: "#429674", usage: "Finout brand green — FAB / logo mark accents" },
];

export const surfaceColors: Token[] = [
  { name: "--color-surface-primary", value: "#fefefe", usage: "Primary surface — cards and widgets" },
  { name: "--color-surface-secondary", value: "#f3f5f8", usage: "Secondary surface — recessed panels, table headers" },
  { name: "--color-canvas", value: "#f2f4f7", usage: "App canvas — the page background behind all cards" },
];

export const borderColors: Token[] = [
  { name: "--color-border-lighter", value: "#f2f4f7", usage: "Faintest divider — inside cards" },
  { name: "--color-border-light", value: "#dee1e8", usage: "Default card and widget border" },
  { name: "--color-border-muted", value: "#d0d5dd", usage: "Control borders — inputs, selects, table strokes" },
  { name: "--color-border-default", value: "#98a2b3", usage: "Stronger border — focused / emphasized controls" },
  { name: "--color-border-primary", value: "#1570ef", usage: "Active / selected border — focus rings, active tabs" },
];

export const successColors: Token[] = [
  { name: "--color-success-50", value: "#ecfdf3", usage: "Success badge background" },
  { name: "--color-success-200", value: "#abefc6", usage: "Success badge border" },
  { name: "--color-success-500", value: "#17b26a", usage: "Success icons and indicators" },
  { name: "--color-success-700", value: "#067647", usage: "Success badge text" },
];

export const datavizColors: Token[] = [
  { name: "--color-dataviz-blue-25", value: "#f5faff", usage: "Chart area fill — lightest blue" },
  { name: "--color-dataviz-blue-100", value: "#84caff", usage: "Chart series — light blue" },
  { name: "--color-dataviz-blue-600", value: "#194185", usage: "Chart series — deep navy" },
  { name: "--color-dataviz-purple-400", value: "#53389e", usage: "Chart series — deep purple" },
  { name: "--color-dataviz-violet-25", value: "#ede9fc", usage: "Chart fill — faint violet" },
  { name: "--color-dataviz-violet-50", value: "#cabdf7", usage: "Chart series — light violet" },
  { name: "--color-dataviz-violet-75", value: "#8465eb", usage: "Chart series — mid violet" },
  { name: "--color-dataviz-violet-100", value: "#724fe9", usage: "Chart series — primary violet" },
];

/* ================================================================== */
/* Radius                                                             */
/* ================================================================== */

export const radii: Token[] = [
  { name: "--radius-sm", value: "4px", usage: "Small controls — badges, checkboxes, tags" },
  { name: "--radius-md", value: "8px", usage: "Buttons, inputs, selects" },
  { name: "--radius-lg", value: "10px", usage: "Dropdowns and menus" },
  { name: "--radius-xl", value: "12px", usage: "Cards, widgets, tables" },
  { name: "--radius-full", value: "9999px", usage: "Pills, avatars, circular buttons" },
];

/* ================================================================== */
/* Shadows                                                            */
/* ================================================================== */

export const shadows: Token[] = [
  { name: "--shadow-xs", value: "0 1px 2px 0 rgba(16, 24, 40, 0.05)", usage: "Hairline lift — buttons, inputs" },
  { name: "--shadow-sm", value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", usage: "Subtle lift — cards at rest" },
  {
    name: "--shadow-md",
    value: "0 2px 4px -2px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    usage: "Raised cards and hover states",
  },
  {
    name: "--shadow-medium",
    value: "0 4px 8px -2px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.06)",
    usage: "Figma 'medium' elevation — widget cards",
  },
  {
    name: "--shadow-lg",
    value: "0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 5px 15px -3px rgba(0, 0, 0, 0.05)",
    usage: "Dropdowns and popovers",
  },
  {
    name: "--shadow-xl",
    value: "0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    usage: "Modals, drawers, floating menus",
  },
];

/* ================================================================== */
/* Type scale (Body = Helvetica Neue)                                 */
/* ================================================================== */

export const typeScale: TypeToken[] = [
  { name: "--text-2xs", className: "text-2xs", size: "10px", lineHeight: "18px", usage: "Micro labels — axis ticks, fine print" },
  { name: "--text-xs", className: "text-xs", size: "12px", lineHeight: "20px", usage: "Badges, captions, table meta" },
  { name: "--text-sm", className: "text-sm", size: "14px", lineHeight: "22px", usage: "Default UI text — buttons, inputs, table cells" },
  { name: "--text-base", className: "text-base", size: "16px", lineHeight: "24px", usage: "Body copy and larger labels" },
  { name: "--text-xl", className: "text-xl", size: "20px", lineHeight: "24px", usage: "Page titles and KPI values" },
];

/**
 * Project rule (not a @theme token): every widget/card title on a page uses one
 * shared style — 18px / 26px, font-medium, text-primary — sized so the LONGEST
 * title on the page fits one line inside an equal-width card. Never shrink a
 * single title; lower the shared size for the whole page instead.
 */
export const widgetTitleRule = {
  size: "18px",
  lineHeight: "26px",
  className: "font-sans font-medium leading-[26px] text-[18px] text-[#101828]",
} as const;

/* ================================================================== */
/* Fonts                                                              */
/* ================================================================== */

export const fonts: Token[] = [
  {
    name: "--font-sans",
    value: '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    usage: "Default UI font — headings, body, buttons",
  },
  {
    name: "--font-inter",
    value: '"Inter", "Helvetica Neue", sans-serif',
    usage: "Sidebar navigation labels",
  },
  {
    name: "--font-geist",
    value: '"Geist", "Inter", "Helvetica Neue", sans-serif',
    usage: "Inputs, counters, badges",
  },
];

/* ================================================================== */
/* Grouped export for the Foundations stories                          */
/* ================================================================== */

export const colorGroups: { title: string; description: string; tokens: Token[] }[] = [
  { title: "Semantic Text", description: "Text colors by role — always prefer these over raw palette values.", tokens: textColors },
  { title: "Semantic Surface", description: "Backgrounds: canvas behind everything, surfaces for cards and panels.", tokens: surfaceColors },
  { title: "Semantic Border", description: "Border colors from faint dividers to active focus strokes.", tokens: borderColors },
  { title: "Icons", description: "Icon colors by role, including the Finout brand green.", tokens: iconColors },
  { title: "Brand Blues", description: "Action blue ramp — buttons, links, selected states.", tokens: blues },
  { title: "Neutrals", description: "Core neutral ramp from white to the darkest ink (#101828).", tokens: neutrals },
  { title: "Grays", description: "Untitled-UI-style grays used in tables and labels.", tokens: grays },
  { title: "Success", description: "Status greens for badges and positive indicators.", tokens: successColors },
  { title: "Data-Viz", description: "Chart-only palette — blues, purples and violets for series and fills.", tokens: datavizColors },
];

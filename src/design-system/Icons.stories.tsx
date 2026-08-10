import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * Foundations / Icons — a curated gallery of the project's icon set.
 * PROJECT RULE: every icon is a real Figma SVG export from public/icons/**
 * (file lhnXVSWU3CbI8QP3BKE0bx) — icons are never hand-drawn or substituted.
 * This list is curated by hand; when new icons are exported, add them here.
 */

const meta = {
  title: "Foundations/Icons",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A representative gallery of the project's icon set, grouped by source directory under public/icons. Every icon is a real SVG exported from the Figma file — never hand-drawn (project rule). Colors are baked into the exports, matching the icon color tokens (icon-primary #7b889e, icon-secondary #475467, link #175cd3, brand #429674).",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

interface IconEntry {
  src: string;
  name: string;
  dir: string;
}

const icon = (dir: string, file: string): IconEntry => ({
  src: `/icons/${dir}/${file}.svg`,
  name: file,
  dir,
});

const ICONS: IconEntry[] = [
  // Sidebar navigation (dark 220px nav) — all single-file nav icons.
  // Cost per Entity, Reports and Resources are multi-part Figma exports
  // (cost-per-entity-p1..p4 etc.) composed inside the Sidebar component,
  // so they are not shown as single tiles here.
  icon("sidebar", "overview"),
  icon("sidebar", "dashboards"),
  icon("sidebar", "megabill"),
  icon("sidebar", "virtual-tags"),
  icon("sidebar", "data-explorer"),
  icon("sidebar", "anomalies"),
  icon("sidebar", "costguard"),
  icon("sidebar", "finops-ai"),
  icon("sidebar", "billy"),
  icon("sidebar", "financial-plans"),
  icon("sidebar", "my-commitments"),
  icon("sidebar", "commitments-log"),
  icon("sidebar", "governance"),
  icon("sidebar", "account"),
  icon("sidebar", "settings"),
  icon("sidebar", "documentation"),
  icon("sidebar", "chevron-down"),

  // Top navigation
  icon("topnav", "house"),
  icon("topnav", "external-link"),
  icon("topnav", "chevron-down-24"),

  // Shared UI controls
  icon("ui", "search"),
  icon("ui", "plus"),
  icon("ui", "folder"),
  icon("ui", "folder-menu"),
  icon("ui", "chevron-down-16"),
  icon("ui", "ellipsis-vertical"),
  icon("ui", "arrow-down"),
  icon("ui", "finout-fab"),

  // Home screen tiles
  icon("home", "greeting-sun"),
  icon("home", "kpi-tile-dollar"),
  icon("home", "pie-chart-01"),
  icon("home", "persona-finops"),
  icon("home", "anomaly-line"),
  icon("home", "badge-arrow-up"),
  icon("home", "badge-arrow-down"),

  // Anomalies screen
  icon("anomalies", "investigate"),
  icon("anomalies", "pencil"),
  icon("anomalies", "trash"),
  icon("anomalies", "comment"),
  icon("anomalies", "red-arrow-up"),
  icon("anomalies", "finout-fab-24"),

  // MegaBill screen
  icon("megabill", "calendar-16"),
  icon("megabill", "download"),
  icon("megabill", "grid"),
  icon("megabill", "sparkle"),
  icon("megabill", "views-glasses"),
  icon("megabill", "chart-column"),
  icon("megabill", "chart-line"),
  icon("megabill", "list-filter-16"),
];

const GROUP_LABELS: Record<string, string> = {
  sidebar: "Sidebar navigation",
  topnav: "Top navigation",
  ui: "Shared UI controls",
  home: "Home screen",
  anomalies: "Anomalies screen",
  megabill: "MegaBill screen",
};

const GROUP_ORDER = ["sidebar", "topnav", "ui", "home", "anomalies", "megabill"];

function IconTile({ entry }: { entry: IconEntry }) {
  return (
    <div className="flex w-[104px] flex-col items-center gap-[8px]">
      <div
        className="flex h-[56px] w-[56px] items-center justify-center rounded-md border bg-white"
        style={{ borderColor: "var(--color-border-light)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG asset gallery */}
        <img src={entry.src} alt={entry.name} className="max-h-[32px] max-w-[32px]" />
      </div>
      <div
        className="w-full break-words text-center text-2xs leading-[14px] text-text-secondary"
        style={{ fontFamily: "var(--font-geist)" }}
      >
        {entry.name}
      </div>
    </div>
  );
}

export const Gallery: Story = {
  render: () => (
    <div className="max-w-[960px] font-sans" style={{ fontFamily: "var(--font-sans)" }}>
      <h2 className="text-[18px] font-medium leading-[26px] text-text-primary">Icon gallery</h2>
      <p className="mt-[2px] max-w-[720px] text-sm text-text-secondary">
        A curated, representative subset of <code>public/icons/**</code>. All icons are real Figma SVG
        exports — never hand-drawn (project rule). Colors are baked into each export and match the
        icon color tokens.
      </p>
      {GROUP_ORDER.map((dir) => (
        <section key={dir} className="mt-[24px]">
          <h3 className="text-sm font-medium text-text-primary">
            {GROUP_LABELS[dir]}{" "}
            <span className="font-normal text-text-tertiary" style={{ fontFamily: "var(--font-geist)" }}>
              public/icons/{dir}
            </span>
          </h3>
          <div className="mt-[12px] flex flex-wrap gap-[16px]">
            {ICONS.filter((i) => i.dir === dir).map((entry) => (
              <IconTile key={entry.src} entry={entry} />
            ))}
          </div>
        </section>
      ))}
      <p className="mt-[24px] text-xs text-text-tertiary">
        Not shown: multi-part exports (e.g. cost-per-entity-p1…p4, reports-p1…p4, resources-p1…p3,
        info-circle vectors) that are composed inside their components, and per-variant duplicates.
      </p>
    </div>
  ),
};

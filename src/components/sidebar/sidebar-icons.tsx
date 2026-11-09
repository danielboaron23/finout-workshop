/*
 * Sidebar nav icons, exported from Figma (public/icons/sidebar/*.svg).
 * Each icon reproduces the exact layer structure and insets from the Figma
 * node so strokes land on the same pixels as the design.
 */

const BASE = "/icons/sidebar";

type Part = {
  src: string;
  /** Tailwind inset classes for the vector's bounding box inside the 16px frame */
  inset: string;
  /** Inset classes for the stroke-extent wrapper (negative insets), if any */
  outer?: string;
};

type IconSpec =
  | { kind: "single"; src: string; inset: string; outer?: string }
  | { kind: "composite"; base: string; parts: Part[] };

const ICONS = {
  overview: { kind: "single", src: `${BASE}/overview.svg`, inset: "inset-[5.21%]" },
  "finops-ai": { kind: "single", src: `${BASE}/finops-ai.svg`, inset: "inset-[5.21%_5.2%_5.21%_5.21%]" },
  billy: { kind: "single", src: `${BASE}/billy.svg`, inset: "inset-[5.21%_5.2%_5.21%_5.21%]" },
  megabill: { kind: "single", src: `${BASE}/megabill.svg`, inset: "inset-[8.33%]", outer: "inset-[-3.75%]" },
  "virtual-tags": { kind: "single", src: `${BASE}/virtual-tags.svg`, inset: "inset-[8.33%_9.34%_9.34%_8.33%]", outer: "inset-[-3.8%]" },
  dashboards: { kind: "single", src: `${BASE}/dashboards.svg`, inset: "inset-[12.5%]", outer: "inset-[-4.17%]" },
  "financial-plans": { kind: "single", src: `${BASE}/financial-plans.svg`, inset: "inset-[8.4%_8.39%_8.35%_8.33%]", outer: "inset-[-3.76%_-3.75%_-3.75%_-3.75%]" },
  resources: {
    kind: "composite",
    base: `${BASE}/nav-icon-base.svg`,
    parts: [
      { src: `${BASE}/resources-p1.svg`, inset: "inset-[21.88%_12.5%]", outer: "inset-[-5.56%_-4.17%]" },
      { src: `${BASE}/resources-p2.svg`, inset: "inset-[40.63%_12.5%_59.38%_12.5%]", outer: "inset-[-0.5px_-4.17%]" },
      { src: `${BASE}/resources-p2.svg`, inset: "inset-[59.38%_12.5%_40.63%_12.5%]", outer: "inset-[-0.5px_-4.17%]" },
      { src: `${BASE}/resources-p3.svg`, inset: "inset-[40.63%_65.63%_21.88%_34.38%]", outer: "inset-[-8.33%_-0.5px]" },
    ],
  },
  "data-explorer": { kind: "single", src: `${BASE}/data-explorer.svg`, inset: "inset-[5.21%]" },
  costguard: { kind: "single", src: `${BASE}/costguard.svg`, inset: "inset-[5.23%_5.23%_5.2%_5.16%]" },
  "my-commitments": { kind: "single", src: `${BASE}/my-commitments.svg`, inset: "inset-[9.38%]" },
  "commitments-log": { kind: "single", src: `${BASE}/commitments-log.svg`, inset: "inset-[21.88%_9.37%_17.71%_9.38%]" },
  anomalies: { kind: "single", src: `${BASE}/anomalies.svg`, inset: "inset-[12.5%_8.33%]", outer: "inset-[-4.17%_-3.75%]" },
  "cost-per-entity": {
    kind: "composite",
    base: `${BASE}/nav-icon-base2.svg`,
    parts: [
      { src: `${BASE}/cost-per-entity-p1.svg`, inset: "inset-[21.88%_45.31%_37.5%_14.06%]", outer: "inset-[-9.23%]" },
      { src: `${BASE}/cost-per-entity-p2.svg`, inset: "inset-[21.88%_13.48%_37.5%_60.7%]", outer: "inset-[-9.23%_-14.52%_-9.23%_-14.53%]" },
      { src: `${BASE}/cost-per-entity-p3.svg`, inset: "inset-[62.5%_37.5%_22.89%_6.25%]", outer: "inset-[-25.67%_-6.67%]" },
      { src: `${BASE}/cost-per-entity-p4.svg`, inset: "inset-[62.5%_5.66%_22.89%_66.21%]", outer: "inset-[-25.67%_-13.33%]" },
    ],
  },
  reports: {
    kind: "composite",
    base: `${BASE}/nav-icon-base2.svg`,
    parts: [
      { src: `${BASE}/reports-p1.svg`, inset: "bottom-1/2 left-[37.5%] right-[37.5%] top-1/2", outer: "inset-[-0.6px_-15%]" },
      { src: `${BASE}/reports-p2.svg`, inset: "inset-[62.5%_37.5%_37.5%_37.5%]", outer: "inset-[-0.6px_-15%]" },
      { src: `${BASE}/reports-p3.svg`, inset: "inset-[15.63%_18.75%_12.5%_18.75%]", outer: "inset-[-5.22%_-6%]" },
      { src: `${BASE}/reports-p4.svg`, inset: "inset-[9.38%_68.75%_78.13%_31.25%]", outer: "inset-[-30%_-0.6px]" },
      { src: `${BASE}/reports-p4.svg`, inset: "bottom-[78.13%] left-1/2 right-1/2 top-[9.38%]", outer: "inset-[-30%_-0.6px]" },
      { src: `${BASE}/reports-p4.svg`, inset: "inset-[9.38%_31.25%_78.13%_68.75%]", outer: "inset-[-30%_-0.6px]" },
    ],
  },
  governance: { kind: "single", src: `${BASE}/governance.svg`, inset: "inset-[17.71%_9.38%]" },
  settings: { kind: "single", src: `${BASE}/settings.svg`, inset: "inset-[8.33%]", outer: "inset-[-3.75%]" },
  documentation: { kind: "single", src: `${BASE}/documentation.svg`, inset: "inset-[16.67%_8.33%]", outer: "inset-[-4.69%_-3.75%]" },
  account: { kind: "single", src: `${BASE}/account.svg`, inset: "inset-[9.38%]" },
} satisfies Record<string, IconSpec>;

export type SidebarIconName = keyof typeof ICONS;

export function SidebarIcon({ name }: { name: SidebarIconName }) {
  const spec: IconSpec = ICONS[name];
  return (
    <div className="relative shrink-0 size-[16px] overflow-clip">
      {spec.kind === "single" ? (
        <div className={`absolute ${spec.inset}`}>
          {spec.outer ? (
            <div className={`absolute ${spec.outer}`}>
              <img alt="" className="block max-w-none size-full" src={spec.src} />
            </div>
          ) : (
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={spec.src} />
          )}
        </div>
      ) : (
        <>
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={spec.base} />
          {spec.parts.map((part, i) => (
            <div key={i} className={`absolute ${part.inset}`}>
              <div className={`absolute ${part.outer ?? "inset-0"}`}>
                <img alt="" className="block max-w-none size-full" src={part.src} />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

import { HomeCell, HomeCellText, HomeHeaderCell, HomeTableShell, TableActionButton, WidgetCard, WidgetTitle } from "./CostCentersCard";

/*
 * "Recent daily optimization recommendations" widget — left card of the home
 * page's bottom 3-widget row (Figma "Frame 1000005011" → "Recent recommendations").
 * Card 810px in the 1652 design; columns 163/80/126/122/122/149 of a 762 table.
 */

export type RecommendationRow = {
  scanName: string;
  waste: string;
  scannedCost: string;
  resources: string;
  costWastePct: string;
  action?: string;
};

export type RecommendationsCardProps = {
  title?: string;
  rows?: RecommendationRow[];
};

const DEFAULT_ROWS: RecommendationRow[] = [
  { scanName: "RDS - Rightsizing", waste: "$450", scannedCost: "$12,891", resources: "120", costWastePct: "45%", action: "Go to scan" },
  { scanName: "Virtual Machine…", waste: "$830", scannedCost: "$8,234", resources: "30", costWastePct: "50%", action: "Go to scan" },
  { scanName: "Network Load B…", waste: "$434", scannedCost: "$7,212", resources: "72", costWastePct: "20%", action: "Go to scan" },
  { scanName: "RDS - Idle", waste: "$434", scannedCost: "$6,450", resources: "24", costWastePct: "20%", action: "Go to scan" },
  { scanName: "K8s - Deployment", waste: "$434", scannedCost: "$4,689", resources: "87", costWastePct: "20%", action: "Go to scan" },
  { scanName: "Persistent Disk…", waste: "$434", scannedCost: "$3,903", resources: "110", costWastePct: "20%", action: "Go to scan" },
];

/** Column proportions from Figma (px at the 1652 design width) */
const COL = { scanName: 163, waste: 80, scannedCost: 126, resources: 122, costWastePct: 122, actions: 149 };

function Column({
  grow,
  children,
}: {
  grow: number;
  children: React.ReactNode;
}) {
  // Figma column px double as basis AND floor; long headers ellipsize like the design
  return (
    <div
      className="flex flex-col items-start overflow-hidden"
      style={{ flexGrow: grow, flexBasis: `${grow}px`, minWidth: `${grow}px` }}
    >
      {children}
    </div>
  );
}

export function RecommendationsCard({
  title = "Recent daily optimization recommendations",
  rows = DEFAULT_ROWS,
}: RecommendationsCardProps) {
  return (
    <WidgetCard className="h-full">
      <div className="flex flex-col gap-[16px] items-start w-full">
        <WidgetTitle>{title}</WidgetTitle>
        <HomeTableShell minWidth={700}>
          <Column grow={COL.scanName}>
            <HomeHeaderCell label="Scan Name" />
            {rows.map((row) => (
              <HomeCell key={row.scanName}>
                <HomeCellText>{row.scanName}</HomeCellText>
              </HomeCell>
            ))}
          </Column>
          <Column grow={COL.waste}>
            <HomeHeaderCell label="Waste" />
            {rows.map((row) => (
              <HomeCell key={row.scanName}>
                <HomeCellText>{row.waste}</HomeCellText>
              </HomeCell>
            ))}
          </Column>
          <Column grow={COL.scannedCost}>
            <HomeHeaderCell label="Scanned Cost" sortable />
            {rows.map((row) => (
              <HomeCell key={row.scanName}>
                <HomeCellText>{row.scannedCost}</HomeCellText>
              </HomeCell>
            ))}
          </Column>
          <Column grow={COL.resources}>
            <HomeHeaderCell label="Number of Resources" />
            {rows.map((row) => (
              <HomeCell key={row.scanName}>
                <HomeCellText>{row.resources}</HomeCellText>
              </HomeCell>
            ))}
          </Column>
          <Column grow={COL.costWastePct}>
            <HomeHeaderCell label="Cost Waste Percentage" />
            {rows.map((row) => (
              <HomeCell key={row.scanName}>
                <HomeCellText>{row.costWastePct}</HomeCellText>
              </HomeCell>
            ))}
          </Column>
          <Column grow={COL.actions}>
            <HomeHeaderCell label="Actions" />
            {rows.map((row) => (
              <HomeCell key={row.scanName} className="px-[12px]!">
                {row.action !== undefined && <TableActionButton>{row.action}</TableActionButton>}
              </HomeCell>
            ))}
          </Column>
        </HomeTableShell>
      </div>
    </WidgetCard>
  );
}

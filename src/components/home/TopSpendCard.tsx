import { HomeCell, HomeCellText, HomeHeaderCell, HomeTableShell, WidgetCard, WidgetTitle } from "./CostCentersCard";

/*
 * "Top monthly spend by service" widget — middle card of the home page's
 * bottom 3-widget row (Figma "Frame 1000005011" → "Monthly top cost drivers").
 * Two equal columns (173.5px each of a 347 table at the 1652 design width).
 */

export type TopSpendRow = {
  name: string;
  totalCost: string;
};

export type TopSpendCardProps = {
  title?: string;
  rows?: TopSpendRow[];
};

const DEFAULT_ROWS: TopSpendRow[] = [
  { name: "AWS EC2", totalCost: "$18,432" },
  { name: "Google BigQuery", totalCost: "$12,891" },
  { name: "OpenAI API", totalCost: "$8,234" },
  { name: "CloudSQL", totalCost: "$7,212" },
  { name: "Gemini API", totalCost: "$5,252" },
  { name: "Others", totalCost: "$2,445" },
];

export function TopSpendCard({ title = "Top monthly spend by service", rows = DEFAULT_ROWS }: TopSpendCardProps) {
  return (
    <WidgetCard className="h-full">
      <div className="flex flex-col gap-[16px] items-start w-full">
        <WidgetTitle>{title}</WidgetTitle>
        <HomeTableShell minWidth={300}>
          <div className="flex flex-1 flex-col items-start min-w-0">
            <HomeHeaderCell label="Name" />
            {rows.map((row) => (
              <HomeCell key={row.name}>
                <HomeCellText>{row.name}</HomeCellText>
              </HomeCell>
            ))}
          </div>
          <div className="flex flex-1 flex-col items-start min-w-0">
            <HomeHeaderCell label="Total Cost" sortable />
            {rows.map((row) => (
              <HomeCell key={row.name}>
                <HomeCellText>{row.totalCost}</HomeCellText>
              </HomeCell>
            ))}
          </div>
        </HomeTableShell>
      </div>
    </WidgetCard>
  );
}

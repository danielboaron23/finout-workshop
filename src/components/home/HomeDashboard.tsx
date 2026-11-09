"use client";

import { useDemoStore } from "@/lib/demo-store";
import { GreetingHeader, type Persona } from "./GreetingHeader";
import { KpiCardsRow } from "./KpiCard";
import { CostCentersCard } from "./CostCentersCard";
import { RecommendationsCard } from "./RecommendationsCard";
import { TopSpendCard } from "./TopSpendCard";
import { RecentActivityCard } from "./RecentActivityCard";
import { ProductCardsRow } from "./ProductCard";
import { ProjectionCardsRow } from "./ProjectionCard";
import { MonthlyCostChart } from "./MonthlyCostChart";

/*
 * Client wrapper for the Home dashboard content. The active persona (demo
 * store key "home-persona", set by the PersonaSwitcher) decides which
 * sections render — a real data-driven view per role. Markup and classNames
 * are identical to the original HomeScreen block; sections only mount/unmount.
 */

type Sections = {
  kpi: boolean;
  costCenters: boolean;
  products: boolean;
  projections: boolean;
  chart: boolean;
  recommendations: boolean;
  topSpend: boolean;
  activity: boolean;
};

const PERSONA_SECTIONS: Record<Persona, Sections> = {
  /* FinOps sees everything (the full current page) */
  FinOps: { kpi: true, costCenters: true, products: true, projections: true, chart: true, recommendations: true, topSpend: true, activity: true },
  /* Engineer: KPIs + cost centers + monthly cost changes + recommendations */
  Engineer: { kpi: true, costCenters: true, products: false, projections: false, chart: true, recommendations: true, topSpend: false, activity: false },
  /* Finance: KPIs + cost centers + projections + monthly cost changes + top spend */
  Finance: { kpi: true, costCenters: true, products: false, projections: true, chart: true, recommendations: false, topSpend: true, activity: false },
  /* Executive: KPIs + projections + monthly cost changes + recent activity */
  Executive: { kpi: true, costCenters: false, products: false, projections: true, chart: true, recommendations: false, topSpend: false, activity: true },
};

export function HomeDashboard() {
  const persona = useDemoStore<Persona>("home-persona", "FinOps");
  const sections = PERSONA_SECTIONS[persona] ?? PERSONA_SECTIONS.FinOps;
  const hasBottomRow = sections.recommendations || sections.topSpend || sections.activity;
  return (
    <div className="flex flex-col px-[24px] pt-[24px] pb-[24px] w-full">
      <GreetingHeader />
      <div className="flex flex-col gap-[32px] mt-[40px] w-full">
        {sections.kpi && <KpiCardsRow />}
        {sections.costCenters && <CostCentersCard />}
        {sections.products && <ProductCardsRow />}
        {sections.projections && <ProjectionCardsRow />}
        {sections.chart && <MonthlyCostChart />}
        {hasBottomRow && (
          <div className="flex flex-wrap gap-[24px] w-full items-stretch">
            {sections.recommendations && (
              <div className="grow-[810] basis-[810px] min-w-[560px]">
                <RecommendationsCard />
              </div>
            )}
            {sections.topSpend && (
              <div className="grow-[397] basis-[397px] min-w-[300px]">
                <TopSpendCard />
              </div>
            )}
            {sections.activity && (
              <div className="grow-[397] basis-[397px] min-w-[300px]">
                <RecentActivityCard />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

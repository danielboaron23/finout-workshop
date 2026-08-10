import { Sidebar } from "@/components/sidebar/Sidebar";
import { HomeTopBar } from "@/components/home/HomeTopBar";
import { GreetingHeader } from "@/components/home/GreetingHeader";
import { KpiCardsRow } from "@/components/home/KpiCard";
import { CostCentersCard } from "@/components/home/CostCentersCard";
import { RecommendationsCard } from "@/components/home/RecommendationsCard";
import { TopSpendCard } from "@/components/home/TopSpendCard";
import { RecentActivityCard } from "@/components/home/RecentActivityCard";
import { ProductCardsRow } from "@/components/home/ProductCard";
import { ProjectionCardsRow } from "@/components/home/ProjectionCard";
import { MonthlyCostChart } from "@/components/home/MonthlyCostChart";

/*
 * Screen: Home / Overview — Figma node 1:13833 "Home page" (1920x2274).
 * Content bg is pure white; sections stack with 32px gaps inside a 24px gutter.
 * Bottom row: 810 / 397 / 397 with 24px gaps at 1920.
 */
export function HomeScreen() {
  return (
    <div className="bg-white flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="Overview" />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto">
        <HomeTopBar />
        <div className="flex flex-col px-[24px] pt-[24px] pb-[24px] w-full">
          <GreetingHeader />
          <div className="flex flex-col gap-[32px] mt-[40px] w-full">
            <KpiCardsRow />
            <CostCentersCard />
            <ProductCardsRow />
            <ProjectionCardsRow />
            <MonthlyCostChart />
            <div className="flex flex-wrap gap-[24px] w-full items-stretch">
              <div className="grow-[810] basis-[810px] min-w-[560px]">
                <RecommendationsCard />
              </div>
              <div className="grow-[397] basis-[397px] min-w-[300px]">
                <TopSpendCard />
              </div>
              <div className="grow-[397] basis-[397px] min-w-[300px]">
                <RecentActivityCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { TopNav } from "@/components/navigation/TopNav";
import { PageTitleBar } from "@/components/navigation/PageTitleBar";
import { AnomaliesResults } from "@/components/anomalies/AnomaliesResults";
import {
  FilterChip,
  FilterSeparator,
  SearchAnomalies,
  DotsMenuButton,
  CalendarIcon18,
} from "@/components/anomalies/FilterChip";

/*
 * Screen: Anomalies feed — Figma node 1:14654 (1920x959).
 * Tabs (Anomalies Feed active, underline #888787), filters row + primary CTA,
 * "1 result", one usage-anomaly card.
 */

function AnomalyTabs() {
  return (
    <div className="border-b border-solid border-[#ebebeb] flex flex-col items-start w-full">
      <div className="flex gap-[16px] items-start">
        <button className="border-b-2 border-solid border-[#888787] flex h-[36px] items-center justify-center overflow-clip pb-[11px] pt-px px-[4px] cursor-pointer">
          <p className="font-sans font-medium leading-[22px] text-[#0d0d0d] text-[14px] whitespace-nowrap">Anomalies Feed</p>
        </button>
        <button className="flex h-[36px] items-center justify-center overflow-clip pb-[11px] pt-px px-[4px] cursor-pointer">
          <p className="font-sans font-medium leading-[22px] text-[#0d0d0d] text-[14px] whitespace-nowrap">Manage Anomalies</p>
        </button>
      </div>
    </div>
  );
}

export function AnomaliesScreen() {
  return (
    <div className="bg-canvas flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="Anomalies" />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto bg-surface-primary">
        <TopNav compact />
        <PageTitleBar title="Create Usage Anomaly Alert" linkLabel="Learn more" />
        <div className="flex flex-col w-full px-[32px] pt-[24px]">
          <div className="flex flex-col gap-[16px] items-start w-full">
            <AnomalyTabs />
            <div className="flex items-center justify-between w-full gap-[16px] flex-wrap">
              <div className="flex gap-[8px] h-[36px] items-start flex-wrap">
                <FilterChip icon={<CalendarIcon18 />}>Last 30 days</FilterChip>
                <FilterSeparator />
                <FilterChip>Type</FilterChip>
                <FilterChip>Cost Center</FilterChip>
                <FilterChip>Key</FilterChip>
                <FilterChip>Value</FilterChip>
                <FilterSeparator />
                <FilterChip>Anomaly Threshold</FilterChip>
                <FilterSeparator />
                <SearchAnomalies />
              </div>
              <div className="flex gap-[12px] items-end">
                <Link
                  href="/anomalies/create"
                  className="bg-[#1570ef] flex gap-[8px] items-center justify-center min-h-[36px] px-[16px] py-[8px] rounded-[8px] cursor-pointer font-sans font-medium leading-[20px] text-[14px] text-[#f3f5f8] whitespace-nowrap"
                >
                  Create Anomaly Alert
                </Link>
                <DotsMenuButton />
              </div>
            </div>
          </div>
          <AnomaliesResults />
        </div>
      </div>
    </div>
  );
}

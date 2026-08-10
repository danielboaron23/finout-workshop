"use client";

import { useState } from "react";
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
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";

/*
 * Screen: Anomalies feed — Figma node 1:14654 (1920x959).
 * Tabs (Anomalies Feed active, underline #888787), filters row + primary CTA,
 * "N result(s)", usage-anomaly cards from the demo store ("anomaly-cards").
 */

const TYPE_OPTIONS = ["Usage Anomaly", "Cost Anomaly"];
const COST_CENTER_OPTIONS = ["Global", "Anthropic", "AWS"];
const KEY_OPTIONS = ["CostCenter", "Service", "Team"];
const VALUE_OPTIONS = ["Anthropic", "AWS", "Global"];
const THRESHOLD_OPTIONS = [">5%", ">10%", ">20%"];
const DATE_OPTIONS = ["Last 7 days", "Last 14 days", "Last 30 days"];

type Tab = "feed" | "manage";

function AnomalyTabs({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const tabButton = (tab: Tab, label: string) => (
    <button
      onClick={() => onChange(tab)}
      className={`${
        active === tab ? "border-b-2 border-solid border-[#888787] " : ""
      }flex h-[36px] items-center justify-center overflow-clip pb-[11px] pt-px px-[4px] cursor-pointer`}
    >
      <p className="font-sans font-medium leading-[22px] text-[#0d0d0d] text-[14px] whitespace-nowrap">{label}</p>
    </button>
  );
  return (
    <div className="border-b border-solid border-[#ebebeb] flex flex-col items-start w-full">
      <div className="flex gap-[16px] items-start">
        {tabButton("feed", "Anomalies Feed")}
        {tabButton("manage", "Manage Anomalies")}
      </div>
    </div>
  );
}

/** Filter chip + options Dropdown. Selecting again clears; label becomes "Base: Value". */
function ChipFilter({
  base,
  value,
  options,
  onSelect,
  icon,
  shortValue,
  selectedBase,
}: {
  base: string;
  value: string | null;
  options: string[];
  onSelect: (v: string | null) => void;
  icon?: React.ReactNode;
  /** Shorten the option for the chip label (e.g. "Usage Anomaly" -> "Usage"). */
  shortValue?: (v: string) => string;
  /** Base label to use once a value is selected (e.g. "Threshold"). */
  selectedBase?: string;
}) {
  const label = value ? `${selectedBase ?? base}: ${shortValue ? shortValue(value) : value}` : base;
  return (
    <Dropdown trigger={() => <FilterChip icon={icon} active={value !== null}>{label}</FilterChip>}>
      {(close) => (
        <>
          {options.map((opt) => (
            <DropdownItem
              key={opt}
              selected={value === opt}
              onClick={() => {
                onSelect(value === opt ? null : opt);
                close();
              }}
            >
              {opt}
            </DropdownItem>
          ))}
        </>
      )}
    </Dropdown>
  );
}

export function AnomaliesScreen() {
  const [tab, setTab] = useState<Tab>("feed");
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [costCenterFilter, setCostCenterFilter] = useState<string | null>(null);
  const [keyFilter, setKeyFilter] = useState<string | null>(null);
  const [valueFilter, setValueFilter] = useState<string | null>(null);
  const [thresholdFilter, setThresholdFilter] = useState<string | null>(null);

  return (
    <div className="bg-canvas flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="Anomalies" />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto bg-surface-primary">
        <TopNav compact />
        <PageTitleBar title="Create Usage Anomaly Alert" linkLabel="Learn more" />
        <div className="flex flex-col w-full px-[32px] pt-[24px]">
          <div className="flex flex-col gap-[16px] items-start w-full">
            <AnomalyTabs active={tab} onChange={setTab} />
            <div className="flex items-center justify-between w-full gap-[16px] flex-wrap">
              <div className="flex gap-[8px] h-[36px] items-start flex-wrap">
                <Dropdown
                  trigger={() => (
                    <FilterChip icon={<CalendarIcon18 />} active={dateRange !== "Last 30 days"}>
                      {dateRange}
                    </FilterChip>
                  )}
                >
                  {(close) => (
                    <>
                      {DATE_OPTIONS.map((opt) => (
                        <DropdownItem
                          key={opt}
                          selected={dateRange === opt}
                          onClick={() => {
                            setDateRange(opt);
                            close();
                          }}
                        >
                          {opt}
                        </DropdownItem>
                      ))}
                    </>
                  )}
                </Dropdown>
                <FilterSeparator />
                <ChipFilter
                  base="Type"
                  value={typeFilter}
                  options={TYPE_OPTIONS}
                  onSelect={setTypeFilter}
                  shortValue={(v) => v.replace(" Anomaly", "")}
                />
                <ChipFilter
                  base="Cost Center"
                  value={costCenterFilter}
                  options={COST_CENTER_OPTIONS}
                  onSelect={setCostCenterFilter}
                />
                <ChipFilter base="Key" value={keyFilter} options={KEY_OPTIONS} onSelect={setKeyFilter} />
                <ChipFilter base="Value" value={valueFilter} options={VALUE_OPTIONS} onSelect={setValueFilter} />
                <FilterSeparator />
                <ChipFilter
                  base="Anomaly Threshold"
                  selectedBase="Threshold"
                  value={thresholdFilter}
                  options={THRESHOLD_OPTIONS}
                  onSelect={setThresholdFilter}
                />
                <FilterSeparator />
                <SearchAnomalies value={query} onChange={setQuery} />
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
          <AnomaliesResults
            tab={tab}
            query={query}
            filters={{ type: typeFilter, costCenter: costCenterFilter, threshold: thresholdFilter }}
          />
        </div>
      </div>
    </div>
  );
}

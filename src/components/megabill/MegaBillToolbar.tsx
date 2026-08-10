"use client";

/*
 * MegaBill toolbar row — Figma node 1:13879 ("Frame 1000004921", 1439x70).
 * LEFT: sparkle icon button, Filters / Daily / Last 30 Days chips, Cost|Usage switcher.
 * RIGHT: Display [Cost], X Axis [Date] selects with inner gray tag, Amortized Cost chip.
 *
 * Every chip/select is a real Dropdown. All state is controllable via props
 * (driven by MegaBillPageClient) with internal fallbacks for standalone use.
 */

import { useState } from "react";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { CHART_SERIES } from "./MegaBillChart";
import { CheckRow } from "./MegaBillMenus";
import {
  AGGREGATION_OPTIONS,
  AMORTIZED_OPTIONS,
  RANGE_OPTIONS,
  type MegaBillAggregation,
  type MegaBillAmortized,
  type MegaBillMode,
  type MegaBillRangeDays,
  type MegaBillXAxis,
} from "./megabill-data";

const I = "/icons/megabill";

function ChevronDown16() {
  return (
    <span className="overflow-clip relative shrink-0 size-[16px]">
      <span className="absolute inset-[34.38%_21.88%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/chevron-down-16.svg`} />
      </span>
    </span>
  );
}

function ListFilterIcon16() {
  return (
    <span className="overflow-clip relative shrink-0 size-[16px]">
      <span className="absolute inset-[21.88%_9.38%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/list-filter-16.svg`} />
      </span>
    </span>
  );
}

function CalendarIcon16() {
  return (
    <span className="overflow-clip relative shrink-0 size-[16px]">
      <span className="absolute inset-[5.21%_9.38%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/calendar-16.svg`} />
      </span>
    </span>
  );
}

function Caret16() {
  return (
    <span className="relative shrink-0 size-[16px]">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/caret-frame.svg`} />
      <span className="absolute inset-[37.5%_18.75%_31.25%_18.75%]">
        <span className="absolute inset-[-20%_-10%]">
          <img alt="" className="block max-w-none size-full" src={`${I}/caret-vector.svg`} />
        </span>
      </span>
    </span>
  );
}

function SparkleButton() {
  return (
    <button className="bg-[#fefefe] border border-solid border-[#d0d5dd] flex items-center justify-center p-[8px] rounded-[8px] shrink-0 size-[36px] cursor-pointer">
      <span className="relative shrink-0 size-[15px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/sparkle.svg`} />
      </span>
    </button>
  );
}

/** Tertiary chip button — white bg, #d0d5dd border, radius 8, 36px tall. */
function ToolbarChip({
  label,
  icon,
  caret = true,
}: {
  label: string;
  icon?: React.ReactNode;
  caret?: boolean;
}) {
  return (
    <button className="bg-[#fefefe] border border-solid border-[#d0d5dd] flex gap-[8px] items-center justify-center min-h-[36px] px-[16px] py-[8px] rounded-[8px] shrink-0 cursor-pointer">
      {icon}
      <span className="font-sans font-medium leading-[20px] text-[#101828] text-[14px] text-center whitespace-nowrap">
        {label}
      </span>
      {caret && <ChevronDown16 />}
    </button>
  );
}

/**
 * Cost | Usage switcher. Active atom: #eff8ff bg, full #1570ef border, #1570ef text 12/16.
 * Inactive atom: #fefefe bg, #98a2b3 border on top/bottom/outer side only, #101828 text 12/20.
 */
function CostUsageSwitcher({
  value,
  onChange,
}: {
  value: MegaBillMode;
  onChange: (mode: MegaBillMode) => void;
}) {
  const active = value;
  return (
    <div className="flex items-center shrink-0">
      <button
        onClick={() => onChange("cost")}
        className={`flex gap-[8px] h-[36px] items-center justify-center px-[16px] py-[7px] rounded-l-[8px] shrink-0 cursor-pointer border-solid ${
          active === "cost"
            ? "bg-[#eff8ff] border border-[#1570ef]"
            : "bg-[#fefefe] border-t border-b border-l border-[#98a2b3]"
        }`}
      >
        <span
          className={`font-sans font-medium text-[12px] whitespace-nowrap ${
            active === "cost" ? "leading-[16px] text-[#1570ef]" : "leading-[20px] text-[#101828]"
          }`}
        >
          Cost
        </span>
      </button>
      <button
        onClick={() => onChange("usage")}
        className={`flex gap-[8px] h-[36px] items-center justify-center px-[16px] py-[7px] rounded-r-[8px] shrink-0 cursor-pointer border-solid ${
          active === "usage"
            ? "bg-[#eff8ff] border border-[#1570ef]"
            : "bg-[#fefefe] border-t border-b border-r border-[#98a2b3]"
        }`}
      >
        <span
          className={`font-sans font-medium text-[12px] whitespace-nowrap ${
            active === "usage" ? "leading-[16px] text-[#1570ef]" : "leading-[20px] text-[#101828]"
          }`}
        >
          Usage
        </span>
      </button>
    </div>
  );
}

/** "Label [Tag] ▾" select — white bg, #d0d5dd border, radius 8, gray #ebebeb inner tag. */
function TagSelect({
  label,
  tag,
  options,
  onSelect,
}: {
  label: string;
  tag: string;
  options: readonly string[];
  onSelect: (value: string) => void;
}) {
  return (
    <Dropdown
      align="right"
      trigger={() => (
        <div className="flex items-start shrink-0">
          <button className="bg-white border border-solid border-[#d0d5dd] flex items-center pl-[4px] pr-[8px] py-[2px] rounded-[8px] shrink-0 cursor-pointer">
            <span className="flex items-start shrink-0">
              <span className="flex gap-[8px] items-center pl-[8px] pr-[4px] py-[2px] rounded-[2px] shrink-0">
                <span className="flex gap-[8px] items-center shrink-0">
                  <span className="flex gap-[4px] items-center py-px shrink-0">
                    <span className="font-sans font-medium leading-[20px] text-[#101828] text-[14px] whitespace-nowrap">
                      {label}
                    </span>
                  </span>
                  <span className="bg-[#ebebeb] flex gap-[5px] h-[28px] items-center justify-center px-[6px] rounded-[3px] shrink-0">
                    <span className="font-sans font-medium leading-[20px] text-[#101828] text-[14px] whitespace-nowrap">
                      {tag}
                    </span>
                  </span>
                </span>
                <Caret16 />
              </span>
            </span>
          </button>
        </div>
      )}
    >
      {(close) => (
        <div className="flex flex-col min-w-[160px]">
          {options.map((o) => (
            <DropdownItem
              key={o}
              selected={o === tag}
              onClick={() => {
                onSelect(o);
                close();
              }}
            >
              {o}
            </DropdownItem>
          ))}
        </div>
      )}
    </Dropdown>
  );
}

/** Controlled-with-fallback helper (value+onChange props, internal state otherwise). */
function useControlled<T>(
  value: T | undefined,
  onChange: ((v: T) => void) | undefined,
  initial: T,
): [T, (v: T) => void] {
  const [internal, setInternal] = useState<T>(initial);
  return [value !== undefined ? value : internal, onChange ?? setInternal];
}

export type MegaBillToolbarProps = {
  mode?: MegaBillMode;
  onModeChange?: (mode: MegaBillMode) => void;
  aggregation?: MegaBillAggregation;
  onAggregationChange?: (aggregation: MegaBillAggregation) => void;
  rangeDays?: MegaBillRangeDays;
  onRangeDaysChange?: (days: MegaBillRangeDays) => void;
  /** Series labels listed in the Filters chip. Default: the 10 chart series. */
  seriesOptions?: readonly string[];
  /** Unchecked (filtered-out) series. */
  filteredSeries?: readonly string[];
  onToggleSeriesFilter?: (label: string) => void;
  xAxis?: MegaBillXAxis;
  onXAxisChange?: (xAxis: MegaBillXAxis) => void;
  amortized?: MegaBillAmortized;
  onAmortizedChange?: (amortized: MegaBillAmortized) => void;
};

export function MegaBillToolbar(props: MegaBillToolbarProps = {}) {
  const [mode, setMode] = useControlled<MegaBillMode>(props.mode, props.onModeChange, "cost");
  const [aggregation, setAggregation] = useControlled<MegaBillAggregation>(
    props.aggregation,
    props.onAggregationChange,
    "daily",
  );
  const [rangeDays, setRangeDays] = useControlled<MegaBillRangeDays>(
    props.rangeDays,
    props.onRangeDaysChange,
    30,
  );
  const [xAxis, setXAxis] = useControlled<MegaBillXAxis>(props.xAxis, props.onXAxisChange, "date");
  const [amortized, setAmortized] = useControlled<MegaBillAmortized>(
    props.amortized,
    props.onAmortizedChange,
    "Amortized Cost",
  );
  const [internalFiltered, setInternalFiltered] = useState<string[]>([]);
  const filtered = props.filteredSeries ?? internalFiltered;
  const toggleFilter =
    props.onToggleSeriesFilter ??
    ((label: string) =>
      setInternalFiltered((prev) =>
        prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
      ));
  const seriesOptions = props.seriesOptions ?? CHART_SERIES.map((s) => s.label);

  const aggregationLabel = AGGREGATION_OPTIONS.find((o) => o.value === aggregation)?.label ?? "Daily";
  const filtersLabel = filtered.length > 0 ? `Filters · ${filtered.length}` : "Filters";

  return (
    <div className="bg-white border border-solid border-[#eaecf0] flex items-start justify-between px-[16px] py-[17px] rounded-[6px] w-full">
      {/* Left group */}
      <div className="flex gap-[12px] items-center shrink-0">
        <SparkleButton />
        <Dropdown trigger={() => <ToolbarChip label={filtersLabel} icon={<ListFilterIcon16 />} />}>
          <div className="flex flex-col gap-[2px] min-w-[180px]">
            {seriesOptions.map((label) => (
              <CheckRow
                key={label}
                label={label}
                checked={!filtered.includes(label)}
                onToggle={() => toggleFilter(label)}
              />
            ))}
          </div>
        </Dropdown>
        <Dropdown trigger={() => <ToolbarChip label={aggregationLabel} />}>
          {(close) => (
            <div className="flex flex-col min-w-[160px]">
              {AGGREGATION_OPTIONS.map((o) => (
                <DropdownItem
                  key={o.value}
                  selected={o.value === aggregation}
                  onClick={() => {
                    setAggregation(o.value);
                    close();
                  }}
                >
                  {o.label}
                </DropdownItem>
              ))}
            </div>
          )}
        </Dropdown>
        <Dropdown trigger={() => <ToolbarChip label={`Last ${rangeDays} Days`} icon={<CalendarIcon16 />} />}>
          {(close) => (
            <div className="flex flex-col min-w-[160px]">
              {RANGE_OPTIONS.map((d) => (
                <DropdownItem
                  key={d}
                  selected={d === rangeDays}
                  onClick={() => {
                    setRangeDays(d);
                    close();
                  }}
                >
                  {`Last ${d} Days`}
                </DropdownItem>
              ))}
            </div>
          )}
        </Dropdown>
        <CostUsageSwitcher value={mode} onChange={setMode} />
      </div>
      {/* Right group */}
      <div className="flex gap-[8px] items-center shrink-0">
        <TagSelect
          label="Display"
          tag={mode === "cost" ? "Cost" : "Usage"}
          options={["Cost", "Usage"]}
          onSelect={(v) => setMode(v === "Usage" ? "usage" : "cost")}
        />
        <TagSelect
          label="X Axis"
          tag={xAxis === "date" ? "Date" : "Service"}
          options={["Date", "Service"]}
          onSelect={(v) => setXAxis(v === "Service" ? "service" : "date")}
        />
        <Dropdown align="right" trigger={() => <ToolbarChip label={amortized} />}>
          {(close) => (
            <div className="flex flex-col min-w-[170px]">
              {AMORTIZED_OPTIONS.map((o) => (
                <DropdownItem
                  key={o}
                  selected={o === amortized}
                  onClick={() => {
                    setAmortized(o);
                    close();
                  }}
                >
                  {o}
                </DropdownItem>
              ))}
            </div>
          )}
        </Dropdown>
      </div>
    </div>
  );
}

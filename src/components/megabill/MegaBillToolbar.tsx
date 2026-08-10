"use client";

/*
 * MegaBill toolbar row — Figma node 1:13879 ("Frame 1000004921", 1439x70).
 * LEFT: sparkle icon button, Filters / Daily / Last 30 Days chips, Cost|Usage switcher.
 * RIGHT: Display [Cost], X Axis [Date] selects with inner gray tag, Amortized Cost chip.
 */

import { useState } from "react";

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
function CostUsageSwitcher() {
  const [active, setActive] = useState<"cost" | "usage">("cost");
  return (
    <div className="flex items-center shrink-0">
      <button
        onClick={() => setActive("cost")}
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
        onClick={() => setActive("usage")}
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
function TagSelect({ label, tag }: { label: string; tag: string }) {
  return (
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
  );
}

export function MegaBillToolbar() {
  return (
    <div className="bg-white border border-solid border-[#eaecf0] flex items-start justify-between overflow-clip px-[16px] py-[17px] rounded-[6px] w-full">
      {/* Left group */}
      <div className="flex gap-[12px] items-center shrink-0">
        <SparkleButton />
        <ToolbarChip label="Filters" icon={<ListFilterIcon16 />} />
        <ToolbarChip label="Daily" />
        <ToolbarChip label="Last 30 Days" icon={<CalendarIcon16 />} />
        <CostUsageSwitcher />
      </div>
      {/* Right group */}
      <div className="flex gap-[8px] items-center shrink-0">
        <TagSelect label="Display" tag="Cost" />
        <TagSelect label="X Axis" tag="Date" />
        <ToolbarChip label="Amortized Cost" />
      </div>
    </div>
  );
}

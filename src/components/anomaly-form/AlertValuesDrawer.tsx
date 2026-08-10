"use client";

import type { ReactNode } from "react";
import { Drawer } from "./Drawer";

/*
 * "Alert Values" Horizontal Drawer — Figma 1:13429 (1636x184).
 * Content row: "Anthropic" select (207x36), "Filters" select with list-filter icon
 * (207x36), "Group By [User Name x]" grouped select (356x36); below, a full-width
 * Tag Area (border #eaecf0, radius 8) with tag "claude-opus-4-8 x" + "Clear".
 */

/* Form's 36px select — white, border #eaecf0, radius 8. Reused by UsageTypeDrawer. */
export function FormSelect({
  label,
  leftIcon,
  textClassName = "font-geist font-normal leading-[20px] text-[14px] text-[#475467]",
  chevronSrc = "/icons/ui/chevron-down-16.svg",
  decoratedChevron = false,
  className = "",
}: {
  label: string;
  leftIcon?: ReactNode;
  textClassName?: string;
  chevronSrc?: string;
  decoratedChevron?: boolean;
  className?: string;
}) {
  const chevron = (
    <span className="overflow-clip relative shrink-0 size-[16px]">
      <span className="absolute inset-[34.38%_21.88%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={chevronSrc} />
      </span>
    </span>
  );
  return (
    <button
      type="button"
      className={`bg-white border border-solid border-[#eaecf0] flex gap-[8px] items-center min-h-[36px] rounded-[8px] shrink-0 cursor-pointer ${
        decoratedChevron ? "px-[12px] py-[7.5px]" : "pl-[12px] pr-[8px] py-[8px]"
      } ${className}`}
    >
      <span className="flex flex-1 gap-[8px] items-center min-w-0 overflow-clip">
        {leftIcon}
        <span className={`whitespace-nowrap ${textClassName}`}>{label}</span>
      </span>
      {decoratedChevron ? (
        <span className="flex flex-col items-center justify-center p-[2px] shrink-0 w-[20px]">
          {chevron}
        </span>
      ) : (
        chevron
      )}
    </button>
  );
}

/* 16px list-filter icon inside its 20px left-decoration wrapper. */
function FilterIcon() {
  return (
    <span className="flex flex-col items-center justify-center p-[2px] shrink-0 w-[20px]">
      <span className="overflow-clip relative shrink-0 size-[16px]">
        <span className="absolute inset-[21.88%_9.38%]">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src="/icons/anomaly-form/filter-16.svg"
          />
        </span>
      </span>
    </span>
  );
}

/* Gray filter tag (#ebebeb, h-28, radius 3) with removable x. */
function FilterTag({ label }: { label: string }) {
  return (
    <span className="bg-[#ebebeb] flex gap-[5px] h-[28px] items-center justify-center px-[6px] rounded-[3px] shrink-0">
      <span className="font-sans font-medium leading-[20px] text-[12px] text-[#101828] whitespace-nowrap">
        {label}
      </span>
      <span
        role="button"
        aria-label={`Remove ${label}`}
        className="h-[12px] relative shrink-0 w-[12.387px] cursor-pointer inline-block"
      >
        <img
          alt=""
          className="absolute block inset-0 max-w-none size-full"
          src="/icons/anomaly-form/tag-x-base.svg"
        />
        <span className="absolute inset-[21.88%]">
          <span className="absolute inset-[-7.41%_-7.18%]">
            <img alt="" className="block max-w-none size-full" src="/icons/anomaly-form/tag-x-v1.svg" />
          </span>
        </span>
        <span className="absolute inset-[21.88%]">
          <span className="absolute inset-[-7.41%_-7.18%]">
            <img alt="" className="block max-w-none size-full" src="/icons/anomaly-form/tag-x-v2.svg" />
          </span>
        </span>
      </span>
    </span>
  );
}

/* "Group By [User Name x]" grouped select with caret — Figma 1:13400 (356x36). */
function GroupBySelect() {
  return (
    <div className="bg-white border border-solid border-[#d0d5dd] flex items-center justify-center pl-[4px] pr-[8px] py-[2px] rounded-[8px] w-[356px]">
      <div className="flex flex-1 items-start min-w-0">
        <button
          type="button"
          className="flex flex-1 items-center justify-between min-w-0 pl-[8px] pr-[4px] py-[2px] rounded-[2px] cursor-pointer"
        >
          <span className="flex gap-[8px] items-center">
            <span className="flex gap-[4px] items-center py-px">
              <span className="font-geist font-normal leading-[20px] text-[14px] text-[#475467] whitespace-nowrap">
                Group By
              </span>
            </span>
            <FilterTag label="User Name" />
          </span>
          <span className="relative shrink-0 size-[16px]">
            <img
              alt=""
              className="absolute block inset-0 max-w-none size-full"
              src="/icons/anomalies/caret-base.svg"
            />
            <span className="absolute inset-[37.5%_18.75%_31.25%_18.75%]">
              <span className="absolute inset-[-20%_-10%]">
                <img alt="" className="block max-w-none size-full" src="/icons/anomaly-form/caret-v.svg" />
              </span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

export function AlertValuesDrawer() {
  return (
    <Drawer
      title="Alert Values"
      description="Apply a usage filter to define the parameters of the anomaly detection scan."
    >
      <div className="flex flex-col gap-[8px] items-start w-full">
        <div className="flex gap-[8px] items-center">
          <FormSelect
            label="Anthropic"
            className="w-[207px]"
            textClassName="font-sans font-normal leading-[20px] text-[14px] text-[#101828]"
          />
          <FormSelect label="Filters" leftIcon={<FilterIcon />} className="w-[207px]" />
          <GroupBySelect />
        </div>
        <div className="bg-white border border-solid border-[#eaecf0] content-center flex flex-wrap gap-y-[8px] items-center px-[16px] py-[12px] rounded-[8px] w-full">
          <div className="content-center flex flex-1 flex-wrap gap-[8px] items-center min-w-0">
            <FilterTag label="claude-opus-4-8" />
            <button
              type="button"
              className="flex gap-[8px] items-center justify-center overflow-clip cursor-pointer"
            >
              <span className="flex h-[22px] items-center justify-center w-0">
                <span className="flex-none rotate-90">
                  <span className="block h-0 relative w-[22px]">
                    <span className="absolute inset-[-1px_0_0_0]">
                      <img
                        alt=""
                        className="block max-w-none size-full"
                        src="/icons/anomaly-form/clear-divider.svg"
                      />
                    </span>
                  </span>
                </span>
              </span>
              <span className="font-sans font-medium leading-[22px] text-[14px] text-[#0d0d0d] whitespace-nowrap">
                Clear
              </span>
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

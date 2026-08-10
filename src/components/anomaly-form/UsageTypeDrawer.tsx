"use client";

import { Drawer } from "./Drawer";
import { FormSelect } from "./AlertValuesDrawer";

/*
 * "Usage Type" Horizontal Drawer — Figma 1:13432 (1636x124).
 * Content: "Anthropic Tokens" select (320x36) — Geist 14/20 #191919, chevron #475467
 * inside a 20px right-decoration wrapper.
 */
export function UsageTypeDrawer() {
  return (
    <Drawer title="Usage Type" description="Select a usage type available for the selected filters.">
      <FormSelect
        label="Anthropic Tokens"
        className="w-[320px]"
        textClassName="font-geist font-normal leading-[20px] text-[14px] text-[#191919]"
        chevronSrc="/icons/anomaly-form/chevron-down-16-dark.svg"
        decoratedChevron
      />
    </Drawer>
  );
}

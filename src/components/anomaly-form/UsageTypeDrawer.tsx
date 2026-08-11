"use client";

import { useState } from "react";
import { Drawer } from "./Drawer";
import { FormSelect } from "./AlertValuesDrawer";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";

/*
 * "Usage Type" Horizontal Drawer — Figma 1:13432 (1636x124).
 * Content: usage-type select (320x36) — Geist 14/20 #191919, chevron #475467
 * inside a 20px right-decoration wrapper. Opens a Dropdown with the available
 * usage types; the selection shows in the trigger and is reported via onChange.
 */

const USAGE_TYPE_OPTIONS = ["Anthropic Tokens", "OpenAI Tokens", "Gemini Tokens"];

export function UsageTypeDrawer({
  title = "Usage Type",
  value = "Anthropic Tokens",
  onChange,
}: {
  /** "Usage Type" | "Cost Type" (Cost/Usage switcher swaps the title). */
  title?: string;
  /** Initial selection. */
  value?: string;
  onChange?: (v: string) => void;
}) {
  const [selected, setSelected] = useState(value);
  return (
    <Drawer title={title} description="Select a usage type available for the selected filters.">
      <Dropdown
        trigger={() => (
          <FormSelect
            label={selected}
            className="w-[320px]"
            textClassName="font-geist font-normal leading-[20px] text-[14px] text-foreground"
            chevronSrc="/icons/anomaly-form/chevron-down-16-dark.svg"
            decoratedChevron
          />
        )}
      >
        {(close) => (
          <>
            {USAGE_TYPE_OPTIONS.map((opt) => (
              <DropdownItem
                key={opt}
                selected={selected === opt}
                onClick={() => {
                  setSelected(opt);
                  onChange?.(opt);
                  close();
                }}
              >
                {opt}
              </DropdownItem>
            ))}
          </>
        )}
      </Dropdown>
    </Drawer>
  );
}

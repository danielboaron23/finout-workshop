"use client";

import { Drawer } from "./Drawer";

/*
 * Alert Name drawer — Figma "Horizontal Drawer" 1:13394 (1636x100).
 * Drawer shell + one 320px input: white bg, border #eaecf0, radius 8,
 * min-h 36, px-12, Geist Regular 14/20 #191919, shadow-xs.
 */
export function AlertNameDrawer({
  value = "Anthropic Tokens",
  onChange,
  className = "",
}: {
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
}) {
  return (
    <Drawer title="Alert Name" className={className}>
      <div className="flex items-start w-[320px]">
        <input
          type="text"
          defaultValue={value}
          onChange={(e) => onChange?.(e.target.value)}
          aria-label="Alert Name"
          className="bg-white border border-solid border-neutral-100 flex-1 min-h-[36px] min-w-px px-[12px] py-[7.5px] rounded-[8px] shadow-xs font-geist font-normal leading-[20px] text-[14px] text-foreground outline-none"
        />
      </div>
    </Drawer>
  );
}

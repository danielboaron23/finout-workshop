"use client";

/*
 * Cost/Usage switcher — Figma "time frame and interval" (1:13387), switcher 1:13388.
 * 128x34: two 64px segments. Active: bg #eff8ff, full 1px border #1570ef, text #1570ef.
 * Inactive: bg white, border #d0d5dd (shared edge is drawn by the active segment), text #101828.
 * Text: Helvetica Neue Medium 12/20.
 */
export function CostUsageSwitcher({
  value,
  onChange,
}: {
  value: "cost" | "usage";
  onChange: (value: "cost" | "usage") => void;
}) {
  const base =
    "flex flex-1 items-center justify-center min-w-px px-[16px] py-[7px] cursor-pointer";
  const label =
    "font-sans font-medium leading-[20px] text-[12px] text-center whitespace-nowrap";
  return (
    <div className="flex isolate items-start overflow-clip w-[128px]">
      <button
        type="button"
        aria-pressed={value === "cost"}
        onClick={() => onChange("cost")}
        className={`${base} rounded-bl-[4px] rounded-tl-[4px] ${
          value === "cost"
            ? "bg-[#eff8ff] border border-solid border-[#1570ef] z-[2]"
            : "bg-white border-[#d0d5dd] border-b border-l border-solid border-t z-[1]"
        }`}
      >
        <span className={`${label} ${value === "cost" ? "text-[#1570ef]" : "text-[#101828]"}`}>
          Cost
        </span>
      </button>
      <button
        type="button"
        aria-pressed={value === "usage"}
        onClick={() => onChange("usage")}
        className={`${base} rounded-br-[4px] rounded-tr-[4px] ${
          value === "usage"
            ? "bg-[#eff8ff] border border-solid border-[#1570ef] z-[2]"
            : "bg-white border-[#d0d5dd] border-b border-r border-solid border-t z-[1]"
        }`}
      >
        <span className={`${label} ${value === "usage" ? "text-[#1570ef]" : "text-[#101828]"}`}>
          Usage
        </span>
      </button>
    </div>
  );
}

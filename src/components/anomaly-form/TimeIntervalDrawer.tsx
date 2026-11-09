"use client";

import { useState } from "react";
import { Drawer } from "./Drawer";

/*
 * Alert Time Interval drawer — Figma "Horizontal Drawer" 1:13818 (698x270).
 * Content = "Alert Time Interval Settings" (0:66194, 674x182):
 * row 1: evaluation period ("Last" + [1▾] select + Days|Weeks segmented control)
 * row 2: comparison period (number chips 2–6 + "More ▾" select + "days")
 * row 3: summary bar (chart icon + sentence with #eff8ff pill values).
 * Active segment/chip: bg #eff8ff, text #1570ef, border #cfcece;
 * inactive: bg white, text #0d0d0d, border-r #d0d5dd.
 * NOT full width on the page — the screen sizes it via className.
 */

const ICONS = "/icons/anomaly-form";

function InfoCircle20() {
  return (
    <span className="relative shrink-0 size-[20px]">
      <span className="absolute inset-[12.5%]">
        <span className="absolute inset-[-5%]">
          <img alt="" className="block max-w-none size-full" src={`${ICONS}/info-circle-vector-0.svg`} />
        </span>
      </span>
      <span className="absolute bottom-[31.25%] left-1/2 right-1/2 top-[46.88%]">
        <span className="absolute inset-[-17.14%_-0.75px]">
          <img alt="" className="block max-w-none size-full" src={`${ICONS}/info-circle-vector-1.svg`} />
        </span>
      </span>
      <span className="absolute inset-[28.13%_45.31%_62.5%_45.31%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${ICONS}/info-circle-vector-2.svg`} />
      </span>
    </span>
  );
}

function PresentationChart20() {
  return (
    <span className="relative shrink-0 size-[20px]">
      <span className="absolute inset-[18.75%_12.5%_28.13%_12.5%]">
        <span className="absolute inset-[-7.06%_-5%]">
          <img alt="" className="block max-w-none size-full" src={`${ICONS}/presentation-chart-vector-0.svg`} />
        </span>
      </span>
      <span className="absolute bottom-[12.5%] left-[62.5%] right-1/4 top-[71.88%]">
        <span className="absolute inset-[-24%_-30%]">
          <img alt="" className="block max-w-none size-full" src={`${ICONS}/presentation-chart-vector-1.svg`} />
        </span>
      </span>
      <span className="absolute bottom-[12.5%] left-1/4 right-[62.5%] top-[71.88%]">
        <span className="absolute inset-[-24%_-30%]">
          <img alt="" className="block max-w-none size-full" src={`${ICONS}/presentation-chart-vector-2.svg`} />
        </span>
      </span>
      <span className="absolute inset-[46.88%_62.5%_43.75%_37.5%]">
        <span className="absolute inset-[-40%_-0.75px]">
          <img alt="" className="block max-w-none size-full" src={`${ICONS}/presentation-chart-vector-3.svg`} />
        </span>
      </span>
      <span className="absolute bottom-[43.75%] left-1/2 right-1/2 top-[40.63%]">
        <span className="absolute inset-[-24%_-0.75px]">
          <img alt="" className="block max-w-none size-full" src={`${ICONS}/presentation-chart-vector-4.svg`} />
        </span>
      </span>
      <span className="absolute inset-[34.38%_37.5%_43.75%_62.5%]">
        <span className="absolute inset-[-17.14%_-0.75px]">
          <img alt="" className="block max-w-none size-full" src={`${ICONS}/presentation-chart-vector-5.svg`} />
        </span>
      </span>
      <span className="absolute bottom-[81.25%] left-1/2 right-1/2 top-[9.38%]">
        <span className="absolute inset-[-40%_-0.75px]">
          <img alt="" className="block max-w-none size-full" src={`${ICONS}/presentation-chart-vector-6.svg`} />
        </span>
      </span>
    </span>
  );
}

/* Select-style trigger (Figma "Date picker dropdown" button): white bg,
 * border #cfcece, radius 8, h 36, px-16, shadow-xs, 20px chevron. */
function SelectButton({ label, medium = false }: { label: string; medium?: boolean }) {
  return (
    <button
      type="button"
      className="bg-white border border-solid border-n200 flex gap-[8px] h-[36px] items-center justify-center overflow-clip px-[16px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer"
    >
      <span
        className={`font-sans ${medium ? "font-medium" : "font-normal"} leading-[22px] text-[14px] text-n900 whitespace-nowrap`}
      >
        {label}
      </span>
      <span className="relative shrink-0 size-[20px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${ICONS}/chevron-down-20.svg`} />
      </span>
    </button>
  );
}

/* Button-group segment. Active (Figma Days / chip 6): bg #eff8ff, text
 * #1570ef, border-r #cfcece. Inactive: bg white, text #0d0d0d, border-r #d0d5dd. */
function Segment({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`${
        active ? "bg-blue-50 border-n200" : "bg-white border-border-muted"
      } border-r border-solid flex items-center justify-center px-[16px] py-[10px] cursor-pointer`}
    >
      <span
        className={`font-sans font-medium leading-[22px] text-[14px] whitespace-nowrap ${
          active ? "text-blue-400" : "text-n900"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function SegmentGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-solid border-n200 drop-shadow-[0px_1px_1px_rgba(16,24,40,0.05)] flex h-[36px] isolate items-center overflow-clip rounded-[8px] shrink-0">
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-blue-50 flex h-[26px] items-center mix-blend-multiply px-[8px] py-[2px] rounded-[16px] shrink-0">
      <span className="font-sans font-medium leading-[22px] text-[14px] text-n900 text-center whitespace-nowrap">
        {children}
      </span>
    </span>
  );
}

const COMPARISON_CHIPS = [2, 3, 4, 5, 6];

export type TimeIntervalValue = { intervalA: string; intervalB: string };

export function TimeIntervalDrawer({
  className = "",
  initialUnit = "Days",
  initialComparison = 6,
  onChange,
}: {
  className?: string;
  initialUnit?: "Days" | "Weeks";
  initialComparison?: number;
  /** Fires with the card-ready values (e.g. { intervalA: "1 day", intervalB: "6 days" }). */
  onChange?: (value: TimeIntervalValue) => void;
}) {
  const [unit, setUnit] = useState<"Days" | "Weeks">(initialUnit);
  const [comparison, setComparison] = useState(initialComparison);

  const emit = (u: "Days" | "Weeks", c: number) =>
    onChange?.({
      intervalA: `1 ${u === "Days" ? "day" : "week"}`,
      intervalB: `${c} ${u === "Days" ? "days" : "weeks"}`,
    });
  const pickUnit = (u: "Days" | "Weeks") => {
    setUnit(u);
    emit(u, comparison);
  };
  const pickComparison = (c: number) => {
    setComparison(c);
    emit(unit, c);
  };

  const unitSingular = unit === "Days" ? "day" : "week";
  const unitPlural = unit === "Days" ? "days" : "weeks";

  return (
    <Drawer
      title="Alert Time Interval"
      description="Set the time interval for the anomaly scan"
      className={className}
    >
      <div className="flex flex-col items-start pt-[12px]">
        <div className="flex flex-col gap-[24px] items-start w-full">
          <div className="flex flex-col gap-[24px] items-start">
            {/* Row 1 — evaluation period */}
            <div className="flex gap-[16px] items-center">
              <div className="flex gap-[4px] items-center">
                <p className="font-sans font-medium leading-[22px] text-n900 text-[14px] whitespace-nowrap">
                  Define evaluation period
                </p>
                <InfoCircle20 />
              </div>
              <div className="flex gap-[8px] items-center">
                <p className="font-sans font-normal leading-[22px] text-n900 text-[14px] whitespace-nowrap">
                  Last
                </p>
                <SelectButton label="1" medium />
                <SegmentGroup>
                  <Segment label="Days" active={unit === "Days"} onClick={() => pickUnit("Days")} />
                  <Segment label="Weeks" active={unit === "Weeks"} onClick={() => pickUnit("Weeks")} />
                </SegmentGroup>
              </div>
            </div>
            {/* Row 2 — comparison period */}
            <div className="flex gap-[16px] items-center">
              <div className="flex gap-[4px] items-center">
                <p className="font-sans font-medium leading-[22px] text-n900 text-[14px] whitespace-nowrap">
                  Comparison period
                </p>
                <InfoCircle20 />
              </div>
              <div className="flex gap-[8px] items-center">
                <p className="font-sans font-normal leading-[22px] text-n900 text-[14px] whitespace-nowrap">
                  Average of total cost over
                </p>
                <SegmentGroup>
                  {COMPARISON_CHIPS.map((n) => (
                    <Segment
                      key={n}
                      label={String(n)}
                      active={comparison === n}
                      onClick={() => pickComparison(n)}
                    />
                  ))}
                </SegmentGroup>
                <SelectButton label="More" />
                <p className="font-sans font-normal leading-[22px] text-n900 text-[14px] whitespace-nowrap">
                  days
                </p>
              </div>
            </div>
          </div>
          {/* Divider (Figma Line 2352, stroke #f9f9f9) */}
          <div className="bg-[#f9f9f9] h-px w-full" />
          {/* Row 3 — summary bar */}
          <div className="flex items-center">
            <div className="flex gap-[4px] items-center">
              <PresentationChart20 />
              <p className="font-sans font-normal leading-[22px] text-n700 text-[14px] whitespace-nowrap">
                Analyzing anomalies over the past
              </p>
              <Pill>1 {unitSingular}</Pill>
              <p className="font-sans font-normal leading-[22px] text-n700 text-[14px] whitespace-nowrap">
                compared to the previous
              </p>
              <Pill>
                {comparison} {unitPlural}
              </Pill>
              <p className="font-sans font-normal leading-[22px] text-n700 text-[14px] whitespace-nowrap">
                average.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

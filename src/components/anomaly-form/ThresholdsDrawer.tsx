"use client";

import { useState } from "react";
import { Drawer } from "./Drawer";

/*
 * ThresholdsDrawer — Figma "Horizontal Drawer" 1:13815 (1636x667)
 * "Alert Thresholds and Endpoints" from the Create Anomaly Form frame.
 * Sections: Alert Thresholds settings (0:70233) + table - Cost (0:70369).
 */

const ICONS = "/icons/anomaly-form";

/* ---------------------------------- Switch ---------------------------------
 * Figma Switch 33x18 — bg #1570ef (checked) rounded-12, white (#fefefe) 16px
 * knob at inset 5.56%/3.03%/5.56%/48.48% when on (mirrored when off).
 */
export function Switch({
  defaultChecked = true,
  ariaLabel = "Toggle",
}: {
  defaultChecked?: boolean;
  ariaLabel?: string;
}) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      onClick={() => setOn((v) => !v)}
      className="relative h-[18px] w-[33px] shrink-0 cursor-pointer"
    >
      <span
        className={`absolute inset-0 rounded-[12px] transition-colors ${on ? "bg-[#1570ef]" : "bg-[#eaecf0]"}`}
      />
      <span
        className={`absolute transition-all ${on ? "inset-[5.56%_3.03%_5.56%_48.48%]" : "inset-[5.56%_48.48%_5.56%_3.03%]"}`}
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${ICONS}/switch-knob.svg`} />
      </span>
    </button>
  );
}

/* ---------------------------- TrendButtonGroup -----------------------------
 * 2-segment button group (trend-up / trend-down), up active by default.
 * Active segment bg #eff8ff (right border #cfcece), inactive bg white
 * (right border #d0d5dd). Group border #d0d5dd rounded-8, shadow-xs.
 * md = 36px tall (settings row), sm = 32px tall (table rows).
 */
function TrendButtonGroup({ size = "md" }: { size?: "md" | "sm" }) {
  const [active, setActive] = useState<"up" | "down">("up");
  const height = size === "md" ? "h-[36px]" : "h-[32px]";
  const segment = (dir: "up" | "down") => (
    <button
      type="button"
      aria-pressed={active === dir}
      onClick={() => setActive(dir)}
      className={`flex h-full items-center justify-center px-[12px] cursor-pointer border-r border-solid ${
        active === dir ? "bg-[#eff8ff] border-[#cfcece]" : "bg-white border-[#d0d5dd]"
      }`}
    >
      <span className="overflow-clip relative shrink-0 size-[20px]">
        <span className="absolute inset-[26.04%_5.21%]">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={`${ICONS}/trend-${dir}-20.svg`}
          />
        </span>
      </span>
    </button>
  );
  return (
    <div
      className={`border border-[#d0d5dd] border-solid drop-shadow-[0px_1px_1px_rgba(16,24,40,0.05)] flex ${height} items-center overflow-clip relative rounded-[8px] shrink-0`}
    >
      {segment("up")}
      {segment("down")}
    </div>
  );
}

/* -------------------------------- SmallInput -------------------------------
 * w-91 input, border #eaecf0 rounded-8, text 14/20 #191919, with trailing
 * unit text (14/22 #101828). md = min-h-36 px-12, sm = min-h-32 px-8.
 */
function SmallInput({
  defaultValue,
  unit,
  size = "md",
  onChange,
}: {
  defaultValue: string;
  unit: string;
  size?: "md" | "sm";
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex gap-[4px] items-center shrink-0">
      <input
        type="text"
        defaultValue={defaultValue}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={`bg-white border border-[#eaecf0] border-solid rounded-[8px] w-[91px] font-sans font-normal text-[14px] leading-[20px] text-[#191919] outline-none ${
          size === "md" ? "min-h-[36px] px-[12px]" : "min-h-[32px] px-[8px]"
        }`}
      />
      <span className="font-sans font-normal text-[14px] leading-[22px] text-[#101828] whitespace-nowrap">
        {unit}
      </span>
    </div>
  );
}

/* ------------------------ Threshold controls (row) ------------------------ */
function ThresholdControls({
  size = "md",
  percentValue,
  amountValue,
  amountUnit,
  onPercentChange,
}: {
  size?: "md" | "sm";
  percentValue: string;
  amountValue: string;
  amountUnit: string;
  onPercentChange?: (v: string) => void;
}) {
  return (
    <div className="flex gap-[8px] items-center shrink-0">
      <TrendButtonGroup size={size} />
      <p className="font-sans font-normal leading-[22px] text-[#0d0d0d] text-[14px] whitespace-nowrap">
        by more than
      </p>
      <SmallInput defaultValue={percentValue} unit="%" size={size} onChange={onPercentChange} />
      <p className="font-sans font-normal leading-[22px] text-[14px] text-[#101828] whitespace-nowrap">AND</p>
      <SmallInput defaultValue={amountValue} unit={amountUnit} size={size} />
    </div>
  );
}

/* -------------------------------- InfoBanner -------------------------------
 * "threshold summary" row — rocket icon 20 + gray text (#57677f 14/22) with
 * two #eff8ff pills (h-26 px-8 rounded-16, 14/20 medium #101828).
 */
function InfoBanner() {
  const pill = (text: string) => (
    <span className="bg-[#eff8ff] flex h-[26px] items-center mix-blend-multiply px-[8px] py-[2px] rounded-[16px] shrink-0">
      <span className="font-sans font-medium leading-[20px] text-[14px] text-[#101828] text-center whitespace-nowrap">
        {text}
      </span>
    </span>
  );
  return (
    <div className="flex flex-wrap gap-[4px] items-center">
      <span className="overflow-clip relative shrink-0 size-[20px]">
        <span className="absolute inset-[5.21%_5.21%_7.29%_7.29%]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${ICONS}/rocket-20.svg`} />
        </span>
      </span>
      <p className="font-sans font-normal leading-[22px] text-[14px] text-[#57677f] whitespace-nowrap">
        Your anomaly alert will be triggered if cost deviations exceed
      </p>
      {pill(" 20%")}
      <p className="font-sans font-normal leading-[22px] text-[14px] text-[#57677f] whitespace-nowrap">
        and simultaneously amount to more than
      </p>
      {pill("20 Tokens")}
    </div>
  );
}

/* -------------------------------- InfoCircle ------------------------------- */
function InfoCircle20() {
  return (
    <span className="relative shrink-0 size-[20px]">
      <span className="absolute inset-[12.5%]">
        <span className="absolute inset-[-5%]">
          <img alt="" className="block max-w-none size-full" src={`${ICONS}/info-circle-ring.svg`} />
        </span>
      </span>
      <span className="absolute bottom-[31.25%] left-1/2 right-1/2 top-[46.88%]">
        <span className="absolute inset-[-17.14%_-0.75px]">
          <img alt="" className="block max-w-none size-full" src={`${ICONS}/info-circle-stem.svg`} />
        </span>
      </span>
      <span className="absolute inset-[28.13%_45.31%_62.5%_45.31%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${ICONS}/info-circle-dot.svg`} />
      </span>
    </span>
  );
}

/* -------------------------------- EndpointRow ------------------------------ */
function EndpointRow() {
  return (
    <div className="flex flex-wrap gap-[16px] items-center">
      <div className="flex gap-[8px] items-center">
        <p className="font-sans font-normal leading-[22px] text-[#0d0d0d] text-[14px] whitespace-nowrap">
          Choose default endpoint for the alert
        </p>
        <InfoCircle20 />
      </div>
      <div className="flex gap-[8px] h-[36px] items-center">
        <button
          type="button"
          className="bg-white border border-[#cfcece] border-solid flex gap-[28px] h-full items-center overflow-clip px-[16px] py-[10px] rounded-[8px] shrink-0 cursor-pointer"
        >
          <span className="font-sans font-normal leading-[22px] text-[#5c5c5c] text-[14px] whitespace-nowrap">
            Choose an endpoint
          </span>
          <span className="relative shrink-0 size-[20px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${ICONS}/chevron-down-20.svg`} />
          </span>
        </button>
        <a href="#" className="font-sans font-normal leading-[20px] text-[#1570ef] text-[12px] whitespace-nowrap">
          How to set endpoints
        </a>
      </div>
    </div>
  );
}

/* ------------------------------ Section heading ---------------------------- */
function SectionHeading({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="flex flex-col gap-[4px] items-start w-full">
      <p className="font-geist font-semibold leading-[20px] text-[14px] text-[#101828] whitespace-nowrap">
        {title}
      </p>
      <p className="font-geist font-normal leading-[16px] text-[12px] text-[#475467] w-full">{caption}</p>
    </div>
  );
}

/* -------------------------------- SearchInput ------------------------------ */
function TableSearchInput() {
  return (
    <div className="bg-white border border-[#eaecf0] border-solid flex gap-[8px] items-center min-h-[36px] overflow-clip pl-[12px] pr-[8px] py-[8px] rounded-[8px] w-[207px]">
      <span className="flex flex-col items-center justify-center p-[2px] shrink-0 w-[20px]">
        <span className="overflow-clip relative shrink-0 size-[16px]">
          <span className="absolute inset-[9.38%]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${ICONS}/search-16.svg`} />
          </span>
        </span>
      </span>
      <input
        type="text"
        placeholder="Search"
        className="flex-1 min-w-0 bg-transparent font-geist font-normal leading-[20px] text-[14px] text-[#191919] placeholder:text-[#475467] outline-none"
      />
    </div>
  );
}

/* ------------------------------- ThresholdTable ----------------------------
 * "table - Cost" (0:70369) — counter header (44px, border #ebebeb, rounded-t-8)
 * + table (border #ebebeb): header row 44px (#f3f5f8), 3 data rows ~46px,
 * row dividers #f9f9f9. Columns: 60px switches | user name (flex) |
 * Avg. Daily Usage 447px | Usage Threshold (flex, per-row controls).
 */
const TABLE_ROWS = [
  { name: "UserA", usage: "20 Tokens" },
  { name: "UserB", usage: "1,352 Tokens" },
  { name: "UserC", usage: "468 Tokens" },
];

function ThresholdTable() {
  return (
    <div className="flex flex-col items-start w-full overflow-x-auto">
      <div className="flex flex-col items-start min-w-[1160px] w-full">
        {/* table header (counter) */}
        <div className="border-[#ebebeb] border-l border-r border-solid border-t flex h-[44px] items-center px-[24px] rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full">
          <p className="font-sans font-normal leading-[22px] text-[#5c5c5c] text-[14px] whitespace-nowrap">
            3 Results
          </p>
        </div>
        {/* table */}
        <div className="bg-white border border-[#ebebeb] border-solid flex flex-col items-start overflow-clip w-full">
          {/* header row */}
          <div className="bg-[#f3f5f8] border-[#f9f9f9] border-b border-solid flex h-[44px] items-center shrink-0 w-full">
            <div className="flex h-full items-center pl-[24px] shrink-0 w-[60px]">
              <Switch ariaLabel="Toggle all thresholds" />
            </div>
            <div className="flex flex-1 h-full items-center min-w-[128px] px-[24px]">
              <p className="font-sans font-medium leading-[16px] text-[#0d0d0d] text-[12px] overflow-hidden text-ellipsis whitespace-nowrap">
                Anthropic/User Name
              </p>
            </div>
            <div className="flex gap-[4px] h-full items-center min-w-[112px] px-[24px] shrink-0 w-[447px]">
              <p className="font-sans font-medium leading-[16px] text-[#0d0d0d] text-[12px] overflow-hidden text-ellipsis whitespace-nowrap">
                Avg. Daily Usage
              </p>
              <span className="relative shrink-0 size-[16px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${ICONS}/sort-arrow-down-16.svg`} />
              </span>
            </div>
            <div className="flex flex-1 h-full items-center min-w-0 pl-[8px] pr-[24px]">
              <p className="font-sans font-normal leading-[20px] text-[#0d0d0d] text-[12px] whitespace-nowrap">
                Usage Threshold
              </p>
            </div>
          </div>
          {/* data rows */}
          {TABLE_ROWS.map((row) => (
            <div
              key={row.name}
              className="border-[#f9f9f9] border-b border-solid flex h-[46px] items-center shrink-0 w-full"
            >
              <div className="flex h-full items-center pl-[24px] shrink-0 w-[60px]">
                <Switch ariaLabel={`Toggle threshold for ${row.name}`} />
              </div>
              <div className="flex flex-1 h-full items-center min-w-[128px] px-[24px]">
                <p className="font-sans font-normal leading-[22px] text-[#0d0d0d] text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {row.name}
                </p>
              </div>
              <div className="flex h-full items-center min-w-[112px] px-[24px] shrink-0 w-[447px]">
                <p className="font-sans font-normal leading-[22px] text-[#0d0d0d] text-[14px] whitespace-nowrap">
                  {row.usage}
                </p>
              </div>
              <div className="flex flex-1 gap-[16px] h-full items-center min-w-0 px-[8px] py-[6px]">
                <ThresholdControls size="sm" percentValue="20" amountValue="20" amountUnit="Tokens" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ ThresholdsDrawer --------------------------- */
export function ThresholdsDrawer({
  defaultPercent = "20",
  onPercentChange,
}: {
  /** Initial value of the settings-row "%" input. */
  defaultPercent?: string;
  /** Fires as the settings-row "%" input changes (carried into the saved card's deltaPct). */
  onPercentChange?: (v: string) => void;
} = {}) {
  return (
    <Drawer title="Alert Thresholds and Endpoints">
      <div className="flex flex-col gap-[16px] items-start w-full">
        {/* Alert Thresholds settings */}
        <div className="flex flex-col gap-[16px] items-start pt-[12px] w-full">
          <SectionHeading title="Thresholds" caption="Set the conditions that trigger an alert." />
          <div className="flex flex-col gap-[16px] items-start">
            <ThresholdControls
              percentValue={defaultPercent}
              amountValue="100,000"
              amountUnit="Tokens"
              onPercentChange={onPercentChange}
            />
            <InfoBanner />
            <div className="flex gap-[8px] items-center">
              <Switch ariaLabel="Set anomaly threshold for every value in the group" />
              <p className="font-sans font-normal leading-[22px] text-[14px] text-[#101828] whitespace-nowrap">
                Set anomaly threshold for every value in the group
              </p>
            </div>
          </div>
          {/* Separator */}
          <div className="flex h-px items-center w-full">
            <div className="bg-[#eaecf0] h-px w-full" />
          </div>
          <SectionHeading title="Endpoints" caption="Select where to send your alert notifications." />
          <EndpointRow />
        </div>
        {/* table - Cost */}
        <div className="flex flex-col gap-[16px] items-start w-full">
          <TableSearchInput />
          <ThresholdTable />
        </div>
      </div>
    </Drawer>
  );
}

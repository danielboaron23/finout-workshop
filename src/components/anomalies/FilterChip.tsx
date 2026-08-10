import type { ReactNode } from "react";

/*
 * Anomalies filter chips — Figma "Buttons variants" (white, #cfcece border,
 * radius 8, HN Medium 14 #0d0d0d, caret-down 16).
 */

const I = "/icons/anomalies";

export function CaretDown16() {
  return (
    <span className="relative shrink-0 size-[16px]">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/caret-base.svg`} />
      <span className="absolute inset-[37.5%_18.75%_31.25%_18.75%]">
        <span className="absolute inset-[-20%_-10%]">
          <img alt="" className="block max-w-none size-full" src={`${I}/caret-v.svg`} />
        </span>
      </span>
    </span>
  );
}

export function CalendarIcon18() {
  return (
    <span className="relative shrink-0 size-[18px]">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/calendar-base.svg`} />
      <span className="absolute inset-[15.63%]">
        <span className="absolute inset-[-4.04%]">
          <img alt="" className="block max-w-none size-full" src={`${I}/cal-v1.svg`} />
        </span>
      </span>
      <span className="absolute inset-[9.38%_31.25%_78.13%_68.75%]">
        <span className="absolute inset-[-22.22%_-0.5px]">
          <img alt="" className="block max-w-none size-full" src={`${I}/cal-v2.svg`} />
        </span>
      </span>
      <span className="absolute inset-[9.38%_68.75%_78.13%_31.25%]">
        <span className="absolute inset-[-22.22%_-0.5px]">
          <img alt="" className="block max-w-none size-full" src={`${I}/cal-v2.svg`} />
        </span>
      </span>
      <span className="absolute inset-[34.38%_15.63%_65.63%_15.63%]">
        <span className="absolute inset-[-0.5px_-4.04%]">
          <img alt="" className="block max-w-none size-full" src={`${I}/cal-v3.svg`} />
        </span>
      </span>
      <span className="absolute bottom-[29.69%] left-[35.94%] right-[53.11%] top-1/2">
        <span className="absolute inset-[-13.68%_-25.37%]">
          <img alt="" className="block max-w-none size-full" src={`${I}/cal-v4.svg`} />
        </span>
      </span>
      <span className="absolute bottom-[29.69%] left-[56.25%] right-[37.5%] top-1/2">
        <span className="absolute inset-[-13.68%_-44.44%_-13.68%_-44.45%]">
          <img alt="" className="block max-w-none size-full" src={`${I}/cal-v5.svg`} />
        </span>
      </span>
    </span>
  );
}

export function FilterChip({
  children,
  icon,
  active = false,
}: {
  children: ReactNode;
  icon?: ReactNode;
  /** Selected filter — reuses the switcher's active blue text (#1570ef). */
  active?: boolean;
}) {
  return (
    <button className="bg-white border border-solid border-[#cfcece] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-start px-[8px] py-[3px] rounded-[8px] shrink-0 cursor-pointer">
      <span className="flex gap-[8px] items-center justify-center px-[8px] py-[4px] rounded-[2px]">
        {icon}
        <span
          className={`font-sans font-medium leading-[22px] text-[14px] text-center whitespace-nowrap ${
            active ? "text-[#1570ef]" : "text-[#0d0d0d]"
          }`}
        >
          {children}
        </span>
        <CaretDown16 />
      </span>
    </button>
  );
}

export function FilterSeparator() {
  return (
    <span className="flex items-center justify-center self-stretch shrink-0 w-px">
      <span className="bg-[#eaecf0] h-full w-px" />
    </span>
  );
}

export function SearchAnomalies({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (v: string) => void;
} = {}) {
  return (
    <div className="bg-white border border-solid border-[#cfcece] flex gap-[8px] h-[36px] items-center overflow-clip p-[8px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shrink-0 w-[225px]">
      <span className="relative shrink-0 size-[20px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/search-base.svg`} />
        <span className="absolute inset-[12.5%_21.88%_21.88%_12.5%]">
          <span className="absolute inset-[-5.71%]">
            <img alt="" className="block max-w-none size-full" src={`${I}/search-v1.svg`} />
          </span>
        </span>
        <span className="absolute inset-[68.52%_12.5%_12.5%_68.52%]">
          <span className="absolute inset-[-19.75%]">
            <img alt="" className="block max-w-none size-full" src={`${I}/search-v2.svg`} />
          </span>
        </span>
      </span>
      <input
        type="text"
        placeholder="Search Anomalies"
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="flex-1 min-w-0 font-sans font-normal leading-[22px] text-[14px] text-[#101828] placeholder:text-[#5c5c5c] outline-none bg-transparent"
      />
    </div>
  );
}

export function DotsMenuButton() {
  return (
    <button className="relative shrink-0 size-[36px] cursor-pointer">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/dots-base.svg`} />
      <span className="absolute inset-[45.31%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/dots-v1.svg`} />
      </span>
      <span className="absolute inset-[20.31%_45.31%_70.31%_45.31%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/dots-v1.svg`} />
      </span>
      <span className="absolute inset-[70.31%_45.31%_20.31%_45.31%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/dots-v2.svg`} />
      </span>
    </button>
  );
}

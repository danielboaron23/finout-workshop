import { ChevronDown16 } from "./Button";

/*
 * Select / Combobox trigger — Figma "Select & Combobox" (0:75868 instance).
 * Same field chrome as Input; label + chevron-down.
 */
export function Select({
  label,
  width = 140,
  onClick,
}: {
  label: string;
  width?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-solid border-[#eaecf0] flex gap-[12px] items-center min-h-[40px] overflow-clip pl-[16px] pr-[8px] py-[10px] rounded-[8px] cursor-pointer"
      style={{ width }}
    >
      <span className="flex flex-1 gap-[12px] items-end min-w-px overflow-clip">
        <span className="font-geist font-normal leading-[20px] text-[14px] text-[#475467] whitespace-nowrap">{label}</span>
      </span>
      <ChevronDown16 />
    </button>
  );
}

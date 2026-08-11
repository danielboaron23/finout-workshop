"use client";

/*
 * MegaBill — shared dropdown-menu rows. CheckRow is the checkbox row used by
 * the toolbar Filters chip and the table header funnels (Finout blue check,
 * same 14px Helvetica row metrics as DropdownItem).
 */

export function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      onClick={onToggle}
      className="flex gap-[8px] items-center w-full px-[8px] py-[6px] rounded-[6px] cursor-pointer text-left hover:bg-neutral-50"
    >
      <span
        className={`flex items-center justify-center rounded-[4px] shrink-0 size-[16px] border border-solid ${
          checked ? "bg-blue-400 border-border-primary" : "bg-white border-border-muted"
        }`}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="font-sans font-normal leading-[20px] text-[14px] text-text-primary whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

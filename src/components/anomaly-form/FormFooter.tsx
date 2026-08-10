"use client";

/*
 * Form footer — Figma "footer" 1:13819 (1700x88).
 * White bar, top border #98a2b3, pr-32 py-24, buttons right-aligned:
 * Cancel (tertiary: #fefefe bg, border #d0d5dd, text #101828) +
 * Save (primary: #1570ef bg, text #f3f5f8). Both min-h 40, px-24 py-10,
 * radius 8, Helvetica Neue Medium 14/20.
 */
export function FormFooter({
  onCancel,
  onSave,
  className = "",
}: {
  onCancel?: () => void;
  onSave?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border-t border-solid border-[#98a2b3] flex flex-col items-start justify-center pr-[32px] py-[24px] w-full ${className}`}
    >
      <div className="flex items-center justify-end w-full">
        <div className="flex gap-[8px] items-center">
          <button
            type="button"
            onClick={onCancel}
            className="bg-surface-primary border border-solid border-[#d0d5dd] flex gap-[8px] items-center justify-center min-h-[40px] px-[24px] py-[10px] rounded-[8px] cursor-pointer font-sans font-medium leading-[20px] text-[14px] text-[#101828] text-center whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="bg-[#1570ef] flex gap-[8px] items-center justify-center min-h-[40px] px-[24px] py-[10px] rounded-[8px] cursor-pointer font-sans font-medium leading-[20px] text-[14px] text-[#f3f5f8] text-center whitespace-nowrap"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

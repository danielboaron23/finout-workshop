"use client";

import { useRef, useState } from "react";

/*
 * Inline rename field for the Name cell — swaps in place of CellText at the
 * exact same type scale. Enter/blur commits, Escape cancels.
 */
export function RenameInput({
  initialValue,
  onCommit,
  onCancel,
}: {
  initialValue: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const cancelled = useRef(false);
  return (
    <input
      autoFocus
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onFocus={(e) => e.currentTarget.select()}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        } else if (e.key === "Escape") {
          cancelled.current = true;
          e.currentTarget.blur();
        }
      }}
      onBlur={() => (cancelled.current ? onCancel() : onCommit(value))}
      className="w-full min-w-0 bg-white border border-solid border-[#1570ef] rounded-[4px] px-[8px] font-sans font-normal leading-[33.898px] text-[21.57px] text-text-primary outline-none"
    />
  );
}

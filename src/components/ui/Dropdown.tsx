"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/*
 * Generic dropdown/popover for the demo experience — Figma "Menu" chrome
 * (white, border #eaecf0, radius 8, md drop shadow, p-12 list).
 * Trigger renders as-is; panel opens below-left, closes on outside click.
 */

export function Dropdown({
  trigger,
  children,
  align = "left",
  panelClassName = "",
}: {
  trigger: (open: boolean) => ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  align?: "left" | "right";
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <div onClick={() => setOpen((v) => !v)}>{trigger(open)}</div>
      {open && (
        <div
          className={`absolute top-[calc(100%+8px)] z-50 bg-white border border-solid border-neutral-100 rounded-[8px] p-[12px] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)] min-w-[180px] ${
            align === "left" ? "left-0" : "right-0"
          } ${panelClassName}`}
        >
          {typeof children === "function" ? children(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  );
}

/** Standard menu row — Helvetica 14/20, hover surface */
export function DropdownItem({
  children,
  onClick,
  selected = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex gap-[8px] items-center w-full px-[8px] py-[6px] rounded-[6px] cursor-pointer text-left font-sans font-normal leading-[20px] text-[14px] text-text-primary hover:bg-neutral-50 ${
        selected ? "bg-blue-50 text-blue-400" : ""
      }`}
    >
      {children}
    </button>
  );
}

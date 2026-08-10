"use client";

import { useState, type ReactNode } from "react";

/*
 * Horizontal Drawer — Figma "Horizontal Drawer" (e.g. 1:13394).
 * White card (#fefefe, border #dee1e8, radius 8, p-12) with a 24px tertiary
 * chevron icon-button + Body/Medium 16/24 title (+ optional 14/20 gray
 * description). Collapsible: the chevron toggles the content.
 */
export function Drawer({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`bg-surface-primary border border-solid border-border-light flex flex-col gap-[12px] items-start p-[12px] rounded-[8px] w-full ${className}`}
    >
      <div className="flex items-start w-full">
        <div className="flex flex-1 gap-[8px] items-start min-w-0">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="bg-surface-primary border border-solid border-[#d0d5dd] flex items-center justify-center min-h-[24px] min-w-[24px] p-[4px] rounded-[4px] shrink-0 cursor-pointer"
          >
            <span className="overflow-clip relative shrink-0 size-[16px]">
              <span
                className={`absolute inset-[34.38%_21.88%] transition-transform ${open ? "" : "-rotate-90"}`}
              >
                <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/ui/chevron-down-16.svg" />
              </span>
            </span>
          </button>
          <div className="flex flex-1 flex-col gap-[4px] items-start min-w-0">
            <p className="font-sans font-medium leading-[24px] text-[16px] text-text-primary w-full">{title}</p>
            {description && (
              <p className="font-sans font-normal leading-[20px] text-[14px] text-[#475467] w-full">{description}</p>
            )}
          </div>
        </div>
      </div>
      {open && <div className="bg-white flex flex-col items-start py-[2px] w-full">{children}</div>}
    </div>
  );
}

import type { ReactNode } from "react";

/*
 * Table primitives — Figma "Tables" (column-based layout).
 * Header cells: #f2f4f7 bg, 54px, Helvetica Neue Medium 14, right divider.
 * Body cells: 54px, bottom border #f2f4f7 (1.241px in design).
 * Cell text: Helvetica Neue Regular 21.57/33.898 (design's exact values).
 */

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface-primary border border-solid border-border-light flex items-start overflow-clip rounded-[8px] shadow-[0px_2.483px_4.965px_-2.483px_rgba(16,24,40,0.06),0px_4.965px_9.93px_-2.483px_rgba(16,24,40,0.1)] w-full">
      {children}
    </div>
  );
}

export function HeaderCell({
  label,
  sortable = false,
  className = "",
  style,
}: {
  label?: string;
  sortable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`bg-[#f2f4f7] border-b-[1.241px] border-solid border-[#f9f9f9] flex h-[54px] items-center justify-center p-[12px] w-full ${className}`}
      style={style}
    >
      {label !== undefined && (
        <div className="flex flex-1 items-center justify-between min-w-px">
          <div className="flex gap-[8px] items-center">
            <p className="font-sans font-medium leading-[20px] text-[14px] text-text-primary whitespace-nowrap">{label}</p>
            {sortable && (
              <span className="relative shrink-0 size-[16px]">
                <span className="absolute inset-[17.71%]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/ui/arrow-down.svg" />
                </span>
              </span>
            )}
          </div>
          <div className="h-[24px] w-px bg-[#d0d5dd] shrink-0" />
        </div>
      )}
    </div>
  );
}

export function Cell({
  children,
  className = "",
  style,
}: {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`border-b-[1.241px] border-solid border-[#f2f4f7] flex h-[54px] items-center px-[16px] w-full ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/** Body cell text at the design's exact rendered size */
export function CellText({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans font-normal leading-[33.898px] text-[21.57px] text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
      {children}
    </p>
  );
}

export function MenuCell() {
  return (
    <div className="border-b-[1.241px] border-solid border-[#f2f4f7] flex h-[54px] items-center justify-center w-[48px]">
      <button className="bg-surface-primary flex items-center justify-center min-h-[24px] min-w-[24px] overflow-clip p-[4px] rounded-[4px] cursor-pointer">
        <span className="overflow-clip relative shrink-0 size-[16px]">
          <span className="absolute inset-[13.54%_42.71%]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/ui/ellipsis-vertical.svg" />
          </span>
        </span>
      </button>
    </div>
  );
}

export function CheckboxCell({ header = false }: { header?: boolean }) {
  return (
    <div
      className={`border-b-[1.241px] border-solid flex h-[54px] items-center justify-center w-[48px] ${
        header ? "bg-[#f2f4f7] border-[#f9f9f9]" : "border-[#f2f4f7]"
      }`}
    />
  );
}

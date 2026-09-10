/*
 * Badges — Figma "Badge / Status" (pill, neutral solid) and "Badge / Product"
 * (Virtual Tag = blue, Relational Virtual Tag = violet). The product badge in
 * the table is rendered at 1.241x scale in the design; exact values kept.
 */

export function FolderBadge({ label }: { label: string }) {
  return (
    <span className="bg-canvas border border-solid border-border-light flex gap-[4px] items-center justify-center px-[16px] py-[4px] rounded-full w-fit">
      <span className="overflow-clip relative shrink-0 size-[16px]">
        <span className="absolute inset-[9.38%_5.21%_13.54%_5.21%]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/ui/folder.svg" />
        </span>
      </span>
      <span className="font-geist font-semibold leading-[16px] text-[12px] text-text-primary text-center whitespace-nowrap">{label}</span>
    </span>
  );
}

export type ProductBadgeVariant = "blue" | "violet";

const PRODUCT_VARIANTS: Record<ProductBadgeVariant, string> = {
  blue: "bg-blue-25 border-dataviz-blue-100 text-dataviz-blue-600",
  violet: "bg-dataviz-violet-25 border-dataviz-violet-50 text-dataviz-purple-400",
};

export function ProductBadge({ label, variant = "blue" }: { label: string; variant?: ProductBadgeVariant }) {
  return (
    <span
      className={`border-[1.241px] border-solid flex gap-[4.965px] items-center justify-center px-[19.861px] py-[4.965px] rounded-full w-fit ${PRODUCT_VARIANTS[variant]}`}
    >
      <span className="font-geist font-semibold leading-[19.861px] text-[14.9px] text-center whitespace-nowrap">{label}</span>
    </span>
  );
}

/*
 * Badge / Status — EXTEND of the product badge language for the CostGuard
 * ledger. Same pill, same 1.241x table scale, narrower horizontal padding so
 * "Working on it" fits a 160px column. "Regressed" is derived, never set by
 * hand: it means the work was done and the cost came back.
 */
export type StatusBadgeVariant = "new" | "working" | "done" | "regressed" | "dismissed";

const STATUS_VARIANTS: Record<StatusBadgeVariant, string> = {
  new: "bg-blue-25 border-dataviz-blue-100 text-dataviz-blue-600",
  working: "bg-yellow-50 border-border-muted text-orange-800",
  done: "bg-success-50 border-success-200 text-success-700",
  regressed: "bg-red-50 border-red-400 text-red-800",
  dismissed: "bg-canvas border-border-light text-text-tertiary",
};

export function StatusBadge({ label, variant }: { label: string; variant: StatusBadgeVariant }) {
  return (
    <span
      className={`border-[1.241px] border-solid flex gap-[4.965px] items-center justify-center px-[12.41px] py-[4.965px] rounded-full w-fit ${STATUS_VARIANTS[variant]}`}
    >
      <span className="font-geist font-semibold leading-[19.861px] text-[13.65px] text-center whitespace-nowrap">
        {label}
      </span>
    </span>
  );
}

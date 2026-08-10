/*
 * Badges — Figma "Badge / Status" (pill, neutral solid) and "Badge / Product"
 * (Virtual Tag = blue, Relational Virtual Tag = violet). The product badge in
 * the table is rendered at 1.241x scale in the design; exact values kept.
 */

export function FolderBadge({ label }: { label: string }) {
  return (
    <span className="bg-[#f2f4f7] border border-solid border-[#dee1e8] flex gap-[4px] items-center justify-center px-[16px] py-[4px] rounded-full w-fit">
      <span className="overflow-clip relative shrink-0 size-[16px]">
        <span className="absolute inset-[9.38%_5.21%_13.54%_5.21%]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/ui/folder.svg" />
        </span>
      </span>
      <span className="font-geist font-semibold leading-[16px] text-[12px] text-[#101828] text-center whitespace-nowrap">{label}</span>
    </span>
  );
}

export type ProductBadgeVariant = "blue" | "violet";

const PRODUCT_VARIANTS: Record<ProductBadgeVariant, string> = {
  blue: "bg-[#f5faff] border-[#84caff] text-[#194185]",
  violet: "bg-[#ede9fc] border-[#cabdf7] text-[#53389e]",
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

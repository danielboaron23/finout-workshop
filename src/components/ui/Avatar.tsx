/*
 * Avatar — Figma "Avatar" in table cells: 40px circle, #f3f5f8 bg,
 * either user initials (Helvetica Neue Medium 14) or the Finout fab icon.
 */
export function Avatar({ initials }: { initials?: string }) {
  return (
    <span className="relative shrink-0 size-[40px] inline-flex items-center justify-center bg-neutral-50 rounded-full">
      {initials ? (
        // 14/20 at the Virtual Tags table's 1.241x Figma instance scale
        <span className="font-sans font-medium leading-[24.83px] text-[17.37px] text-text-primary text-center">{initials}</span>
      ) : (
        <span className="relative size-[16px]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/ui/finout-fab.svg" />
        </span>
      )}
    </span>
  );
}

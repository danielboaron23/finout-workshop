/*
 * 2nd level page title — Figma node 0:75862.
 * Heading/4 (Helvetica Neue Medium 20/24) + optional link action on the right.
 */
export function PageTitleBar({
  title,
  linkLabel,
}: {
  title: string;
  linkLabel?: string;
}) {
  return (
    <div className="bg-surface-primary flex items-center justify-between px-[24px] py-[16px] w-full h-[68px]">
      <div className="flex flex-1 items-center min-w-px">
        <div className="flex gap-[8px] items-center">
          <p className="font-sans font-medium leading-[24px] text-[#1b1f1d] text-[20px] whitespace-nowrap">{title}</p>
        </div>
      </div>
      {linkLabel && (
        <div className="flex gap-[16px] items-center justify-end">
          <button className="flex gap-[8px] items-center justify-end overflow-clip cursor-pointer">
            <div className="overflow-clip relative shrink-0 size-[20px]">
              <div className="absolute inset-[9.38%]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/topnav/external-link.svg" />
              </div>
            </div>
            <p className="font-sans font-medium leading-[22px] text-[14px] text-[#1570ef] whitespace-nowrap">{linkLabel}</p>
          </button>
        </div>
      )}
    </div>
  );
}

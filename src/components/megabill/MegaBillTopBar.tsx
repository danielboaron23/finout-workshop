/*
 * MegaBill top nav — Figma node 1:13878 ("Top nav", 1463x68).
 * LEFT: Views select-style button + Save/Clear link buttons (30% opacity).
 * RIGHT: Share link, home icon button, avatar S + chevron.
 */

const I = "/icons/megabill";

function ViewsIcon16() {
  return (
    <span className="overflow-clip relative shrink-0 size-[16px]">
      <span className="absolute inset-[17.71%_5.21%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/views-glasses.svg`} />
      </span>
    </span>
  );
}

function ChevronDown16({ dark = false }: { dark?: boolean }) {
  return (
    <span className="overflow-clip relative shrink-0 size-[16px]">
      <span className="absolute inset-[34.38%_21.88%]">
        <img
          alt=""
          className="absolute block inset-0 max-w-none size-full"
          src={dark ? `${I}/chevron-down-16-dark.svg` : `${I}/chevron-down-16.svg`}
        />
      </span>
    </span>
  );
}

function LinkIcon16() {
  return (
    <span className="overflow-clip relative shrink-0 size-[16px]">
      <span className="absolute inset-[26.04%_5.21%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/link-2-16.svg`} />
      </span>
    </span>
  );
}

function HouseIcon16() {
  return (
    <span className="overflow-clip relative shrink-0 size-[16px]">
      <span className="absolute inset-[5.21%_9.38%_9.38%_9.38%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/house-16.svg`} />
      </span>
    </span>
  );
}

export function MegaBillTopBar({
  viewsLabel = "Views",
  userInitial = "S",
}: {
  viewsLabel?: string;
  userInitial?: string;
}) {
  return (
    <div className="bg-[#fefefe] border-b border-solid border-[#f2f4f7] flex items-center px-[24px] py-[16px] w-full h-[68px]">
      <div className="bg-white flex flex-1 items-center justify-between min-w-0">
        {/* Left */}
        <div className="flex gap-[24px] items-center shrink-0">
          <div className="bg-white flex gap-[8px] items-center shrink-0">
            <div className="flex gap-[16px] items-center shrink-0">
              <button className="bg-[#fefefe] border border-solid border-[#d0d5dd] flex gap-[6px] items-center justify-center min-h-[32px] px-[12px] py-[6px] rounded-[8px] shrink-0 cursor-pointer">
                <ViewsIcon16 />
                <span className="font-sans font-medium leading-[20px] text-[#101828] text-[14px] text-center whitespace-nowrap">
                  {viewsLabel}
                </span>
                <ChevronDown16 />
              </button>
              <div className="flex gap-[16px] items-center shrink-0">
                <button className="flex gap-[8px] items-center justify-center min-h-[24px] opacity-30 px-[8px] py-[4px] rounded-[4px] shrink-0 cursor-pointer">
                  <span className="font-sans font-medium leading-[20px] text-[#175cd3] text-[14px] whitespace-nowrap">
                    Save
                  </span>
                </button>
                <button className="flex gap-[8px] items-center justify-center min-h-[24px] opacity-30 px-[8px] py-[4px] rounded-[4px] shrink-0 cursor-pointer">
                  <span className="font-sans font-medium leading-[20px] text-[#175cd3] text-[14px] whitespace-nowrap">
                    Clear
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="flex gap-[8px] items-center justify-end self-stretch">
          <div className="flex gap-[4px] items-center shrink-0">
            <button className="flex gap-[8px] items-center justify-center min-h-[36px] px-[16px] py-[8px] rounded-[8px] shrink-0 cursor-pointer">
              <LinkIcon16 />
              <span className="font-sans font-medium leading-[20px] text-[#175cd3] text-[14px] whitespace-nowrap">
                Share
              </span>
            </button>
            <div className="self-stretch shrink-0 w-px" />
            <button className="bg-[#fefefe] flex items-center justify-center min-h-[32px] min-w-[32px] overflow-clip p-[8px] rounded-[8px] shrink-0 cursor-pointer">
              <HouseIcon16 />
            </button>
          </div>
          <div className="flex gap-[4px] items-center shrink-0">
            <div className="overflow-clip relative shrink-0 size-[24px]">
              <div className="absolute inset-0 bg-[#4f95a5] rounded-full flex items-center justify-center">
                <p className="font-sans font-medium leading-[16px] text-[12px] text-center text-[#f2f4f7]">
                  {userInitial}
                </p>
              </div>
            </div>
            <button className="bg-[#fefefe] flex items-center justify-center min-h-[24px] min-w-[24px] overflow-clip p-[4px] rounded-[4px] shrink-0 cursor-pointer">
              <ChevronDown16 dark />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

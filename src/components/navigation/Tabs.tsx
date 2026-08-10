/*
 * 3rd level tabs — Figma node 0:75863. 68px bar, active tab gets a 2px
 * bottom border in brand blue; each tab carries a gray counter pill.
 */

export type TabItem = { label: string; count?: number };

export function Tabs({
  items,
  activeIndex = 0,
}: {
  items: TabItem[];
  activeIndex?: number;
}) {
  return (
    <div className="bg-surface-primary border-b border-solid border-border-lighter flex items-center pl-[24px] w-full">
      <div className="flex h-[68px] items-center py-px">
        {items.map((tab, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={tab.label}
              className={`flex gap-[8px] h-full items-center justify-center min-h-[32px] min-w-[32px] px-[12px] py-[4px] cursor-pointer ${
                active ? "bg-white border-b-2 border-solid border-[#1570ef]" : ""
              }`}
            >
              <p className="font-sans font-normal leading-[20px] text-[14px] text-text-primary whitespace-nowrap">{tab.label}</p>
              {tab.count !== undefined && (
                <span className="bg-[#d0d5dd] flex flex-col h-[16px] items-center justify-center min-w-[16px] px-[4px] rounded-[10px]">
                  <span className="font-geist font-semibold leading-[16px] text-[12px] text-[#191919] text-center whitespace-nowrap">
                    {tab.count}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

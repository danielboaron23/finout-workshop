/*
 * Search input — Figma "Input" (0:75867 instance).
 * White field, #eaecf0 border, 8px radius, 40px min height, Geist 14 text.
 */
export function SearchInput({
  placeholder = "Search",
  width = 350,
}: {
  placeholder?: string;
  width?: number;
}) {
  return (
    <div
      className="bg-white border border-solid border-[#eaecf0] flex gap-[12px] items-center min-h-[40px] overflow-clip px-[16px] py-[9.5px] rounded-[8px]"
      style={{ width, maxWidth: width, minWidth: 200 }}
    >
      <div className="flex flex-col items-center justify-center p-[2px] shrink-0 w-[20px]">
        <span className="overflow-clip relative shrink-0 size-[16px]">
          <span className="absolute inset-[9.38%]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/ui/search.svg" />
          </span>
        </span>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 min-w-px font-geist font-normal leading-[20px] text-[14px] text-text-primary placeholder:text-[#475467] outline-none bg-transparent"
      />
    </div>
  );
}

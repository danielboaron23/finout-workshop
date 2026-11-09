export function HomeTopBar({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white flex h-[47px] items-center justify-end w-full ${className}`}>
      <div className="flex gap-[8px] h-[47px] items-center justify-end shrink-0 w-[249px]">
        <div className="relative shrink-0 size-[28px]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              alt=""
              className="absolute h-full left-[-5.48%] max-w-none top-[2.29%] w-[110.71%]"
              src="/images/home/home-thumb.png"
            />
          </div>
        </div>
        <div className="h-[47px] relative shrink-0 w-[197px]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              alt="Currency and user menu"
              className="absolute h-full left-[-172.59%] max-w-none top-0 w-[272.59%]"
              src="/images/home/currency-user-menu.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

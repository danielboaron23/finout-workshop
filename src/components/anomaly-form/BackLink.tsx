"use client";

/*
 * "Back to Anomalies" link — Figma Top nav 1:13384, Buttons variants 5299:38443.
 * ArrowLeft 18px + Helvetica Neue Medium 14/22 #2e90fa (Blue/B300).
 */
export function BackLink({
  label = "Back to Anomalies",
  onClick,
}: {
  label?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex gap-[8px] items-center justify-center py-[4px] rounded-[2px] cursor-pointer"
    >
      <span className="relative shrink-0 size-[18px]">
        <img
          alt=""
          className="absolute block inset-0 max-w-none size-full"
          src="/icons/anomaly-form/arrow-left-base.svg"
        />
        <span className="absolute bottom-1/2 left-[15.63%] right-[15.63%] top-1/2">
          <span className="absolute inset-[-1px_-8.08%]">
            <img
              alt=""
              className="block max-w-none size-full"
              src="/icons/anomaly-form/arrow-left-line.svg"
            />
          </span>
        </span>
        <span className="absolute inset-[21.88%_56.25%_21.88%_15.63%]">
          <span className="absolute inset-[-9.88%_-19.75%]">
            <img
              alt=""
              className="block max-w-none size-full"
              src="/icons/anomaly-form/arrow-left-head.svg"
            />
          </span>
        </span>
      </span>
      <span className="font-sans font-medium leading-[22px] text-[#2e90fa] text-[14px] text-center whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

import type { ReactNode } from "react";

/*
 * Finout button — variants from Figma Button components:
 * primary  (#1570ef bg, #f3f5f8 text)
 * secondary (white bg, #1570ef border, #175cd3 text)
 * tertiary (white bg, #d0d5dd border, #101828 text)
 * ghost    (white bg, no border, #101828 text)
 * link     (#175cd3 text only)
 */

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost" | "link";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-blue-400 text-text-inverse",
  secondary: "bg-surface-primary border border-solid border-border-primary text-text-link",
  tertiary: "bg-surface-primary border border-solid border-border-muted text-text-primary",
  ghost: "bg-surface-primary text-text-primary",
  link: "bg-transparent text-text-link",
};

export function Button({
  children,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <button
      className={`flex gap-[8px] items-center justify-center min-h-[36px] px-[16px] py-[8px] rounded-[8px] cursor-pointer font-sans font-medium leading-[20px] text-[14px] whitespace-nowrap ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function ChevronDown16({ white = false }: { white?: boolean }) {
  return (
    <span className="overflow-clip relative shrink-0 size-[16px] inline-block">
      <span className="absolute inset-[34.38%_21.88%]">
        <img
          alt=""
          className="absolute block inset-0 max-w-none size-full"
          src={white ? "/icons/ui/chevron-down-16-white.svg" : "/icons/ui/chevron-down-16.svg"}
        />
      </span>
    </span>
  );
}

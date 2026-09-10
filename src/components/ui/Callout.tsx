import type { ReactNode } from "react";
import { InfoIcon16 } from "@/components/home/KpiCard";

/*
 * Callout — INVENT (Settings, 2026-09-10), proposed back to the DS.
 *
 * A tinted panel that states a CONSEQUENCE. Nothing in ui/ does this today:
 * StatusBadge is a pill (a label, not a sentence), KpiCard tone="danger" is a
 * whole card, and InfoBanner inside ThresholdsDrawer is the right visual
 * language but private and hardcoded to threshold copy.
 *
 * Every value is an existing token; no new colour is introduced. Meaning is
 * never carried by colour alone — each tone ships an icon and the sentence
 * itself says what happens.
 */
export type CalloutTone = "info" | "warning" | "danger";

const TONES: Record<CalloutTone, string> = {
  info: "bg-blue-50 border-dataviz-blue-100 text-text-primary",
  warning: "bg-yellow-50 border-border-muted text-orange-800",
  danger: "bg-red-50 border-red-400 text-red-800",
};

export function Callout({
  tone = "info",
  title,
  children,
  action,
  className = "",
}: {
  tone?: CalloutTone;
  /** Optional lead line, set in the shared 14/22 medium weight. */
  title?: string;
  children?: ReactNode;
  /** Trailing slot — e.g. a tertiary Button. */
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="note"
      className={`border border-solid flex gap-[10px] items-start px-[14px] py-[12px] rounded-[8px] w-full ${TONES[tone]} ${className}`}
    >
      <span className="shrink-0 mt-[3px]">
        <InfoIcon16 />
      </span>
      <div className="flex flex-1 flex-col gap-[2px] min-w-0">
        {title && <p className="font-sans font-medium leading-[22px] text-[14px]">{title}</p>}
        {children && (
          <div className="font-sans font-normal leading-[22px] text-[14px] opacity-90">{children}</div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

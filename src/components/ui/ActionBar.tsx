import type { ReactNode } from "react";

/*
 * ActionBar — EXTEND (Settings, 2026-09-10).
 *
 * Lifted out of costguard/BulkActionBar, which had exactly this shape already:
 * a dark bar that appears on a condition, leads with what is at stake, and
 * carries its actions on the right. It was welded to OWNERS/DISMISS_REASONS,
 * so the chrome could not be reused. Now the chrome lives here and the two
 * callers supply their own label and actions. BulkActionBar keeps its API.
 */
export function ActionBar({
  label,
  actions,
  className = "",
}: {
  label: ReactNode;
  actions: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-neutral-500 flex flex-wrap items-center gap-[20px] px-[20px] py-[12px] rounded-[10px] shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.1),0px_2px_4px_-2px_rgba(16,24,40,0.06)] ${className}`}
    >
      <div className="font-sans font-medium leading-[20px] text-[14px] text-text-inverse">{label}</div>
      <div className="flex items-center gap-[8px] ml-auto">{actions}</div>
    </div>
  );
}

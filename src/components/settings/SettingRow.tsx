"use client";

import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui/Badge";

/*
 * SettingRow — INVENT (Settings, 2026-09-10).
 *
 * The atomic unit of the screen: a label and description on the left, a
 * control on the right, and — the part no competitor row carries — two
 * metadata lines beneath. `scope` says who this affects before you touch it;
 * `provenance` says who last changed it and why.
 *
 * The nearest existing things are all unusable: Drawer's head has no control
 * slot and is welded to a collapsible card, and SectionHeading and EndpointRow
 * inside ThresholdsDrawer are private with hardcoded copy.
 */

export function SettingRow({
  label,
  description,
  scope,
  provenance,
  staged = false,
  nonDefault = false,
  control,
  children,
}: {
  label: string;
  description?: string;
  /** Who and what this setting reaches — stated before the change, not after. */
  scope?: ReactNode;
  /** "Changed by X · date · reason" */
  provenance?: ReactNode;
  staged?: boolean;
  nonDefault?: boolean;
  control?: ReactNode;
  /** Full-width slot below the row — the impact panel lives here. */
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[12px] py-[18px] w-full">
      <div className="flex flex-wrap gap-[16px] items-start justify-between w-full">
        <div className="flex flex-1 flex-col gap-[3px] min-w-[260px]">
          <div className="flex flex-wrap gap-[8px] items-center">
            <p className="font-sans font-medium leading-[24px] text-[16px] text-text-primary">{label}</p>
            {staged && <StatusBadge label="Staged" variant="working" />}
            {!staged && nonDefault && <StatusBadge label="Changed" variant="new" />}
          </div>
          {description && (
            <p className="font-sans font-normal leading-[22px] text-[14px] text-text-secondary max-w-[62ch]">
              {description}
            </p>
          )}
          {/* Scope and provenance are content, not decoration — they say who a
              change reaches and who made it, so they carry AA contrast rather
              than the muted tertiary ink used for captions elsewhere. */}
          {scope && (
            <p className="font-sans font-normal leading-[20px] text-[12px] text-neutral-400 mt-[2px]">{scope}</p>
          )}
          {provenance && (
            <p className="font-sans font-normal leading-[20px] text-[12px] text-neutral-400">{provenance}</p>
          )}
        </div>
        {control && <div className="flex items-center gap-[10px] shrink-0 pt-[2px]">{control}</div>}
      </div>
      {children}
    </div>
  );
}

/** The hairline between rows — the repo's inline divider idiom. */
export function RowDivider() {
  return <div className="h-px w-full bg-neutral-100" />;
}

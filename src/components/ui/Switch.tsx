"use client";

import { useState } from "react";

/*
 * Switch — Figma Switch 33x18. bg #1570ef (checked) rounded-12, white 16px
 * knob at inset 5.56%/3.03%/5.56%/48.48% when on (mirrored when off).
 *
 * EXTEND (Settings, 2026-09-10): lifted here from anomaly-form/ThresholdsDrawer
 * and given `checked` + `onChange`, so a parent can both read and drive it.
 * Same shape as the CheckboxCell extend: pass the pair and it is controlled,
 * omit them and it keeps the uncontrolled behaviour every existing call site
 * relies on. No visual change.
 */
export function Switch({
  defaultChecked = true,
  checked,
  onChange,
  disabled = false,
  ariaLabel = "Toggle",
}: {
  defaultChecked?: boolean;
  /** EXTEND: pass checked + onChange to control the switch from the parent. */
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const controlled = checked !== undefined;
  const on = controlled ? checked : uncontrolled;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        if (!controlled) setUncontrolled((v) => !v);
        onChange?.(!on);
      }}
      className={`relative h-[18px] w-[33px] shrink-0 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <span
        className={`absolute inset-0 rounded-[12px] transition-colors ${on ? "bg-blue-400" : "bg-neutral-100"}`}
      />
      <span
        className={`absolute transition-all ${on ? "inset-[5.56%_3.03%_5.56%_48.48%]" : "inset-[5.56%_48.48%_5.56%_3.03%]"}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/anomaly-form/switch-knob.svg" />
      </span>
    </button>
  );
}

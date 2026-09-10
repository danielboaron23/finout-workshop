"use client";

import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { ActionBar } from "@/components/ui/ActionBar";
import { EFFECTIVE_OPTIONS, periodsRestated, type EffectiveFrom } from "./data";

/*
 * StagedChangeBar — COMPOSE (ActionBar + Button + Dropdown).
 *
 * Nothing a user changes here reaches the rest of the product until Publish.
 * The effective-date control sits IN the bar rather than on each row, because
 * one publish applies one effective date to everything staged — putting it per
 * row would promise a precision the model does not have.
 *
 * Reaching into a closed period is deliberately harder than not: the primary
 * action changes its own label to name the damage, and asks a second time.
 */
export function StagedChangeBar({
  count,
  effectiveFrom,
  onEffectiveChange,
  onPublish,
  onDiscard,
}: {
  count: number;
  effectiveFrom: EffectiveFrom;
  onEffectiveChange: (v: EffectiveFrom) => void;
  onPublish: () => void;
  onDiscard: () => void;
}) {
  if (count === 0) return null;

  const restated = periodsRestated(effectiveFrom);
  const selected = EFFECTIVE_OPTIONS.find((o) => o.id === effectiveFrom)!;

  return (
    <div className="sticky bottom-[20px] z-40 w-full px-[2px]">
      <p className="font-sans font-normal leading-[18px] text-[12px] text-text-tertiary mb-[6px] text-right">
        {selected.detail}
      </p>
      <ActionBar
        label={
          <span>
            {count} change{count > 1 ? "s" : ""} staged
            <span className="font-normal opacity-70"> · nothing has been applied yet</span>
          </span>
        }
        actions={
          <>
            <Dropdown
              align="right"
              placement="top"
              panelClassName="min-w-[340px]"
              trigger={() => (
                <Button variant="tertiary">
                  Effective: {effectiveFrom === "forward" ? "1 Sep" : effectiveFrom === "open" ? "August" : "all history"}
                </Button>
              )}
            >
              {(close) => (
                <>
                  {EFFECTIVE_OPTIONS.map((o) => (
                    <DropdownItem
                      key={o.id}
                      selected={o.id === effectiveFrom}
                      onClick={() => { onEffectiveChange(o.id); close(); }}
                    >
                      <span className="flex flex-col gap-[2px] py-[2px]">
                        <span className="font-medium">{o.label}</span>
                        <span className="font-normal text-[12px] leading-[18px] text-text-secondary">{o.detail}</span>
                      </span>
                    </DropdownItem>
                  ))}
                </>
              )}
            </Dropdown>

            <button
              onClick={onDiscard}
              className="font-sans font-medium leading-[20px] text-[14px] text-text-inverse opacity-70 hover:opacity-100 cursor-pointer whitespace-nowrap"
            >
              Discard
            </button>

            {restated.length === 0 ? (
              <Button onClick={onPublish}>Publish</Button>
            ) : (
              <Dropdown
                align="right"
                placement="top"
                panelClassName="min-w-[320px]"
                trigger={() => <Button>Restate {restated.length} closed periods</Button>}
              >
                {(close) => (
                  <>
                    <div className="flex flex-col gap-[6px] px-[12px] py-[10px]">
                      <p className="font-sans font-medium leading-[20px] text-[13px] text-text-primary">
                        These months have already been reported
                      </p>
                      <p className="font-sans font-normal leading-[18px] text-[12px] text-text-secondary">
                        {restated.map((p) => p.label.replace(" 2026", "")).join(", ")} were sent to finance.
                        Publishing will change figures those reports were built on.
                      </p>
                    </div>
                    <div className="h-px w-full bg-neutral-100" />
                    <DropdownItem onClick={() => { onPublish(); close(); }}>
                      <span className="font-medium text-red-800">Yes, restate them</span>
                    </DropdownItem>
                    <DropdownItem onClick={close}>Keep history as reported</DropdownItem>
                  </>
                )}
              </Dropdown>
            )}
          </>
        }
      />
    </div>
  );
}

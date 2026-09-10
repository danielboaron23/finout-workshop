import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { ActionBar } from "@/components/ui/ActionBar";
import { OWNERS, DISMISS_REASONS } from "./data";
import { usd } from "./data";

/*
 * BulkActionBar — INVENT (proposed back to the DS).
 *
 * CheckboxCell already exists in the table primitives and currently leads
 * nowhere. Xero pairs selection with its action but only ever shows a count;
 * for money work the selected total is the number that governs the decision,
 * so this bar leads with it.
 */

export function BulkActionBar({
  count,
  totalUsd,
  onAssign,
  onDismiss,
  onClear,
}: {
  count: number;
  totalUsd: number;
  onAssign: (owner: string) => void;
  onDismiss: (reason: string) => void;
  onClear?: () => void;
}) {
  if (count === 0) return null;
  return (
    <ActionBar
      className="w-fit"
      label={
        <span className="whitespace-nowrap">
          {count} selected
          <span className="font-normal opacity-70"> · {usd(totalUsd)}/mo at stake</span>
        </span>
      }
      actions={
        <>
        <Dropdown trigger={() => <Button variant="tertiary">Assign owner</Button>}>
          {(close) => (
            <>
              {OWNERS.map((o) => (
                <DropdownItem key={o} onClick={() => { onAssign(o); close(); }}>{o}</DropdownItem>
              ))}
            </>
          )}
        </Dropdown>
        <Dropdown align="right" trigger={() => <Button variant="tertiary">Dismiss</Button>}>
          {(close) => (
            <>
              {DISMISS_REASONS.map((r) => (
                <DropdownItem key={r} onClick={() => { onDismiss(r); close(); }}>{r}</DropdownItem>
              ))}
            </>
          )}
        </Dropdown>
          <button
            onClick={onClear}
            className="font-sans font-medium leading-[20px] text-[14px] text-text-inverse opacity-70 hover:opacity-100 cursor-pointer whitespace-nowrap"
          >
            Clear
          </button>
        </>
      }
    />
  );
}

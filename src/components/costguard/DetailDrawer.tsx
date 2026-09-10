"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { StatusBadge, type StatusBadgeVariant } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { EvidenceChart } from "./EvidenceChart";
import { canStart, usd, ageLabel, OWNERS, DISMISS_REASONS, type CgRow, type CgEvent } from "./data";

const VARIANT: Record<string, StatusBadgeVariant> = {
  New: "new", "Working on it": "working", Done: "done", Dismissed: "dismissed",
};

const initials = (n: string) => n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

function Stat({ label, value, tone = "" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex flex-col gap-[2px]">
      <p className="font-sans font-normal leading-[18px] text-[12px] text-text-tertiary">{label}</p>
      <p className={`font-sans font-medium leading-[24px] text-[17px] ${tone || "text-text-primary"}`}>{value}</p>
    </div>
  );
}

export function DetailDrawer({
  row, events, onClose, onAssign, onStart, onDone, onDismiss, onReopen, onRestore,
}: {
  row: CgRow;
  events: CgEvent[];
  onClose: () => void;
  onAssign: (owner: string) => void;
  onStart: () => void;
  onDone: () => void;
  onDismiss: (reason: string) => void;
  onReopen: () => void;
  onRestore: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const verdict = row.regressed
    ? { text: "Saving lost", tone: "text-red-800" }
    : row.status === "Done" && row.realizedMonthlyUsd !== null
      ? { text: "Realized " + usd(row.realizedMonthlyUsd), tone: "text-success-700" }
      : row.status === "Done"
        ? { text: "Not verifiable", tone: "text-text-tertiary" }
        : { text: "Not yet on the bill", tone: "text-text-secondary" };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-500/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={row.title}
        className="relative bg-surface-primary flex flex-col gap-[24px] h-full w-[620px] max-w-[92vw] overflow-y-auto px-[28px] py-[24px] shadow-[0px_8px_24px_-4px_rgba(16,24,40,0.18)] outline-none"
      >
        {/* header */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-start justify-between gap-[16px]">
            <div className="flex flex-col gap-[4px] min-w-0">
              <p className="font-sans font-normal leading-[18px] text-[12px] text-text-tertiary">
                {row.service} · {row.provider} · {row.type}
              </p>
              <h2 className="font-sans font-medium leading-[30px] text-[22px] text-text-primary">{row.title}</h2>
            </div>
            <button onClick={onClose} aria-label="Close" className="font-sans text-[20px] leading-[20px] text-text-tertiary hover:text-text-primary cursor-pointer px-[6px]">
              ✕
            </button>
          </div>
          <div className="flex items-center gap-[12px] flex-wrap">
            <StatusBadge label={row.regressed ? "Regressed" : row.status} variant={row.regressed ? "regressed" : VARIANT[row.status]} />
            {row.owner ? (
              <span className="flex items-center gap-[8px]">
                <Avatar initials={initials(row.owner)} />
                <span className="font-sans font-normal leading-[20px] text-[14px] text-text-primary">{row.owner}</span>
              </span>
            ) : (
              <span className="font-sans font-medium leading-[20px] text-[14px] text-red-800">Nobody owns this</span>
            )}
            <span className="font-sans font-normal leading-[20px] text-[13px] text-text-tertiary">
              {row.regressed && row.regressedAt ? `Reverted ${ageLabel(row.regressedAt)} ago` : `Open ${ageLabel(row.createdAt)}`}
            </span>
          </div>
        </div>

        {/* actions — driven by the lifecycle, not by a fixed toolbar */}
        <div className="flex items-center gap-[8px] flex-wrap">
          {row.status === "Dismissed" ? (
            <Button variant="primary" onClick={onRestore}>Restore to the ledger</Button>
          ) : row.regressed ? (
            <Button variant="primary" onClick={onReopen}>Reopen and fix</Button>
          ) : row.status === "Done" ? (
            <Button variant="secondary" onClick={onReopen}>Reopen</Button>
          ) : (
            <>
              {row.status === "New" && (
                <Button variant="primary" onClick={onStart} disabled={!canStart(row)}>
                  Start work
                </Button>
              )}
              {row.status === "Working on it" && <Button variant="primary" onClick={onDone}>Mark done</Button>}
              <Dropdown trigger={() => <Button variant="tertiary">{row.owner ? "Reassign" : "Assign owner"}</Button>}>
                {(close) => (
                  <>
                    {OWNERS.map((o) => (
                      <DropdownItem key={o} selected={row.owner === o} onClick={() => { onAssign(o); close(); }}>{o}</DropdownItem>
                    ))}
                  </>
                )}
              </Dropdown>
              <Dropdown align="right" trigger={() => <Button variant="ghost">Dismiss</Button>}>
                {(close) => (
                  <>
                    {DISMISS_REASONS.map((r) => (
                      <DropdownItem key={r} onClick={() => { onDismiss(r); close(); }}>{r}</DropdownItem>
                    ))}
                  </>
                )}
              </Dropdown>
            </>
          )}
          {row.status === "New" && !canStart(row) && (
            <p className="font-sans font-normal leading-[20px] text-[13px] text-text-tertiary">
              Assign an owner before starting — unowned work is work nobody does.
            </p>
          )}
        </div>

        {/* the money */}
        <div className="bg-canvas border border-solid border-border-lighter flex flex-wrap gap-[32px] px-[20px] py-[16px] rounded-[8px]">
          <Stat label="Projected" value={usd(row.projectedMonthlyUsd) + " /mo"} />
          <Stat label="Outcome" value={verdict.text} tone={verdict.tone} />
          {row.baseline && <Stat label="Baseline window" value={row.baseline} />}
          {row.dismissReason && <Stat label="Dismissed because" value={row.dismissReason} />}
        </div>

        {/* provenance — answerable without leaving the page */}
        <section className="flex flex-col gap-[8px]">
          <h3 className="font-sans font-medium leading-[26px] text-[18px] text-text-primary">Why this was raised</h3>
          <p className="font-sans font-normal leading-[22px] text-[15px] text-text-secondary max-w-[62ch]">{row.why}</p>
        </section>

        {/* evidence — the real cost history behind the claim */}
        <section className="flex flex-col gap-[8px]">
          <h3 className="font-sans font-medium leading-[26px] text-[18px] text-text-primary">The evidence</h3>
          <EvidenceChart slug={row.serviceSlug} markers={row.markers} />
        </section>

        {/* audit trail */}
        <section className="flex flex-col gap-[10px] pb-[8px]">
          <h3 className="font-sans font-medium leading-[26px] text-[18px] text-text-primary">Activity</h3>
          {events.length === 0 ? (
            <p className="font-sans font-normal leading-[22px] text-[14px] text-text-tertiary">Nothing has happened to this yet.</p>
          ) : (
            <ol className="flex flex-col gap-[10px] m-0 p-0 list-none">
              {events.map((e, i) => (
                <li key={i} className="flex gap-[12px] items-start">
                  <span
                    aria-hidden="true"
                    className={`mt-[7px] rounded-full shrink-0 size-[7px] ${e.kind === "system" ? "bg-border-primary" : "bg-blue-400"}`}
                  />
                  <span className="flex flex-col gap-[1px]">
                    <span className="font-sans font-normal leading-[20px] text-[14px] text-text-primary">{e.what}</span>
                    <span className="font-sans font-normal leading-[18px] text-[12px] text-text-tertiary">
                      {e.who} · {new Date(e.at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}

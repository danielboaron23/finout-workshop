"use client";

import { useState, type ReactNode } from "react";
import { showToast } from "@/components/ui/Toast";

/*
 * Usage anomaly feed card — Figma ".local_usage_anomaly_feed" (1:14693).
 * White card, #d0d5dd border, radius 8, p-24. Header: date + Inter SemiBold 18
 * title + yellow "Usage Anomaly" badge. Info column + Highcharts render
 * (exported from the Figma node as a single image). Footer action buttons.
 */

const I = "/icons/anomalies";

function GhostAction({
  icon,
  children,
  onClick,
}: {
  icon: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-surface-primary flex gap-[6px] items-center justify-center min-h-[32px] px-[12px] py-[6px] rounded-[8px] cursor-pointer"
    >
      {icon}
      <span className="font-sans font-medium leading-[20px] text-text-primary text-[14px] text-center whitespace-nowrap">
        {children}
      </span>
    </button>
  );
}

function LabelValue({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-[8px] items-center">
      <span className="font-sans font-medium leading-[22px] text-text-secondary text-[14px] whitespace-nowrap">{label}</span>
      {children}
    </div>
  );
}

function Bold14({ children }: { children: ReactNode }) {
  return <span className="font-sans font-bold leading-[22px] text-[14px] text-black whitespace-nowrap">{children}</span>;
}

function IntervalBadge({ children }: { children: ReactNode }) {
  return (
    <span className="bg-blue-50 flex h-[26px] items-center mix-blend-multiply px-[8px] py-[2px] rounded-[16px] shrink-0">
      <span className="font-sans font-medium leading-[20px] text-text-primary text-[14px] text-center whitespace-nowrap">
        {children}
      </span>
    </span>
  );
}

export type AnomalyCardProps = {
  date?: string;
  title?: string;
  deltaLabel?: string;
  deltaPct?: string;
  expected?: string;
  actual?: string;
  usageType?: string;
  costCenter?: string;
  intervalA?: string;
  intervalB?: string;
  scopeTag?: string;
  /** True only on the seeded Figma card — user-created alerts omit it. */
  builtIn?: boolean;
  /** Comment texts appended via "Add comment" (stored on the card object). */
  comments?: string[];
};

/** Behavior callbacks — all optional so stories/screens can render the card statically. */
export type AnomalyCardActions = {
  onInvestigate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onComment?: (text: string) => void;
};

export function AnomalyCard({
  date = "Sunday, May 24, 2026",
  title = "Anthropic Tokens",
  deltaLabel = "+3,380 Tokens",
  deltaPct = "9%",
  expected = "37,557 Tokens",
  actual = "40,937 Tokens",
  usageType = "Anthropic - Tokens",
  costCenter = "Global",
  intervalA = "1 day",
  intervalB = "6 days",
  scopeTag = "CostCenter: Anthropic",
  comments = [],
  onInvestigate,
  onEdit,
  onDelete,
  onComment,
}: AnomalyCardProps & AnomalyCardActions) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const submitComment = () => {
    const text = draft.trim();
    if (!text) return;
    onComment?.(text);
    setDraft("");
    setCommentOpen(false);
  };

  return (
    <div className="bg-white border border-solid border-border-muted flex flex-col gap-[8px] items-start p-[24px] rounded-[8px] w-full">
      {/* header */}
      <div className="flex items-center justify-between w-full gap-[16px]">
        <div className="flex flex-1 flex-col items-start min-w-0">
          <p className="font-sans font-normal leading-[15.2px] text-n700 text-[12px] whitespace-nowrap">{date}</p>
          <p className="font-inter font-semibold leading-[28px] text-text-primary text-[18px]">{title}</p>
        </div>
        <span className="bg-yellow-50 flex items-start pb-[4.5px] pl-[10.87px] pr-[10.13px] pt-[3.5px] rounded-[8px] shrink-0">
          <span className="font-sans font-medium leading-[22px] text-orange-800 text-[14px] text-center whitespace-nowrap">
            Usage Anomaly
          </span>
        </span>
      </div>
      {/* body: info + chart */}
      <div className="border-b border-solid border-neutral-100 flex gap-[32px] items-start justify-between pb-[16px] w-full flex-wrap">
        <div className="flex flex-1 flex-col gap-[8px] items-start min-w-[420px]">
          <div className="flex gap-[8px] items-center">
            <span className="font-sans font-medium leading-[22px] text-text-secondary text-[14px] whitespace-nowrap">
              Usage anomaly
            </span>
            <span className="font-sans font-bold leading-[28px] text-red-400 text-[20px] whitespace-nowrap">
              {deltaLabel}
            </span>
            <span className="bg-red-50 flex gap-[2px] items-center pl-[6px] pr-[5.02px] rounded-[4px] shrink-0">
              <span className="h-[5.3px] overflow-clip relative shrink-0 w-[6px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/red-arrow-up.svg`} />
              </span>
              <span className="font-sans font-normal leading-[20px] text-red-800 text-[12px] whitespace-nowrap">
                {deltaPct}
              </span>
            </span>
          </div>
          <div className="flex gap-[24px] items-center">
            <LabelValue label="Expected usage">
              <Bold14>{expected}</Bold14>
            </LabelValue>
            <LabelValue label="Actual usage">
              <Bold14>{actual}</Bold14>
            </LabelValue>
          </div>
          <LabelValue label="Usage type">
            <Bold14>{usageType}</Bold14>
          </LabelValue>
          <LabelValue label="Cost Center">
            <span className="flex gap-[4px] items-center">
              <span className="overflow-clip relative shrink-0 size-[24px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/finout-fab-24.svg`} />
              </span>
              <Bold14>{costCenter}</Bold14>
            </span>
          </LabelValue>
          <div className="flex gap-[7.74px] items-center">
            <span className="font-sans font-medium leading-[22px] text-text-secondary text-[14px] whitespace-nowrap">
              Time interval
            </span>
            <span className="flex gap-[4px] items-center">
              <IntervalBadge>{intervalA}</IntervalBadge>
              <span className="font-sans font-normal leading-[22px] text-neutral-400 text-[14px] whitespace-nowrap">
                compared to the
              </span>
              <IntervalBadge>{intervalB}</IntervalBadge>
              <span className="font-sans font-normal leading-[22px] text-neutral-400 text-[14px] whitespace-nowrap">
                average prior
              </span>
            </span>
          </div>
          <div className="flex gap-[8px] items-center">
            <span className="font-sans font-medium leading-[22px] text-text-secondary text-[14px] whitespace-nowrap">In</span>
            <span className="bg-neutral-100 border border-solid border-neutral-100 flex items-start pl-[5px] pr-[4.37px] rounded-[4px]">
              <span className="font-sans font-medium leading-[20px] text-text-primary text-[12px] whitespace-nowrap">
                {scopeTag}
              </span>
            </span>
          </div>
        </div>
        {/* Highcharts render exported from the Figma node */}
        <div className="h-[150px] shrink-0 w-[379px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/anomalies/anomaly-chart.png" alt="" className="block h-full w-full max-w-none" />
        </div>
      </div>
      {/* footer actions */}
      <div className="flex items-center justify-between w-full gap-[16px] flex-wrap">
        <div className="flex gap-[16px] items-center flex-wrap">
          <button
            onClick={onInvestigate}
            className="bg-surface-primary border border-solid border-border-primary flex gap-[6px] items-center justify-center min-h-[32px] px-[12px] py-[6px] rounded-[8px] cursor-pointer"
          >
            <span className="overflow-clip relative shrink-0 size-[16px]">
              <span className="-translate-x-1/2 absolute h-[17.5px] left-1/2 top-0 w-[12px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/investigate.svg`} />
              </span>
            </span>
            <span className="font-sans font-medium leading-[20px] text-blue-400 text-[14px] text-center whitespace-nowrap">
              Investigate
            </span>
          </button>
          <GhostAction
            onClick={onEdit}
            icon={
              <span className="overflow-clip relative shrink-0 size-[16px]">
                <span className="absolute inset-[5.21%]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/pencil.svg`} />
                </span>
              </span>
            }
          >
            Edit anomaly
          </GhostAction>
          <GhostAction
            onClick={onDelete}
            icon={
              <span className="overflow-clip relative shrink-0 size-[16px]">
                <span className="absolute inset-[5.21%_9.38%]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/trash.svg`} />
                </span>
              </span>
            }
          >
            Delete
          </GhostAction>
          <GhostAction
            onClick={() => setCommentOpen((v) => !v)}
            icon={
              <span className="overflow-clip relative shrink-0 size-[16px]">
                <span className="absolute inset-[9.38%_9.38%_9.37%_9.38%]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/comment.svg`} />
                </span>
              </span>
            }
          >
            Add comment
          </GhostAction>
        </div>
        <button
          onClick={() => showToast("Jira issue FIN-1234 created")}
          className="bg-surface-primary border border-solid border-border-muted flex gap-[6px] items-center justify-center min-h-[32px] px-[12px] py-[6px] rounded-[8px] cursor-pointer"
        >
          <span className="overflow-clip relative rounded-[3px] shrink-0 size-[16px]">
            <span className="absolute inset-[16.67%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/anomalies/jira-logo.png"
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
              />
            </span>
          </span>
          <span className="font-sans font-medium leading-[20px] text-blue-400 text-[14px] text-center whitespace-nowrap">
            Create a Jira issue
          </span>
        </button>
      </div>
      {/* comment input (toggled by "Add comment") */}
      {commentOpen && (
        <form
          className="flex items-start w-full"
          onSubmit={(e) => {
            e.preventDefault();
            submitComment();
          }}
        >
          <input
            type="text"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a comment"
            aria-label="Add a comment"
            className="bg-white border border-solid border-neutral-100 min-h-[36px] w-[320px] px-[12px] py-[7.5px] rounded-[8px] shadow-xs font-geist font-normal leading-[20px] text-[14px] text-foreground placeholder:text-text-secondary outline-none"
          />
        </form>
      )}
      {/* comment lines */}
      {comments.length > 0 && (
        <div className="flex flex-col gap-[4px] items-start w-full">
          {comments.map((text, i) => (
            <p key={i} className="font-sans font-normal leading-[15.2px] text-n700 text-[12px] w-full">
              You · just now · {text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

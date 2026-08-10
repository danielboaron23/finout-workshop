"use client";

/*
 * Top nav — Figma node 0:75861. 68px tall, white surface, bottom border.
 * Right cluster: Share Link (copies URL), home icon (→ /), avatar + user name.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { showToast } from "@/components/ui/Toast";

const I = "/icons/topnav";

function LinkIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/link-base.svg`} />
      <div className="absolute bottom-1/2 left-[31.25%] right-[31.25%] top-1/2">
        <div className="absolute inset-[-0.75px_-10%]">
          <img alt="" className="block max-w-none size-full" src={`${I}/link-p1.svg`} />
        </div>
      </div>
      <div className="absolute inset-[31.25%_59.38%_31.25%_6.25%]">
        <div className="absolute inset-[-10%_-10.91%]">
          <img alt="" className="block max-w-none size-full" src={`${I}/link-p2.svg`} />
        </div>
      </div>
      <div className="absolute inset-[31.25%_6.25%_31.25%_59.38%]">
        <div className="absolute inset-[-10%_-10.91%]">
          <img alt="" className="block max-w-none size-full" src={`${I}/link-p3.svg`} />
        </div>
      </div>
    </div>
  );
}

function VerticalSeparator() {
  return <div className="h-[20px] w-px bg-border-lighter shrink-0" />;
}

export function TopNav({
  userName = "User name here",
  userInitial = "S",
  compact = false,
  left,
}: {
  userName?: string;
  userInitial?: string;
  /** Figma variant with only home + avatar + chevron on the right */
  compact?: boolean;
  /** Optional left-side content (e.g. the "Back to Anomalies" link) */
  left?: ReactNode;
}) {
  const shareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied");
    } catch {
      showToast("Couldn't copy link");
    }
  };
  return (
    <div className="bg-surface-primary border-b border-solid border-border-light flex items-center px-[24px] py-[16px] w-full h-[68px]">
      <div className="flex flex-1 items-center justify-between min-w-0 gap-[16px]">
        <div className="flex flex-1 gap-[24px] h-[36px] items-center min-w-0">{left}</div>
        <div className="flex gap-[12px] items-center justify-end self-stretch">
          {!compact && (
            <>
              <button onClick={shareLink} className="flex gap-[8px] items-center justify-end overflow-clip cursor-pointer">
                <LinkIcon />
                <p className="font-sans font-medium leading-[22px] text-[14px] text-[#1570ef] whitespace-nowrap">
                  Share Link
                </p>
              </button>
              <VerticalSeparator />
            </>
          )}
          <Link href="/" aria-label="Home" className="overflow-clip relative shrink-0 size-[24px] cursor-pointer">
            <div className="absolute inset-[5.21%_9.38%_9.38%_9.38%]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/house.svg`} />
            </div>
          </Link>
          {!compact && <VerticalSeparator />}
          <div className={`flex gap-[4px] items-center cursor-pointer ${compact ? "" : "w-[161px]"}`}>
            <div className="relative shrink-0 size-[24px]">
              <div className="absolute inset-0 bg-[#4f95a5] rounded-full flex items-center justify-center">
                <p className="font-geist font-semibold leading-[16px] text-[12px] text-center text-text-inverse">{userInitial}</p>
              </div>
            </div>
            <div className="flex flex-1 items-center min-w-px">
              {!compact && (
                <div className="flex flex-1 gap-[8px] h-full items-center min-w-px">
                  <p className="font-geist font-medium leading-[20px] text-[14px] text-[#191919] overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                    {userName}
                  </p>
                </div>
              )}
              <div className="overflow-clip relative shrink-0 size-[24px]">
                <div className="absolute inset-[34.38%_21.88%]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${I}/chevron-down-24.svg`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

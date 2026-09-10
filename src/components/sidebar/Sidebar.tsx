"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SidebarIcon, type SidebarIconName } from "./sidebar-icons";

/*
 * Finout sidebar navigation — Figma node 0:75858 ("Sidebar navigation").
 * 220px wide, dark (#101828), three sections (Inform / Optimize / Operate)
 * plus a footer card with Settings / Documentation / account switcher.
 *
 * Collapse behavior (Daniel, Sep 2026): clicking the logo collapses the
 * sidebar to a 64px icon rail — the green mark stays, labels hide, items
 * grow CSS tooltips. State persists in localStorage across screens.
 * Expanded layout at 220px is untouched (1:1 with the Figma).
 */

const COLLAPSE_KEY = "finout-sidebar-collapsed";

export type SidebarItem = {
  label: string;
  icon: SidebarIconName;
};

type Entry =
  | { type: "item"; label: string; icon: SidebarIconName; href?: string }
  | { type: "section"; label: string };

const NAV: Entry[] = [
  { type: "item", label: "Overview", icon: "overview", href: "/" },
  { type: "item", label: "Finops for AI", icon: "finops-ai" },
  { type: "item", label: "Billy", icon: "billy" },
  { type: "section", label: "Inform" },
  { type: "item", label: "MegaBill", icon: "megabill", href: "/megabill" },
  { type: "item", label: "Virtual tags", icon: "virtual-tags", href: "/virtual-tags" },
  { type: "item", label: "Dashboards", icon: "dashboards" },
  { type: "item", label: "Financial Plans", icon: "financial-plans" },
  { type: "item", label: "Resources", icon: "resources" },
  { type: "item", label: "Data Explorer", icon: "data-explorer" },
  { type: "section", label: "Optimize" },
  { type: "item", label: "CostGuard", icon: "costguard", href: "/costguard" },
  { type: "item", label: "My Commitments", icon: "my-commitments" },
  { type: "item", label: "Commitments Log", icon: "commitments-log" },
  { type: "item", label: "Anomalies", icon: "anomalies", href: "/anomalies" },
  { type: "section", label: "Operate" },
  { type: "item", label: "Cost per entity", icon: "cost-per-entity" },
  { type: "item", label: "Reports", icon: "reports" },
  { type: "item", label: "Governance", icon: "governance" },
];

function Tooltip({ label }: { label: string }) {
  return (
    <span
      className="pointer-events-none absolute left-full top-1/2 z-50 ml-[10px] -translate-y-1/2 whitespace-nowrap
        rounded-[6px] bg-[#1a2435] px-[10px] py-[6px] font-inter text-[12px] font-medium leading-[18px] text-white
        opacity-0 shadow-medium transition-opacity duration-150 group-hover/item:opacity-100 group-hover/item:delay-300"
      role="tooltip"
    >
      {label}
    </span>
  );
}

function NavItem({
  label,
  icon,
  active = false,
  footer = false,
  href,
  collapsed = false,
  instant = false,
}: {
  label: string;
  icon: SidebarIconName;
  active?: boolean;
  footer?: boolean;
  href?: string;
  collapsed?: boolean;
  instant?: boolean;
}) {
  const bg = active ? "bg-gray-600" : footer ? "bg-[#1a2435]" : "bg-neutral-500";
  const text = active ? "text-white" : "text-text-tertiary";
  const inner = (
    <div
      className={`${bg} sb-row group/item relative flex flex-1 items-center p-[8px] rounded-[6px] cursor-pointer
        ${collapsed ? "justify-center" : "overflow-clip"}`}
    >
      <div className={`flex items-center gap-[8px] ${collapsed ? "" : "flex-1 min-w-px"}`}>
        <span className="sb-ico">
          <SidebarIcon name={icon} />
        </span>
        <p
          className={`sb-label font-inter font-medium leading-[20px] text-[14px] whitespace-nowrap ${text}
            transition-[opacity,max-width] duration-300 ease-in-out ${instant ? "!transition-none" : ""}
            ${collapsed ? "max-w-0 opacity-0 overflow-hidden" : "max-w-[160px] opacity-100"}`}
        >
          {label}
        </p>
      </div>
      {collapsed && <Tooltip label={label} />}
    </div>
  );
  return href ? (
    <Link href={href} className="flex items-start w-full">
      {inner}
    </Link>
  ) : (
    <div className="flex items-start w-full">{inner}</div>
  );
}

export function Sidebar({ activeItem = "Virtual tags" }: { activeItem?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  /* transitions stay off for the first paint so a stored collapsed state
     applies instantly on every page load instead of replaying the slide */
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(COLLAPSE_KEY) === "1") setCollapsed(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
  }, []);

  const toggle = () => {
    setCollapsed((c) => {
      localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      return !c;
    });
  };

  /* collapsed: everything fits without scrolling, so overflow can stay
     visible and tooltips escape the rail; expanded keeps the 1:1 layout */
  const scroller = collapsed
    ? "overflow-visible"
    : "overflow-y-auto overflow-x-clip";

  const anim = ready ? "" : "!transition-none";

  return (
    <div
      className={`bg-neutral-500 flex items-start h-full shrink-0 transition-[width] duration-300 ease-in-out ${anim}
        ${collapsed ? "w-[64px]" : "w-[220px]"}`}
    >
      <div className="flex flex-1 flex-col h-full items-start justify-between min-w-px">
        <div className={`flex flex-1 flex-col gap-[24px] items-start min-h-px pt-[32px] w-full ${scroller}`}>
          <div className={`flex flex-col items-start w-full ${collapsed ? "pl-[20px] pr-[15px]" : "pl-[24px] pr-[20px]"}`}>
            <button
              type="button"
              onClick={toggle}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              title={collapsed ? "Expand" : "Collapse"}
              className="relative block h-[24px] cursor-pointer border-0 bg-transparent p-0 transition-transform
                duration-150 hover:scale-[1.06] active:scale-[0.97]"
            >
              {/* the green mark never moves; the wordmark slides away on collapse */}
              <span className={`block overflow-hidden transition-[width] duration-300 ease-in-out ${anim} ${collapsed ? "w-[25px]" : "w-[96.601px]"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/finout-logo.svg" alt="Finout" className="h-[24px] w-[96.601px] max-w-none block" />
              </span>
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-[4px] items-start min-h-px px-[8px] w-full">
            {NAV.map((entry) =>
              entry.type === "section" ? (
                <div
                  key={entry.label}
                  className={`flex items-center w-full transition-all duration-300
                    ${collapsed ? "h-[9px] px-[8px]" : "px-[8px] py-[4px]"}`}
                >
                  {collapsed ? (
                    <span className="block h-[1px] w-full bg-[#344054]" aria-hidden="true" />
                  ) : (
                    <p className="font-inter font-medium leading-[18px] text-[12px] text-[#eaecf0] whitespace-nowrap">
                      {entry.label}
                    </p>
                  )}
                </div>
              ) : (
                <NavItem
                  key={entry.label}
                  label={entry.label}
                  icon={entry.icon}
                  href={entry.href}
                  active={entry.label === activeItem}
                  collapsed={collapsed}
                  instant={!ready}
                />
              ),
            )}
          </nav>
        </div>
        <div className="flex flex-col items-start pb-[8px] px-[8px] w-full">
          <div
            className={`bg-[#1a2435] flex flex-col gap-[8px] items-start rounded-[8px] w-full transition-[padding]
              duration-300 ${collapsed ? "p-[4px]" : "p-[16px]"}`}
          >
            <NavItem label="Settings" icon="settings" href="/settings" active={activeItem === "Settings"} footer collapsed={collapsed} instant={!ready} />
            <NavItem label="Documentation" icon="documentation" footer collapsed={collapsed} instant={!ready} />
            <div
              className={`border-t border-solid border-[#475467] flex items-start w-full transition-all duration-300
                ${collapsed ? "justify-center pt-[8px] pb-[4px]" : "pl-[8px] pr-[32px] pt-[24px]"}`}
            >
              <div className={`sb-row group/item relative flex items-center rounded-[6px] p-[4px] -m-[4px] cursor-pointer ${collapsed ? "" : "gap-[12px] w-[164px]"}`}>
                <span className="sb-ico">
                  <SidebarIcon name="account" />
                </span>
                {!collapsed && (
                  <div className="flex gap-[8px] items-center">
                    <p className="font-inter font-semibold leading-[20px] text-[14px] text-white whitespace-nowrap">Finout</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/sidebar/chevron-down.svg" alt="" className="size-[16px] block" />
                  </div>
                )}
                {collapsed && <Tooltip label="Finout account" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

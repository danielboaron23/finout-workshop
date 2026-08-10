import Link from "next/link";
import { SidebarIcon, type SidebarIconName } from "./sidebar-icons";

/*
 * Finout sidebar navigation — Figma node 0:75858 ("Sidebar navigation").
 * 220px wide, dark (#101828), three sections (Inform / Optimize / Operate)
 * plus a footer card with Settings / Documentation / account switcher.
 */

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
  { type: "item", label: "MegaBill", icon: "megabill" },
  { type: "item", label: "Virtual tags", icon: "virtual-tags", href: "/virtual-tags" },
  { type: "item", label: "Dashboards", icon: "dashboards" },
  { type: "item", label: "Financial Plans", icon: "financial-plans" },
  { type: "item", label: "Resources", icon: "resources" },
  { type: "item", label: "Data Explorer", icon: "data-explorer" },
  { type: "section", label: "Optimize" },
  { type: "item", label: "CostGuard", icon: "costguard" },
  { type: "item", label: "My Commitments", icon: "my-commitments" },
  { type: "item", label: "Commitments Log", icon: "commitments-log" },
  { type: "item", label: "Anomalies", icon: "anomalies", href: "/anomalies" },
  { type: "section", label: "Operate" },
  { type: "item", label: "Cost per entity", icon: "cost-per-entity" },
  { type: "item", label: "Reports", icon: "reports" },
  { type: "item", label: "Governance", icon: "governance" },
];

function NavItem({
  label,
  icon,
  active = false,
  footer = false,
  href,
}: {
  label: string;
  icon: SidebarIconName;
  active?: boolean;
  footer?: boolean;
  href?: string;
}) {
  const bg = active ? "bg-[#475467]" : footer ? "bg-[#1a2435]" : "bg-[#101828]";
  const text = active ? "text-white" : "text-text-tertiary";
  const inner = (
    <div className={`${bg} flex flex-1 items-center overflow-clip p-[8px] rounded-[6px] cursor-pointer`}>
      <div className="flex flex-1 gap-[8px] items-center min-w-px">
        <SidebarIcon name={icon} />
        <p className={`font-inter font-medium leading-[20px] text-[14px] whitespace-nowrap ${text}`}>{label}</p>
      </div>
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
  return (
    <div className="bg-[#101828] flex items-start h-full w-[220px] shrink-0">
      <div className="flex flex-1 flex-col h-full items-start justify-between min-w-px">
        <div className="flex flex-1 flex-col gap-[24px] items-start min-h-px overflow-y-auto overflow-x-clip pt-[32px] w-full">
          <div className="flex flex-col items-start pl-[24px] pr-[20px] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/finout-logo.svg" alt="Finout" className="h-[24px] w-[96.601px] block" />
          </div>
          <nav className="flex flex-1 flex-col gap-[4px] items-start min-h-px px-[8px] w-full">
            {NAV.map((entry) =>
              entry.type === "section" ? (
                <div key={entry.label} className="flex items-start px-[8px] py-[4px] w-full">
                  <p className="font-inter font-medium leading-[18px] text-[12px] text-[#eaecf0] whitespace-nowrap">
                    {entry.label}
                  </p>
                </div>
              ) : (
                <NavItem
                  key={entry.label}
                  label={entry.label}
                  icon={entry.icon}
                  href={entry.href}
                  active={entry.label === activeItem}
                />
              ),
            )}
          </nav>
        </div>
        <div className="flex flex-col items-start pb-[8px] px-[8px] w-full">
          <div className="bg-[#1a2435] flex flex-col gap-[8px] items-start p-[16px] rounded-[8px] w-full">
            <NavItem label="Settings" icon="settings" footer />
            <NavItem label="Documentation" icon="documentation" footer />
            <div className="border-t border-solid border-[#475467] flex items-start pl-[8px] pr-[32px] pt-[24px] w-full">
              <div className="flex gap-[12px] items-center w-[164px]">
                <SidebarIcon name="account" />
                <div className="flex gap-[8px] items-center">
                  <p className="font-inter font-semibold leading-[20px] text-[14px] text-white whitespace-nowrap">Finout</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/sidebar/chevron-down.svg" alt="" className="size-[16px] block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

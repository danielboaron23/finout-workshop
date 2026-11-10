"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { TopNav } from "@/components/navigation/TopNav";
import { PageTitleBar } from "@/components/navigation/PageTitleBar";
import { Tabs } from "@/components/navigation/Tabs";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/Input";
import { ProductBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { TableShell, HeaderCell, Cell, CellText, CheckboxCell, MenuCell } from "@/components/table/Table";
import { REPORT_ROWS, type ReportSource } from "@/components/reports/data";

/*
 * Screen: Reports (Operate → Reports). Follows the Virtual Tags list layout:
 * Sidebar + TopNav + PageTitleBar + Tabs + toolbar (search, create) + table.
 * No Figma frame exists for this screen; built from the existing primitives.
 */

const SOURCE_VARIANT: Record<ReportSource, "blue" | "violet"> = {
  MegaBill: "blue",
  "Virtual Tags": "violet",
  Anomalies: "blue",
};

export function ReportsScreen() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const scheduledCount = REPORT_ROWS.filter((r) => r.schedule !== "Not scheduled").length;

  const query = search.trim().toLowerCase();
  const visible = REPORT_ROWS.filter(
    (r) =>
      (activeTab === 0 || (activeTab === 1 ? r.schedule !== "Not scheduled" : r.schedule === "Not scheduled")) &&
      (query === "" || r.name.toLowerCase().includes(query)),
  );

  return (
    <div className="bg-canvas flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="Reports" />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto bg-surface-primary">
        <TopNav />
        <PageTitleBar title="Reports" />
        <Tabs
          items={[
            { label: "All", count: REPORT_ROWS.length },
            { label: "Scheduled", count: scheduledCount },
            { label: "On demand", count: REPORT_ROWS.length - scheduledCount },
          ]}
          activeIndex={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="bg-surface-primary flex items-center justify-center p-[24px] w-full">
          <div className="flex flex-1 flex-wrap gap-[8px] items-center justify-between min-w-0">
            <SearchInput placeholder="Search" value={search} onChange={setSearch} />
            <Button variant="primary">Create Report</Button>
          </div>
        </div>
        <div className="flex flex-col items-center px-[24px] pb-[24px] w-full">
          <TableShell>
            <div className="flex flex-col items-start w-[48px] shrink-0">
              <CheckboxCell header />
              {visible.map((r) => (
                <CheckboxCell key={r.id} />
              ))}
            </div>
            <div className="flex flex-col items-start flex-1 min-w-[240px]">
              <HeaderCell label="Name" />
              {visible.map((r) => (
                <Cell key={r.id}>
                  <CellText>{r.name}</CellText>
                </Cell>
              ))}
            </div>
            <div className="flex flex-col items-start w-[240px] shrink-0">
              <HeaderCell label="Source" />
              {visible.map((r) => (
                <Cell key={r.id}>
                  <ProductBadge label={r.source} variant={SOURCE_VARIANT[r.source]} />
                </Cell>
              ))}
            </div>
            <div className="flex flex-col items-start w-[200px] shrink-0">
              <HeaderCell label="Schedule" />
              {visible.map((r) => (
                <Cell key={r.id}>
                  <CellText>{r.schedule}</CellText>
                </Cell>
              ))}
            </div>
            <div className="flex flex-col items-start w-[160px] shrink-0">
              <HeaderCell label="Owner" />
              {visible.map((r) => (
                <Cell key={r.id}>
                  <Avatar initials={r.owner} />
                </Cell>
              ))}
            </div>
            <div className="flex flex-col items-start w-[210px] shrink-0">
              <HeaderCell label="Last run" />
              {visible.map((r) => (
                <Cell key={r.id}>
                  <CellText>{r.lastRun}</CellText>
                </Cell>
              ))}
            </div>
            <div className="flex flex-col items-start w-[48px] shrink-0">
              <HeaderCell />
              {visible.map((r) => (
                <MenuCell key={r.id} />
              ))}
            </div>
          </TableShell>
          {visible.length === 0 && (
            <p className="font-sans text-[14px] leading-[22px] text-text-secondary py-[24px]">No reports match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

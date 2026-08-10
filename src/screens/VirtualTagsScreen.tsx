import { Sidebar } from "@/components/sidebar/Sidebar";
import { TopNav } from "@/components/navigation/TopNav";
import { PageTitleBar } from "@/components/navigation/PageTitleBar";
import { Tabs } from "@/components/navigation/Tabs";
import { Button, ChevronDown16 } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/Input";
import { FolderSelect } from "@/components/ui/FolderSelect";
import { FolderBadge, ProductBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { TableShell, HeaderCell, Cell, CellText, MenuCell, CheckboxCell } from "@/components/table/Table";

/*
 * Screen: Virtual Tags List and Folders — Figma node 0:75857 (1920x1080).
 */

type Row = {
  name: string;
  folder?: string;
  type: "Virtual Tag" | "Relational Virtual Tag";
  createdBy?: string; // initials; undefined = Finout fab
  created: string;
  modified: string;
};

const ROWS: Row[] = [
  { name: "ProfitPulse", folder: "Folder name", type: "Virtual Tag", createdBy: "CN", created: "Jan 15, 2023", modified: "Feb 14, 2024" },
  { name: "RevenueRadar", folder: "Folder name", type: "Virtual Tag", createdBy: "CN", created: "Nov 8, 2022", modified: "Mar 3, 2024" },
  { name: "ProfitPulseDashboard", folder: "Folder name", type: "Virtual Tag", createdBy: "CN", created: "Sep 3, 2023", modified: "Apr 27, 2024" },
  { name: "RevenueStreamMap", folder: "Folder name", type: "Relational Virtual Tag", createdBy: "CN", created: "Dec 27, 2024", modified: "May 9, 2024" },
  { name: "MarketMetrics", type: "Relational Virtual Tag", created: "Feb 14, 2025", modified: "Jun 15, 2024" },
  { name: "ExpenseEagle", type: "Relational Virtual Tag", created: "Jul 6, 2023", modified: "Jul 22, 2024" },
  { name: "FinanceFalcon", type: "Relational Virtual Tag", created: "Oct 30, 2024", modified: "Aug 30, 2024" },
];

const FOLDERS = Array.from({ length: 8 }, () => "Folder name here");

export function VirtualTagsScreen() {
  return (
    <div className="bg-canvas flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="Virtual tags" />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto">
        <TopNav />
        <PageTitleBar title="Virtual Tags" linkLabel="Learn about Virtual Tags" />
        <Tabs
          items={[
            { label: "All", count: 73 },
            { label: "Custom Virtual Tags", count: 40 },
            { label: "Finout Virtual Tags", count: 25 },
          ]}
        />
        <div className="bg-surface-primary flex items-center justify-center p-[24px] w-full">
          <div className="flex flex-1 flex-wrap gap-[8px] items-center justify-between min-w-0">
            <div className="flex gap-[8px] items-center">
              <SearchInput placeholder="Search" />
              <FolderSelect folders={FOLDERS} />
            </div>
            <Button variant="primary">
              Create Virtual Tag
              <ChevronDown16 white />
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center px-[24px] pb-[24px] w-full">
          <TableShell>
            {/* checkbox column */}
            <div className="flex flex-col items-start w-[48px] shrink-0">
              <CheckboxCell header />
              {ROWS.map((r) => (
                <CheckboxCell key={r.name} />
              ))}
            </div>
            {/* Name column (flex) */}
            <div className="flex flex-col items-start flex-1 min-w-[160px]">
              <HeaderCell label="Name" />
              {ROWS.map((r) => (
                <Cell key={r.name}>
                  <CellText>{r.name}</CellText>
                </Cell>
              ))}
            </div>
            {/* Folder column */}
            <div className="flex flex-col items-start w-[160px] shrink-0">
              <HeaderCell label="Folder" />
              {ROWS.map((r) => (
                <Cell key={r.name} className="px-[8px]">
                  {r.folder && <FolderBadge label={r.folder} />}
                </Cell>
              ))}
            </div>
            {/* Type column */}
            <div className="flex flex-col items-start w-[300px] shrink-0">
              <HeaderCell label="Type" />
              {ROWS.map((r) => (
                <Cell key={r.name}>
                  <ProductBadge label={r.type} variant={r.type === "Virtual Tag" ? "blue" : "violet"} />
                </Cell>
              ))}
            </div>
            {/* Created by column */}
            <div className="flex flex-col items-start w-[160px] shrink-0">
              <HeaderCell label="Created by" />
              {ROWS.map((r) => (
                <Cell key={r.name}>
                  <Avatar initials={r.createdBy} />
                </Cell>
              ))}
            </div>
            {/* Creation date column */}
            <div className="flex flex-col items-start w-[210px] shrink-0">
              <HeaderCell label="Creation date" />
              {ROWS.map((r) => (
                <Cell key={r.name}>
                  <CellText>{r.created}</CellText>
                </Cell>
              ))}
            </div>
            {/* Modified date column */}
            <div className="flex flex-col items-start w-[210px] shrink-0">
              <HeaderCell label="Modified date" sortable />
              {ROWS.map((r) => (
                <Cell key={r.name}>
                  <CellText>{r.modified}</CellText>
                </Cell>
              ))}
            </div>
            {/* Actions column */}
            <div className="flex flex-col items-start w-[48px] shrink-0">
              <HeaderCell />
              {ROWS.map((r) => (
                <MenuCell key={r.name} />
              ))}
            </div>
          </TableShell>
        </div>
      </div>
    </div>
  );
}

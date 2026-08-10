"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { TopNav } from "@/components/navigation/TopNav";
import { PageTitleBar } from "@/components/navigation/PageTitleBar";
import { Tabs } from "@/components/navigation/Tabs";
import { Button, ChevronDown16 } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/Input";
import { FolderSelect } from "@/components/ui/FolderSelect";
import { FolderBadge, ProductBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { showToast } from "@/components/ui/Toast";
import { useDemoStore, updateDemo } from "@/lib/demo-store";
import { TableShell, HeaderCell, Cell, CellText, CheckboxCell } from "@/components/table/Table";
import { RowMenuCell } from "@/components/virtual-tags/RowMenuCell";
import { RenameInput } from "@/components/virtual-tags/RenameInput";
import {
  DEFAULT_VT_FOLDERS,
  DEFAULT_VT_ROWS,
  VT_FOLDERS_KEY,
  VT_ROWS_KEY,
  formatVtDate,
  type VtRow,
} from "@/components/virtual-tags/data";

/*
 * Screen: Virtual Tags List and Folders — Figma node 0:75857 (1920x1080).
 * Fully interactive: rows + folders live in the demo store ("vt-rows" /
 * "vt-folders"); search, tab + folder filters, create, rename, move to
 * folder, delete (with undo) and modified-date sort all act on real data.
 */

const updateRows = (fn: (prev: VtRow[]) => VtRow[]) => updateDemo<VtRow[]>(VT_ROWS_KEY, DEFAULT_VT_ROWS, fn);
const updateFolders = (fn: (prev: string[]) => string[]) => updateDemo<string[]>(VT_FOLDERS_KEY, DEFAULT_VT_FOLDERS, fn);

export function VirtualTagsScreen() {
  const rows = useDemoStore<VtRow[]>(VT_ROWS_KEY, DEFAULT_VT_ROWS);
  const folders = useDemoStore<string[]>(VT_FOLDERS_KEY, DEFAULT_VT_FOLDERS);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [folderFilter, setFolderFilter] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);

  const customCount = rows.filter((r) => r.kind === "custom").length;

  const query = search.trim().toLowerCase();
  const visible = rows.filter(
    (r) =>
      (activeTab === 0 || r.kind === (activeTab === 1 ? "custom" : "finout")) &&
      (query === "" || r.name.toLowerCase().includes(query)) &&
      (folderFilter === null || r.folder === folderFilter),
  );
  if (sortAsc !== null) {
    visible.sort((a, b) => (Date.parse(a.modified) - Date.parse(b.modified)) * (sortAsc ? 1 : -1));
  }

  const createVirtualTag = () => {
    const today = formatVtDate(new Date());
    updateRows((prev) => {
      const n =
        prev.reduce((max, r) => {
          const m = /^NewVirtualTag-(\d+)$/.exec(r.name);
          return m ? Math.max(max, Number(m[1])) : max;
        }, 0) + 1;
      return [
        ...prev,
        {
          id: `vt-${Date.now()}`,
          name: `NewVirtualTag-${n}`,
          kind: "custom",
          type: "Virtual Tag",
          createdBy: "CN",
          created: today,
          modified: today,
        },
      ];
    });
    showToast("Virtual tag created");
  };

  const createFolder = () => {
    updateFolders((prev) => {
      const n =
        prev.reduce((max, f) => {
          const m = /^New folder (\d+)$/.exec(f);
          return m ? Math.max(max, Number(m[1])) : max;
        }, 0) + 1;
      return [...prev, `New folder ${n}`];
    });
    showToast("Folder created");
  };

  const commitRename = (id: string, name: string) => {
    setRenamingId(null);
    const next = name.trim();
    if (next === "") return;
    updateRows((prev) => prev.map((r) => (r.id === id ? { ...r, name: next } : r)));
  };

  const moveToFolder = (id: string, folder: string) => {
    updateRows((prev) => prev.map((r) => (r.id === id ? { ...r, folder } : r)));
    showToast(`Moved to ${folder}`);
  };

  const deleteRow = (id: string) => {
    const index = rows.findIndex((r) => r.id === id);
    const row = rows[index];
    if (!row) return;
    updateRows((prev) => prev.filter((r) => r.id !== id));
    showToast("Virtual tag deleted", {
      undo: () =>
        updateRows((prev) => {
          const next = prev.filter((r) => r.id !== id);
          next.splice(Math.min(index, next.length), 0, row);
          return next;
        }),
    });
  };

  return (
    <div className="bg-canvas flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="Virtual tags" />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto">
        <TopNav />
        <PageTitleBar title="Virtual Tags" linkLabel="Learn about Virtual Tags" />
        <Tabs
          items={[
            { label: "All", count: rows.length },
            { label: "Custom Virtual Tags", count: customCount },
            { label: "Finout Virtual Tags", count: rows.length - customCount },
          ]}
          activeIndex={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="bg-surface-primary flex items-center justify-center p-[24px] w-full">
          <div className="flex flex-1 flex-wrap gap-[8px] items-center justify-between min-w-0">
            <div className="flex gap-[8px] items-center">
              <SearchInput placeholder="Search" value={search} onChange={setSearch} />
              <FolderSelect folders={folders} value={folderFilter} onChange={setFolderFilter} onNewFolder={createFolder} />
            </div>
            <Dropdown
              align="right"
              trigger={() => (
                <Button variant="primary">
                  Create Virtual Tag
                  <ChevronDown16 white />
                </Button>
              )}
            >
              {(close) => (
                <>
                  <DropdownItem
                    onClick={() => {
                      createVirtualTag();
                      close();
                    }}
                  >
                    New Virtual Tag
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      createFolder();
                      close();
                    }}
                  >
                    New Folder
                  </DropdownItem>
                </>
              )}
            </Dropdown>
          </div>
        </div>
        <div className="flex flex-col items-center px-[24px] pb-[24px] w-full">
          <TableShell>
            {/* checkbox column */}
            <div className="flex flex-col items-start w-[48px] shrink-0">
              <CheckboxCell header />
              {visible.map((r) => (
                <CheckboxCell key={r.id} />
              ))}
            </div>
            {/* Name column (flex) */}
            <div className="flex flex-col items-start flex-1 min-w-[160px]">
              <HeaderCell label="Name" />
              {visible.map((r) => (
                <Cell key={r.id}>
                  {renamingId === r.id ? (
                    <RenameInput
                      initialValue={r.name}
                      onCommit={(value) => commitRename(r.id, value)}
                      onCancel={() => setRenamingId(null)}
                    />
                  ) : (
                    <CellText>{r.name}</CellText>
                  )}
                </Cell>
              ))}
            </div>
            {/* Folder column */}
            <div className="flex flex-col items-start w-[160px] shrink-0">
              <HeaderCell label="Folder" />
              {visible.map((r) => (
                <Cell key={r.id} className="px-[8px]">
                  {r.folder && <FolderBadge label={r.folder} />}
                </Cell>
              ))}
            </div>
            {/* Type column */}
            <div className="flex flex-col items-start w-[300px] shrink-0">
              <HeaderCell label="Type" />
              {visible.map((r) => (
                <Cell key={r.id}>
                  <ProductBadge label={r.type} variant={r.type === "Virtual Tag" ? "blue" : "violet"} />
                </Cell>
              ))}
            </div>
            {/* Created by column */}
            <div className="flex flex-col items-start w-[160px] shrink-0">
              <HeaderCell label="Created by" />
              {visible.map((r) => (
                <Cell key={r.id}>
                  <Avatar initials={r.createdBy} />
                </Cell>
              ))}
            </div>
            {/* Creation date column */}
            <div className="flex flex-col items-start w-[210px] shrink-0">
              <HeaderCell label="Creation date" />
              {visible.map((r) => (
                <Cell key={r.id}>
                  <CellText>{r.created}</CellText>
                </Cell>
              ))}
            </div>
            {/* Modified date column */}
            <div className="flex flex-col items-start w-[210px] shrink-0">
              <HeaderCell
                label="Modified date"
                sortable
                sortAsc={sortAsc === true}
                onClick={() => setSortAsc((v) => (v === null ? false : !v))}
              />
              {visible.map((r) => (
                <Cell key={r.id}>
                  <CellText>{r.modified}</CellText>
                </Cell>
              ))}
            </div>
            {/* Actions column */}
            <div className="flex flex-col items-start w-[48px] shrink-0">
              <HeaderCell />
              {visible.map((r, i) => (
                <RowMenuCell
                  key={r.id}
                  folders={folders}
                  openUp={i >= Math.floor(visible.length / 2) && i >= 3}
                  onRename={() => setRenamingId(r.id)}
                  onMoveToFolder={(folder) => moveToFolder(r.id, folder)}
                  onDelete={() => deleteRow(r.id)}
                />
              ))}
            </div>
          </TableShell>
        </div>
      </div>
    </div>
  );
}

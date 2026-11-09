"use client";

import { useState } from "react";
import { SearchInput } from "./Input";

/*
 * Folder picker menu — Figma "Menu" (0:75885). 350px popover: search input,
 * scrollable folder list, separator + secondary "New folder" button.
 * The search filters the folder list live; folder rows and "New folder"
 * fire the optional callbacks.
 */
export function FolderMenu({
  folders,
  onSelect,
  onNewFolder,
}: {
  folders: string[];
  /** optional — called with the clicked folder name */
  onSelect?: (name: string) => void;
  /** optional — called when "New folder" is clicked */
  onNewFolder?: () => void;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = q === "" ? folders : folders.filter((name) => name.toLowerCase().includes(q));
  return (
    <div className="bg-white border border-solid border-neutral-100 flex flex-col gap-[8px] items-start p-[12px] rounded-[8px] w-[350px] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]">
      <div className="bg-surface-primary flex flex-col gap-[8px] items-start w-full">
        <div className="flex flex-col items-start w-full">
          <SearchInput placeholder="Search" width={326} value={query} onChange={setQuery} />
        </div>
        <div className="flex flex-col items-start overflow-clip w-full">
          <div className="flex flex-col h-[196px] items-start overflow-clip w-full">
            <div className="flex flex-col gap-[12px] items-start px-[12px] w-full">
              {visible.map((name, i) => (
                <button
                  key={i}
                  onClick={onSelect ? () => onSelect(name) : undefined}
                  className="flex gap-[8px] h-[24px] items-center shrink-0 cursor-pointer"
                >
                  <span className="overflow-clip relative shrink-0 size-[16px]">
                    <span className="absolute inset-[9.38%_5.21%_13.54%_5.21%]">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/ui/folder-menu.svg" />
                    </span>
                  </span>
                  <span className="font-sans font-normal leading-[20px] text-[14px] text-text-primary whitespace-nowrap">{name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[8px] items-start w-full">
            <div className="h-px w-full bg-neutral-100" />
            <button
              onClick={onNewFolder}
              className="bg-surface-primary border-2 border-solid border-border-primary flex gap-[6px] items-center justify-center min-h-[32px] px-[12px] py-[6px] rounded-[8px] w-full cursor-pointer"
            >
              <span className="overflow-clip relative shrink-0 size-[16px]">
                <span className="absolute inset-[17.71%]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/ui/plus.svg" />
                </span>
              </span>
              <span className="font-sans font-medium leading-[20px] text-[14px] text-text-link text-center whitespace-nowrap">New folder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { DropdownItem } from "@/components/ui/Dropdown";

/*
 * Row actions cell (⋮) — same cell + trigger chrome as Table's MenuCell and
 * the same panel chrome as Dropdown, plus a real menu: Rename / Move to
 * folder (flat "Move to <folder>" list) / Delete. Opens upward for bottom
 * rows so the panel stays inside the table's scroll container.
 */
export function RowMenuCell({
  folders,
  openUp = false,
  onRename,
  onMoveToFolder,
  onDelete,
}: {
  folders: string[];
  openUp?: boolean;
  onRename: () => void;
  onMoveToFolder: (folder: string) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [showFolders, setShowFolders] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowFolders(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const close = () => {
    setOpen(false);
    setShowFolders(false);
  };

  return (
    <div className="border-b-[1.241px] border-solid border-[#f2f4f7] flex h-[54px] items-center justify-center w-[48px]">
      <div ref={rootRef} className="relative">
        <button
          onClick={() => (open ? close() : setOpen(true))}
          className="bg-surface-primary flex items-center justify-center min-h-[24px] min-w-[24px] overflow-clip p-[4px] rounded-[4px] cursor-pointer"
        >
          <span className="overflow-clip relative shrink-0 size-[16px]">
            <span className="absolute inset-[13.54%_42.71%]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/ui/ellipsis-vertical.svg" />
            </span>
          </span>
        </button>
        {open && (
          <div
            className={`absolute right-0 z-50 bg-white border border-solid border-[#eaecf0] rounded-[8px] p-[12px] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)] min-w-[180px] ${
              openUp ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
            }`}
          >
            {showFolders ? (
              <div className="flex flex-col max-h-[160px] overflow-y-auto">
                {folders.map((folder, i) => (
                  <DropdownItem
                    key={`${folder}-${i}`}
                    onClick={() => {
                      onMoveToFolder(folder);
                      close();
                    }}
                  >
                    <span className="whitespace-nowrap">Move to {folder}</span>
                  </DropdownItem>
                ))}
              </div>
            ) : (
              <>
                <DropdownItem
                  onClick={() => {
                    onRename();
                    close();
                  }}
                >
                  Rename
                </DropdownItem>
                <DropdownItem onClick={() => setShowFolders(true)}>Move to folder</DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onDelete();
                    close();
                  }}
                >
                  Delete
                </DropdownItem>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

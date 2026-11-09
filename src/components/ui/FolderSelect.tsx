"use client";

import { useEffect, useRef, useState } from "react";
import { Select } from "./Select";
import { FolderMenu } from "./FolderMenu";

/*
 * "Folders" filter — clicking the select opens the FolderMenu popover
 * left-aligned, 8px below the trigger (Figma: menu x aligns with the
 * select's left edge, y = select bottom + 8).
 * Optionally controlled: `value` shows the picked folder on the trigger,
 * picking a folder calls `onChange` (picking it again clears to null).
 */
export function FolderSelect({
  folders,
  value = null,
  onChange,
  onNewFolder,
}: {
  folders: string[];
  /** currently selected folder name (null = no folder filter) */
  value?: string | null;
  onChange?: (folder: string | null) => void;
  onNewFolder?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <Select label={value ?? "Folders"} onClick={() => setOpen((v) => !v)} />
      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50">
          <FolderMenu
            folders={folders}
            onSelect={(name) => {
              onChange?.(name === value ? null : name);
              setOpen(false);
            }}
            onNewFolder={onNewFolder}
          />
        </div>
      )}
    </div>
  );
}

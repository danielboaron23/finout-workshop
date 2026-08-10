"use client";

import { useEffect, useRef, useState } from "react";
import { Select } from "./Select";
import { FolderMenu } from "./FolderMenu";

/*
 * "Folders" filter — clicking the select opens the FolderMenu popover
 * left-aligned, 8px below the trigger (Figma: menu x aligns with the
 * select's left edge, y = select bottom + 8).
 */
export function FolderSelect({ folders }: { folders: string[] }) {
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
      <Select label="Folders" onClick={() => setOpen((v) => !v)} />
      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50">
          <FolderMenu folders={folders} />
        </div>
      )}
    </div>
  );
}

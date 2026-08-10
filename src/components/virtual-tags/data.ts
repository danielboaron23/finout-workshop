/*
 * Virtual Tags demo data — lives in the demo store (src/lib/demo-store) so
 * real actions (create, rename, move to folder, delete) update the UI
 * instantly and survive client-side navigation.
 * Store keys: "vt-rows" (VtRow[]) and "vt-folders" (string[]).
 */

export type VtRowKind = "custom" | "finout";

export type VtRow = {
  id: string;
  name: string;
  folder?: string;
  kind: VtRowKind;
  type: "Virtual Tag" | "Relational Virtual Tag";
  createdBy?: string; // initials; undefined = Finout fab
  created: string;
  modified: string;
};

export const VT_ROWS_KEY = "vt-rows";
export const VT_FOLDERS_KEY = "vt-folders";

export const DEFAULT_VT_ROWS: VtRow[] = [
  { id: "vt-1", name: "ProfitPulse", folder: "Folder name", kind: "custom", type: "Virtual Tag", createdBy: "CN", created: "Jan 15, 2023", modified: "Feb 14, 2024" },
  { id: "vt-2", name: "RevenueRadar", folder: "Folder name", kind: "custom", type: "Virtual Tag", createdBy: "CN", created: "Nov 8, 2022", modified: "Mar 3, 2024" },
  { id: "vt-3", name: "ProfitPulseDashboard", folder: "Folder name", kind: "custom", type: "Virtual Tag", createdBy: "CN", created: "Sep 3, 2023", modified: "Apr 27, 2024" },
  { id: "vt-4", name: "RevenueStreamMap", folder: "Folder name", kind: "custom", type: "Relational Virtual Tag", createdBy: "CN", created: "Dec 27, 2024", modified: "May 9, 2024" },
  { id: "vt-5", name: "MarketMetrics", kind: "finout", type: "Relational Virtual Tag", created: "Feb 14, 2025", modified: "Jun 15, 2024" },
  { id: "vt-6", name: "ExpenseEagle", kind: "finout", type: "Relational Virtual Tag", created: "Jul 6, 2023", modified: "Jul 22, 2024" },
  { id: "vt-7", name: "FinanceFalcon", kind: "finout", type: "Relational Virtual Tag", created: "Oct 30, 2024", modified: "Aug 30, 2024" },
];

// First entry matches the seeded rows' folder so picking it actually filters;
// the rest keep the Figma placeholder label
export const DEFAULT_VT_FOLDERS: string[] = ["Folder name", ...Array.from({ length: 7 }, () => "Folder name here")];

/** "Aug 10, 2026" — same format as the seeded rows */
export function formatVtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

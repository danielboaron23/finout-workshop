/*
 * Reports demo data (static). Each report is a saved, optionally scheduled
 * export of cost data from one of the Inform screens.
 */

export type ReportSource = "MegaBill" | "Virtual Tags" | "Anomalies";

export type ReportRow = {
  id: string;
  name: string;
  source: ReportSource;
  schedule: "Daily" | "Weekly" | "Monthly" | "Not scheduled";
  owner: string; // initials
  lastRun: string;
};

export const REPORT_ROWS: ReportRow[] = [
  { id: "rp-1", name: "Monthly cloud spend by provider", source: "MegaBill", schedule: "Monthly", owner: "CN", lastRun: "Aug 1, 2026" },
  { id: "rp-2", name: "Executive cost summary", source: "MegaBill", schedule: "Weekly", owner: "CN", lastRun: "Aug 9, 2026" },
  { id: "rp-3", name: "Kubernetes cost per team", source: "Virtual Tags", schedule: "Weekly", owner: "SH", lastRun: "Aug 9, 2026" },
  { id: "rp-4", name: "Untagged spend audit", source: "Virtual Tags", schedule: "Monthly", owner: "SH", lastRun: "Aug 1, 2026" },
  { id: "rp-5", name: "Anomalies — last 30 days", source: "Anomalies", schedule: "Daily", owner: "CN", lastRun: "Aug 10, 2026" },
  { id: "rp-6", name: "Snowflake weekend usage", source: "MegaBill", schedule: "Not scheduled", owner: "SH", lastRun: "Jul 22, 2026" },
  { id: "rp-7", name: "Platform team budget vs actual", source: "Virtual Tags", schedule: "Not scheduled", owner: "CN", lastRun: "Jul 14, 2026" },
];

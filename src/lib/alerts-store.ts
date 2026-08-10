import type { AnomalyCardProps } from "@/components/anomalies/AnomalyCard";

/*
 * Demo store for user-created anomaly alerts: survives client-side navigation
 * (sessionStorage) so an alert saved in /anomalies/create shows up in the
 * /anomalies feed as an extra card.
 */

const KEY = "finout-anomaly-alerts";

export function getSavedAlerts(): AnomalyCardProps[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.sessionStorage.getItem(KEY) ?? "[]") as AnomalyCardProps[];
  } catch {
    return [];
  }
}

export function saveAlert(alert: AnomalyCardProps) {
  const all = [...getSavedAlerts(), alert];
  window.sessionStorage.setItem(KEY, JSON.stringify(all));
}

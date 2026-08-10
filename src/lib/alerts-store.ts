"use client";

import type { AnomalyCardProps } from "@/components/anomalies/AnomalyCard";
import { setDemo, updateDemo } from "@/lib/demo-store";

/*
 * Anomaly feed data — one live list in the demo store under "anomaly-cards":
 * the Figma default card (builtIn) plus every alert the user creates via the
 * Create Usage Anomaly Alert form. Legacy alerts saved under the old
 * "finout-anomaly-alerts" sessionStorage key are imported once on first load.
 */

const LEGACY_KEY = "finout-anomaly-alerts";
export const ANOMALY_CARDS_KEY = "anomaly-cards";

/** The Figma feed card (node 1:14693) — always seeded first. */
export const DEFAULT_ANOMALY_CARD: AnomalyCardProps = {
  date: "Sunday, May 24, 2026",
  title: "Anthropic Tokens",
  deltaLabel: "+3,380 Tokens",
  deltaPct: "9%",
  expected: "37,557 Tokens",
  actual: "40,937 Tokens",
  usageType: "Anthropic - Tokens",
  costCenter: "Global",
  intervalA: "1 day",
  intervalB: "6 days",
  scopeTag: "CostCenter: Anthropic",
  builtIn: true,
};

/** Stable fallback for useDemoStore (module constant — never re-created). */
export const DEFAULT_ANOMALY_CARDS: AnomalyCardProps[] = [DEFAULT_ANOMALY_CARD];

function getLegacyAlerts(): AnomalyCardProps[] {
  try {
    return JSON.parse(window.sessionStorage.getItem(LEGACY_KEY) ?? "[]") as AnomalyCardProps[];
  } catch {
    return [];
  }
}

/**
 * One-time import: if "anomaly-cards" has never been written, seed it with the
 * default Figma card + any alerts saved under the legacy key, then retire the
 * legacy key. Safe to call repeatedly.
 */
export function migrateAnomalyCards() {
  if (typeof window === "undefined") return;
  if (window.sessionStorage.getItem(ANOMALY_CARDS_KEY) !== null) return;
  setDemo(ANOMALY_CARDS_KEY, [...DEFAULT_ANOMALY_CARDS, ...getLegacyAlerts()]);
  window.sessionStorage.removeItem(LEGACY_KEY);
}

/** Synchronous read of the current card list (client only). */
export function getAnomalyCards(): AnomalyCardProps[] {
  if (typeof window === "undefined") return DEFAULT_ANOMALY_CARDS;
  migrateAnomalyCards();
  try {
    const raw = window.sessionStorage.getItem(ANOMALY_CARDS_KEY);
    return raw ? (JSON.parse(raw) as AnomalyCardProps[]) : DEFAULT_ANOMALY_CARDS;
  } catch {
    return DEFAULT_ANOMALY_CARDS;
  }
}

/** Append a user-created alert to the feed. */
export function saveAlert(alert: AnomalyCardProps) {
  migrateAnomalyCards();
  updateDemo<AnomalyCardProps[]>(ANOMALY_CARDS_KEY, DEFAULT_ANOMALY_CARDS, (prev) => [...prev, alert]);
}

/** Update the card at `index` in place (edit mode). */
export function updateAlert(index: number, patch: Partial<AnomalyCardProps>) {
  migrateAnomalyCards();
  updateDemo<AnomalyCardProps[]>(ANOMALY_CARDS_KEY, DEFAULT_ANOMALY_CARDS, (prev) =>
    prev.map((card, i) => (i === index ? { ...card, ...patch } : card)),
  );
}

/** Remove the card at `index`. */
export function deleteAlert(index: number) {
  migrateAnomalyCards();
  updateDemo<AnomalyCardProps[]>(ANOMALY_CARDS_KEY, DEFAULT_ANOMALY_CARDS, (prev) =>
    prev.filter((_, i) => i !== index),
  );
}

/** Re-insert a deleted card at its original position (toast Undo). */
export function restoreAlert(index: number, card: AnomalyCardProps) {
  migrateAnomalyCards();
  updateDemo<AnomalyCardProps[]>(ANOMALY_CARDS_KEY, DEFAULT_ANOMALY_CARDS, (prev) => [
    ...prev.slice(0, index),
    card,
    ...prev.slice(index),
  ]);
}

/** Append a comment line to the card at `index`. */
export function addAlertComment(index: number, text: string) {
  migrateAnomalyCards();
  updateDemo<AnomalyCardProps[]>(ANOMALY_CARDS_KEY, DEFAULT_ANOMALY_CARDS, (prev) =>
    prev.map((card, i) => (i === index ? { ...card, comments: [...(card.comments ?? []), text] } : card)),
  );
}

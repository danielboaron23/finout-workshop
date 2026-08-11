"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnomalyCard, type AnomalyCardProps } from "./AnomalyCard";
import {
  ANOMALY_CARDS_KEY,
  DEFAULT_ANOMALY_CARDS,
  addAlertComment,
  deleteAlert,
  migrateAnomalyCards,
  restoreAlert,
} from "@/lib/alerts-store";
import { useDemoStore } from "@/lib/demo-store";
import { showToast } from "@/components/ui/Toast";

/*
 * Feed results — one live list from the demo store ("anomaly-cards"): the
 * Figma default card plus any alerts the user created via the Create Usage
 * Anomaly Alert form (newest first). Search / chip filters and the
 * Feed / Manage tabs narrow the list.
 */

export type AnomalyFeedFilters = {
  /** "Usage Anomaly" | "Cost Anomaly" — must match the card badge. */
  type?: string | null;
  /** Matches card.costCenter. */
  costCenter?: string | null;
  /** ">5%" | ">10%" | ">20%" — card deltaPct must exceed it. */
  threshold?: string | null;
};

export function AnomaliesResults({
  tab = "feed",
  query = "",
  filters,
}: {
  tab?: "feed" | "manage";
  query?: string;
  filters?: AnomalyFeedFilters;
}) {
  const router = useRouter();
  const cards = useDemoStore<AnomalyCardProps[]>(ANOMALY_CARDS_KEY, DEFAULT_ANOMALY_CARDS);

  // First load: import alerts saved under the legacy key, then use only "anomaly-cards".
  useEffect(() => {
    migrateAnomalyCards();
  }, []);

  const q = query.trim().toLowerCase();
  const thresholdMin = filters?.threshold ? parseFloat(filters.threshold.replace(/[^\d.]/g, "")) : null;

  const visible = cards
    .map((card, index) => ({ card, index }))
    .filter(({ card }) => (tab === "manage" ? !card.builtIn : true))
    .filter(({ card }) => (q ? (card.title ?? "").toLowerCase().includes(q) : true))
    .filter(() => (filters?.type ? filters.type === "Usage Anomaly" : true))
    .filter(({ card }) => (filters?.costCenter ? (card.costCenter ?? "Global") === filters.costCenter : true))
    .filter(({ card }) =>
      thresholdMin !== null && !Number.isNaN(thresholdMin)
        ? parseFloat((card.deltaPct ?? "9%").replace("%", "")) > thresholdMin
        : true,
    )
    .reverse();

  if (tab === "manage" && visible.length === 0) {
    return (
      <p className="font-sans font-normal leading-[22px] text-n700 text-[14px] text-center w-full mt-[48px] pb-[32px]">
        No custom anomaly alerts yet. Create one to manage it here.
      </p>
    );
  }

  const count = visible.length;
  return (
    <>
      <p className="font-sans font-medium leading-[28px] text-text-primary text-[18px] mt-[24px]">
        {count} {count === 1 ? "result" : "results"}
      </p>
      <div className="mt-[16px] pb-[32px] w-full flex flex-col gap-[16px]">
        {visible.map(({ card, index }) => (
          <AnomalyCard
            key={index}
            {...card}
            onInvestigate={() => router.push("/megabill")}
            onEdit={() => router.push(`/anomalies/create?edit=${index}`)}
            onDelete={() => {
              deleteAlert(index);
              showToast("Alert deleted", { undo: () => restoreAlert(index, card) });
            }}
            onComment={(text) => addAlertComment(index, text)}
          />
        ))}
      </div>
    </>
  );
}

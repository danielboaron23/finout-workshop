"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { TopNav } from "@/components/navigation/TopNav";
import { PageTitleBar } from "@/components/navigation/PageTitleBar";
import { BackLink } from "@/components/anomaly-form/BackLink";
import { CostUsageSwitcher } from "@/components/anomaly-form/CostUsageSwitcher";
import { AlertNameDrawer } from "@/components/anomaly-form/AlertNameDrawer";
import { AlertValuesDrawer } from "@/components/anomaly-form/AlertValuesDrawer";
import { UsageTypeDrawer } from "@/components/anomaly-form/UsageTypeDrawer";
import { ThresholdsDrawer } from "@/components/anomaly-form/ThresholdsDrawer";
import { TimeIntervalDrawer } from "@/components/anomaly-form/TimeIntervalDrawer";
import { FormFooter } from "@/components/anomaly-form/FormFooter";
import { getAnomalyCards, saveAlert, updateAlert } from "@/lib/alerts-store";
import { showToast } from "@/components/ui/Toast";
import type { AnomalyCardProps } from "@/components/anomalies/AnomalyCard";

/*
 * Screen: Create Usage Anomaly Alert — Figma node 1:13381 (1945x1715).
 * Opened from the Anomalies feed CTA; Save adds the alert to the feed,
 * Cancel / Back to Anomalies return without saving.
 * With ?edit=<index> (from a card's "Edit anomaly"), the form prefills from
 * that card and Save updates it in place instead of appending.
 * NOTE: uses useSearchParams — the page route wraps this screen in <Suspense>.
 */

const VENDOR_OPTIONS = ["Anthropic", "OpenAI", "AWS"];

/** "Anthropic - Tokens" (card) -> "Anthropic Tokens" (select label). */
function usageTypeLabel(card: AnomalyCardProps): string {
  return card.usageType?.replace(" - ", " ") ?? "Anthropic Tokens";
}

/** "1 week" -> Weeks; anything else -> Days. */
function unitFromCard(card: AnomalyCardProps): "Days" | "Weeks" {
  return card.intervalA?.includes("week") ? "Weeks" : "Days";
}

/** "6 days" -> 6, clamped to the 2-6 comparison chips. */
function comparisonFromCard(card: AnomalyCardProps): number {
  const n = parseInt(card.intervalB ?? "6", 10);
  return Number.isNaN(n) ? 6 : Math.min(6, Math.max(2, n));
}

export function CreateAnomalyScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editParam = searchParams.get("edit");
  const editIndex = editParam !== null && /^\d+$/.test(editParam) ? Number(editParam) : null;

  const [mode, setMode] = useState<"cost" | "usage">("usage");
  // Snapshot of the demo store on mount — this screen renders client-side only
  // (Suspense boundary in the route), so sessionStorage is available here.
  const [initialCards] = useState<AnomalyCardProps[]>(() => getAnomalyCards());
  const editCard = editIndex !== null ? (initialCards[editIndex] ?? null) : null;

  // Latest form values (children own their display state; refs avoid re-renders).
  const nameRef = useRef("Anthropic Tokens");
  const usageTypeRef = useRef("Anthropic Tokens");
  const vendorRef = useRef("Anthropic");
  const pctRef = useRef("20");
  const intervalRef = useRef({ intervalA: "1 day", intervalB: "6 days" });

  // Edit mode: seed the refs from the card so an untouched Save keeps its values.
  useEffect(() => {
    if (!editCard) return;
    nameRef.current = editCard.title ?? "Anthropic Tokens";
    usageTypeRef.current = usageTypeLabel(editCard);
    if (editCard.costCenter && VENDOR_OPTIONS.includes(editCard.costCenter)) vendorRef.current = editCard.costCenter;
    pctRef.current = (editCard.deltaPct ?? "20%").replace("%", "");
    intervalRef.current = {
      intervalA: editCard.intervalA ?? "1 day",
      intervalB: editCard.intervalB ?? "6 days",
    };
  }, [editCard]);

  const handleSave = () => {
    const vendor = usageTypeRef.current.replace(/ Tokens$/, "");
    const patch = {
      title: nameRef.current || "Anthropic Tokens",
      usageType: `${vendor} - Tokens`,
      costCenter: vendorRef.current,
      scopeTag: `CostCenter: ${vendorRef.current}`,
      deltaPct: `${pctRef.current.replace(/%$/, "") || "20"}%`,
      intervalA: intervalRef.current.intervalA,
      intervalB: intervalRef.current.intervalB,
    };
    if (editIndex !== null && editCard) {
      updateAlert(editIndex, patch);
      showToast("Alert updated");
    } else {
      const now = new Date();
      saveAlert({
        date: now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        ...patch,
      });
    }
    router.push("/anomalies");
  };

  // Remount the prefillable drawers once the edit card loads.
  const formKey = editCard ? `edit-${editIndex}` : "create";
  const vendorInitial =
    editCard?.costCenter && VENDOR_OPTIONS.includes(editCard.costCenter) ? editCard.costCenter : "Anthropic";
  const percentInitial = editCard ? (editCard.deltaPct ?? "20%").replace("%", "") : "20";

  return (
    <div className="bg-canvas flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="Anomalies" />
      <div className="flex flex-col flex-1 h-full min-w-0 bg-surface-primary">
        <TopNav compact left={<BackLink label="Back to Anomalies" onClick={() => router.push("/anomalies")} />} />
        <PageTitleBar title="Create Usage Anomaly Alert" linkLabel="Learn more" />
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto w-full">
          <div className="flex flex-col gap-[16px] items-start px-[32px] pt-[16px] pb-[24px] w-full">
            <CostUsageSwitcher value={mode} onChange={setMode} />
            <AlertNameDrawer
              key={`name-${formKey}`}
              value={editCard?.title ?? "Anthropic Tokens"}
              onChange={(v) => (nameRef.current = v)}
            />
            <AlertValuesDrawer
              key={`values-${formKey}`}
              vendor={vendorInitial}
              onVendorChange={(v) => (vendorRef.current = v)}
            />
            <UsageTypeDrawer
              key={`type-${formKey}`}
              title={mode === "cost" ? "Cost Type" : "Usage Type"}
              value={editCard ? usageTypeLabel(editCard) : "Anthropic Tokens"}
              onChange={(v) => (usageTypeRef.current = v)}
            />
            <ThresholdsDrawer
              key={`thresholds-${formKey}`}
              defaultPercent={percentInitial}
              onPercentChange={(v) => (pctRef.current = v)}
            />
            <TimeIntervalDrawer
              key={`interval-${formKey}`}
              className="max-w-[698px]"
              initialUnit={editCard ? unitFromCard(editCard) : "Days"}
              initialComparison={editCard ? comparisonFromCard(editCard) : 6}
              onChange={(v) => (intervalRef.current = v)}
            />
          </div>
        </div>
        <FormFooter onCancel={() => router.push("/anomalies")} onSave={handleSave} />
      </div>
    </div>
  );
}

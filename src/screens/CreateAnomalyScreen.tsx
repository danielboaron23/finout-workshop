"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import { saveAlert } from "@/lib/alerts-store";

/*
 * Screen: Create Usage Anomaly Alert — Figma node 1:13381 (1945x1715).
 * Opened from the Anomalies feed CTA; Save adds the alert to the feed,
 * Cancel / Back to Anomalies return without saving.
 */
export function CreateAnomalyScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<"cost" | "usage">("usage");
  const nameRef = useRef("Anthropic Tokens");

  const handleSave = () => {
    const now = new Date();
    saveAlert({
      date: now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      title: nameRef.current || "Anthropic Tokens",
      usageType: "Anthropic - Tokens",
      costCenter: "Anthropic",
      intervalA: "1 day",
      intervalB: "6 days",
      scopeTag: "CostCenter: Anthropic",
    });
    router.push("/anomalies");
  };

  return (
    <div className="bg-canvas flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="Anomalies" />
      <div className="flex flex-col flex-1 h-full min-w-0 bg-surface-primary">
        <TopNav compact left={<BackLink label="Back to Anomalies" onClick={() => router.push("/anomalies")} />} />
        <PageTitleBar title="Create Usage Anomaly Alert" linkLabel="Learn more" />
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto w-full">
          <div className="flex flex-col gap-[16px] items-start px-[32px] pt-[16px] pb-[24px] w-full">
            <CostUsageSwitcher value={mode} onChange={setMode} />
            <AlertNameDrawer onChange={(v) => (nameRef.current = v)} />
            <AlertValuesDrawer />
            <UsageTypeDrawer />
            <ThresholdsDrawer />
            <TimeIntervalDrawer className="max-w-[698px]" />
          </div>
        </div>
        <FormFooter onCancel={() => router.push("/anomalies")} onSave={handleSave} />
      </div>
    </div>
  );
}

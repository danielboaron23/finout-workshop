"use client";

import { useEffect, useState } from "react";
import { AnomalyCard, type AnomalyCardProps } from "./AnomalyCard";
import { getSavedAlerts } from "@/lib/alerts-store";

/*
 * Feed results — the Figma default card plus any alerts the user created via
 * the Create Usage Anomaly Alert form (newest first).
 */
export function AnomaliesResults() {
  const [saved, setSaved] = useState<AnomalyCardProps[]>([]);
  useEffect(() => {
    setSaved(getSavedAlerts());
  }, []);

  const count = saved.length + 1;
  return (
    <>
      <p className="font-sans font-medium leading-[28px] text-[#101828] text-[18px] mt-[24px]">
        {count} {count === 1 ? "result" : "results"}
      </p>
      <div className="mt-[16px] pb-[32px] w-full flex flex-col gap-[16px]">
        {[...saved].reverse().map((alert, i) => (
          <AnomalyCard key={i} {...alert} />
        ))}
        <AnomalyCard />
      </div>
    </>
  );
}

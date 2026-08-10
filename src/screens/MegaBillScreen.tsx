import { Sidebar } from "@/components/sidebar/Sidebar";
import { MegaBillPageClient } from "@/components/megabill/MegaBillPageClient";

/*
 * Screen: MegaBill — Figma node 1:13876 "MegaBill - New Components" (1682x994).
 * Toolbar rows + one big card: KPI strip, stacked daily cost chart, legend,
 * actions row, breakdown table. Reached from the home KPI "Investigate in
 * MegaBill" CTAs and the sidebar. The content column is a client container
 * (MegaBillPageClient) that owns the fully interactive view state.
 */
export function MegaBillScreen() {
  return (
    <div className="bg-canvas flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="MegaBill" />
      <MegaBillPageClient />
    </div>
  );
}

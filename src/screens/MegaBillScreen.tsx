import { Sidebar } from "@/components/sidebar/Sidebar";
import { MegaBillTopBar } from "@/components/megabill/MegaBillTopBar";
import { MegaBillToolbar } from "@/components/megabill/MegaBillToolbar";
import { MegaBillChartSection } from "@/components/megabill/MegaBillChart";
import { MegaBillActionsRow, MegaBillTable } from "@/components/megabill/MegaBillTable";

/*
 * Screen: MegaBill — Figma node 1:13876 "MegaBill - New Components" (1682x994).
 * Toolbar rows + one big card: KPI strip, stacked daily cost chart, legend,
 * actions row, breakdown table. Reached from the home KPI "Investigate in
 * MegaBill" CTAs and the sidebar.
 */
export function MegaBillScreen() {
  return (
    <div className="bg-canvas flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="MegaBill" />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto bg-canvas">
        <MegaBillTopBar />
        <div className="flex flex-col gap-[16px] px-[12px] pt-[4px] pb-[24px] w-full">
          <MegaBillToolbar />
          <div className="bg-white border border-solid border-[#eaecf0] flex flex-col rounded-[8px] w-full">
            <MegaBillChartSection />
            <div className="h-px w-full bg-[#eaecf0]" />
            <MegaBillActionsRow />
            <div className="h-px w-full bg-[#eaecf0]" />
            <MegaBillTable />
          </div>
        </div>
      </div>
    </div>
  );
}

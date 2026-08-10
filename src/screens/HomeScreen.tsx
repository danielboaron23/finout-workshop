import { Sidebar } from "@/components/sidebar/Sidebar";
import { HomeTopBar } from "@/components/home/HomeTopBar";
import { HomeDashboard } from "@/components/home/HomeDashboard";

/*
 * Screen: Home / Overview — Figma node 1:13833 "Home page" (1920x2274).
 * Content bg is pure white; sections stack with 32px gaps inside a 24px gutter.
 * Bottom row: 810 / 397 / 397 with 24px gaps at 1920.
 * Section rendering is persona-driven — see HomeDashboard (client).
 */
export function HomeScreen() {
  return (
    <div className="bg-white flex h-full flex-1 w-full items-start overflow-hidden">
      <Sidebar activeItem="Overview" />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto">
        <HomeTopBar />
        <HomeDashboard />
      </div>
    </div>
  );
}

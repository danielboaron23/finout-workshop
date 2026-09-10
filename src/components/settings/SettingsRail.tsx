"use client";

import { SECTIONS, type SectionId } from "./data";

/*
 * SettingsRail — INVENT (Settings, 2026-09-10).
 *
 * Why not Tabs: Tabs is a horizontal 68px bar with a bottom-border indicator,
 * it has no concept of a group heading, and TabItem carries no href — which is
 * why CostGuardHubScreen has to hand-maintain a parallel slug array to make
 * three tabs linkable. Why not Sidebar: that is the dark 220px global nav with
 * a module-level NAV const and dark-surface-only hover classes.
 *
 * Every row is a real anchor, so a section is deep-linkable, middle-clickable
 * and reachable by keyboard without any of our own key handling.
 */

const SCOPES = [
  { id: "organisation" as const, label: "Organisation", hint: "Applies to everyone in Finout" },
  { id: "personal" as const, label: "Personal", hint: "Only affects you" },
];

export function SettingsRail({ active }: { active: SectionId }) {
  return (
    <nav aria-label="Settings sections" className="flex flex-col gap-[20px] shrink-0 w-[252px]">
      {SCOPES.map((scope) => (
        <div key={scope.id} className="flex flex-col gap-[4px] w-full">
          <div className="flex flex-col gap-[1px] px-[10px] pb-[4px]">
            <p className="font-sans font-medium leading-[16px] text-[11px] tracking-[0.06em] uppercase text-text-tertiary">
              {scope.label}
            </p>
            <p className="font-sans font-normal leading-[16px] text-[11px] text-text-tertiary opacity-80">
              {scope.hint}
            </p>
          </div>

          {SECTIONS.filter((s) => s.scope === scope.id).map((s) => {
            const on = s.id === active;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={on ? "page" : undefined}
                className={`group relative flex items-center gap-[8px] h-[36px] pl-[10px] pr-[8px] rounded-[6px]
                  transition-colors cursor-pointer ${
                    on ? "bg-blue-50 text-text-link" : "text-text-secondary hover:bg-surface-secondary"
                  }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-[8px] bottom-[8px] w-[2px] rounded-full transition-opacity ${
                    on ? "bg-blue-400 opacity-100" : "opacity-0"
                  }`}
                />
                <span
                  className={`flex-1 min-w-0 font-sans leading-[20px] text-[14px] truncate ${
                    on ? "font-medium" : "font-normal"
                  }`}
                >
                  {s.label}
                </span>
                {s.rewrites && (
                  <span
                    title="Changes figures across Finout"
                    className="shrink-0 size-[6px] rounded-full bg-orange-800 opacity-70"
                  >
                    <span className="sr-only">Changes figures across Finout</span>
                  </span>
                )}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

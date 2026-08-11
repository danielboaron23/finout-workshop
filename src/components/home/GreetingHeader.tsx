"use client";

import type { ReactNode } from "react";
import { setDemo, useDemoStore } from "@/lib/demo-store";

export type Persona = "FinOps" | "Engineer" | "Finance" | "Executive";

function FinOpsIcon() {
  return (
    <div className="relative rounded-[40px] shrink-0 size-[20px]">
      <div className="absolute inset-[12.5%_13.54%_9.38%_15.8%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/persona-finops.svg" />
      </div>
    </div>
  );
}

function EngineerIcon() {
  return (
    <div className="relative rounded-[40px] shrink-0 size-[20px]">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/persona-base-20.svg" />
      <div className="absolute bottom-[34.38%] left-[6.25%] right-3/4 top-[34.38%]">
        <div className="absolute inset-[-12%_-20%]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/persona-engineer-1.svg" />
        </div>
      </div>
      <div className="absolute bottom-[34.38%] left-3/4 right-[6.25%] top-[34.38%]">
        <div className="absolute inset-[-12%_-20%]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/persona-engineer-2.svg" />
        </div>
      </div>
      <div className="absolute inset-[15.63%_37.5%]">
        <div className="absolute inset-[-5.46%_-15%]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/persona-engineer-3.svg" />
        </div>
      </div>
    </div>
  );
}

function FinanceIcon() {
  return (
    <div className="relative rounded-[40px] shrink-0 size-[20px]">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/persona-base-20.svg" />
      <div className="absolute bottom-[81.25%] left-1/2 right-1/2 top-[9.38%]">
        <div className="absolute inset-[-40%_-0.75px]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/persona-finance-1.svg" />
        </div>
      </div>
      <div className="absolute bottom-[9.38%] left-1/2 right-1/2 top-[81.25%]">
        <div className="absolute inset-[-40%_-0.75px]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/persona-finance-1.svg" />
        </div>
      </div>
      <div className="absolute bottom-[18.75%] left-1/4 right-1/4 top-[18.75%]">
        <div className="absolute inset-[-6%_-7.5%]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/persona-finance-2.svg" />
        </div>
      </div>
    </div>
  );
}

function ExecutiveIcon() {
  return (
    <div className="relative rounded-[40px] shrink-0 size-[20px]">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/persona-base-20.svg" />
      <div className="absolute inset-[28.13%_12.5%_15.63%_12.5%]">
        <div className="absolute inset-[-6.67%_-5%]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/persona-executive-1.svg" />
        </div>
      </div>
      <div className="absolute inset-[15.63%_34.38%_71.88%_34.38%]">
        <div className="absolute inset-[-30%_-12%]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/persona-executive-2.svg" />
        </div>
      </div>
      <div className="absolute inset-[49.34%_12.5%_40.62%_12.5%]">
        <div className="absolute inset-[-37.36%_-5%_-37.35%_-5%]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/persona-executive-3.svg" />
        </div>
      </div>
      <div className="absolute inset-[46.88%_45.31%_53.13%_45.31%]">
        <div className="absolute inset-[-0.75px_-40%]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/persona-executive-4.svg" />
        </div>
      </div>
    </div>
  );
}

const PERSONAS: { label: Persona; icon: ReactNode }[] = [
  { label: "FinOps", icon: <FinOpsIcon /> },
  { label: "Engineer", icon: <EngineerIcon /> },
  { label: "Finance", icon: <FinanceIcon /> },
  { label: "Executive", icon: <ExecutiveIcon /> },
];

/* Exported persona icons are fixed-color SVGs (FinOps blue, others gray),
 * so switching `active` restyles the pill but not the icon colors.
 * Uncontrolled (no `active` prop) it reads/writes the "home-persona" demo
 * store key, so the choice persists and the dashboard filters live. */
export function PersonaSwitcher({
  active,
  onSelect,
}: {
  active?: Persona;
  onSelect?: (persona: Persona) => void;
}) {
  const stored = useDemoStore<Persona>("home-persona", "FinOps");
  const current = active ?? stored;
  return (
    <div className="flex h-[32px] isolate items-start overflow-clip relative rounded-[4px]">
      {PERSONAS.map(({ label, icon }, i) => {
        const isActive = label === current;
        const isFirst = i === 0;
        const isLast = i === PERSONAS.length - 1;
        return (
          <button
            key={label}
            onClick={() => (onSelect ? onSelect(label) : setDemo("home-persona", label))}
            className={`flex gap-[8px] h-full items-center justify-center px-[16px] py-[7px] shrink-0 cursor-pointer ${
              isActive
                ? "bg-blue-50 border border-solid border-border-primary"
                : "bg-white border-solid border-border-muted border-b border-r border-t"
            } ${isFirst ? "rounded-bl-[8px] rounded-tl-[8px]" : ""} ${
              isLast ? "rounded-br-[8px] rounded-tr-[8px]" : ""
            }`}
            style={{ zIndex: isActive ? 7 : PERSONAS.length - i }}
          >
            {icon}
            <span
              className={`font-sans font-medium leading-[24px] text-[16px] whitespace-nowrap ${
                isActive ? "text-blue-400" : "text-neutral-300"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function GreetingHeader({
  greeting = "Good afternoon",
  name = "Sharon",
  activePersona,
  onPersonaChange,
  className = "",
}: {
  greeting?: string;
  name?: string;
  /** Controlled active persona; omit to drive it from the demo store */
  activePersona?: Persona;
  onPersonaChange?: (persona: Persona) => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-[16px] items-center justify-between w-full ${className}`}>
      <div className="flex gap-[16px] items-center min-w-0">
        <h1 className="font-sans font-bold leading-[32px] text-text-primary text-[24px] whitespace-nowrap">
          {greeting}, {name}
        </h1>
        <div className="relative shrink-0 size-[32px]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/greeting-sun.svg" />
        </div>
      </div>
      <PersonaSwitcher active={activePersona} onSelect={onPersonaChange} />
    </div>
  );
}

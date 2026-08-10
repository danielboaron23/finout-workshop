import type { ReactNode } from "react";

export type KpiTrend = "down" | "up";

export type KpiCardProps = {
  title: string;
  caption: ReactNode;
  icon: ReactNode;
  value: string;
  delta?: { trend: KpiTrend; value: string };
  previous?: string;
  cta: string;
  className?: string;
};

export function KpiTileDollar() {
  return (
    <div className="relative shrink-0 size-[50px]">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/kpi-tile-dollar.svg" />
    </div>
  );
}

function Tile({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#eff8ff] flex flex-col items-center justify-center px-[7.952px] py-[8.835px] relative rounded-[8px] shrink-0 size-[50px]">
      {children}
    </div>
  );
}

export function KpiTileChartLine() {
  return (
    <Tile>
      <div className="relative rounded-[8px] shrink-0 size-[24px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/kpi-icon-base-24.svg" />
        <div className="absolute inset-[18.75%_12.5%]">
          <div className="absolute inset-[-6.67%_-5.56%]">
            <img alt="" className="block max-w-none size-full" src="/icons/home/chart-line-1.svg" />
          </div>
        </div>
        <div className="absolute inset-[37.5%_12.5%]">
          <div className="absolute inset-[-16.67%_-5.56%]">
            <img alt="" className="block max-w-none size-full" src="/icons/home/chart-line-2.svg" />
          </div>
        </div>
      </div>
    </Tile>
  );
}

export function KpiTileWavyCheck() {
  return (
    <Tile>
      <div className="relative rounded-[8px] shrink-0 size-[24px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/kpi-icon-base-24.svg" />
        <div className="absolute inset-[9.38%]">
          <div className="absolute inset-[-5.13%]">
            <img alt="" className="block max-w-none size-full" src="/icons/home/wavy-check-1.svg" />
          </div>
        </div>
        <div className="absolute inset-[40.63%_32.81%_37.5%_32.81%]">
          <div className="absolute inset-[-19.05%_-12.12%]">
            <img alt="" className="block max-w-none size-full" src="/icons/home/wavy-check-2.svg" />
          </div>
        </div>
      </div>
    </Tile>
  );
}

export function KpiTileAnomaly() {
  return (
    <Tile>
      <div className="relative rounded-[8px] shrink-0 size-[24px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/kpi-icon-base-24.svg" />
        <div className="absolute bottom-[26.56%] left-[12.5%] right-[10.94%] top-1/4">
          <div className="absolute inset-[-8.6%_-5.44%]">
            <img alt="" className="block max-w-none size-full" src="/icons/home/anomaly-line.svg" />
          </div>
        </div>
      </div>
    </Tile>
  );
}

export function InfoIcon16() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/info-base-16.svg" />
      <div className="absolute inset-[12.5%]">
        <div className="absolute inset-[-6.25%]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/info-1.svg" />
        </div>
      </div>
      <div className="absolute inset-[46.88%_46.88%_31.25%_46.88%]">
        <div className="absolute inset-[-21.43%_-75%]">
          <img alt="" className="block max-w-none size-full" src="/icons/home/info-2.svg" />
        </div>
      </div>
      <div className="absolute inset-[28.13%_46.09%_62.5%_44.53%]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/info-3.svg" />
      </div>
    </div>
  );
}

function TrendIcon({ trend }: { trend: KpiTrend }) {
  return (
    <div className="relative shrink-0 size-[20px]">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/trend-base-20.svg" />
      {trend === "down" ? (
        <>
          <div className="absolute inset-[28.13%_9.38%_21.88%_9.38%]">
            <div className="absolute inset-[-10%_-6.15%]">
              <img alt="" className="block max-w-none size-full" src="/icons/home/trend-down-1.svg" />
            </div>
          </div>
          <div className="absolute inset-[53.13%_9.38%_21.88%_65.63%]">
            <div className="absolute inset-[-20%]">
              <img alt="" className="block max-w-none size-full" src="/icons/home/trend-down-2.svg" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-[21.88%_9.38%_28.13%_9.38%]">
            <div className="absolute inset-[-7.5%_-4.62%]">
              <img alt="" className="block max-w-none size-full" src="/icons/home/trend-up-1.svg" />
            </div>
          </div>
          <div className="absolute inset-[21.88%_9.38%_53.13%_65.63%]">
            <div className="absolute inset-[-20%]">
              <img alt="" className="block max-w-none size-full" src="/icons/home/trend-up-2.svg" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function KpiCard({ title, caption, icon, value, delta, previous, cta, className = "" }: KpiCardProps) {
  return (
    <div
      className={`@container bg-white border border-solid border-[#eaecf0] drop-shadow-[0px_1px_1px_rgba(16,24,40,0.06),0px_1px_1.5px_rgba(16,24,40,0.1)] flex flex-col gap-[16px] px-[16px] py-[24px] rounded-[8px] ${className}`}
    >
      <div className="flex flex-col gap-[12px] items-start w-full">
        <div className="flex gap-[12px] items-center w-full">
          {icon}
          <div className="flex flex-col gap-[2px] items-start min-w-0">
            {/* Canonical widget-title typography (18/26 — sized so the longest
                title fits one line in an equal-width card); same on every title */}
            <div className="font-sans font-medium leading-[26px] text-[#101828] text-[18px]">
              {title}
            </div>
            <div className="flex gap-[2px] items-center font-sans leading-[20px] text-[#475467] text-[12px] whitespace-nowrap">
              {caption}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[8px] items-start w-full">
          <div className="flex flex-wrap gap-[8px] items-center">
            <div className="font-sans font-bold leading-[32px] text-[#101828] text-[24px] whitespace-nowrap">
              {value}
            </div>
            {delta && (
              <div className="flex gap-[6px] items-center py-[2px] rounded-[8px]">
                <TrendIcon trend={delta.trend} />
                <span
                  className={`font-sans font-bold leading-[28px] text-[20px] whitespace-nowrap ${
                    delta.trend === "down" ? "text-[#027a48]" : "text-[#d92d20]"
                  }`}
                >
                  {delta.value}
                </span>
              </div>
            )}
          </div>
          {previous && (
            <div className="font-sans leading-[22px] text-[#101828] text-[14px] whitespace-nowrap">{previous}</div>
          )}
        </div>
      </div>
      <button className="bg-white border border-solid border-[#d0d5dd] flex gap-[8px] items-center justify-center mt-auto overflow-clip px-[14px] py-[7px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full cursor-pointer">
        <span className="font-inter font-semibold leading-[20px] text-[#344054] text-[14px] whitespace-nowrap">
          {cta}
        </span>
      </button>
    </div>
  );
}

const DEFAULT_CARDS: KpiCardProps[] = [
  {
    title: "Monthly cloud spend",
    caption: <span>Time frame: Current Month</span>,
    icon: <KpiTileDollar />,
    value: "$15,596",
    delta: { trend: "down", value: "7%" },
    previous: "$16,687 in previous month",
    cta: "Investigate in MegaBill",
  },
  {
    title: "Avg. daily spend",
    caption: <span>Time frame: Current Month</span>,
    icon: <KpiTileDollar />,
    value: "$520",
    delta: { trend: "down", value: "7%" },
    previous: "$556 in previous month",
    cta: "Investigate in MegaBill",
  },
  {
    title: "Projected monthly spend",
    caption: <span>Projection Period: Current Month</span>,
    icon: <KpiTileChartLine />,
    value: "$356,387",
    delta: { trend: "up", value: "3%" },
    previous: "$345,695 in previous month",
    cta: "Investigate in MegaBill",
  },
  {
    title: "Monthly potential savings",
    caption: (
      <>
        <span>Time resolution: </span>
        <span className="bg-[#f2f4f7] flex items-center px-[6px] rounded-[8px]">
          <span className="font-medium text-[#101828]">Monthly</span>
        </span>
        <InfoIcon16 />
      </>
    ),
    icon: <KpiTileWavyCheck />,
    value: "$26,802",
    cta: "Go to CostGuard",
  },
  {
    title: "Anomalies",
    caption: <span>Time frame: Last 7 Days</span>,
    icon: <KpiTileAnomaly />,
    value: "7",
    cta: "Go to Anomalies",
  },
];

export function KpiCardsRow({ cards = DEFAULT_CARDS, className = "" }: { cards?: KpiCardProps[]; className?: string }) {
  return (
    // Equal-width cards that fill the full row (like Figma); the card's
    // container query scales its title so text always fits inside
    <div className={`grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[24px] items-stretch w-full ${className}`}>
      {cards.map((card) => (
        <KpiCard key={card.title} {...card} className="w-full" />
      ))}
    </div>
  );
}

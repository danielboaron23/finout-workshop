import type { ReactNode } from "react";

/*
 * Home dashboard product shortcut cards ("Frame 1000005014").
 * Figma: Home page → .local_homepage_content → Frame 1000005014 (1652x230):
 * Financial Plans / Virtual Tags / Dashboards / Cost Centers.
 * Icons sit in 50px light-blue (#eff8ff) rounded tiles; CTA is the
 * Figma widget button (white, #d0d5dd border, Inter Semi Bold #344054).
 */

function Tile({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#eff8ff] flex flex-col items-center justify-center px-[7.952px] py-[8.835px] relative rounded-[8px] shrink-0 size-[50px]">
      {children}
    </div>
  );
}

/** pie-chart-01 (Financial Plans) */
export function ProductIconPieChart() {
  return (
    <Tile>
      <div className="relative shrink-0 size-[24px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/pie-chart-01.svg" />
      </div>
    </Tile>
  );
}

/** Tag (Virtual Tags) */
export function ProductIconTag() {
  return (
    <Tile>
      <div className="relative rounded-[8px] shrink-0 size-[24px]">
        <div className="absolute inset-[10.06%_7.55%_7.55%_10.06%]">
          <div className="absolute inset-[-3.79%]">
            <img alt="" className="block max-w-none size-full" src="/icons/home/tag-vector-1.svg" />
          </div>
        </div>
        <div className="absolute inset-[28.13%_62.5%_62.5%_28.13%]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src="/icons/home/tag-vector-2.svg" />
        </div>
      </div>
    </Tile>
  );
}

/** SquaresFour (Dashboards) */
export function ProductIconSquaresFour() {
  return (
    <Tile>
      <div className="relative rounded-[8px] shrink-0 size-[24px]">
        <div className="absolute inset-[18.75%_56.25%_62.5%_18.75%]">
          <div className="absolute inset-[-16.67%_-12.5%]">
            <img alt="" className="block max-w-none size-full" src="/icons/home/squares-vector-1.svg" />
          </div>
        </div>
        <div className="absolute bottom-1/2 left-[56.25%] right-[18.75%] top-[18.75%]">
          <div className="absolute inset-[-10%_-12.5%]">
            <img alt="" className="block max-w-none size-full" src="/icons/home/squares-vector-2.svg" />
          </div>
        </div>
        <div className="absolute bottom-[18.75%] left-[18.75%] right-[56.25%] top-1/2">
          <div className="absolute inset-[-10%_-12.5%]">
            <img alt="" className="block max-w-none size-full" src="/icons/home/squares-vector-2.svg" />
          </div>
        </div>
        <div className="absolute inset-[62.5%_18.75%_18.75%_56.25%]">
          <div className="absolute inset-[-16.67%_-12.5%]">
            <img alt="" className="block max-w-none size-full" src="/icons/home/squares-vector-1.svg" />
          </div>
        </div>
      </div>
    </Tile>
  );
}

/** LinkSimpleHorizontal (Cost Centers) */
export function ProductIconLink() {
  return (
    <Tile>
      <div className="relative rounded-[8px] shrink-0 size-[24px]">
        <div className="absolute bottom-1/2 left-[31.25%] right-[31.25%] top-1/2">
          <div className="absolute inset-[-1px_-11.11%]">
            <img alt="" className="block max-w-none size-full" src="/icons/home/link-vector-1.svg" />
          </div>
        </div>
        <div className="absolute inset-[31.25%_59.38%_31.25%_6.25%]">
          <div className="absolute inset-[-11.11%_-12.12%]">
            <img alt="" className="block max-w-none size-full" src="/icons/home/link-vector-2.svg" />
          </div>
        </div>
        <div className="absolute inset-[31.25%_6.25%_31.25%_59.38%]">
          <div className="absolute inset-[-11.11%_-12.12%]">
            <img alt="" className="block max-w-none size-full" src="/icons/home/link-vector-3.svg" />
          </div>
        </div>
      </div>
    </Tile>
  );
}

/** Figma widget CTA button (white, #d0d5dd border, Inter Semi Bold #344054) */
export function WidgetButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <button
      className={`bg-white border border-solid border-[#d0d5dd] flex gap-[8px] items-center justify-center overflow-clip px-[14px] py-[8px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full cursor-pointer ${className}`}
    >
      <span className="font-inter font-semibold leading-[20px] text-[#344054] text-[14px] whitespace-nowrap">
        {children}
      </span>
    </button>
  );
}

export type ProductCardProps = {
  icon: ReactNode;
  title: string;
  count: string;
  description: string;
  cta: string;
  className?: string;
};

export function ProductCard({ icon, title, count, description, cta, className = "" }: ProductCardProps) {
  return (
    <div
      className={`bg-white border border-solid border-[#eaecf0] drop-shadow-[0px_1px_1px_rgba(16,24,40,0.06),0px_1px_1.5px_rgba(16,24,40,0.1)] flex flex-1 flex-col gap-[32px] items-start justify-center min-w-[280px] px-[16px] py-[24px] rounded-[8px] ${className}`}
    >
      <div className="bg-white flex flex-col h-[114px] items-start w-full">
        <div className="flex flex-col gap-[12px] items-start w-full">
          <div className="flex gap-[12px] items-center">
            {icon}
            <div className="flex flex-col gap-[2px] items-start">
              <p className="font-sans font-medium leading-[28px] text-[#101828] text-[20px] whitespace-nowrap">
                {title}
              </p>
              <p className="font-sans font-normal leading-[22px] text-[#475467] text-[14px] whitespace-nowrap">
                {count}
              </p>
            </div>
          </div>
          <p className="font-sans font-normal leading-[22px] text-[#475467] text-[14px]">{description}</p>
        </div>
      </div>
      <WidgetButton>{cta}</WidgetButton>
    </div>
  );
}

export const DEFAULT_PRODUCT_CARDS: ProductCardProps[] = [
  {
    icon: <ProductIconPieChart />,
    title: "Financial Plans",
    count: "0 Plans",
    description: "Plan annual cloud budgets and control costs with Finout",
    cta: "Go to Financial Plans",
  },
  {
    icon: <ProductIconTag />,
    title: "Virtual Tags",
    count: "50 Tags",
    description: "Unify cloud cost management with Finout’s dynamic Virtual Tags",
    cta: "Go to Virtual Tags",
  },
  {
    icon: <ProductIconSquaresFour />,
    title: "Dashboards",
    count: "30 Dashboards",
    description: "Customize cloud cost dashboards to visualize, analyze, and optimize spend.",
    cta: "Go to Dashboards",
  },
  {
    icon: <ProductIconLink />,
    title: "Cost Centers",
    count: "8 Cost Centers",
    description: "Integrate cloud providers and services",
    cta: "Add Cost Centers",
  },
];

export function ProductCardsRow({ cards = DEFAULT_PRODUCT_CARDS }: { cards?: ProductCardProps[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[32px] items-stretch w-full">
      {cards.map((card) => (
        <ProductCard key={card.title} {...card} />
      ))}
    </div>
  );
}

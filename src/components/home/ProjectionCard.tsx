import type { ReactNode } from "react";
import { WidgetButton } from "./ProductCard";

/*
 * "Year-end cost projection" cards ("Projectes costs", 1652x232).
 * Figma: Home page → .local_homepage_content → Projectes costs → Trend projection numerics.
 * 4 cards: AWS / Google Cloud / Azure / OpenAI — provider logo in a 50px tile,
 * centered "Total Trend Projection" label + big value, full-width widget CTA.
 */

export function AwsLogo() {
  return (
    <div className="overflow-clip relative rounded-[3px] shrink-0 size-[50px]">
      <div className="absolute inset-[29.17%_15.69%_28.28%_12.5%]">
        <img alt="AWS" className="absolute block inset-0 max-w-none size-full" src="/images/home/aws-logo.svg" />
      </div>
    </div>
  );
}

export function GcpLogo() {
  return (
    <div className="overflow-clip relative rounded-[3px] shrink-0 size-[50px]">
      <div className="absolute inset-[11.67%]">
        <img
          alt="Google Cloud"
          className="absolute block inset-0 max-w-none size-full"
          src="/images/home/gcp-logo.svg"
        />
      </div>
    </div>
  );
}

export function AzureLogo() {
  return (
    <div className="overflow-clip relative rounded-[3px] shrink-0 size-[50px]">
      <div className="absolute inset-[16.67%_12.58%_16.67%_16.67%]">
        <img alt="Azure" className="absolute block inset-0 max-w-none size-full" src="/images/home/azure-logo.svg" />
      </div>
    </div>
  );
}

export function OpenAiLogo() {
  return (
    <div className="overflow-clip relative rounded-[6px] shrink-0 size-[50px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[36px] top-1/2">
        <img alt="OpenAI" className="absolute block inset-0 max-w-none size-full" src="/images/home/openai-logo.svg" />
      </div>
    </div>
  );
}

export type ProjectionCardProps = {
  logo: ReactNode;
  title?: string;
  caption?: string;
  label?: string;
  value: string;
  cta: string;
  className?: string;
};

export function ProjectionCard({
  logo,
  title = "Year-end cost projection",
  caption = "Projection Period: Current Year",
  label = "Total Trend Projection",
  value,
  cta,
  className = "",
}: ProjectionCardProps) {
  return (
    <div
      className={`@container bg-white border border-solid border-[#eaecf0] drop-shadow-[0px_1px_1px_rgba(16,24,40,0.06),0px_1px_1.5px_rgba(16,24,40,0.1)] flex w-full flex-col min-h-[232px] items-start p-[16px] rounded-[8px] ${className}`}
    >
      <div className="flex flex-1 flex-col items-start justify-between min-h-px w-full">
        <div className="flex gap-[12px] items-center">
          {logo}
          <div className="flex flex-col gap-[2px] items-start min-w-0">
            <p className="font-sans font-medium text-[#101828] text-[15px] leading-[22px] @[300px]:text-[17px] @[300px]:leading-[24px] @[310px]:text-[18px] @[310px]:leading-[26px] @[340px]:text-[20px] @[340px]:leading-[28px]">
              {title}
            </p>
            <p className="font-sans font-normal leading-[20px] text-[#475467] text-[12px] whitespace-nowrap">
              {caption}
            </p>
          </div>
        </div>
        <div className="flex flex-1 gap-[38px] items-center justify-center min-h-px w-full">
          <div className="flex flex-col gap-[8px] h-[78px] items-start whitespace-nowrap">
            <p className="font-sans font-normal leading-[22px] text-[#475467] text-[14px]">{label}</p>
            <p className="font-sans font-bold leading-[32px] text-[#101828] text-[24px]">{value}</p>
          </div>
        </div>
        <WidgetButton>{cta}</WidgetButton>
      </div>
    </div>
  );
}

export const DEFAULT_PROJECTION_CARDS: ProjectionCardProps[] = [
  { logo: <AwsLogo />, value: "$1,233,539", cta: "Go to AWS dashboard" },
  { logo: <GcpLogo />, value: "$267,732", cta: "Go to GCP dashboard" },
  { logo: <AzureLogo />, value: "$367,123", cta: "Go to Azure dashboard" },
  { logo: <OpenAiLogo />, value: "$152,125", cta: "Go to OpenAI dashboard" },
];

export function ProjectionCardsRow({ cards = DEFAULT_PROJECTION_CARDS }: { cards?: ProjectionCardProps[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[32px] items-stretch w-full">
      {cards.map((card) => (
        <ProjectionCard key={card.cta} {...card} />
      ))}
    </div>
  );
}

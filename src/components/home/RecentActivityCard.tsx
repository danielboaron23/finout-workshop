import { Fragment } from "react";
import { WidgetCard, WidgetTitle } from "./CostCentersCard";

/*
 * "Recent activity" widget — right card of the home page's bottom 3-widget row
 * (Figma "Frame 1000005011" → third widget). Feed of avatar photo + name,
 * relative time, and action line, separated by 1px #eaecf0 rules.
 * Avatar photos are transparent-background cutouts on a pastel circle.
 */

export type ActivityItem = {
  name: string;
  time: string;
  action: string;
  /** raster avatar photo (transparent bg), e.g. /images/home/avatar-george.png */
  avatarSrc: string;
  /** circle background behind the cutout photo */
  avatarBg: string;
};

export type RecentActivityCardProps = {
  title?: string;
  items?: ActivityItem[];
};

const GEORGE = { avatarSrc: "/images/home/avatar-george.png", avatarBg: "#d1dfc3" };
const LOKI = { avatarSrc: "/images/home/avatar-loki.png", avatarBg: "#b9cfd0" };

const DEFAULT_ITEMS: ActivityItem[] = [
  { name: "George Young", time: "2 minutes ago", action: "Updated a dashboard", ...GEORGE },
  { name: "Loki Bright", time: "52 minutes ago", action: "Created a financial plan", ...LOKI },
  { name: "Loki Bright", time: "1 hour", action: "Deleted a virtual tag", ...LOKI },
  { name: "George Young", time: "1 day ago", action: "Updated a scheduled report", ...GEORGE },
  { name: "George Young", time: "1 week ago", action: "Updated a financial plan", ...GEORGE },
];

function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <div className="flex gap-[12px] h-[50px] items-center w-full">
      <div
        className="overflow-clip relative rounded-full shrink-0 size-[40px]"
        style={{ backgroundColor: item.avatarBg }}
      >
        <img alt={item.name} className="absolute block inset-0 max-w-none object-cover size-full" src={item.avatarSrc} />
      </div>
      <div className="flex flex-col gap-[4px] items-start min-w-0">
        <div className="flex gap-[16px] items-baseline min-w-0">
          <p className="font-sans font-medium leading-[24px] text-[#101828] text-[16px] whitespace-nowrap">{item.name}</p>
          <p className="font-sans font-normal leading-[22px] text-[#475467] text-[14px] whitespace-nowrap">{item.time}</p>
        </div>
        <p className="font-sans font-normal leading-[22px] text-[#475467] text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">
          {item.action}
        </p>
      </div>
    </div>
  );
}

export function RecentActivityCard({ title = "Recent activity", items = DEFAULT_ITEMS }: RecentActivityCardProps) {
  return (
    <WidgetCard className="h-full">
      <div className="flex flex-col gap-[16px] items-start w-full">
        <WidgetTitle>{title}</WidgetTitle>
        <div className="flex flex-col gap-[16px] items-start w-full">
          {items.map((item, i) => (
            <Fragment key={`${item.name}-${item.time}`}>
              {i > 0 && <div className="bg-[#eaecf0] h-px shrink-0 w-full" />}
              <ActivityRow item={item} />
            </Fragment>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}

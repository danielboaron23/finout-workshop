import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TopNav } from "./TopNav";
import { PageTitleBar } from "./PageTitleBar";
import { Tabs } from "./Tabs";
import { BackLink } from "@/components/anomaly-form/BackLink";
import { Toaster, showToast } from "@/components/ui/Toast";

const meta = {
  title: "Organisms/Navigation Bars",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The three stacked header bars that top every list screen — Figma nodes 0:75861 (Top nav), 0:75862 (2nd level page title) and 0:75863 (3rd level tabs), each 68px tall on a white surface. TopNav's \"Share Link\" copies the current URL to the clipboard and confirms with a toast, the home icon is a real Next link to `/`, and the bar supports a `compact` variant (home + avatar + chevron only) plus a `left` slot used by the anomaly form for its \"Back to Anomalies\" link. Tabs are controlled via `activeIndex`/`onTabChange` (active tab gets a 2px #1570ef bottom border and each tab carries a gray Geist counter pill); FullHeader shows the composed three-bar stack exactly as the Virtual Tags screen uses it.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const TopNavBar: Story = {
  render: () => (
    <>
      <TopNav />
      <Toaster />
    </>
  ),
};

export const TopNavCompact: Story = {
  render: () => <TopNav compact />,
};

export const TopNavWithBackLink: Story = {
  render: () => (
    <>
      <TopNav
        compact
        left={<BackLink onClick={() => showToast("Would navigate back to /anomalies")} />}
      />
      <Toaster />
    </>
  ),
};

export const PageTitle: Story = {
  render: () => <PageTitleBar title="Virtual Tags" linkLabel="Learn about Virtual Tags" />,
};

const TABS = [
  { label: "All", count: 73 },
  { label: "Custom Virtual Tags", count: 40 },
  { label: "Finout Virtual Tags", count: 25 },
];

function InteractiveTabs() {
  const [active, setActive] = useState(0);
  return <Tabs items={TABS} activeIndex={active} onTabChange={setActive} />;
}

export const TabsBar: Story = {
  render: () => <InteractiveTabs />,
};

export const FullHeader: Story = {
  render: () => (
    <div className="flex flex-col w-full">
      <TopNav />
      <PageTitleBar title="Virtual Tags" linkLabel="Learn about Virtual Tags" />
      <Tabs items={TABS} />
      <Toaster />
    </div>
  ),
};

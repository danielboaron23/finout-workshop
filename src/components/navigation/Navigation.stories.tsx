import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TopNav } from "./TopNav";
import { PageTitleBar } from "./PageTitleBar";
import { Tabs } from "./Tabs";

const meta = {
  title: "Navigation/Bars",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const TopNavBar: Story = {
  render: () => <TopNav />,
};

export const PageTitle: Story = {
  render: () => <PageTitleBar title="Virtual Tags" linkLabel="Learn about Virtual Tags" />,
};

export const TabsBar: Story = {
  render: () => (
    <Tabs
      items={[
        { label: "All", count: 73 },
        { label: "Custom Virtual Tags", count: 40 },
        { label: "Finout Virtual Tags", count: 25 },
      ]}
      activeIndex={0}
    />
  ),
};

export const FullHeader: Story = {
  render: () => (
    <div className="flex flex-col w-full">
      <TopNav />
      <PageTitleBar title="Virtual Tags" linkLabel="Learn about Virtual Tags" />
      <Tabs
        items={[
          { label: "All", count: 73 },
          { label: "Custom Virtual Tags", count: 40 },
          { label: "Finout Virtual Tags", count: 25 },
        ]}
      />
    </div>
  ),
};

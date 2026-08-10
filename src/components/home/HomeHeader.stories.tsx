import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HomeTopBar } from "./HomeTopBar";
import { GreetingHeader } from "./GreetingHeader";

const meta = {
  title: "Organisms/Home Header",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Header organisms of the Home overview screen — Figma \"Home page\" → top bar + greeting block. HomeTopBar is the slim 47px utility strip (currency + user menu, reproduced from the Figma export images). GreetingHeader greets the user and carries the persona switcher (FinOps / Engineer / Finance / Executive) whose selection is stored in the demo store and re-tailors the dashboard content below it. The KPI cards row that sits under this header is documented separately under Molecules/KPI Card.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const TopBar: Story = {
  render: () => <HomeTopBar />,
};

export const Greeting: Story = {
  render: () => (
    <div className="bg-white p-[24px]">
      <GreetingHeader />
    </div>
  ),
};

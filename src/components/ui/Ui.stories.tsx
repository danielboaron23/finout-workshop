import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button, ChevronDown16 } from "./Button";
import { SearchInput } from "./Input";
import { Select } from "./Select";

const meta = {
  title: "UI/Form Controls",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Buttons: Story = {
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <Button variant="primary">
        Create Virtual Tag
        <ChevronDown16 white />
      </Button>
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link button</Button>
    </div>
  ),
};

export const Inputs: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <SearchInput placeholder="Search" />
      <Select label="Folders" />
    </div>
  ),
};

export const TableActionsRow: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="bg-surface-primary flex items-center justify-center p-[24px] w-full">
      <div className="flex flex-1 items-center justify-between min-w-px">
        <div className="flex gap-[8px] items-center">
          <SearchInput placeholder="Search" />
          <Select label="Folders" />
        </div>
        <Button variant="primary">
          Create Virtual Tag
          <ChevronDown16 white />
        </Button>
      </div>
    </div>
  ),
};

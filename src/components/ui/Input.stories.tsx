import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchInput } from "./Input";
import { Select } from "./Select";
import { Button, ChevronDown16 } from "./Button";

const meta = {
  title: "Molecules/Search Input",
  component: SearchInput,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Search field mapped to the Figma **Input** component (0:75867 instance): white field, `#eaecf0` border, 8px radius, 40px min height, 16px search icon, and Geist (`font-geist`) 14/20 text with `#475467` placeholder. Works uncontrolled by default, or controlled via `value` + `onChange` — the FolderMenu uses the controlled mode to live-filter its folder list. Default width is 350px (the table-toolbar size) with a 200px minimum.",
      },
    },
  },
  argTypes: {
    placeholder: { control: "text" },
    width: { control: { type: "number", min: 200, max: 600, step: 10 } },
    value: { control: false },
    onChange: { control: false },
  },
  args: { placeholder: "Search", width: 350 },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Uncontrolled toolbar search at the default 350px width. */
export const Default: Story = {};

/** Narrow variant — the 326px size used inside the FolderMenu popover. */
export const MenuWidth: Story = {
  args: { width: 326, placeholder: "Search" },
};

const TAGS = ["Kubernetes", "Data Platform", "Streaming", "ML Training", "Databases", "Networking"];

function FilteringDemo() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = q === "" ? TAGS : TAGS.filter((t) => t.toLowerCase().includes(q));
  return (
    <div className="flex flex-col gap-[12px] items-start">
      <SearchInput placeholder="Search tags" value={query} onChange={setQuery} />
      <ul className="flex flex-col gap-[4px]">
        {visible.map((t) => (
          <li key={t} className="font-sans font-normal leading-[20px] text-[14px] text-text-primary">
            {t}
          </li>
        ))}
        {visible.length === 0 && (
          <li className="font-sans font-normal leading-[20px] text-[14px] text-[#475467]">No results</li>
        )}
      </ul>
    </div>
  );
}

export const ControlledFiltering: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Controlled mode (`value` + `onChange`): typing live-filters the list below — the exact pattern the FolderMenu popover uses for its folder list.",
      },
    },
  },
  render: () => <FilteringDemo />,
};

export const TableToolbar: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "In context: the Virtual Tags table actions row — search + Folders select on the left, primary split CTA on the right.",
      },
    },
  },
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

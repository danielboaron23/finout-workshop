import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "./Select";
import { FolderSelect } from "./FolderSelect";
import { showToast, Toaster } from "./Toast";

const meta = {
  title: "Molecules/Select",
  component: Select,
  subcomponents: { FolderSelect },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Select trigger mapped to the Figma **Select & Combobox** component (0:75868 instance) — the same field chrome as the Input (white, `#eaecf0` border, 8px radius, 40px min height) with a Geist 14 label and `ChevronDown16`. `Select` on its own is just the trigger; `FolderSelect` composes it with the **Menu** popover (0:75885): clicking opens the FolderMenu left-aligned 8px below the trigger (never statically overlaid), picking a folder updates the trigger label, and picking it again clears the filter.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    width: { control: { type: "number", min: 100, max: 400, step: 10 } },
    onClick: { control: false },
  },
  args: { label: "Folders", width: 140 },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The bare trigger at its default 140px toolbar width. */
export const Default: Story = {};

/** Wider trigger with a contextual label. */
export const CustomWidth: Story = {
  args: { label: "Group by: Service", width: 200 },
};

const FOLDERS = ["Kubernetes", "Data Platform", "Streaming", "ML Training", "Databases", "Networking"];

function FolderSelectDemo() {
  const [folder, setFolder] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-[12px] items-start">
      <FolderSelect
        folders={FOLDERS}
        value={folder}
        onChange={setFolder}
        onNewFolder={() => showToast("New folder flow is next in the workshop")}
      />
      <p className="font-sans font-normal leading-[20px] text-[14px] text-[#475467]">
        Active folder filter: {folder ?? "none"}
      </p>
      <Toaster />
    </div>
  );
}

export const WithFolderMenu: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Click the trigger to open the FolderMenu dropdown (left-aligned, 8px below — per the design contract it is never statically overlaid on the table). The popover's search live-filters the folder list; selecting a folder puts its name on the trigger, re-selecting it clears back to “Folders”, and “New folder” fires its callback (a toast here).",
      },
    },
  },
  render: () => <FolderSelectDemo />,
  decorators: [
    (Story) => (
      <div style={{ minHeight: 420 }}>
        <Story />
      </div>
    ),
  ],
};

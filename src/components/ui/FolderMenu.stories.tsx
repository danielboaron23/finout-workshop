import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FolderMenu } from "./FolderMenu";
import { Toaster, showToast } from "./Toast";

const FOLDERS = [
  "Folder name",
  "Marketing",
  "Platform team",
  "Data engineering",
  "FinOps squad",
  "Shared dashboards",
  "Archive",
];

const meta = {
  title: "Organisms/Folder Menu",
  component: FolderMenu,
  parameters: {
    docs: {
      description: {
        component:
          "Folder picker popover — Figma \"Menu\" (0:75885): a 350px card with a search input, a scrollable folder list and a separator + secondary \"New folder\" action. The search filters the list live as you type; folder rows fire `onSelect(name)` and the button fires `onNewFolder` (both wired to toasts here for demo). In the product it is a dropdown anchored to the \"Folders\" Select on the Virtual Tags screen — opened on click, left-aligned, 8px below the trigger — never statically overlaid on the table.",
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof FolderMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    folders: FOLDERS,
    onSelect: (name: string) => showToast(`Selected "${name}"`),
    onNewFolder: () => showToast("New folder created"),
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VirtualTagsScreen } from "./VirtualTagsScreen";

const meta = {
  title: "Screens/Virtual Tags",
  component: VirtualTagsScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Virtual Tags list and folders screen — a 1:1 rebuild of Figma node 0:75857. Fully interactive against the demo store (`vt-rows` / `vt-folders`): live search, count-badged tabs (All / Custom / Finout), a FolderSelect dropdown filter, and modified-date sorting all act on real row data. Full CRUD is wired in — the Create Virtual Tag split button adds tags or folders, and each row's menu supports inline rename, move to folder, and delete with an undo toast. Composes Sidebar, TopNav, PageTitleBar and Tabs above the Table organisms (TableShell, HeaderCell, Cell, CheckboxCell) plus SearchInput, FolderSelect, Badge, Avatar and Dropdown.",
      },
    },
  },
} satisfies Meta<typeof VirtualTagsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ height: "960px", display: "flex" }}>
      <VirtualTagsScreen />
    </div>
  ),
};

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dropdown, DropdownItem } from "./Dropdown";
import { Select } from "./Select";
import { Button, ChevronDown16 } from "./Button";

const meta = {
  title: "Atoms/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Generic dropdown/popover pair mapped to the Figma **Menu** chrome: white panel, `#eaecf0` border, 8px radius, md drop shadow, 12px padding. `Dropdown` renders any trigger as-is (the render-prop receives the open state), opens the panel 8px below aligned left or right, and closes on outside click. `DropdownItem` is the standard menu row — Helvetica Neue 14/20, `hover:bg-neutral-50`, and a selected state in `#eff8ff` / `#1570ef`. Composed by FolderSelect, table row menus, and the MegaBill toolbars.",
      },
    },
  },
  argTypes: {
    align: { control: "inline-radio", options: ["left", "right"] },
    trigger: { control: false },
    children: { control: false },
    panelClassName: { control: false },
  },
  args: {
    trigger: () => <Select label="Group by" width={160} />,
    children: (
      <div className="flex flex-col gap-[2px]">
        <DropdownItem>Service</DropdownItem>
        <DropdownItem>Account</DropdownItem>
        <DropdownItem>Region</DropdownItem>
        <DropdownItem>Team</DropdownItem>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 260 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click the trigger to open the Menu panel; click anywhere outside to close. */
export const Default: Story = {};

function SelectedDemo() {
  const [selected, setSelected] = useState("Service");
  return (
    <Dropdown trigger={() => <Select label={selected} width={160} />}>
      {(close) => (
        <div className="flex flex-col gap-[2px]">
          {["Service", "Account", "Region", "Team"].map((option) => (
            <DropdownItem
              key={option}
              selected={option === selected}
              onClick={() => {
                setSelected(option);
                close();
              }}
            >
              {option}
            </DropdownItem>
          ))}
        </div>
      )}
    </Dropdown>
  );
}

export const SelectedItem: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Single-select pattern: the panel receives a `close` callback via the children render-prop; the picked row shows the `#eff8ff` / `#1570ef` selected state and updates the trigger label.",
      },
    },
  },
  render: () => <SelectedDemo />,
};

export const RightAligned: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`align="right"` anchors the panel to the trigger\'s right edge — used for actions on the far end of a toolbar, so the menu never overflows the viewport.',
      },
    },
  },
  render: () => (
    <div className="flex justify-end">
      <Dropdown
        align="right"
        trigger={() => (
          <Button variant="tertiary">
            Actions
            <ChevronDown16 />
          </Button>
        )}
      >
        <div className="flex flex-col gap-[2px]">
          <DropdownItem>Rename</DropdownItem>
          <DropdownItem>Duplicate</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </div>
      </Dropdown>
    </div>
  ),
};

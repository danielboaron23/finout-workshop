import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ProjectionCard,
  ProjectionCardsRow,
  DEFAULT_PROJECTION_CARDS,
  AwsLogo,
  GcpLogo,
  AzureLogo,
  OpenAiLogo,
} from "./ProjectionCard";

const meta = {
  title: "Molecules/Projection Card",
  component: ProjectionCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Year-end cost projection card from the Home dashboard, mapped to Figma **"Projectes costs"** (1652×232) → Trend projection numerics. Same widget chrome as the other home cards (white, `#eaecf0` border, drop shadow, 8px radius, min-height 232px): a provider logo in a 50px tile, the shared 18/26 widget title with a 12px projection-period caption, a centered "Total Trend Projection" label over the 24px bold value, and a full-width WidgetButton CTA. Four provider cards — AWS, Google Cloud, Azure, OpenAI — form the equal-width row.',
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    caption: { control: "text" },
    label: { control: "text" },
    value: { control: "text" },
    cta: { control: "text" },
    logo: { control: false },
    className: { control: false },
  },
} satisfies Meta<typeof ProjectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const singleCardWidth = [
  (Story: ComponentType) => (
    <div style={{ maxWidth: 400 }}>
      <Story />
    </div>
  ),
];

/** AWS projection — logo tile + default title/caption/label props. */
export const Aws: Story = {
  args: { logo: <AwsLogo />, value: "$1,233,539", cta: "Go to AWS dashboard" },
  decorators: singleCardWidth,
};

/** Google Cloud projection. */
export const GoogleCloud: Story = {
  args: { logo: <GcpLogo />, value: "$267,732", cta: "Go to GCP dashboard" },
  decorators: singleCardWidth,
};

/** Azure projection. */
export const Azure: Story = {
  args: { logo: <AzureLogo />, value: "$367,123", cta: "Go to Azure dashboard" },
  decorators: singleCardWidth,
};

/** OpenAI projection — LLM spend is a first-class provider in Finout. */
export const OpenAi: Story = {
  args: { logo: <OpenAiLogo />, value: "$152,125", cta: "Go to OpenAI dashboard" },
  decorators: singleCardWidth,
};

export const FourCardRow: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "The full projection row (`ProjectionCardsRow` with `DEFAULT_PROJECTION_CARDS`): equal-width `minmax(280px,1fr)` grid columns that fill the row at any width.",
      },
    },
  },
  args: { ...DEFAULT_PROJECTION_CARDS[0] },
  render: () => (
    <div className="p-[24px]">
      <ProjectionCardsRow cards={DEFAULT_PROJECTION_CARDS} />
    </div>
  ),
};

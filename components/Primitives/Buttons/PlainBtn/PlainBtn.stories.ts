import { Meta, StoryObj } from '@storybook/react';
import PlainBtn, {ThemeColors} from './PlainBtn';


const meta = {
  title: 'Components/PlainBtn',
  component: PlainBtn,
  parameters: {
    layout: "centered",
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlainBtn>;
export default meta;

type Story = StoryObj<typeof meta>;

export const AllStyles: Story = {
  args: {
    text: "Text",
    iconName: "stopwatch",
    size: "m",
    style: "solid",
    color: "primary",
    enabled: true,
  },

};



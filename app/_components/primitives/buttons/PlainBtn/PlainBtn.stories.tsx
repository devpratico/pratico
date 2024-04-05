import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import PlainBtn from './PlainBtn';
import StopwatchIcon from '@/app/_components/icons/StopwatchIcon';


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
    children: <StopwatchIcon />,
    message: "Stop",
    size: "m",
    style: "solid",
    color: "primary",
    enabled: true,
  },

};



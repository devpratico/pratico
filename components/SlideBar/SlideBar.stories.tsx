import type { Meta, StoryObj } from '@storybook/react';
import SlideBar from './SlideBar';

const meta: Meta<typeof SlideBar> = {
    title: 'Composants/SlideBar',
    component: SlideBar,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SlideBar_: Story = {
    args: {
        children: 'SlideBar',
    },
};
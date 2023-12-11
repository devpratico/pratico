import type { Meta, StoryObj } from '@storybook/react';
import SlideBar from './SlideBar';

const meta: Meta<typeof SlideBar> = {
    title: 'Composants/Creation/SlideBar',
    component: SlideBar,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SlideBarStory: Story = {
    args: {
        children: 'SlideBar',
    },
};
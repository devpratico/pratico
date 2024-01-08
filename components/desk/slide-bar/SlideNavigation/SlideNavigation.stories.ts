import type { Meta, StoryObj } from '@storybook/react';
import SlideNavigation from './SlideNavigation';

const meta: Meta<typeof SlideNavigation> = {
    title: 'Composants/SlideNavigation',
    component: SlideNavigation,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SlideNavigation_: Story = {
    args: {
    },
};
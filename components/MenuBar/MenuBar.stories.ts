import type { Meta, StoryObj } from '@storybook/react';
import MenuBar from './MenuBar';

const meta: Meta<typeof MenuBar> = {
    title: 'Composants/MenuBar',
    component: MenuBar,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Creation: Story = {
    args: {
        mode: 'creation',
    },
};

export const Animation: Story = {
    args: {
        mode: 'animation',
    },
};


import type { Meta, StoryObj } from '@storybook/react';
import MenuBar from './MenuBar';

const meta: Meta<typeof MenuBar> = {
    title: 'Composants',
    component: MenuBar,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const MenuBar_: Story = {
    args: {
        mode: 'creation',
    },
};


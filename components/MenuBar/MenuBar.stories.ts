import type { Meta, StoryObj } from '@storybook/react';
import MenuBar from './MenuBar';

const meta: Meta<typeof MenuBar> = {
    title: 'Composants/MenuBar',
    component: MenuBar,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const MenuBarStory: Story = {
    args: {
        title: 'Titre',
    },
};
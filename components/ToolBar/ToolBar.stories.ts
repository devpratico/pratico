import type { Meta, StoryObj } from '@storybook/react';
import ToolBar from './ToolBar';

const meta: Meta<typeof ToolBar> = {
    title: 'Composants/Creation/ToolBar',
    component: ToolBar,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ToolBarStory: Story = {
    args: {
        //children: 'ToolBar',
    },
};
import type { Meta, StoryObj } from '@storybook/react';
import ToolBar from './ToolBar';

const meta: Meta<typeof ToolBar> = {
    title: 'Composants/ToolBar',
    component: ToolBar,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ToolBar_: Story = {
    args: {
        //children: 'ToolBar',
    },
};
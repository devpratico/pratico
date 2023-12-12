import type { Meta, StoryObj } from '@storybook/react';
import Dashboard from './Dashboard';

const meta: Meta<typeof Dashboard> = {
    title: 'Composants/Dashboard',
    component: Dashboard,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DashboardStory: Story = {
    args: {
        //children: 'ToolBar',
    },
};
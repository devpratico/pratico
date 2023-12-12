import type { Meta, StoryObj } from '@storybook/react';
import Dashboard from './Dashboard';

const meta: Meta<typeof Dashboard> = {
    title: 'Composants',
    component: Dashboard,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Dashboard_: Story = {
    args: {
        //children: 'ToolBar',
    },
};
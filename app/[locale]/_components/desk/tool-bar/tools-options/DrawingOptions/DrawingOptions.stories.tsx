import type { Meta, StoryObj } from '@storybook/react';
import DrawingOptions from './DrawingOptions';

const meta: Meta<typeof DrawingOptions> = {
    title: 'Composants',
    component: DrawingOptions,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DrawingOptions_: Story = {
    args: {
    },
};
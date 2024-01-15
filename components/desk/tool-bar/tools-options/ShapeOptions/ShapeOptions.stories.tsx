import type { Meta, StoryObj } from '@storybook/react';
import ShapeOptions from './ShapeOptions';

const meta: Meta<typeof ShapeOptions> = {
    title: 'Composants',
    component: ShapeOptions,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ShapeOptions_: Story = {
    args: {
    },
};
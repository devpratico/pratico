import type { Meta, StoryObj } from '@storybook/react';
import TextOptions from './TextOptions';

const meta: Meta<typeof TextOptions> = {
    title: 'Composants',
    component: TextOptions,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const TextOptions_: Story = {
    args: {
    },
};
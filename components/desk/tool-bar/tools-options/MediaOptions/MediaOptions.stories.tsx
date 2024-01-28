import type { Meta, StoryObj } from '@storybook/react';
import MediaOptions from './MediaOptions';

const meta: Meta<typeof MediaOptions> = {
    title: 'Composants',
    component: MediaOptions,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const MediaOptions_: Story = {
    args: {
    },
};
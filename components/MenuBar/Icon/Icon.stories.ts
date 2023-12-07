import type { Meta, StoryObj } from '@storybook/react';
import Icon from './Icon';

const meta: Meta<typeof Icon> = {
    title: 'Composants/MenuBar',
    component: Icon,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Bouton: Story = {
    args: {
        type: 'play',
        showLabel: true,
    },
};



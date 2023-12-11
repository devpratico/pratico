import type { Meta, StoryObj } from '@storybook/react';
import LabeledIcon from './LabeledIcon';

const meta: Meta<typeof LabeledIcon> = {
    title: 'Composants/MenuBar/Icons',
    component: LabeledIcon,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const LabeledIconStory: Story = {
    args: {
        type: 'play',
        label: 'Play',
    },
};



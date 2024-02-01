import type { Meta, StoryObj } from '@storybook/react';
import LabeledIcon from './LabeledIcon';
import HighlighterIcon from '@/components/icons/HighlighterIcon';

const meta: Meta<typeof LabeledIcon> = {
    title: 'Composants',
    component: LabeledIcon,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const LabeledIcon_: Story = {
    args: {
        icon:  <HighlighterIcon/>,
        iconSize: "lg",
        label: 'Highlighter',
        centered: true,
        gap: "0",
    },
};



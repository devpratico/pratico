import type { Meta, StoryObj } from '@storybook/react';
import Carousel from './Carousel';

const meta: Meta<typeof Carousel> = {
    title: 'Composants',
    component: Carousel,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Carousel_: Story = {
    args: {
    },
};
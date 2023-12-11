import type { Meta, StoryObj } from '@storybook/react';
import Carousel from './Carousel';

const meta: Meta<typeof Carousel> = {
    title: 'Composants/Creation/SlideBar',
    component: Carousel,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const CarouselStory: Story = {
    args: {
    },
};
import { Meta, StoryObj } from '@storybook/react';
import Modal from './Modal';


const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;
export default meta;

type Story = StoryObj<typeof meta>;

const button = <button>Click me</button>;

export const _Modal: Story = {
  args: {
    button: button,
    content: "This is a modal",
    position: 'right',
    overlayBlur: false,
    contentBlur: false,
  },

};



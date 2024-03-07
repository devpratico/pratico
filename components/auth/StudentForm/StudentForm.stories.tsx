import type { Meta, StoryObj } from '@storybook/react';
import StudentForm from './StudentForm';

const meta: Meta<typeof StudentForm> = {
    title: 'Composants/StudentForm',
    component: StudentForm,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const StudentForm_: Story = {
    args: {
    },
};
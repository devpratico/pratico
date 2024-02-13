import React from "react";
import type { Preview } from "@storybook/react";
import '../app/globals.css';
import '../app/colors.css';
import { luciole } from '../app/Fonts';


const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <main className={luciole.className}>
        <Story />
      </main>
    )
  ],
};

export default preview;

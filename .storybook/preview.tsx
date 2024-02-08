import React from "react";
import type { Preview } from "@storybook/react";
import '../app/[locale]/globals.css';
import '../app/[locale]/colors.css';
//import RootLayout from "../app/[locale]/layout";
import { luciole } from "../app/[locale]/layout";


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

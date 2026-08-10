import React from 'react'
import type { Preview } from '@storybook/nextjs-vite'
import { Inter } from 'next/font/google'
import '../src/app/globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className={`${inter.variable} contents`}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;

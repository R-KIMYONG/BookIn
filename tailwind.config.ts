import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],

  theme: {
    extend: {
      colors: {
        main: '#AF5858',

        appBg: '#ffffff',
      },
    },
  },

  darkMode: 'class',

  plugins: [],
};

export default config;

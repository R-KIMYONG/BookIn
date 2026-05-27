import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],

  theme: {
    extend: {
      colors: {
        main: '#AF5858',
        appBg: '#ffffff',
      },
      fontFamily: {
        sans: ['var(--font-noto-kr)', 'var(--font-noto-jp)', 'var(--font-noto-sc)', 'system-ui', 'sans-serif'],
      },
    },
  },

  darkMode: 'class',

  plugins: [],
};

export default config;

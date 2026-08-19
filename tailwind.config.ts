import type { Config } from 'tailwindcss';
import personas from './src/data/personas.json';

const personaColors = (personas as { color: string }[]).map((p) => p.color);

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  safelist: [...new Set(personaColors)],

  theme: {
    extend: {
      colors: {
        main: '#AF5858',
        appBg: '#ffffff',
      },
      fontFamily: {
        sans: ['var(--font-noto-kr)', 'var(--font-noto-jp)', 'var(--font-noto-sc)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'trophy-ring': {
          '0%,100%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(-14deg)' },
          '40%': { transform: 'rotate(10deg)' },
          '60%': { transform: 'rotate(-6deg)' },
          '80%': { transform: 'rotate(3deg)' },
        },
        flame: {
          '0%, 100%': { transform: 'scale(1) rotate(-3deg)', color: '#ef4444', fill: '#ef4444' },
          '20%': { transform: 'scale(1.12) rotate(3deg)' },
          '40%': { transform: 'scale(0.96) rotate(-2deg)' },
          '50%': { transform: 'scale(1.12) rotate(3deg)', color: '#f97316', fill: '#f97316' },
          '60%': { transform: 'scale(1.08) rotate(2deg)' },
          '80%': { transform: 'scale(1.02) rotate(-1deg)' },
        },
      },
      animation: {
        'trophy-ring': 'trophy-ring 0.6s ease-in-out',
        flame: 'flame 0.9s ease-in-out infinite',
      },
    },
  },

  darkMode: 'class',

  plugins: [],
};

export default config;

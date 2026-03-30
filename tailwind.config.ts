const { nextui } = require('@nextui-org/react');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: '#AF5858',
        appBg: '#ffffff',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};

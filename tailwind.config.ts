const { nextui } = require('@nextui-org/react');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}' // NextUI 테마 경로 추가
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        main: '#AF5858',
        primary: {
          DEFAULT: '#000000'
        },
        background: '#ffffff' // 적용 안 됨
      }
    }
  },
  darkMode: 'class',
  plugins: [nextui()]
};

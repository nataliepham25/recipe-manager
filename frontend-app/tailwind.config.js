/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF9F7',
        surface: '#FFFFFF',
        border: '#E8E4DF',
        accent: '#8B7355',
        text: {
          primary: '#1A1A1A',
          secondary: '#6B6560',
        },
        tag: {
          bg: '#F0EDE8',
          text: '#6B6560',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

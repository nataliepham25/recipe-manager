/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FDFAF7',
        surface:    '#FFFFFF',
        border:     '#E5DDD3',
        accent:     '#A0785A',
        hero:       '#F5EDE3',
        text: {
          primary:   '#2C1810',
          secondary: '#7A6355',
          muted:     '#B8967A',
        },
        tag: {
          bg:   '#F5EDE3',
          text: '#7A6355',
        },
      },
      fontFamily: {
        sans:  ['var(--font-inter)', 'sans-serif'],
        serif: ['Georgia', 'ui-serif', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

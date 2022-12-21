/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      // body
      xs: '.8rem',
      sm: '.9rem',
      base: '1rem',
      lg: '1.25rem',

      // headings
      xl: '1.5rem',
      '2xl': '2rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  plugins: [],
};

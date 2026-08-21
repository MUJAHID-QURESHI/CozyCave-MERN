/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#08453E',
          dark: '#052E29',
          light: '#0E6157',
        },
        cream: {
          DEFAULT: '#F7F5EF',
          deep: '#F0ECE1',
        },
        charcoal: {
          DEFAULT: '#2B2B27',
          soft: '#5B5B54',
        },
        gold: '#C9A15A',
        line: 'rgba(8, 69, 62, 0.12)',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'cozy': '0 20px 50px -20px rgba(8, 69, 62, 0.25)',
        'cozy-sm': '0 8px 24px -12px rgba(8, 69, 62, 0.18)',
      }
    },
  },
  plugins: [],
}

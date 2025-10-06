/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        saira: ['Saira', 'sans-serif'],
      },
      colors: {
        cream: '#f9f6ee',
        'cream-light': '#fffaf0',
      },
    },
  },
  plugins: [],
}
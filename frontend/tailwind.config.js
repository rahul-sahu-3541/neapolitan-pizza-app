/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-red': '#CA262D',
        'neo-red-dark': '#A31C22',
        'neo-cream': '#FFFBF2',
        'neo-charcoal': '#1A1A1A',
        'neo-green': '#2E7D32',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}

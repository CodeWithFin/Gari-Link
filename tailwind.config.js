/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0891b2', // cyan-600
        secondary: '#0f766e', // teal-700
        accent: '#f59e0b', // amber-500
      },
    },
  },
  plugins: [],
}

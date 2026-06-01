/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#181b22',
        'bg-light': '#232632',
        'accent-blue': '#7ec3e6',
        'accent-pink': '#e68cb7',
        'accent-purple': '#b6a6e6',
        'accent-green': '#72d275',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Arial', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

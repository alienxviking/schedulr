/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#0B0B10',
        'surface': '#16161D',
        'stroke': '#24242F',
        'primary': '#7B5CFF',
        'text-main': '#F2F2F7',
        'text-muted': '#9CA3AF',
        'positive': '#10B981',
        'warning': '#F59E0B',
      }
    },
  },
  plugins: [],
}
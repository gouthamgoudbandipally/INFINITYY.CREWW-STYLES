/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f8',
          500: '#e11d48',
          700: '#be123c',
          900: '#111827'
        }
      }
    }
  },
  plugins: []
};

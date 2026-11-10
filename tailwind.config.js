/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C9A227', // dorado principal
          dark: '#A8841A', // hover / bordes
          light: '#F5ECCF', // fondos suaves / badges
        },
        ink: '#2B2B2B', // texto (gris muy oscuro, no negro puro)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(43,43,43,0.04), 0 4px 16px rgba(201,162,39,0.08)',
        'card-hover': '0 2px 4px rgba(43,43,43,0.05), 0 10px 28px rgba(201,162,39,0.18)',
      },
    },
  },
  plugins: [],
};

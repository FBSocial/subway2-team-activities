import safeArea from 'tailwindcss-safe-area';
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        b: '#1A2033',
        b60: '#767985',
        b95: '#1A2033',
        blue: '#198CFE',
        orange: '#FF6A00',
        red: '#F2494A',
      },
    },
  },
  plugins: [safeArea],
};

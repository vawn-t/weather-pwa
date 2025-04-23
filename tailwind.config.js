/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': {
            backgroundImage:
              'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent)',
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundImage:
              'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent)',
            backgroundPosition: '200% 0',
          },
        },
      },
    },
  },
  plugins: [],
};

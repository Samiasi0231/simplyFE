/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        lora: ['Lora', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#6B21A8',
          dark:    '#581C87',
          light:   '#F0EEFF',
          border:  '#DDD6FE',
        },
      },
      keyframes: {
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%':     { transform: 'translateX(-5px)' },
          '60%':     { transform: 'translateX(5px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shake:  'shake 0.35s ease',
        fadeUp: 'fadeUp 0.4s ease both',
      },
    },
  },
  plugins: [],
}


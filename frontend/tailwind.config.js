/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'pink': {
          400: '#FF69B4',
          500: '#FF1493',
          600: '#DC143C'
        },
        'gold': {
          400: '#FFD700',
          500: '#FFA500'
        },
        'purple': {
          800: '#4A148C',
          900: '#2D0A5C'
        }
      },
      fontFamily: {
        'alex-brush': ['Alex Brush', 'cursive'],
        'playfair': ['Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
}

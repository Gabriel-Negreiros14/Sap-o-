/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta do protótipo "Sapinho Hidratado" (#eefff0, #d1f7d6, #42a95c, #358a49, #2d4a22)
        sapo: {
          50: '#eefff0',
          100: '#d1f7d6',
          200: '#b4ebc0',
          300: '#86d99a',
          400: '#5cc277',
          500: '#42a95c',
          600: '#358a49',
          700: '#2b6f3b',
          800: '#285a33',
          900: '#2d4a22',
        },
      },
      keyframes: {
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '60%': { transform: 'scale(1.08)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '20%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-26px)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        hop: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.45s ease-out both',
        'float-up': 'float-up 1.4s ease-out forwards',
        'slide-down': 'slide-down 0.3s ease-out both',
        'fade-in': 'fade-in 0.25s ease-out both',
        hop: 'hop 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

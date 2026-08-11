/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF7',
        ink: '#16201A',
        primary: {
          50: '#F1FAEC',
          100: '#DFF3D1',
          200: '#C3E8A8',
          300: '#A0D875',
          400: '#7CC24C',
          500: '#5FA636',
          600: '#4C8A2A',
          700: '#3D6E22',
          800: '#325A1C',
          900: '#1E3512',
        },
        accent: {
          50: '#FFF8EB',
          100: '#FEECC7',
          300: '#F8CE7C',
          400: '#F5B94D',
          500: '#F2A93B',
          600: '#DB8F1F',
          700: '#B8730F',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

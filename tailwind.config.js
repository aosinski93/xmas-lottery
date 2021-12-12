const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  screens: {
    sm: '480px',
    md: '768px',
    lg: '976px',
    xl: '1440px',
  },
  colors: {
    blue: '#1fb6ff',
    purple: '#7e5bef',
    pink: '#ff49db',
    orange: '#ff7849',
    green: '#13ce66',
    yellow: '#ffc82c',
    'gray-dark': '#273444',
    gray: '#8492a6',
    'gray-light': '#d3dce6',
  },
  fontFamily: {
    sans: ['Graphik', 'sans-serif'],
    serif: ['Merriweather', 'serif'],
  },
  variants: {
    extend: {},
  },
  plugins: [],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'ball-1': '#B68080',
      gray: '#8492a6',
      white: '#FFFFFF',
      'balls-4': '#A8D7E4',
      ...colors,
    },
    extend: {
      backgroundImage: {
        'background-color-snow': "url('assets/background.png')",
        'background-gift': "url('assets/giftbox-empty.png')",
      }
    }
  },
};

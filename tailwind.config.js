import colors from 'tailwindcss/colors';
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
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
      gray: '#8492a6',
      white: '#FFFFFF',
      'santa-blue': '#A8D7E4',
      'black-enough': '#525252',
      'santa-red-light': '#FF9C9C',
      'santa-red': '#F68080',
      'santa-red-darker': '#E56161',
      ...colors,
    },
    extend: {
      backgroundImage: {
        'background-color-snow': "url('assets/background.png')",
        'background-gift': "url('assets/giftbox-empty.png')",
      },
    },
  },
};

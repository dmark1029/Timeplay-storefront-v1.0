import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        tempo: ['Tempo Standard Heavy Condensed', 'sans-serif'],
        'eurostile-extended': ['Eurostile Extended', 'sans-serif'],
        'eurostile-extended-bold': ['Eurostile Extended Bold', 'sans-serif'],
        arial: ['Arial', 'sans-serif'],
        roboto: ['Roboto', 'Helvetica'],
        'passion-one': ['Passion One', 'Helvetica'],
      },
      screens: {
        'xs-h': { raw: '(min-height: 320px)' },
        'sm-h': { raw: '(min-height: 512px)' },
        'md-h': { raw: '(min-height: 768px)' },
        'lg-h': { raw: '(min-height: 1024px)' },
        'xl-h': { raw: '(min-height: 1280px)' },
      },
      maxHeight: {
        xs: '320px',
        sm: '512px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      colors: {
        salmon: '#EDD4D1',
        'cfc-blue': '#10559A',
        'cfc-red': '#CA3030',
        'cfc-dark-blue': '#052049',

        'oct-blue': '#7BEFF3',
        'oct-brown': '#331A10',
        'oct-dark-brown': '#331A10',
        'oct-neutral': '#EFE5CA',

        'dond-yellow': '#FDF38B',
        'dond-gold': '#EBB94C',

        'nav-button-slate': '#EDF4F8',
        'user-menu-blue': '#2B5297',
        'user-menu-blue-gradient-light': '#10559a',
        'user-menu-blue-gradient-dark': '#052049',
        'user-menu-blue-gradient-light-disabled': 'rgb(163, 183, 208)',
        'user-menu-blue-gradient-dark-disabled': 'rgb(88, 126, 175)',
        'user-menu-red-gradient-light': '#dc1125',
        'user-menu-red-gradient-dark': '#9b242f',
        'user-menu-gray-gradient-light': '#B1C4DC',
        'user-menu-gray-gradient-dark': '#96ABC6',
        'user-menu-light-blue': '#E0ECFF',
        'primary-100': '#E0ECFF',
        'primary-300': '#A1CAFF',
        'primary-default': '#2D81FF',
        'primary-700': '#10559A',
        'primary-900': '#052049',
        'neutral-100': '#FFFFFF',
        'neutral-300': '#DFE1E3',
        'neutral-default': '#9A9A9A',
        'neutral-700': '#637185',
        'neutral-900': '#000000',
        'accent-pink': '#FFD3D4',
        'accent-red': '#DE1326',
        'accent-purple': '#D4A4FC',
        success: '#00960F',

        'pp-text-dark': '#052049',
        'pp-text-light': '#10559a',
        'pp-text-accent': '#9b242f',

        'pp-background': '#e0ecff',
        'pp-button-dark': '#052049',
        'pp-button-light': '#10559a',

        'pp-ball-default': '#313131',
        'pp-ball-default-dark': '#141414',

        'pp-ball-powerplay': '#dc1125',
        'pp-ball-powerplay-dark': '#af1f2c',

        'pp-ball-match': '#4ce153',
        'pp-ball-match-dark': '#36a63d',

        'pp-ball-active': '#93c5fd',
        'pp-ball-active-dark': '#4979c9',

        'pp-ball-inactive': '#8095b0',
        'pp-ball-inactive-dark': '#516681',

        'info-popover-blue': '#10559a',
      },
      backgroundImage: {
        'primary-default': `linear-gradient(to right, #A1CAFF, #2D81FF)`,
        'primary-pressed': 'linear-gradient(to right, #10559A, #052049)',
        'round-default': 'linear-gradient(to right, #A1CAFF, #2D81FF)',
        'round-pressed': 'linear-gradient(to right, #10559A, #052049)',
      },
      boxShadow: {
        'user-menu-blue-shadow': '0 4px 10px rgba(16, 85, 153, .3)',
        'user-menu-gray-shadow': '0 4px 10px rgba(177, 196, 220, .5)',
        'tos-blue-shadow': '0 3px 10px rgba(64, 133, 239, 0.5)',
        'tos-black-shadow': '0 4px 4px rgba(0, 0, 0, 0.25)',
      },
      borderWidth: {
        '6': '6px',
        '7': '7px',
        '8': '8px',
        '9': '9px',
        '10': '10px',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui(),
    function ({ addUtilities }) {
      const newUtilities = {
        '.font-stretch-condensed': {
          'font-stretch': 'condensed',
        },
        '.modal-close-button': {
          svg: {
            width: '1.75em',
            height: '1.75em',
            stroke: '#10559a',
            strokeWidth: '3',
          },
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
} satisfies Config;

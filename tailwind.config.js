const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'media', // or 'media' or 'class'
  mode: 'jit',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      primary: colors.blueGray,
      danger: colors.red,
      accent: colors.orange,
      warning: colors.yellow,
      success: colors.teal,
    },
    extend: {
      fontFamily: {
        'alegreya': ['Alegreya'],
        'roboto': ['Roboto'],
      },
      zIndex: {
        modal: '600000000',
        popup: `${600000000 - 20}`,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  purge: [
    './libs/**/src/**/*.svelte',
    './libs/**/src/**/**/*.svelte',
  ]
}

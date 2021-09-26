module.exports = {
  darkMode: 'media', // or 'media' or 'class'
  mode: 'jit',
  theme: {
    extend: {
      fontFamily: {
        'alegreya': ['Alegreya'],
        'roboto': ['Roboto'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  purge: [
    './libs/**/src/**/**/*.svelte'
  ]
}

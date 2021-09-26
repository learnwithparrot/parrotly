//https://dev.to/matebek/simplest-way-to-set-up-svelte-with-tailwind-css-41bn
const {purge, ...baseConfigs} = require('./../../tailwind.config')

module.exports = {
  ...baseConfigs,
  purge: {
    enabled: true,
    content: [
      ...purge,
      './apps/popup/public/index.html',
      './apps/popup/src/**/*.svelte',
    ],
  }
}

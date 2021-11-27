//https://dev.to/matebek/simplest-way-to-set-up-svelte-with-tailwind-css-41bn
const { purge, ...baseConfigs } = require('../../tailwind.config')

module.exports = {
  ...baseConfigs,
  purge: {
    enabled: true,
    content: [
      /**
       * map the relative routes in root tailwind config file to relative routes with respect to
       * current directory as compile steps runs relative to this current repo and not the root repo.
       */
      ...purge.map(_ => `../.${_}`),
      './src/**/*.{html,js,svelte,ts}',
    ],
  }
}

const sveltePreprocess = require('svelte-preprocess');
const tailwind = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors

  preprocess: sveltePreprocess({
    postcss: {
      plugins: [
        tailwind('./apps/popup/tailwind.config.cjs'), //Relative to root of project.
        autoprefixer
      ]
    }
  }),
};

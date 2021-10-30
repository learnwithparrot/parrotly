const sveltePreprocess = require('svelte-preprocess');
const tailwind = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors

  preprocess: sveltePreprocess({
    postcss: {
      plugins: [
        autoprefixer,
        tailwind('./apps/component-playgroun/tailwind.config.cjs'), //Relative to root of project.
      ]
    }
  }),
  //Setting the below causes svelte to inline the styles in the attaching node in main.ts.
  //This prevents (inheritable and general selector styles eg:'*')styles leaking out of this shadowroot onto the elements
  emitCss: false,
};
